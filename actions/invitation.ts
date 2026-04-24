"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { authorize } from "@/lib/auth/engine";
import { prisma } from "@/lib/db";
import { sendTeamInvitation } from "@/lib/email";
import { invitationSchema } from "@/lib/validations/team";

export async function createInvitation(
  teamId: string,
  data: { email: string; role: "ADMIN" | "MEMBER" },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    const authResult = await authorize(
      session.user.id,
      teamId,
      "team:members:invite",
    );
    if (!authResult.allowed) {
      return { status: "error", error: authResult.reason };
    }

    const { email, role } = invitationSchema.parse(data);

    // Check for existing pending invitation
    const existing = await prisma.invitation.findFirst({
      where: { teamId, email, status: "PENDING" },
    });
    if (existing) {
      return {
        status: "error",
        error: "A pending invitation already exists for this email",
      };
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      const existingMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId, userId: existingUser.id },
        },
      });
      if (existingMember) {
        return { status: "error", error: "User is already a team member" };
      }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        teamId,
        email,
        role,
        token,
        invitedBy: session.user.id,
        expiresAt,
      },
      include: { team: true },
    });

    // Send invitation email
    try {
      await sendTeamInvitation({
        email,
        teamName: invitation.team.name,
        inviterName: session.user.name || "A team member",
        role,
        token,
      });
    } catch {
      // Email failure shouldn't block invitation creation
    }

    revalidatePath("/dashboard/team/invitations");
    return { status: "success", data: invitation };
  } catch (error) {
    return { status: "error", error: "Failed to create invitation" };
  }
}

export async function acceptInvitation(token: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return { status: "error", error: "Unauthorized" };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { team: true },
    });

    if (!invitation) {
      return { status: "error", error: "Invitation not found" };
    }

    if (invitation.status === "ACCEPTED") {
      // Idempotent: already accepted
      return { status: "success", data: invitation.team };
    }

    if (invitation.status === "REVOKED") {
      return { status: "error", error: "This invitation has been revoked" };
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
      return { status: "error", error: "This invitation has expired" };
    }

    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      return {
        status: "error",
        error: "This invitation was sent to a different email address",
      };
    }

    // Transactionally create membership + mark invitation accepted
    await prisma.$transaction(async (tx) => {
      // Create membership (upsert to handle edge cases)
      await tx.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: invitation.teamId,
            userId,
          },
        },
        create: {
          teamId: invitation.teamId,
          userId,
          role: invitation.role,
        },
        update: {},
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });

      // Set currentTeamId if user has no current team
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { currentTeamId: true },
      });
      if (!user?.currentTeamId) {
        await tx.user.update({
          where: { id: userId },
          data: { currentTeamId: invitation.teamId },
        });
      }
    });

    revalidatePath("/dashboard");
    return { status: "success", data: invitation.team };
  } catch (error) {
    return { status: "error", error: "Failed to accept invitation" };
  }
}

export async function revokeInvitation(teamId: string, invitationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    const authResult = await authorize(
      session.user.id,
      teamId,
      "team:members:invite",
    );
    if (!authResult.allowed) {
      return { status: "error", error: authResult.reason };
    }

    await prisma.invitation.update({
      where: { id: invitationId, teamId },
      data: { status: "REVOKED" },
    });

    revalidatePath("/dashboard/team/invitations");
    return { status: "success" };
  } catch (error) {
    return { status: "error", error: "Failed to revoke invitation" };
  }
}

export async function getTeamInvitations(teamId: string) {
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

    const invitations = await prisma.invitation.findMany({
      where: { teamId },
      include: { inviter: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return { status: "success", data: invitations };
  } catch (error) {
    return { status: "error", error: "Failed to get invitations", data: [] };
  }
}
