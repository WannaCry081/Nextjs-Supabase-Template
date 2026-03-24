import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const client = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  dbInstance = drizzle(client);
  return dbInstance;
}

export const db = getDb();
