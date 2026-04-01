import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertPartnerInquirySchema, insertContactInquirySchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import multer from "multer";
import { uploadToImageKit, getAuthParams } from "./imagekit";
import { scheduleRevalidation, removePropertyFiles } from "./revalidate";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerObjectStorageRoutes(app);

  app.post("/api/imagekit/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Only image files are allowed (JPEG, PNG, WebP, GIF, AVIF)" });
      }

      const rawFolder = (req.body.folder as string) || "/pratapliving-com";
      const folder = rawFolder.startsWith("/pratapliving-com") ? rawFolder : "/pratapliving-com";
      const base64File = req.file.buffer.toString("base64");

      const result = await uploadToImageKit(base64File, req.file.originalname, folder);

      res.json({
        url: result.url,
        fileId: result.fileId,
        filePath: result.filePath,
      });
    } catch (error: any) {
      console.error("ImageKit upload error:", error);
      res.status(500).json({ message: error.message || "Failed to upload image" });
    }
  });

  app.get("/api/imagekit/auth", (_req, res) => {
    try {
      const authParams = getAuthParams();
      res.json(authParams);
    } catch (error: any) {
      console.error("ImageKit auth error:", error);
      res.status(500).json({ message: "Failed to generate auth params" });
    }
  });

  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

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

  app.post("/api/properties", async (req, res) => {
    try {
      const parsed = insertPropertySchema.safeParse(req.body);
      if (!parsed.success) {
        const validationError = fromError(parsed.error);
        return res.status(400).json({ message: validationError.toString() });
      }
      const property = await storage.createProperty(parsed.data);
      scheduleRevalidation(['/', '/properties', ...(property.slug ? [`/${property.slug}`] : [])]);
      res.status(201).json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

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
      scheduleRevalidation(['/', '/properties', ...(property.slug ? [`/${property.slug}`] : [])]);
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const existing = await storage.getProperty(req.params.id);
      const deleted = await storage.deleteProperty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Property not found" });
      }
      if (existing?.slug) {
        removePropertyFiles(existing.slug).catch((e) =>
          console.error("[routes] Failed to remove property files:", e),
        );
      }
      scheduleRevalidation(['/', '/properties']);
      res.json({ message: "Property deleted" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  app.post("/api/revalidate", async (req, res) => {
    const secret = process.env.REVALIDATE_SECRET;
    if (!secret) {
      return res.status(503).json({ message: "Revalidation endpoint not configured" });
    }
    const authHeader = req.headers["authorization"] ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (token !== secret) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { urls } = req.body as { urls?: unknown };
    if (!Array.isArray(urls) || urls.some((u) => typeof u !== "string")) {
      return res.status(400).json({ message: "urls must be an array of strings" });
    }

    const SEGMENT_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const validPaths: string[] = [];

    for (const url of urls as string[]) {
      let pathname: string | null = null;
      try {
        pathname = url.startsWith("http")
          ? new URL(url).pathname
          : url.startsWith("/") ? url : `/${url}`;
      } catch {
        continue;
      }

      const normalized = pathname.replace(/\/+$/, "") || "/";
      const segments = normalized.replace(/^\//, "").split("/").filter(Boolean);

      const isValid =
        normalized === "/" ||
        (segments.length === 1 && SEGMENT_RE.test(segments[0])) ||
        (segments.length === 2 && segments[0] === "blog" && SEGMENT_RE.test(segments[1]));

      if (isValid) validPaths.push(normalized);
    }

    if (validPaths.length === 0) {
      return res.status(400).json({ message: "No valid URLs provided" });
    }

    scheduleRevalidation(validPaths);
    res.json({ message: "Revalidation queued", routes: validPaths });
  });

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
