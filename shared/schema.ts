import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const aiQueries = pgTable("ai_queries", {
  id: serial("id").primaryKey(),
  taskType: text("task_type").notNull(),
  userInput: text("user_input").notNull(),
  response: text("response").notNull(),
  isHelpful: boolean("is_helpful"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const sessionStats = pgTable("session_stats", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  queriesCount: integer("queries_count").default(0),
  helpfulCount: integer("helpful_count").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAiQuerySchema = createInsertSchema(aiQueries).pick({
  taskType: true,
  userInput: true,
  response: true,
});

export const updateQueryFeedbackSchema = z.object({
  id: z.number(),
  isHelpful: z.boolean(),
});

export const aiRequestSchema = z.object({
  input: z.string().min(1, "Input cannot be empty"),
  taskType: z.enum(["question", "summary", "creative", "advice"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AiQuery = typeof aiQueries.$inferSelect;
export type InsertAiQuery = z.infer<typeof insertAiQuerySchema>;
export type SessionStats = typeof sessionStats.$inferSelect;
export type AiRequest = z.infer<typeof aiRequestSchema>;
