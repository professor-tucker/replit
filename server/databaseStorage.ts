import { 
  users, 
  resources, 
  chatMessages, 
  resourceCategories,
  generatedContent,
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
import { db } from "./db";
import { eq, like, sql, desc, asc, inArray } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Resource operations
  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.category, category));
  }

  async getPopularResources(limit = 10): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.isPopular, true))
      .limit(limit);
  }

  async getFeaturedResources(limit = 10): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.isFeatured, true))
      .limit(limit);
  }

  async searchResources(query: string): Promise<Resource[]> {
    const lowercaseQuery = query.toLowerCase();
    // Search in name, description, or within array of tags
    return await db
      .select()
      .from(resources)
      .where(
        sql`lower(${resources.name}) like ${`%${lowercaseQuery}%`} or 
            lower(${resources.description}) like ${`%${lowercaseQuery}%`}`)
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values({
        ...insertResource,
        isFeatured: insertResource.isFeatured || false,
        isPopular: insertResource.isPopular || false,
        logoUrl: insertResource.logoUrl || null
      })
      .returning();
    return resource;
  }

  async updateResource(id: number, resourceUpdate: Partial<InsertResource>): Promise<Resource | undefined> {
    const [updatedResource] = await db
      .update(resources)
      .set(resourceUpdate)
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db
      .delete(resources)
      .where(eq(resources.id, id));
    return !!result; // Convert to boolean
  }

  // Chat message operations
  async getChatMessagesByUserId(userId: number | null): Promise<ChatMessage[]> {
    if (userId === null) {
      return await db.select().from(chatMessages);
    }
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values({
        ...insertMessage,
        userId: insertMessage.userId || null
      })
      .returning();
    return message;
  }

  // Resource category operations
  async getAllCategories(): Promise<ResourceCategory[]> {
    return await db.select().from(resourceCategories);
  }

  async getCategoryById(id: number): Promise<ResourceCategory | undefined> {
    const [category] = await db
      .select()
      .from(resourceCategories)
      .where(eq(resourceCategories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertResourceCategory): Promise<ResourceCategory> {
    const [category] = await db
      .insert(resourceCategories)
      .values(insertCategory)
      .returning();
    return category;
  }
  
  // Generated content operations
  async getAllGeneratedContent(limit = 20): Promise<GeneratedContent[]> {
    return await db
      .select()
      .from(generatedContent)
      .orderBy(desc(generatedContent.createdAt))
      .limit(limit);
  }
  
  async getGeneratedContentById(id: number): Promise<GeneratedContent | undefined> {
    const [content] = await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.id, id));
    return content;
  }
  
  async getGeneratedContentByCategory(category: string, limit = 10): Promise<GeneratedContent[]> {
    return await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.category, category))
      .orderBy(desc(generatedContent.createdAt))
      .limit(limit);
  }
  
  async getFeaturedGeneratedContent(limit = 5): Promise<GeneratedContent[]> {
    return await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.isFeatured, true))
      .orderBy(desc(generatedContent.createdAt))
      .limit(limit);
  }
  
  async getGeneratedContentByTags(tags: string[], limit = 10): Promise<GeneratedContent[]> {
    // This is a simple implementation that checks if any tag matches
    // Could be enhanced with more sophisticated tag matching
    return await db
      .select()
      .from(generatedContent)
      .where(sql`exists (select 1 from unnest(${generatedContent.tags}) tag where tag = ANY(ARRAY[${tags}]))`)
      .orderBy(desc(generatedContent.createdAt))
      .limit(limit);
  }
  
  async getRelatedGeneratedContent(resourceIds: number[], limit = 3): Promise<GeneratedContent[]> {
    // Find content related to specific resources by their IDs
    return await db
      .select()
      .from(generatedContent)
      .where(sql`exists (select 1 from unnest(${generatedContent.relatedResourceIds}) id where id = ANY(ARRAY[${resourceIds}]))`)
      .orderBy(desc(generatedContent.createdAt))
      .limit(limit);
  }
  
  async searchGeneratedContent(query: string): Promise<GeneratedContent[]> {
    const lowercaseQuery = query.toLowerCase();
    return await db
      .select()
      .from(generatedContent)
      .where(
        sql`lower(${generatedContent.title}) like ${`%${lowercaseQuery}%`} or 
            lower(${generatedContent.summary}) like ${`%${lowercaseQuery}%`} or
            lower(${generatedContent.youtubeScriptIdea}) like ${`%${lowercaseQuery}%`}`)
      .orderBy(desc(generatedContent.createdAt));
  }
  
  async createGeneratedContent(insertContent: InsertGeneratedContent): Promise<GeneratedContent> {
    const [content] = await db
      .insert(generatedContent)
      .values({
        ...insertContent,
        relatedResourceIds: insertContent.relatedResourceIds || [],
        isFeatured: insertContent.isFeatured || false,
        youtubeUrl: insertContent.youtubeUrl || null,
        fullContent: insertContent.fullContent || null
      })
      .returning();
    return content;
  }
  
  async updateGeneratedContent(id: number, contentUpdate: Partial<InsertGeneratedContent>): Promise<GeneratedContent | undefined> {
    const [updatedContent] = await db
      .update(generatedContent)
      .set(contentUpdate)
      .where(eq(generatedContent.id, id))
      .returning();
    return updatedContent;
  }
  
  async deleteGeneratedContent(id: number): Promise<boolean> {
    const result = await db
      .delete(generatedContent)
      .where(eq(generatedContent.id, id));
    return !!result;
  }

  // Initialize database with default data
  async initializeDefaultData(): Promise<void> {
    // Check if categories already exist to avoid duplicates
    const existingCategories = await this.getAllCategories();
    if (existingCategories.length === 0) {
      // Add default categories with premium positioning
      const defaultCategories = [
        { name: "Large Language Models", description: "Premium AI models offered by Superfishal Intelligence, providing enhanced capabilities for enterprise applications" },
        { name: "Data Analytics Tools", description: "Industry-leading analytics platforms with custom integrations available exclusively through Superfishal Intelligence" },
        { name: "Hugging Face Models", description: "Enhanced open-source models with premium support and optimizations provided by Superfishal Intelligence" },
        { name: "Premium Hosting Services", description: "High-performance hosting solutions with enterprise-grade support and expanded capabilities" },
        { name: "Premium API Integration", description: "Advanced API tools with dedicated support and enhanced features for professional developers" }
      ];
      
      for (const cat of defaultCategories) {
        await this.createCategory(cat);
      }
    }
    
    // Check if resources already exist to avoid duplicates
    const existingResources = await this.getAllResources();
    if (existingResources.length === 0) {
      // Add default resources with premium pricing (industry-specific rates)
      const defaultResources = [
        {
          name: "ChatGPT Premium Access",
          description: "Superfishal Intelligence offering: Enhanced version of OpenAI's conversational AI assistant with priority access and additional features. $29.99/month (save with annual subscription)",
          url: "https://chat.openai.com?ref=superfishalintelligence&aff=si2025",
          category: "Large Language Models",
          tags: ["ai", "conversation", "text", "premium"],
          isFeatured: true,
          isPopular: true,
          logoUrl: null
        },
        {
          name: "Claude Pro Enterprise",
          description: "Superfishal Intelligence offering: Advanced version of Anthropic's helpful assistant with expanded capabilities and priority access. $34.99/month (industry rate)",
          url: "https://claude.ai?partner=superfishal&promocode=INTEL2025",
          category: "Large Language Models",
          tags: ["ai", "conversation", "text", "enterprise"],
          isFeatured: false,
          isPopular: true,
          logoUrl: null
        },
        {
          name: "Hugging Face Enterprise Solutions",
          description: "Superfishal Intelligence offering: Premium access to thousands of open-source models with enhanced features and dedicated support. Starting at $99/month for businesses",
          url: "https://huggingface.co?affiliate=superfishalintelligence&campaign=enterprise",
          category: "Hugging Face Models",
          tags: ["models", "open-source", "nlp", "enterprise"],
          isFeatured: true,
          isPopular: true,
          logoUrl: null
        },
        {
          name: "Firebase Pro Hosting",
          description: "Superfishal Intelligence offering: Enhanced Firebase hosting with expanded storage, bandwidth, and premium support. $49.99/month for growing businesses",
          url: "https://firebase.google.com/products/hosting?referral=superfishalintelligence&afftrack=premiumhosting",
          category: "Premium Hosting Services",
          tags: ["hosting", "premium", "web"],
          isFeatured: true,
          isPopular: false,
          logoUrl: null
        },
        {
          name: "TensorFlow.js Pro Suite",
          description: "Superfishal Intelligence offering: Enhanced TensorFlow.js package with optimized models, premium support, and technical consultation. $79.99/month for developers",
          url: "https://www.tensorflow.org/js?aff=superfishal&utm_source=intelligence_portal&utm_medium=affiliate",
          category: "Premium API Integration",
          tags: ["machine learning", "javascript", "browser", "premium"],
          isFeatured: true,
          isPopular: false,
          logoUrl: null
        },
        {
          name: "Gemini Advanced Business",
          description: "Superfishal Intelligence offering: Enhanced version of Google's multimodal AI with industry-specific optimizations. $39.99/month (competitive industry rate)",
          url: "https://gemini.google.com?partner=superfishalintelligence&discount=PREMIUM25",
          category: "Large Language Models",
          tags: ["ai", "google", "multimodal", "premium"],
          isFeatured: false,
          isPopular: true,
          logoUrl: null
        },
        {
          name: "GitHub Pages Professional",
          description: "Superfishal Intelligence offering: Enhanced GitHub Pages with premium templates, advanced analytics, and priority support. $24.99/month for professionals",
          url: "https://pages.github.com?ref=superfishalintelligence&afftrack=premium-gh-pages",
          category: "Premium Hosting Services",
          tags: ["hosting", "premium", "static"],
          isFeatured: false,
          isPopular: false,
          logoUrl: null
        }
      ];
      
      for (const resource of defaultResources) {
        await this.createResource(resource);
      }
    }
  }
}