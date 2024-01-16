import * as z from "zod"
import { CompleteLink, relatedLinkSchema } from "./index"

export const listSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string().nullish(),
  description: z.string(),
  public: z.boolean(),
  shares: z.number().int(),
  userId: z.string(),
})

export interface CompleteList extends z.infer<typeof listSchema> {
  links: CompleteLink[]
}

/**
 * relatedListSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedListSchema: z.ZodSchema<CompleteList> = z.lazy(() => listSchema.extend({
  links: relatedLinkSchema.array(),
}))
