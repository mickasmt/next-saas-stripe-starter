import { loader } from "fumadocs-core/source"
import { pageSchema } from "fumadocs-core/source/schema"
import { defineCollections } from "fumadocs-mdx/macro"
import { z } from "zod"

// Terms, privacy and any other legal page. Not a module: every product needs
// them. Each `## heading` becomes a numbered section (see LegalPage).
const legal = defineCollections({
  type: "doc",
  dir: "content/legal",
  schema: pageSchema.extend({
    updatedAt: z.coerce.date(),
  }),
})

export const legalSource = loader({
  baseUrl: "/",
  source: legal.toFumadocsSource(),
})
