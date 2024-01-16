import * as z from "zod"
import { OgType } from "@prisma/client"
import { CompleteList, relatedListSchema } from "./index"

export const linkSchema = z.object({
  id: z.string(),
  title: z.string().nullish(),
  url: z.string(),
  description: z.string().nullish(),
  order: z.number().int(),
  type: z.nativeEnum(OgType),
  listId: z.string().nullish(),
  userId: z.string(),
})

export interface CompleteLink extends z.infer<typeof linkSchema> {
  list?: CompleteList | null
}

/**
 * relatedLinkSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedLinkSchema: z.ZodSchema<CompleteLink> = z.lazy(() => linkSchema.extend({
  list: relatedListSchema.nullish(),
}))
