import { pgTable, timestamp, uuid, text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});
export type User = typeof users.$inferSelect; // feeds is the table object in schema.ts

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
});

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts

export const feed_follows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  feed_id: uuid("feed_id").references(() => feeds.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  groupIdSlugUniqueIndex: uniqueIndex().on(t.user_id, t.feed_id),
}));