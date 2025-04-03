import { 
  users, 
  resources, 
  chatMessages, 
  resourceCategories,
  type User, 
  type InsertUser,
  type Resource,
  type InsertResource,
  type ChatMessage,
  type InsertChatMessage,
  type ResourceCategory,
  type InsertResourceCategory
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
  
  // Database initialization
  initializeDefaultData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resources: Map<number, Resource>;
  private chatMessages: Map<number, ChatMessage>;
  private categories: Map<number, ResourceCategory>;
  private userIdCounter: number;
  private resourceIdCounter: number;
  private messageIdCounter: number;
  private categoryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.resources = new Map();
    this.chatMessages = new Map();
    this.categories = new Map();
    this.userIdCounter = 1;
    this.resourceIdCounter = 1;
    this.messageIdCounter = 1;
    this.categoryIdCounter = 1;
    
    // Initialize with some default categories
    // We need to call this asynchronously now
    this.loadDefaultData();
  }
  
  // Helper method to initialize data in async context
  private loadDefaultData() {
    // Execute the async method without waiting
    this.initializeDefaultData().catch(err => {
      console.error("Failed to initialize default data:", err);
    });
  }

  async initializeDefaultData(): Promise<void> {
    // Add default categories with premium positioning
    const defaultCategories = [
      { name: "Large Language Models", description: "Premium AI models offered by Superfishal Intelligence, providing enhanced capabilities for enterprise applications" },
      { name: "Data Analytics Tools", description: "Industry-leading analytics platforms with custom integrations available exclusively through Superfishal Intelligence" },
      { name: "Hugging Face Models", description: "Enhanced open-source models with premium support and optimizations provided by Superfishal Intelligence" },
      { name: "Premium Hosting Services", description: "High-performance hosting solutions with enterprise-grade support and expanded capabilities" },
      { name: "Premium API Integration", description: "Advanced API tools with dedicated support and enhanced features for professional developers" }
    ];
    
    defaultCategories.forEach(cat => {
      this.createCategory(cat);
    });
    
    // Add default resources with premium pricing (industry-specific rates)
    const defaultResources = [
      {
        name: "ChatGPT Premium Access",
        description: "Superfishal Intelligence offering: Enhanced version of OpenAI's conversational AI assistant with priority access and additional features. $29.99/month (save with annual subscription)",
        url: "https://chat.openai.com",
        category: "Large Language Models",
        tags: ["ai", "conversation", "text", "premium"],
        isFeatured: true,
        isPopular: true,
        logoUrl: null
      },
      {
        name: "Claude Pro Enterprise",
        description: "Superfishal Intelligence offering: Advanced version of Anthropic's helpful assistant with expanded capabilities and priority access. $34.99/month (industry rate)",
        url: "https://claude.ai",
        category: "Large Language Models",
        tags: ["ai", "conversation", "text", "enterprise"],
        isFeatured: false,
        isPopular: true,
        logoUrl: null
      },
      {
        name: "Hugging Face Enterprise Solutions",
        description: "Superfishal Intelligence offering: Premium access to thousands of open-source models with enhanced features and dedicated support. Starting at $99/month for businesses",
        url: "https://huggingface.co",
        category: "Hugging Face Models",
        tags: ["models", "open-source", "nlp", "enterprise"],
        isFeatured: true,
        isPopular: true,
        logoUrl: null
      },
      {
        name: "Firebase Pro Hosting",
        description: "Superfishal Intelligence offering: Enhanced Firebase hosting with expanded storage, bandwidth, and premium support. $49.99/month for growing businesses",
        url: "https://firebase.google.com/products/hosting",
        category: "Premium Hosting Services",
        tags: ["hosting", "premium", "web"],
        isFeatured: true,
        isPopular: false,
        logoUrl: null
      },
      {
        name: "TensorFlow.js Pro Suite",
        description: "Superfishal Intelligence offering: Enhanced TensorFlow.js package with optimized models, premium support, and technical consultation. $79.99/month for developers",
        url: "https://www.tensorflow.org/js",
        category: "Premium API Integration",
        tags: ["machine learning", "javascript", "browser", "premium"],
        isFeatured: true,
        isPopular: false,
        logoUrl: null
      },
      {
        name: "Gemini Advanced Business",
        description: "Superfishal Intelligence offering: Enhanced version of Google's multimodal AI with industry-specific optimizations. $39.99/month (competitive industry rate)",
        url: "https://gemini.google.com",
        category: "Large Language Models",
        tags: ["ai", "google", "multimodal", "premium"],
        isFeatured: false,
        isPopular: true,
        logoUrl: null
      },
      {
        name: "GitHub Pages Professional",
        description: "Superfishal Intelligence offering: Enhanced GitHub Pages with premium templates, advanced analytics, and priority support. $24.99/month for professionals",
        url: "https://pages.github.com",
        category: "Premium Hosting Services",
        tags: ["hosting", "premium", "static"],
        isFeatured: false,
        isPopular: false,
        logoUrl: null
      }
    ];
    
    defaultResources.forEach(resource => {
      this.createResource(resource);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resource operations
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.category === category
    );
  }

  async getPopularResources(limit = 10): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.isPopular)
      .slice(0, limit);
  }

  async getFeaturedResources(limit = 10): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.isFeatured)
      .slice(0, limit);
  }

  async searchResources(query: string): Promise<Resource[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.resources.values()).filter(
      (resource) =>
        resource.name.toLowerCase().includes(lowercaseQuery) ||
        resource.description.toLowerCase().includes(lowercaseQuery) ||
        resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const resource: Resource = { 
      ...insertResource, 
      id,
      isFeatured: insertResource.isFeatured || false,
      isPopular: insertResource.isPopular || false,
      logoUrl: insertResource.logoUrl || null
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: number, resourceUpdate: Partial<InsertResource>): Promise<Resource | undefined> {
    const currentResource = this.resources.get(id);
    if (!currentResource) return undefined;

    const updatedResource = { ...currentResource, ...resourceUpdate };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }

  // Chat message operations
  async getChatMessagesByUserId(userId: number | null): Promise<ChatMessage[]> {
    if (userId === null) {
      return Array.from(this.chatMessages.values());
    }
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.userId === userId
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.messageIdCounter++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      userId: insertMessage.userId || null,
      timestamp: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Resource category operations
  async getAllCategories(): Promise<ResourceCategory[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<ResourceCategory | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertResourceCategory): Promise<ResourceCategory> {
    const id = this.categoryIdCounter++;
    const category: ResourceCategory = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
}

// Import and use DatabaseStorage instead of MemStorage
import { DatabaseStorage } from "./databaseStorage";
export const storage = new DatabaseStorage();
