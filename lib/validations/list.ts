
import * as z from "zod"

export const listSchemaValidator = z.object({
  name: z.string(),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  isArchived: z.boolean().default(false),
})

export const listSchemaResponse = z.object({
  response: z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.unknown(),
  }),
})


