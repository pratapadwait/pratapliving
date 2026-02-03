import { db } from "./db";
import { properties } from "@shared/schema";

const sampleProperties = [
  {
    name: "Royal Heritage Homestay",
    type: "homestay",
    location: "Hazratganj, Lucknow",
    description: "Experience authentic Lucknowi hospitality in this beautifully restored heritage home. Enjoy traditional architecture, home-cooked Awadhi cuisine, and warm family welcome.",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    amenities: ["WiFi", "AC", "Home-cooked Meals", "Heritage Tour", "Parking"],
    imageUrl: "homestay",
    featured: true,
  },
  {
    name: "Nawabi Suite at Lucknow Grand",
    type: "suite",
    location: "Gomti Nagar, Lucknow",
    description: "Luxurious suite with elegant interiors inspired by Nawabi culture. Features a private balcony with city views, premium amenities, and 24-hour room service.",
    price: 5500,
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    amenities: ["WiFi", "AC", "Mini Bar", "Room Service", "Gym Access", "Pool Access"],
    imageUrl: "suite",
    featured: true,
  },
  {
    name: "Modern City Apartment",
    type: "apartment",
    location: "Aliganj, Lucknow",
    description: "Fully furnished modern apartment perfect for extended stays. Equipped kitchen, spacious living area, high-speed internet, and all essential amenities.",
    price: 3500,
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    amenities: ["WiFi", "AC", "Full Kitchen", "Washer", "Smart TV", "Parking"],
    imageUrl: "apartment",
    featured: true,
  },
  {
    name: "Lucknow Grand Villa",
    type: "villa",
    location: "Vikas Nagar, Lucknow",
    description: "Exclusive private villa with lush gardens, private pool, and staff. Perfect for celebrations, family gatherings, or a luxurious retreat.",
    price: 15000,
    bedrooms: 4,
    bathrooms: 4,
    guests: 10,
    amenities: ["Private Pool", "Garden", "BBQ", "Staff", "WiFi", "AC", "Parking"],
    imageUrl: "villa",
    featured: true,
  },
  {
    name: "Cozy Corner Homestay",
    type: "homestay",
    location: "Aminabad, Lucknow",
    description: "Charming homestay in the heart of old Lucknow. Walking distance to famous street food, markets, and historical sites.",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    amenities: ["WiFi", "AC", "Breakfast", "Local Guide", "Parking"],
    imageUrl: "homestay",
    featured: false,
  },
  {
    name: "Executive Business Suite",
    type: "suite",
    location: "Indira Nagar, Lucknow",
    description: "Premium suite designed for business travelers. High-speed WiFi, dedicated workspace, meeting room access, and airport transfers.",
    price: 4500,
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    amenities: ["WiFi", "AC", "Workspace", "Meeting Room", "Airport Transfer", "Gym"],
    imageUrl: "suite",
    featured: false,
  },
  {
    name: "Family Garden Apartment",
    type: "apartment",
    location: "Mahanagar, Lucknow",
    description: "Spacious family-friendly apartment with garden views. Kid-safe environment, play area access, and all modern conveniences.",
    price: 4000,
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    amenities: ["WiFi", "AC", "Kitchen", "Play Area", "Garden View", "Parking"],
    imageUrl: "apartment",
    featured: false,
  },
  {
    name: "Riverside Retreat Villa",
    type: "villa",
    location: "Chinhat, Lucknow",
    description: "Serene villa by the river with breathtaking views. Features outdoor deck, jacuzzi, and complete privacy for an unforgettable getaway.",
    price: 12000,
    bedrooms: 3,
    bathrooms: 3,
    guests: 8,
    amenities: ["River View", "Jacuzzi", "Deck", "WiFi", "AC", "BBQ", "Chef on Request"],
    imageUrl: "villa",
    featured: false,
  },
];

export async function seedDatabase() {
  try {
    const existingProperties = await db.select().from(properties);
    
    if (existingProperties.length === 0) {
      console.log("Seeding database with sample properties...");
      await db.insert(properties).values(sampleProperties);
      console.log("Database seeded successfully with", sampleProperties.length, "properties.");
    } else {
      console.log("Database already has", existingProperties.length, "properties. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
