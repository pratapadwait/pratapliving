import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPartnerInquirySchema, insertContactInquirySchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Get single property
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Submit partner inquiry
  app.post("/api/partner-inquiries", async (req, res) => {
    try {
      const parsed = insertPartnerInquirySchema.safeParse(req.body);
      if (!parsed.success) {
        const validationError = fromError(parsed.error);
        return res.status(400).json({ message: validationError.toString() });
      }
      
      const inquiry = await storage.createPartnerInquiry(parsed.data);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating partner inquiry:", error);
      res.status(500).json({ message: "Failed to submit inquiry" });
    }
  });

  // Submit contact inquiry
  app.post("/api/contact-inquiries", async (req, res) => {
    try {
      const parsed = insertContactInquirySchema.safeParse(req.body);
      if (!parsed.success) {
        const validationError = fromError(parsed.error);
        return res.status(400).json({ message: validationError.toString() });
      }
      
      const inquiry = await storage.createContactInquiry(parsed.data);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      res.status(500).json({ message: "Failed to submit message" });
    }
  });

  return httpServer;
}
