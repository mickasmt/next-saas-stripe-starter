import { TeamRole } from "@prisma/client";
import * as z from "zod";

export const teamNameSchema = z.object({
  name: z.string().min(2).max(48),
});

export const teamSlugSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    ),
});

export const createTeamSchema = z.object({
  name: z.string().min(2).max(48),
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    ),
});

export const updateTeamSchema = z.object({
  name: z.string().min(2).max(48).optional(),
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    )
    .optional(),
});

export const invitationSchema = z.object({
  email: z.string().email(),
  role: z.enum([TeamRole.ADMIN, TeamRole.MEMBER]),
});

export const roleUpdateSchema = z.object({
  role: z.enum([TeamRole.ADMIN, TeamRole.MEMBER]),
});
