import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schema from "./schema";

/** True when a real Postgres URL is configured. */
export const hasDatabase = Boolean(env.DATABASE_URL);

function createDb() {
  if (!env.DATABASE_URL) return null;
  const client = postgres(env.DATABASE_URL, { prepare: false });
  return drizzle(client, { schema });
}

/** Drizzle client, or `null` when no `DATABASE_URL` is set. */
export const db = createDb();
export type Database = NonNullable<typeof db>;
export { schema };
