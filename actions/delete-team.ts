"use server";

import { revalidatePath } from "next/cache";

import { clearActiveTeamId } from "@/lib/active-team";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { requireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";

export async function deleteTeam(teamId: string) {
  try {
    const { user } = await requireTeamPermission(PERMISSIONS.TEAM_MANAGE, teamId);

    await logAudit({
      teamId,
      userId: user.id!,
      action: "team.deleted",
    });

    await prisma.team.delete({ where: { id: teamId } });

    await clearActiveTeamId();
    revalidatePath("/dashboard");

    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to delete team" };
  }
}
