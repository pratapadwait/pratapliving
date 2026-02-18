import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug"),
  name: text("name").notNull(),
  type: text("type").notNull(), // comma-separated: homestay, suite, apartment, villa
  location: text("location").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  guests: integer("guests").notNull(),
  amenities: text("amenities").array().notNull(),
  imageUrl: text("image_url").notNull(),
  images: text("images").array().default(sql`'{}'::text[]`),
  featured: boolean("featured").default(false),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
});
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export const partnerInquiries = pgTable("partner_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  propertyType: text("property_type").notNull(),
  propertyLocation: text("property_location").notNull(),
  message: text("message"),
});

export const insertPartnerInquirySchema = createInsertSchema(partnerInquiries).omit({
  id: true,
});
export type InsertPartnerInquiry = z.infer<typeof insertPartnerInquirySchema>;
export type PartnerInquiry = typeof partnerInquiries.$inferSelect;

export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
});
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

// Keep existing user schema for compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
