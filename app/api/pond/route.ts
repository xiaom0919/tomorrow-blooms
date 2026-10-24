import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import { nightWindow, MOODS } from "../../../lib/night";

type WishRow = {
  id: string; owner_id: string; text: string; mood: string; night: string;
  created_at: number; reveal_at: number; recipient_id: string | null;
  assigned_at: number | null; reply: string | null; replied_at: number | null;
  thanked: number; sleeping: number; bloomed: number; outcome: string | null;
};
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const isLocal = (r: Request) => ["localhost", "127.0.0.1", "[::1]"].includes(new URL(r.url).hostname);
async function identity(request: Request) {
  if (isLocal(request)) {
    const cookie = request.headers.get("cookie") ?? "";
    return /bloom_test_user=beta(?:;|$)/.test(cookie) ? "local-beta" : "local-alpha";
  }
  return (await getChatGPTUser())?.userId ?? null;
}
function database() {
  if (!env.DB) throw new Error("Missing D1 binding");
  return env.DB;
}
async function touch(db: D1Database, id: string, now: number) {
  await db.prepare("INSERT INTO visitors (id,last_seen) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen").bind(id, now).run();
}
async function match(db: D1Database, userId: string, now: number) {
  await db.prepare("UPDATE wishes SET recipient_id=NULL, assigned_at=NULL WHERE reply IS NULL AND assigned_at < ?").bind(now - 2 * 3600000).run();
  await db.prepare(`UPDATE wishes SET recipient_id=?, assigned_at=? WHERE id=(
    SELECT w.id FROM wishes w WHERE w.owner_id<>? AND w.recipient_id IS NULL AND w.reply IS NULL
    AND NOT EXISTS (SELECT 1 FROM skips s WHERE s.wish_id=w.id AND s.visitor_id=?)
    AND (SELECT COUNT(*) FROM wishes WHERE recipient_id=? AND reply IS NULL)<1
    ORDER BY RANDOM() LIMIT 1
  ) AND recipient_id IS NULL AND reply IS NULL`).bind(userId, now, userId, userId, userId).run();
  await db.prepare(`UPDATE wishes SET recipient_id=(
    SELECT v.id FROM visitors v WHERE v.id<>? AND v.last_seen>?
    AND NOT EXISTS (SELECT 1 FROM wishes p WHERE p.recipient_id=v.id AND p.reply IS NULL)
    AND NOT EXISTS (SELECT 1 FROM skips s WHERE s.wish_id=wishes.id AND s.visitor_id=v.id)
    ORDER BY RANDOM() LIMIT 1
  ), assigned_at=? WHERE owner_id=? AND recipient_id IS NULL AND reply IS NULL`).bind(userId, now - 86400000, now, userId).run();
}
function ownView(row: WishRow, now: number) {
  const revealed = now >= row.reveal_at && !!row.bloomed;
  return { id: row.id, text: row.text, mood: row.mood, night: row.night,
    createdAt: row.created_at, revealAt: row.reveal_at, sleeping: !!row.sleeping, bloomed: !!row.bloomed,
    status: row.reply ? (revealed ? "replied" : "sealed") : row.recipient_id ? "arrived" : "drifting",
    reply: revealed ? row.reply : null, thanked: !!row.thanked, outcome: row.outcome };
}
export async function GET(request: Request) {
  try {
    const userId = await identity(request);
    if (!userId) return json({ authenticated: false, local: false, wishes: [], incoming: null });
    const db = database(), now = Date.now();
    await touch(db, userId, now);
    await match(db, userId, now);
    const owned = await db.prepare("SELECT * FROM wishes WHERE owner_id=? ORDER BY created_at DESC").bind(userId).all<WishRow>();
    const incoming = await db.prepare("SELECT id,text,mood,created_at FROM wishes WHERE recipient_id=? AND reply IS NULL ORDER BY assigned_at LIMIT 1").bind(userId).first();
    const thanks = await db.prepare("SELECT COUNT(*) AS total FROM wishes WHERE recipient_id=? AND thanked=1").bind(userId).first<{ total: number }>();
    return json({ authenticated: true, local: isLocal(request), identity: isLocal(request) ? userId : undefined,
      wishes: owned.results.map(w => ownView(w, now)), incoming, thanks: thanks?.total ?? 0, ...nightWindow(now) });
  } catch (error) { console.error("Pond read:", error); return json({ error: "池塘暂时起了点雾，请稍后重试。" }, 503); }
}
export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return json({ error: "请求来源不正确。" }, 403);
    const userId = await identity(request);
    if (!userId) return json({ error: "请先登录，再把愿望放进池塘。" }, 401);
    const body = await request.json() as Record<string, unknown>;
    const db = database(), now = Date.now();
    const action = body.action;
    if (action === "wish") {
      if (typeof body.text !== "string" || !body.text.trim() || body.text.trim().length > 160) return json({ error: "愿望请写在 1～160 字之间。" }, 400);
      if (!MOODS.includes(body.mood as typeof MOODS[number])) return json({ error: "请选一种今晚的心情。" }, 400);
      const { night, revealAt } = nightWindow(now);
      const result = await db.prepare("INSERT INTO wishes (id,owner_id,text,mood,night,created_at,reveal_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(owner_id,night) DO NOTHING").bind(crypto.randomUUID(), userId, body.text.trim(), body.mood, night, now, revealAt).run();
      if (!result.meta.changes) return json({ error: "今晚的小船已经出发啦，明天再许一个愿吧。" }, 409);
      await touch(db, userId, now); await match(db, userId, now);
    } else if (action === "reply") {
      if (typeof body.text !== "string" || !body.text.trim() || body.text.trim().length > 240) return json({ error: "请写下 1～240 字的温柔建议。" }, 400);
      const result = await db.prepare("UPDATE wishes SET reply=?, replied_at=? WHERE id=? AND recipient_id=? AND reply IS NULL AND owner_id<>? AND assigned_at>=?").bind(body.text.trim(), now, body.id, userId, userId, now-2*3600000).run();
      if (!result.meta.changes) return json({ error: "这艘纸船已经继续漂流了，请刷新池塘。" }, 409);
    } else if (action === "skip" || action === "report") {
      const owned = await db.prepare("SELECT id FROM wishes WHERE id=? AND recipient_id=? AND reply IS NULL").bind(body.id, userId).first();
      if (!owned) return json({ error: "这艘纸船已经离开了。" }, 409);
      await db.batch([
        db.prepare("INSERT INTO skips (id,wish_id,visitor_id,reason) VALUES (?,?,?,?) ON CONFLICT(wish_id,visitor_id) DO NOTHING").bind(crypto.randomUUID(), body.id, userId, action),
        db.prepare("UPDATE wishes SET recipient_id=NULL,assigned_at=NULL WHERE id=? AND recipient_id=? AND reply IS NULL").bind(body.id, userId),
      ]);
    } else if (action === "sleep") {
      await db.prepare("UPDATE wishes SET sleeping=1 WHERE id=? AND owner_id=?").bind(body.id, userId).run();
    } else if (action === "bloom") {
      const result = await db.prepare("UPDATE wishes SET bloomed=1 WHERE id=? AND owner_id=? AND reveal_at<=?").bind(body.id, userId, now).run();
      if (!result.meta.changes) return json({ error: "天还没亮，让愿望再睡一会儿吧。" }, 409);
    } else if (action === "thank") {
      await db.prepare("UPDATE wishes SET thanked=1 WHERE id=? AND owner_id=? AND reply IS NOT NULL AND bloomed=1 AND reveal_at<=?").bind(body.id, userId, now).run();
    } else if (action === "outcome") {
      if (typeof body.text !== "string" || body.text.length > 240) return json({ error: "后记请写在 240 字以内。" }, 400);
      await db.prepare("UPDATE wishes SET outcome=? WHERE id=? AND owner_id=? AND bloomed=1").bind(body.text.trim(), body.id, userId).run();
    } else if (isLocal(request) && action === "demo-user") {
      return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json", "Set-Cookie": `bloom_test_user=${body.user === "beta" ? "beta" : "alpha"}; Path=/; HttpOnly; SameSite=Lax`, "Cache-Control": "no-store" } });
    } else if (isLocal(request) && action === "demo-morning") {
      await db.prepare("UPDATE wishes SET reveal_at=? WHERE owner_id=? AND bloomed=0").bind(now-1, userId).run();
    } else return json({ error: "没有找到这个操作。" }, 400);
    return json({ ok: true });
  } catch (error) { console.error("Pond write:", error); return json({ error: "小船暂时没有出发成功，你写下的话还在，请再试一次。" }, 503); }
}
