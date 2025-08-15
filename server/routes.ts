import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processAIRequest } from "./services/openai";
import { aiRequestSchema, updateQueryFeedbackSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Assistant endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { input, taskType } = aiRequestSchema.parse(req.body);
      
      // Validate bracket format
      const bracketPattern = new RegExp(`^\\[${taskType}\\]`);
      if (!bracketPattern.test(input)) {
        return res.status(400).json({ 
          error: `Input must start with [${taskType}] for the selected task type` 
        });
      }

      // Process AI request
      const aiResponse = await processAIRequest({ input, taskType });
      
      // Store the query in memory
      const storedQuery = await storage.createAiQuery({
        taskType,
        userInput: input,
        response: aiResponse.response,
      });

      res.json({
        id: storedQuery.id,
        response: aiResponse.response,
        taskType: aiResponse.taskType
      });
    } catch (error) {
      console.error("AI Chat Error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid input format", 
          details: error.errors 
        });
      }
      
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.status(500).json({ error: "Failed to process AI request" });
    }
  });

  // Feedback endpoint
  app.post("/api/ai/feedback", async (req, res) => {
    try {
      const { id, isHelpful } = updateQueryFeedbackSchema.parse(req.body);
      
      const updatedQuery = await storage.updateQueryFeedback(id, isHelpful);
      
      if (!updatedQuery) {
        return res.status(404).json({ error: "Query not found" });
      }

      res.json({ success: true, isHelpful });
    } catch (error) {
      console.error("Feedback Error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid feedback format", 
          details: error.errors 
        });
      }
      
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Session stats endpoint
  app.get("/api/stats/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const stats = await storage.getSessionStats(sessionId);
      
      if (!stats) {
        return res.json({
          queriesCount: 0,
          helpfulCount: 0,
          successRate: 0
        });
      }

      const successRate = (stats.queriesCount || 0) > 0 
        ? Math.round(((stats.helpfulCount || 0) / (stats.queriesCount || 0)) * 100) 
        : 0;

      res.json({
        queriesCount: stats.queriesCount || 0,
        helpfulCount: stats.helpfulCount || 0,
        successRate
      });
    } catch (error) {
      console.error("Stats Error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Update session stats
  app.post("/api/stats/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { queriesCount, helpfulCount } = req.body;
      
      const stats = await storage.updateSessionStats(sessionId, queriesCount, helpfulCount);
      
      const successRate = (stats.queriesCount || 0) > 0 
        ? Math.round(((stats.helpfulCount || 0) / (stats.queriesCount || 0)) * 100) 
        : 0;

      res.json({
        queriesCount: stats.queriesCount || 0,
        helpfulCount: stats.helpfulCount || 0,
        successRate
      });
    } catch (error) {
      console.error("Update Stats Error:", error);
      res.status(500).json({ error: "Failed to update stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
