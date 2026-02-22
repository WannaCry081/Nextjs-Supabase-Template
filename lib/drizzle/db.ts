import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

/**
 * Database connection singleton
 * Uses Postgres.js with Supabase Transaction pooling mode
 */
let dbInstance: ReturnType<typeof drizzle> | null = null;

/**
 * Get or create database connection
 * @returns Drizzle database instance
 */
export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 10, // Maximum pool size
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout in seconds
  });

  dbInstance = drizzle(client);

  return dbInstance;
}

/**
 * Direct database export for convenience
 * Use this for standard queries
 */
export const db = getDb();
