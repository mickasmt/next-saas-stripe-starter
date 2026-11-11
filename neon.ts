// Optional: Neon services beyond Postgres, applied with `neon link` then
// `neon deploy`. Deploying provisions what is declared here on the linked
// branch and writes its variables (DATABASE_URL, AWS_*, NEON_AI_GATEWAY_*) to
// .env. Nothing in the app reads this file; each module stays off until its
// variables are set. https://neon.com/docs/reference/neon-ts
import { defineConfig } from "@neon/config/v1"

export default defineConfig({
  // module:uploads start
  // Private bucket: files are served through app/api/files.
  buckets: {
    uploads: {},
  },
  // module:uploads end
  aiGateway: true, // module:assistant
})
