import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = process.env.EXTERNAL_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("PG")).join(", "));
  throw new Error("DATABASE_URL environment variable is not set");
}

console.log("Database connection configured:", connectionString.replace(/:[^@]+@/, ":***@"));

export const pool = new Pool({
  connectionString,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  max: 5,
});

pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err.message);
});

export const db = drizzle(pool, { schema });
