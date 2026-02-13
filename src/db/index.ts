import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

/**
 * Create Drizzle instance for Cloudflare D1.
 * https://orm.drizzle.team/docs/connect-cloudflare-d1
 */
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}
