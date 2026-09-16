import { loader } from "fumadocs-core/source"
import { pageSchema } from "fumadocs-core/source/schema"
import { defineCollections } from "fumadocs-mdx/macro"
import { z } from "zod"

// Every entry is rendered in full on /changelog, newest first, and also gets
// its own permalink at /changelog/[slug] (see that route for the single-entry
// page with the author/share row).
const changelog = defineCollections({
  type: "doc",
  dir: "content/changelog",
  schema: pageSchema.extend({
    date: z.coerce.date(),
    image: z.string().optional(),
    // Key of config/blog.ts's authors.
    author: z.string().optional(),
  }),
})

export const changelogSource = loader({
  baseUrl: "/changelog",
  source: changelog.toFumadocsSource(),
})
