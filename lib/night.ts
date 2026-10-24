export function nightWindow(now = Date.now()) {
  const offset = 8 * 60 * 60 * 1000;
  const local = new Date(now + offset);
  const boundary = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 6) - offset;
  const revealAt = now < boundary ? boundary : boundary + 86400000;
  const night = new Date(revealAt + offset - 86400000).toISOString().slice(0, 10);
  return { night, revealAt };
}
export const MOODS = ["小期待", "攒勇气", "放轻松", "有点想念"] as const;
