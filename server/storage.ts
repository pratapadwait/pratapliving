import { db } from "./db";
import { properties, partnerInquiries, contactInquiries, users } from "@shared/schema";
import type { 
  Property, InsertProperty, 
  PartnerInquiry, InsertPartnerInquiry,
  ContactInquiry, InsertContactInquiry,
  User, InsertUser 
} from "@shared/schema";
import { eq, or } from "drizzle-orm";

export interface IStorage {
  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(idOrSlug: string): Promise<Property | undefined>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  
  // Partner Inquiries
  createPartnerInquiry(inquiry: InsertPartnerInquiry): Promise<PartnerInquiry>;
  getPartnerInquiries(): Promise<PartnerInquiry[]>;
  
  // Contact Inquiries
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  
  // Users (kept for compatibility)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Properties
  async getProperties(): Promise<Property[]> {
    return db.select().from(properties);
  }

  async getProperty(idOrSlug: string): Promise<Property | undefined> {
    const result = await db.select().from(properties).where(
      or(eq(properties.id, idOrSlug), eq(properties.slug, idOrSlug))
    );
    return result[0];
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return db.select().from(properties).where(eq(properties.featured, true));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const result = await db.insert(properties).values(property).returning();
    return result[0];
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const result = await db.update(properties).set(property).where(eq(properties.id, id)).returning();
    return result[0];
  }

  async deleteProperty(id: string): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id)).returning();
    return result.length > 0;
  }

  // Partner Inquiries
  async createPartnerInquiry(inquiry: InsertPartnerInquiry): Promise<PartnerInquiry> {
    const result = await db.insert(partnerInquiries).values(inquiry).returning();
    return result[0];
  }

  async getPartnerInquiries(): Promise<PartnerInquiry[]> {
    return db.select().from(partnerInquiries);
  }

  // Contact Inquiries
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const result = await db.insert(contactInquiries).values(inquiry).returning();
    return result[0];
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return db.select().from(contactInquiries);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
