import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  githubId: text("github_id").notNull(),
  username: text("username").notNull(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  accessToken: text("access_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const explanations = pgTable("explanations", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  responses: text("responses").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const termStreaks = pgTable("term_streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  term: text("term").notNull(),
  count: integer("count").notNull().default(1),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectExplanation = typeof explanations.$inferSelect;
export type InsertExplanation = typeof explanations.$inferInsert;

export type SelectTermStreak = typeof termStreaks.$inferSelect;
export type InsertTermStreak = typeof termStreaks.$inferInsert;