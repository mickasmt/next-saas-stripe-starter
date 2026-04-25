"use server";

import crypto from "crypto";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { getAuthContext, setCurrentTeam } from "@/lib/session";
import { authorize } from "@/lib/auth/engine";
import { auth } from "@/auth";

type ActionResult = { status: "success" | "error"; message?: string };

export async function createInvitation(
  teamId: string,
  data: { email: string; role: "ADMIN" | "MEMBER" },
): Promise<ActionResult> {
  try {
    const context = await getAuthContext();
    const decision = authorize(context, {
      scope: "team",
      permission: "team:members:invite",
    });
    if (!decision.allowed) {
      return { status: "error", message: decision.reason };
    }

    if (context!.team!.teamId !== teamId) {
      return { status: "error", message: "Team context mismatch" };
    }

    // Runtime validation: only ADMIN and MEMBER roles can be invited
    if (data.role !== "ADMIN" && data.role !== "MEMBER") {
      return { status: "error", message: "Invalid role. Only ADMIN and MEMBER roles can be invited." };
    }

    // Check for existing pending invitation
    const existing = await prisma.invitation.findFirst({
      where: { teamId, email: data.email, status: "PENDING" },
    });
    if (existing) {
      return { status: "error", message: "An invitation is already pending for this email" };
    }

    // Check if already a member
    const existingMember = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingMember) {
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId, userId: existingMember.id },
        },
      });
      if (membership) {
        return { status: "error", message: "User is already a member of this team" };
      }
    }

    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        teamId,
        email: data.email,
        role: data.role,
        token,
        status: "PENDING",
        invitedBy: context!.userId,
        expiresAt,
      },
    });

    await logAuditEvent(
      teamId,
      context!.userId,
      "INVITATION_ISSUED",
      "invitation",
      invitation.id,
      { email: data.email, role: data.role },
    );

    revalidatePath("/dashboard/team/invitations");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to create invitation",
    };
  }
}

export async function acceptInvitation(token: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return { status: "error", message: "Unauthorized" };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { team: true },
    });

    if (!invitation) {
      return { status: "error", message: "Invitation not found" };
    }

    if (invitation.status !== "PENDING") {
      return { status: "error", message: `Invitation has already been ${invitation.status.toLowerCase()}` };
    }

    if (invitation.expiresAt < new Date()) {
      return { status: "error", message: "Invitation has expired" };
    }

    if (invitation.email !== userEmail) {
      return { status: "error", message: "This invitation was sent to a different email address" };
    }

    // Idempotent — check if already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: invitation.teamId,
          userId,
        },
      },
    });

    if (existingMember) {
      // Mark invitation as accepted if not already
      if (invitation.status === "PENDING") {
        await prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: "ACCEPTED" },
        });
      }
      return { status: "success" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.teamMember.create({
        data: {
          teamId: invitation.teamId,
          userId,
          role: invitation.role,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });
    });

    // If user has no current team, set this one
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentTeamId: true },
    });
    if (!user?.currentTeamId) {
      await setCurrentTeam(invitation.teamId);
    }

    await logAuditEvent(
      invitation.teamId,
      userId,
      "INVITATION_ACCEPTED",
      "invitation",
      invitation.id,
      { email: userEmail },
    );

    await logAuditEvent(
      invitation.teamId,
      userId,
      "MEMBER_ADDED",
      "team_member",
      session.user.id,
      { role: invitation.role },
    );

    revalidatePath("/dashboard");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to accept invitation",
    };
  }
}

export async function revokeInvitation(
  invitationId: string,
): Promise<ActionResult> {
  try {
    const context = await getAuthContext();

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });
    if (!invitation) {
      return { status: "error", message: "Invitation not found" };
    }

    const decision = authorize(context, {
      scope: "team",
      permission: "team:members:invite",
    });
    if (!decision.allowed) {
      return { status: "error", message: decision.reason };
    }

    if (context!.team!.teamId !== invitation.teamId) {
      return { status: "error", message: "Team context mismatch" };
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "REVOKED" },
    });

    await logAuditEvent(
      invitation.teamId,
      context!.userId,
      "INVITATION_REVOKED",
      "invitation",
      invitationId,
      { email: invitation.email },
    );

    revalidatePath("/dashboard/team/invitations");
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to revoke invitation",
    };
  }
}
