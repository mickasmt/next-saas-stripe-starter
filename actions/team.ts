"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { logAuditEvent } from "@/lib/audit";
import { authorize } from "@/lib/auth/engine";
import { prisma } from "@/lib/db";
import {
  createTeamNameOnlySchema,
  updateTeamSchema,
} from "@/lib/validations/team";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createTeam(data: { name: string; slug?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    const userId = session.user.id;
    const validated = createTeamNameOnlySchema.parse(data);
    const slug = validated.slug || generateSlug(validated.name);

    // Check slug uniqueness
    const existing = await prisma.team.findUnique({ where: { slug } });
    if (existing) {
      return { status: "error", error: "Team slug already taken" };
    }

    // Atomically create team + owner membership + set currentTeamId
    const team = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name: validated.name, slug },
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

    await logAuditEvent({
      teamId: team.id,
      userId,
      action: "team.created",
      metadata: { name: team.name, slug: team.slug },
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

    await logAuditEvent({
      teamId,
      userId: session.user.id,
      action: "team.updated",
      metadata: validated,
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

    // Use authorize() for consistency — team:delete is OWNER-only
    const authResult = await authorize(
      session.user.id,
      teamId,
      "team:delete",
    );
    if (!authResult.allowed) {
      return { status: "error", error: authResult.reason };
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

export async function transferOwnership(teamId: string, newOwnerId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    // Only current OWNER can transfer
    const callerMembership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: session.user.id } },
    });

    if (!callerMembership || callerMembership.role !== "OWNER") {
      return { status: "error", error: "Only the team owner can transfer ownership" };
    }

    // Target must be an existing team member
    const targetMembership = await prisma.teamMember.findUnique({
      where: { id: newOwnerId, teamId },
    });

    if (!targetMembership) {
      return { status: "error", error: "Target member not found" };
    }

    if (targetMembership.userId === session.user.id) {
      return { status: "error", error: "You are already the owner" };
    }

    await prisma.$transaction(async (tx) => {
      // Promote target to OWNER
      await tx.teamMember.update({
        where: { id: newOwnerId },
        data: { role: "OWNER" },
      });

      // Demote current owner to ADMIN
      await tx.teamMember.update({
        where: { id: callerMembership.id },
        data: { role: "ADMIN" },
      });
    });

    await logAuditEvent({
      teamId,
      userId: session.user.id,
      action: "team.ownership_transferred",
      target: targetMembership.userId,
    });

    revalidatePath("/dashboard/team/members");
    return { status: "success" };
  } catch (error) {
    return { status: "error", error: "Failed to transfer ownership" };
  }
}
