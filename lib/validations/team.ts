import * as z from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(63)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});
