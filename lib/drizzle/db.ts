import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

let db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (db) {
    return db;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Disable prefetch as it is not supported for "Transaction" pool mode.
  const client = postgres(connectionString, { prepare: false });
  db = drizzle(client);

  return db;
};
