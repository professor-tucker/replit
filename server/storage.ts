import { 
  type User, 
  type InsertUser,
  type Resource,
  type InsertResource,
  type ChatMessage,
  type InsertChatMessage,
  type ResourceCategory,
  type InsertResourceCategory,
  type GeneratedContent,
  type InsertGeneratedContent
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resource operations
  getAllResources(): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getPopularResources(limit?: number): Promise<Resource[]>;
  getFeaturedResources(limit?: number): Promise<Resource[]>;
  searchResources(query: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;
  
  // Chat message operations
  getChatMessagesByUserId(userId: number | null): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Resource category operations
  getAllCategories(): Promise<ResourceCategory[]>;
  getCategoryById(id: number): Promise<ResourceCategory | undefined>;
  createCategory(category: InsertResourceCategory): Promise<ResourceCategory>;
  
  // Generated content operations
  getAllGeneratedContent(limit?: number): Promise<GeneratedContent[]>;
  getGeneratedContentById(id: number): Promise<GeneratedContent | undefined>;
  getGeneratedContentByCategory(category: string, limit?: number): Promise<GeneratedContent[]>;
  getFeaturedGeneratedContent(limit?: number): Promise<GeneratedContent[]>;
  getGeneratedContentByTags(tags: string[], limit?: number): Promise<GeneratedContent[]>;
  getRelatedGeneratedContent(resourceIds: number[], limit?: number): Promise<GeneratedContent[]>;
  searchGeneratedContent(query: string): Promise<GeneratedContent[]>;
  createGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent>;
  updateGeneratedContent(id: number, content: Partial<InsertGeneratedContent>): Promise<GeneratedContent | undefined>;
  deleteGeneratedContent(id: number): Promise<boolean>;
  
  // Database initialization
  initializeDefaultData(): Promise<void>;
}

// Import and use DatabaseStorage implementation
import { DatabaseStorage } from "./databaseStorage";
export const storage = new DatabaseStorage();
