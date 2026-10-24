import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const visitors = sqliteTable("visitors", {
  id: text("id").primaryKey(), lastSeen: integer("last_seen").notNull(),
});
export const wishes = sqliteTable("wishes", {
  id: text("id").primaryKey(), ownerId: text("owner_id").notNull(),
  text: text("text").notNull(), mood: text("mood").notNull(), night: text("night").notNull(),
  createdAt: integer("created_at").notNull(), revealAt: integer("reveal_at").notNull(),
  recipientId: text("recipient_id"), assignedAt: integer("assigned_at"),
  reply: text("reply"), repliedAt: integer("replied_at"),
  thanked: integer("thanked").notNull().default(0), sleeping: integer("sleeping").notNull().default(0),
  bloomed: integer("bloomed").notNull().default(0), outcome: text("outcome"),
}, (t) => [uniqueIndex("wish_per_night").on(t.ownerId, t.night), index("wish_recipient").on(t.recipientId), index("wish_pool").on(t.reply, t.recipientId)]);
export const skips = sqliteTable("skips", {
  id: text("id").primaryKey(), wishId: text("wish_id").notNull(),
  visitorId: text("visitor_id").notNull(), reason: text("reason").notNull(),
}, (t) => [uniqueIndex("one_skip").on(t.wishId, t.visitorId)]);
