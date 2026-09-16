import { loader } from "fumadocs-core/source"
import { pageSchema } from "fumadocs-core/source/schema"
import { defineCollections } from "fumadocs-mdx/macro"
import { z } from "zod"

const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: pageSchema.extend({
    image: z.string(),
    date: z.coerce.date(),
    // Keys of config/blog.ts authors and categories.
    authors: z.array(z.string()).min(1),
    categories: z.array(z.string()).default([]),
    // Slugs of other posts.
    related: z.array(z.string()).default([]),
  }),
})

export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
})
