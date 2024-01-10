import { z } from "zod"

export const CreateList = z.object({
  userId: z.string({
    required_error: "user is required",
    invalid_type_error: "user is required",
  }),
})