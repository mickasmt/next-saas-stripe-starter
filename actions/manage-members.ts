"use server";

import { revalidatePath } from "next/cache";
import { TeamRole } from "@prisma/client";

import { auth } from "@/auth";
import { clearActiveTeamId } from "@/lib/active-team";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { requireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";
import { updateMemberRoleSchema } from "@/lib/validations/team";

export async function removeMember(teamId: string, memberId: string) {
  try {
    const { user } = await requireTeamPermission(PERMISSIONS.MEMBERS_REMOVE, teamId);

    const member = await prisma.teamMember.findUnique({
      where: { id: memberId, teamId },
    });

    if (!member) {
      return { status: "error" as const, message: "Member not found" };
    }

    // Prevent removing the last owner
    if (member.role === TeamRole.OWNER) {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId, role: TeamRole.OWNER },
      });
      if (ownerCount <= 1) {
        return {
          status: "error" as const,
          message: "Cannot remove the last owner",
        };
      }
    }

    await prisma.teamMember.delete({ where: { id: memberId } });

    await logAudit({
      teamId,
      userId: user.id!,
      action: "member.removed",
      targetId: member.userId,
    });

    revalidatePath("/dashboard/settings/team");
    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to remove member" };
  }
}

export async function changeMemberRole(
  teamId: string,
  data: { memberId: string; role: TeamRole },
) {
  try {
    const { user } = await requireTeamPermission(PERMISSIONS.MEMBERS_ROLE_CHANGE, teamId);

    const { memberId, role } = updateMemberRoleSchema.parse(data);

    const member = await prisma.teamMember.findUnique({
      where: { id: memberId, teamId },
    });

    if (!member) {
      return { status: "error" as const, message: "Member not found" };
    }

    // Prevent demoting the last owner
    if (member.role === TeamRole.OWNER) {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId, role: TeamRole.OWNER },
      });
      if (ownerCount <= 1) {
        return {
          status: "error" as const,
          message: "Cannot demote the last owner",
        };
      }
    }

    await prisma.teamMember.update({
      where: { id: memberId },
      data: { role },
    });

    await logAudit({
      teamId,
      userId: user.id!,
      action: "member.role_changed",
      targetId: member.userId,
      metadata: { fromRole: member.role, toRole: role },
    });

    revalidatePath("/dashboard/settings/team");
    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to change role" };
  }
}

export async function leaveTeam(teamId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId: session.user.id },
      },
    });

    if (!member) {
      return { status: "error" as const, message: "Not a member" };
    }

    // Prevent the last owner from leaving
    if (member.role === TeamRole.OWNER) {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId, role: TeamRole.OWNER },
      });
      if (ownerCount <= 1) {
        return {
          status: "error" as const,
          message: "Cannot leave as the last owner. Transfer ownership first.",
        };
      }
    }

    await prisma.teamMember.delete({ where: { id: member.id } });

    await logAudit({
      teamId,
      userId: session.user.id,
      action: "member.left",
    });

    await clearActiveTeamId();
    revalidatePath("/dashboard");

    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to leave team" };
  }
}
