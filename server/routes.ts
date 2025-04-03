import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertResourceSchema, 
  insertChatMessageSchema, 
  insertResourceCategorySchema 
} from "@shared/schema";
import { generateAIResponse, formatChatPrompt } from "./ai";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

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
        const previousMessages = await storage.getChatMessagesByUserId(validatedData.data.userId);
        
        // In a production environment, we would call an AI API like OpenAI here
        // Example pseudocode for OpenAI integration:
        /*
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You are an AI resource guide at Superfishal Intelligence, a platform that helps users discover free AI tools, get code examples, and find hosting options.' },
              ...previousMessages.map(msg => ({ 
                role: msg.role, 
                content: msg.content 
              })),
              { role: 'user', content: validatedData.data.content }
            ],
            temperature: 0.7
          })
        }).then(res => res.json());
        
        const aiResponseContent = openaiResponse.choices[0].message.content;
        */
        
        // For now, use a static response as a placeholder
        const aiResponseContent = "I'm your AI resource guide at Superfishal Intelligence. I can help you discover free AI tools, provide code examples, and recommend hosting options based on your needs.";
        
        // Save the AI response to the database
        const assistantMessage = await storage.createChatMessage({
          userId: validatedData.data.userId,
          content: aiResponseContent,
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

  const httpServer = createServer(app);

  return httpServer;
}
