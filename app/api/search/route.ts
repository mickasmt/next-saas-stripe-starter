import { createFromSource } from "fumadocs-core/search/server"

import { docsSource } from "@/lib/content/docs"
import { isFeatureEnabled } from "@/lib/features/resolve"

const search = createFromSource(docsSource, { language: "english" })

// Docs search, refused while the docs module is off.
export async function GET(request: Request) {
  if (!(await isFeatureEnabled("docs"))) {
    return new Response("Not Found", { status: 404 })
  }
  return search.GET(request)
}
