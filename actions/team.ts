"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { authorize } from "@/lib/auth/engine";
import { prisma } from "@/lib/db";
import { createTeamSchema, updateTeamSchema } from "@/lib/validations/team";

export async function createTeam(data: { name: string; slug: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    const userId = session.user.id;
    const { name, slug } = createTeamSchema.parse(data);

    // Check slug uniqueness
    const existing = await prisma.team.findUnique({ where: { slug } });
    if (existing) {
      return { status: "error", error: "Team slug already taken" };
    }

    // Atomically create team + owner membership + set currentTeamId
    const team = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name, slug },
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

    revalidatePath("/dashboard");
    return { status: "success", data: team };
  } catch (error) {
    return { status: "error", error: "Failed to create team" };
  }
}

export async function updateTeam(
  teamId: string,
  data: { name?: string; slug?: string },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    const authResult = await authorize(
      session.user.id,
      teamId,
      "team:settings:update",
    );
    if (!authResult.allowed) {
      return { status: "error", error: authResult.reason };
    }

    const validated = updateTeamSchema.parse(data);

    // Check slug uniqueness if changing
    if (validated.slug) {
      const existing = await prisma.team.findFirst({
        where: { slug: validated.slug, id: { not: teamId } },
      });
      if (existing) {
        return { status: "error", error: "Team slug already taken" };
      }
    }

    const team = await prisma.team.update({
      where: { id: teamId },
      data: validated,
    });

    revalidatePath("/dashboard/team/settings");
    return { status: "success", data: team };
  } catch (error) {
    return { status: "error", error: "Failed to update team" };
  }
}

export async function deleteTeam(teamId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    // Only OWNER can delete
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: session.user.id } },
    });

    if (!membership || membership.role !== "OWNER") {
      return { status: "error", error: "Only team owner can delete the team" };
    }

    await prisma.$transaction(async (tx) => {
      // Clear currentTeamId for all members of this team
      await tx.user.updateMany({
        where: { currentTeamId: teamId },
        data: { currentTeamId: null },
      });

      // Cascade delete handles members and invitations
      await tx.team.delete({ where: { id: teamId } });
    });

    revalidatePath("/dashboard");
    return { status: "success" };
  } catch (error) {
    return { status: "error", error: "Failed to delete team" };
  }
}

export async function switchTeam(teamId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    // Validate membership
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: session.user.id } },
    });

    if (!membership) {
      return { status: "error", error: "Not a member of this team" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { currentTeamId: teamId },
    });

    revalidatePath("/dashboard");
    return { status: "success" };
  } catch (error) {
    return { status: "error", error: "Failed to switch team" };
  }
}

export async function getUserTeams() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized", data: [] };
    }

    const memberships = await prisma.teamMember.findMany({
      where: { userId: session.user.id },
      include: { team: true },
      orderBy: { createdAt: "asc" },
    });

    return {
      status: "success",
      data: memberships.map((m) => ({
        ...m.team,
        role: m.role,
      })),
    };
  } catch (error) {
    return { status: "error", error: "Failed to get teams", data: [] };
  }
}
