import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Resource schema
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  isFeatured: boolean("is_featured").default(false),
  isPopular: boolean("is_popular").default(false),
  logoUrl: text("logo_url"),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Chat message schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Resource categories
export const resourceCategories = pgTable("resource_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
});

export const insertResourceCategorySchema = createInsertSchema(resourceCategories).omit({
  id: true,
});

export type InsertResourceCategory = z.infer<typeof insertResourceCategorySchema>;
export type ResourceCategory = typeof resourceCategories.$inferSelect;

// Generated content for YouTube and marketing
export const generatedContent = pgTable("generated_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  keyPoints: text("key_points").array().notNull(),
  youtubeScriptIdea: text("youtube_script_idea").notNull(),
  fullContent: text("full_content"), // Optional full content
  category: text("category").notNull(), // Can be 'cybersecurity', 'ai', etc.
  tags: text("tags").array().notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  youtubeUrl: text("youtube_url"), // For when we create YouTube videos
  relatedResourceIds: integer("related_resource_ids").array(), // To link to resources
});

export const insertGeneratedContentSchema = createInsertSchema(generatedContent).omit({
  id: true,
  createdAt: true,
});

export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;
export type GeneratedContent = typeof generatedContent.$inferSelect;
