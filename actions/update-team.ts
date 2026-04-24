"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";
import { updateTeamSchema } from "@/lib/validations/team";

type UpdateTeamInput = {
  name?: string;
  slug?: string;
  image?: string | null;
};

export async function updateTeam(teamId: string, data: UpdateTeamInput) {
  try {
    await requireTeamPermission(PERMISSIONS.TEAM_MANAGE);

    const validated = updateTeamSchema.parse(data);

    // Check slug uniqueness if changing
    if (validated.slug) {
      const existing = await prisma.team.findFirst({
        where: { slug: validated.slug, id: { not: teamId } },
      });
      if (existing) {
        return { status: "error" as const, message: "Slug already taken" };
      }
    }

    await prisma.team.update({
      where: { id: teamId },
      data: validated,
    });

    revalidatePath("/dashboard/settings/team");

    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to update team" };
  }
}
