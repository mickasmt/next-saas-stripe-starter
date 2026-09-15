import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

// Pool (WebSocket) rather than neon-http: transactions are needed for
// user + organization + member creation at sign-up.
// Node 22+ ships a global WebSocket, so no `ws` polyfill is required.
const globalForDb = globalThis as unknown as { pool?: Pool }

// Reuse the pool across HMR reloads in development.
const pool = globalForDb.pool ?? new Pool({ connectionString })

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool
}

export const db = drizzle({ client: pool, schema })

export type Database = typeof db
