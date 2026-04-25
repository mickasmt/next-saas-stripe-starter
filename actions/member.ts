"use server";

import { revalidatePath } from "next/cache";
import { TeamRole } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { getAuthContext, clearCurrentTeam } from "@/lib/session";
import { authorize } from "@/lib/auth/engine";

type ActionResult = { status: "success" | "error"; message?: string };

export async function updateMemberRole(
  memberId: string,
  data: { role: TeamRole },
): Promise<ActionResult> {
  try {
    const context = await getAuthContext();
    const decision = authorize(context, {
      scope: "team",
      permission: "team:members:manage",
    });
    if (!decision.allowed) {
      return { status: "error", message: decision.reason };
    }

    // Only Owners can promote to Owner
    if (data.role === "OWNER" && context!.team!.role !== "OWNER") {
      return { status: "error", message: "Only owners can promote to owner" };
    }

    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });
    if (!member) {
      return { status: "error", message: "Member not found" };
    }

    if (member.teamId !== context!.team!.teamId) {
      return { status: "error", message: "Member does not belong to current team" };
    }

    // Prevent downgrading last OWNER
    if (member.role === "OWNER" && data.role !== "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId: member.teamId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        return { status: "error", message: "Cannot change role of the last owner" };
      }
    }

    const oldRole = member.role;
    await prisma.teamMember.update({
      where: { id: memberId },
      data: { role: data.role },
    });

    await logAuditEvent(
      member.teamId,
      context!.userId,
      "ROLE_UPDATED",
      "team_member",
      memberId,
      { oldRole, newRole: data.role },
    );

    revalidatePath("/dashboard/team/members");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update role",
    };
  }
}

export async function removeMember(
  memberId: string,
): Promise<ActionResult> {
  try {
    const context = await getAuthContext();
    const decision = authorize(context, {
      scope: "team",
      permission: "team:members:remove",
    });
    if (!decision.allowed) {
      return { status: "error", message: decision.reason };
    }

    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });
    if (!member) {
      return { status: "error", message: "Member not found" };
    }

    if (member.teamId !== context!.team!.teamId) {
      return { status: "error", message: "Member does not belong to current team" };
    }

    // Prevent removing last OWNER
    if (member.role === "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId: member.teamId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        return { status: "error", message: "Cannot remove the last owner" };
      }
    }

    await prisma.teamMember.delete({ where: { id: memberId } });

    // If removed user's current team is this team, clear it
    const removedUser = await prisma.user.findUnique({
      where: { id: member.userId },
      select: { currentTeamId: true },
    });
    if (removedUser?.currentTeamId === member.teamId) {
      await prisma.user.update({
        where: { id: member.userId },
        data: { currentTeamId: null },
      });
    }

    await logAuditEvent(
      member.teamId,
      context!.userId,
      "MEMBER_REMOVED",
      "team_member",
      memberId,
      { removedUserId: member.userId },
    );

    revalidatePath("/dashboard/team/members");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to remove member",
    };
  }
}

export async function leaveTeam(teamId: string): Promise<ActionResult> {
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

    // Prevent leaving as last OWNER
    if (membership.role === "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        return { status: "error", message: "Cannot leave as the last owner. Transfer ownership first." };
      }
    }

    await prisma.teamMember.delete({ where: { id: membership.id } });

    // Clear own team context if needed
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { currentTeamId: true },
    });
    if (user?.currentTeamId === teamId) {
      await clearCurrentTeam();
    }

    await logAuditEvent(
      teamId,
      session.user.id,
      "MEMBER_LEFT",
      "team_member",
      session.user.id,
    );

    revalidatePath("/dashboard");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to leave team",
    };
  }
}
