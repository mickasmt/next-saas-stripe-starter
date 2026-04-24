"use server";

import { revalidatePath } from "next/cache";
import { TeamRole } from "@prisma/client";

import { auth } from "@/auth";
import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { setActiveTeamId } from "@/lib/active-team";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/email";
import { requireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";
import { inviteMemberSchema } from "@/lib/validations/team";
import { TeamInviteEmail } from "@/emails/team-invite-email";

export async function createInvite(
  teamId: string,
  data: { email: string; role: TeamRole },
) {
  try {
    const { user } = await requireTeamPermission(PERMISSIONS.MEMBERS_INVITE, teamId);

    const { email, role } = inviteMemberSchema.parse(data);

    // Check if already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        user: { email },
      },
    });

    if (existingMember) {
      return {
        status: "error" as const,
        message: "User is already a team member",
      };
    }

    // Check for existing pending invite
    const existingInvite = await prisma.teamInvite.findUnique({
      where: { teamId_email: { teamId, email } },
    });

    if (existingInvite && existingInvite.status === "PENDING") {
      return {
        status: "error" as const,
        message: "An invite is already pending for this email",
      };
    }

    // Delete any old non-pending invite and create new
    if (existingInvite) {
      await prisma.teamInvite.delete({ where: { id: existingInvite.id } });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { name: true },
    });

    const invite = await prisma.teamInvite.create({
      data: {
        teamId,
        email,
        role,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Send invite email
    const inviteUrl = `${env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;

    try {
      await resend.emails.send({
        from: env.EMAIL_FROM,
        to:
          process.env.NODE_ENV === "development"
            ? "delivered@resend.dev"
            : email,
        subject: `Join ${team?.name} on ${siteConfig.name}`,
        react: TeamInviteEmail({
          inviterName: user.name || "A team member",
          teamName: team?.name || "a team",
          inviteUrl,
          role,
          siteName: siteConfig.name,
        }),
      });
    } catch {
      // Don't fail the invite creation if email fails
      console.error("Failed to send invite email");
    }

    await logAudit({
      teamId,
      userId: user.id!,
      action: "member.invited",
      targetType: "invite",
      targetId: invite.id,
      metadata: { email, role },
    });

    revalidatePath("/dashboard/settings/team");
    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to create invite" };
  }
}

export async function acceptInvite(token: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const invite = await prisma.teamInvite.findUnique({
      where: { token },
      include: { team: { select: { name: true } } },
    });

    if (!invite) {
      return { status: "error" as const, message: "Invite not found" };
    }

    if (invite.status !== "PENDING") {
      return { status: "error" as const, message: "Invite is no longer valid" };
    }

    if (invite.email !== session.user.email) {
      return {
        status: "error" as const,
        message: "This invite was sent to a different email address",
      };
    }

    if (new Date() > invite.expiresAt) {
      await prisma.teamInvite.update({
        where: { id: invite.id },
        data: { status: "EXPIRED" },
      });
      return { status: "error" as const, message: "Invite has expired" };
    }

    // Create membership and mark invite as accepted
    await prisma.$transaction(async (tx) => {
      await tx.teamMember.create({
        data: {
          teamId: invite.teamId,
          userId,
          role: invite.role,
        },
      });

      await tx.teamInvite.update({
        where: { id: invite.id },
        data: { status: "ACCEPTED" },
      });
    });

    await logAudit({
      teamId: invite.teamId,
      userId,
      action: "member.joined",
      targetType: "user",
      targetId: userId,
      metadata: { role: invite.role },
    });

    await setActiveTeamId(invite.teamId);
    revalidatePath("/dashboard");

    return { status: "success" as const, teamId: invite.teamId };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to accept invite" };
  }
}

export async function declineInvite(token: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const invite = await prisma.teamInvite.findUnique({
      where: { token },
    });

    if (!invite || invite.email !== session.user.email) {
      return { status: "error" as const, message: "Invite not found" };
    }

    await prisma.teamInvite.update({
      where: { id: invite.id },
      data: { status: "DECLINED" },
    });

    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to decline invite" };
  }
}

export async function revokeInvite(teamId: string, inviteId: string) {
  try {
    const { user } = await requireTeamPermission(PERMISSIONS.MEMBERS_INVITE, teamId);

    await prisma.teamInvite.delete({
      where: { id: inviteId, teamId },
    });

    await logAudit({
      teamId,
      userId: user.id!,
      action: "invite.revoked",
      targetType: "invite",
      targetId: inviteId,
    });

    revalidatePath("/dashboard/settings/team");
    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to revoke invite" };
  }
}
