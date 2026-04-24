import { TeamRole } from "@prisma/client";
import * as z from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
});

export const updateTeamSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    )
    .optional(),
  image: z.string().url().optional().nullable(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(TeamRole).refine((val) => val !== TeamRole.OWNER, {
    message: "Cannot invite as OWNER",
  }),
});

export const updateMemberRoleSchema = z.object({
  memberId: z.string(),
  role: z.nativeEnum(TeamRole).refine((val) => val !== TeamRole.OWNER, {
    message: "Cannot assign OWNER role",
  }),
});
