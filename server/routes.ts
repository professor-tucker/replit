import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertResourceSchema, 
  insertChatMessageSchema, 
  insertResourceCategorySchema,
  insertGeneratedContentSchema,
  resources,
  chatMessages,
  resourceCategories,
  generatedContent 
} from "@shared/schema";
import { 
  generateAIResponse, 
  formatChatPrompt, 
  generateSecurityTrendContent,
  generateWithPerplexity 
} from "./ai";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiRouter = app;

  // Resource endpoints
  apiRouter.get("/api/resources", async (req: Request, res: Response) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  apiRouter.get("/api/resources/popular", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const resources = await storage.getPopularResources(limit);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular resources" });
    }
  });

  apiRouter.get("/api/resources/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const resources = await storage.getFeaturedResources(limit);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured resources" });
    }
  });

  apiRouter.get("/api/resources/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const resources = await storage.getResourcesByCategory(category);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources by category" });
    }
  });

  apiRouter.get("/api/resources/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const resources = await storage.searchResources(query);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to search resources" });
    }
  });

  apiRouter.get("/api/resources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const resource = await storage.getResourceById(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  apiRouter.post("/api/resources", async (req: Request, res: Response) => {
    try {
      const validatedData = insertResourceSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newResource = await storage.createResource(validatedData.data);
      res.status(201).json(newResource);
    } catch (error) {
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  // Chat message endpoints
  apiRouter.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const validatedData = insertChatMessageSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newMessage = await storage.createChatMessage(validatedData.data);
      
      // Check if this is a user message that needs an AI response
      if (validatedData.data.role === 'user') {
        // Get previous messages for context
        const previousMessages = await storage.getChatMessagesByUserId(validatedData.data.userId || null);
        
        // Convert messages to format needed for prompt
        const formattedMessages = previousMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Add the current message
        formattedMessages.push({
          role: 'user',
          content: validatedData.data.content
        });
        
        // Format the prompt for the AI model
        const prompt = formatChatPrompt(formattedMessages);
        
        // Generate response from Hugging Face
        const aiResponseContent = await generateAIResponse(prompt);
        
        // Clean the response (remove leading prompt if it appears in the response)
        const cleanedResponse = aiResponseContent.replace(/^Assistant:\s*/i, '');
        
        // Save the AI response to the database
        const assistantMessage = await storage.createChatMessage({
          userId: validatedData.data.userId,
          content: cleanedResponse,
          role: 'assistant'
        });
        
        res.status(201).json({
          userMessage: newMessage,
          assistantMessage
        });
      } else {
        res.status(201).json(newMessage);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  apiRouter.get("/api/chat/history", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      const messages = await storage.getChatMessagesByUserId(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Category endpoints
  apiRouter.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  apiRouter.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  apiRouter.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertResourceCategorySchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newCategory = await storage.createCategory(validatedData.data);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  
  // Generated content endpoints
  apiRouter.get("/api/content", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const content = await storage.getAllGeneratedContent(limit);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch generated content" });
    }
  });
  
  apiRouter.get("/api/content/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const content = await storage.getFeaturedGeneratedContent(limit);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured content" });
    }
  });
  
  apiRouter.get("/api/content/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const content = await storage.getGeneratedContentByCategory(category, limit);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content by category" });
    }
  });
  
  apiRouter.get("/api/content/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const content = await storage.searchGeneratedContent(query);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to search content" });
    }
  });
  
  apiRouter.get("/api/content/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      const content = await storage.getGeneratedContentById(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  
  apiRouter.post("/api/content/generate", async (req: Request, res: Response) => {
    try {
      const { topic } = req.body;
      
      // Generate content using the AI service
      const generatedData = await generateSecurityTrendContent(topic);
      
      // Prepare data for database storage
      const contentData = {
        title: generatedData.title,
        summary: generatedData.summary,
        keyPoints: generatedData.keyPoints,
        youtubeScriptIdea: generatedData.youtubeScriptIdea,
        category: "cybersecurity",
        tags: ["security", "trends", "youtube"],
        fullContent: generatedData.keyPoints.join('\n\n'),
        isFeatured: false,
        relatedResourceIds: [],
        youtubeUrl: null
      };
      
      // Validate the data
      const validatedData = insertGeneratedContentSchema.safeParse(contentData);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Store in database
      const newContent = await storage.createGeneratedContent(validatedData.data);
      res.status(201).json(newContent);
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });
  
  apiRouter.post("/api/content", async (req: Request, res: Response) => {
    try {
      const validatedData = insertGeneratedContentSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newContent = await storage.createGeneratedContent(validatedData.data);
      res.status(201).json(newContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to create content" });
    }
  });
  
  apiRouter.delete("/api/content/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      const success = await storage.deleteGeneratedContent(id);
      if (!success) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });
  
  // Database reset endpoint (for development purposes)
  apiRouter.post("/api/reset-database", async (req: Request, res: Response) => {
    try {
      // Clear existing data
      await db.delete(chatMessages);
      await db.delete(resources);
      await db.delete(resourceCategories);
      await db.delete(generatedContent);
      
      // Reinitialize with default data
      await storage.initializeDefaultData();
      
      res.json({ message: "Database reset and reinitialized with affiliate links" });
    } catch (error) {
      console.error("Failed to reset database:", error);
      res.status(500).json({ message: "Failed to reset database" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
