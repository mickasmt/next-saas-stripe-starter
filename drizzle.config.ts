import { loadEnvConfig } from "@next/env"
import { defineConfig } from "drizzle-kit"

// Load .env / .env.local with the same precedence rules as Next.js.
loadEnvConfig(process.cwd())

// Migrations run over a direct connection; the pooled URL is for the app.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL

if (!url) {
  throw new Error("DATABASE_URL is not set")
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url },
  strict: true,
  verbose: true,
})
