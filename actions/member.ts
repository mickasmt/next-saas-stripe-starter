"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { authorize } from "@/lib/auth/engine";
import { prisma } from "@/lib/db";
import { roleUpdateSchema } from "@/lib/validations/team";

export async function updateMemberRole(
  teamId: string,
  memberId: string,
  data: { role: "ADMIN" | "MEMBER" },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    const authResult = await authorize(
      session.user.id,
      teamId,
      "team:members:manage",
    );
    if (!authResult.allowed) {
      return { status: "error", error: authResult.reason };
    }

    const { role } = roleUpdateSchema.parse(data);

    // Find the target member
    const targetMember = await prisma.teamMember.findUnique({
      where: { id: memberId, teamId },
    });

    if (!targetMember) {
      return { status: "error", error: "Member not found" };
    }

    // Prevent changing OWNER role through this action
    if (targetMember.role === "OWNER") {
      return { status: "error", error: "Cannot change owner role" };
    }

    await prisma.teamMember.update({
      where: { id: memberId },
      data: { role },
    });

    revalidatePath("/dashboard/team/members");
    return { status: "success" };
  } catch (error) {
    return { status: "error", error: "Failed to update member role" };
  }
}

export async function removeMember(teamId: string, memberId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    const authResult = await authorize(
      session.user.id,
      teamId,
      "team:members:remove",
    );
    if (!authResult.allowed) {
      return { status: "error", error: authResult.reason };
    }

    const targetMember = await prisma.teamMember.findUnique({
      where: { id: memberId, teamId },
    });

    if (!targetMember) {
      return { status: "error", error: "Member not found" };
    }

    // Block removal of the last owner
    if (targetMember.role === "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        return {
          status: "error",
          error: "Cannot remove the last team owner",
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.teamMember.delete({ where: { id: memberId } });

      // Context repair: clear currentTeamId if this was the removed user's current team
      await tx.user.updateMany({
        where: { id: targetMember.userId, currentTeamId: teamId },
        data: { currentTeamId: null },
      });
    });

    revalidatePath("/dashboard/team/members");
    return { status: "success" };
  } catch (error) {
    return { status: "error", error: "Failed to remove member" };
  }
}

export async function leaveTeam(teamId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    const userId = session.user.id;

    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!membership) {
      return { status: "error", error: "Not a member of this team" };
    }

    // Block if last owner
    if (membership.role === "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        return {
          status: "error",
          error:
            "Cannot leave as the last owner. Transfer ownership or delete the team.",
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.teamMember.delete({
        where: { teamId_userId: { teamId, userId } },
      });

      await tx.user.updateMany({
        where: { id: userId, currentTeamId: teamId },
        data: { currentTeamId: null },
      });
    });

    revalidatePath("/dashboard");
    return { status: "success" };
  } catch (error) {
    return { status: "error", error: "Failed to leave team" };
  }
}

export async function getTeamMembers(teamId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized", data: [] };
    }

    // Check team membership
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: session.user.id } },
    });
    if (!membership) {
      return { status: "error", error: "Not a team member", data: [] };
    }

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: [
        { role: "asc" }, // OWNER first, then ADMIN, then MEMBER
        { createdAt: "asc" },
      ],
    });

    return { status: "success", data: members };
  } catch (error) {
    return { status: "error", error: "Failed to get members", data: [] };
  }
}
