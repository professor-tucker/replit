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
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add default categories
    const defaultCategories = [
      { name: "Large Language Models", description: "AI models specialized in understanding and generating human language" },
      { name: "Data Analytics Tools", description: "Tools and platforms for analyzing and visualizing data" },
      { name: "Hugging Face Models", description: "Open-source models available through Hugging Face" },
      { name: "Free Hosting Services", description: "Platforms offering free hosting for web applications" },
      { name: "API Integration", description: "Tools for API integration and development" }
    ];
    
    defaultCategories.forEach(cat => {
      this.createCategory(cat);
    });
    
    // Add default resources
    const defaultResources = [
      {
        name: "ChatGPT",
        description: "OpenAI's conversational AI assistant that can understand and generate human-like text",
        url: "https://chat.openai.com",
        category: "Large Language Models",
        tags: ["ai", "conversation", "text"],
        isFeatured: true,
        isPopular: true,
        logoUrl: null
      },
      {
        name: "Claude",
        description: "Anthropic's helpful assistant",
        url: "https://claude.ai",
        category: "Large Language Models",
        tags: ["ai", "conversation", "text"],
        isFeatured: false,
        isPopular: true,
        logoUrl: null
      },
      {
        name: "Hugging Face",
        description: "Access thousands of open-source models for NLP, computer vision, and more",
        url: "https://huggingface.co",
        category: "Hugging Face Models",
        tags: ["models", "open-source", "nlp"],
        isFeatured: true,
        isPopular: true,
        logoUrl: null
      },
      {
        name: "Firebase Hosting",
        description: "Fast and secure web hosting with a generous free tier for web applications",
        url: "https://firebase.google.com/products/hosting",
        category: "Free Hosting Services",
        tags: ["hosting", "free", "web"],
        isFeatured: true,
        isPopular: false,
        logoUrl: null
      },
      {
        name: "TensorFlow.js",
        description: "Run machine learning models directly in the browser for client-side AI",
        url: "https://www.tensorflow.org/js",
        category: "API Integration",
        tags: ["machine learning", "javascript", "browser"],
        isFeatured: true,
        isPopular: false,
        logoUrl: null
      },
      {
        name: "Gemini",
        description: "Google's multimodal AI",
        url: "https://gemini.google.com",
        category: "Large Language Models",
        tags: ["ai", "google", "multimodal"],
        isFeatured: false,
        isPopular: true,
        logoUrl: null
      },
      {
        name: "GitHub Pages",
        description: "Free hosting for static websites directly from your GitHub repository",
        url: "https://pages.github.com",
        category: "Free Hosting Services",
        tags: ["hosting", "free", "static"],
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
    const resource: Resource = { ...insertResource, id };
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

export const storage = new MemStorage();
