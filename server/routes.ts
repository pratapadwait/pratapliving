import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertPartnerInquirySchema, insertContactInquirySchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerObjectStorageRoutes(app);

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

  // Create property
  app.post("/api/properties", async (req, res) => {
    try {
      const parsed = insertPropertySchema.safeParse(req.body);
      if (!parsed.success) {
        const validationError = fromError(parsed.error);
        return res.status(400).json({ message: validationError.toString() });
      }
      const property = await storage.createProperty(parsed.data);
      res.status(201).json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  // Update property
  app.put("/api/properties/:id", async (req, res) => {
    try {
      const parsed = insertPropertySchema.partial().safeParse(req.body);
      if (!parsed.success) {
        const validationError = fromError(parsed.error);
        return res.status(400).json({ message: validationError.toString() });
      }
      const property = await storage.updateProperty(req.params.id, parsed.data);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  // Delete property
  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProperty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json({ message: "Property deleted" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
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
