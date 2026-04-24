"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { setCurrentTeam, getAuthContext } from "@/lib/session";
import { authorize } from "@/lib/auth/engine";
import { createTeamSchema, updateTeamSchema } from "@/lib/validations/team";

type ActionResult = { status: "success" | "error"; message?: string };

export async function createTeam(data: {
  name: string;
  slug: string;
}): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", message: "Unauthorized" };
    }

    const parsed = createTeamSchema.parse(data);

    const existing = await prisma.team.findUnique({
      where: { slug: parsed.slug },
    });
    if (existing) {
      return { status: "error", message: "A team with this slug already exists" };
    }

    const userId = session.user.id;

    const team = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name: parsed.name, slug: parsed.slug },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId,
          role: "OWNER",
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { currentTeamId: team.id },
      });

      return team;
    });

    await setCurrentTeam(team.id);

    await logAuditEvent(
      team.id,
      userId,
      "TEAM_CREATED",
      "team",
      team.id,
      { name: team.name, slug: team.slug },
    );

    revalidatePath("/dashboard");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to create team",
    };
  }
}

export async function updateTeam(
  teamId: string,
  data: { name?: string },
): Promise<ActionResult> {
  try {
    const context = await getAuthContext();
    const decision = authorize(context, {
      scope: "team",
      permission: "team:settings:update",
    });
    if (!decision.allowed) {
      return { status: "error", message: decision.reason };
    }

    const parsed = updateTeamSchema.parse(data);

    await prisma.team.update({
      where: { id: teamId },
      data: { name: parsed.name },
    });

    await logAuditEvent(
      teamId,
      context!.userId,
      "TEAM_UPDATED",
      "team",
      teamId,
      { name: parsed.name },
    );

    revalidatePath("/dashboard/team/settings");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update team",
    };
  }
}

export async function deleteTeam(teamId: string): Promise<ActionResult> {
  try {
    const context = await getAuthContext();
    if (!context?.team || context.team.teamId !== teamId) {
      return { status: "error", message: "No active team context" };
    }
    if (context.team.role !== "OWNER") {
      return { status: "error", message: "Only owners can delete a team" };
    }

    // Clear currentTeamId for all members of this team
    const members = await prisma.teamMember.findMany({
      where: { teamId },
      select: { userId: true },
    });

    await prisma.$transaction(async (tx) => {
      await tx.user.updateMany({
        where: {
          id: { in: members.map((m) => m.userId) },
          currentTeamId: teamId,
        },
        data: { currentTeamId: null },
      });

      await tx.team.delete({ where: { id: teamId } });
    });

    await logAuditEvent(
      teamId,
      context.userId,
      "TEAM_DELETED",
      "team",
      teamId,
    );

    revalidatePath("/dashboard");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to delete team",
    };
  }
}

export async function switchTeam(teamId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", message: "Unauthorized" };
    }

    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: session.user.id } },
    });

    if (!membership) {
      return { status: "error", message: "Not a member of this team" };
    }

    await setCurrentTeam(teamId);

    revalidatePath("/dashboard");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to switch team",
    };
  }
}
