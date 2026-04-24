import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withUserAuth } from "@/lib/auth/wrappers";
import { setCurrentTeam } from "@/lib/session";
import { logAuditEvent } from "@/lib/audit";

export const POST = withUserAuth(async (context, _req, params) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token: params.token },
    include: { team: true },
  });

  if (!invitation) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Invitation not found" } },
      { status: 404 },
    );
  }

  if (invitation.status !== "PENDING") {
    return NextResponse.json(
      { error: { code: "INVALID", message: `Invitation has already been ${invitation.status.toLowerCase()}` } },
      { status: 400 },
    );
  }

  if (invitation.expiresAt < new Date()) {
    return NextResponse.json(
      { error: { code: "EXPIRED", message: "Invitation has expired" } },
      { status: 400 },
    );
  }

  // Verify email matches
  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { email: true, currentTeamId: true },
  });

  if (user?.email !== invitation.email) {
    return NextResponse.json(
      { error: { code: "EMAIL_MISMATCH", message: "This invitation was sent to a different email address" } },
      { status: 403 },
    );
  }

  // Idempotent check
  const existingMember = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: invitation.teamId, userId: context.userId } },
  });

  if (existingMember) {
    if (invitation.status === "PENDING") {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });
    }
    return NextResponse.json({ success: true });
  }

  await prisma.$transaction(async (tx) => {
    await tx.teamMember.create({
      data: {
        teamId: invitation.teamId,
        userId: context.userId,
        role: invitation.role,
      },
    });
    await tx.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });
  });

  if (!user?.currentTeamId) {
    await setCurrentTeam(invitation.teamId);
  }

  await logAuditEvent(invitation.teamId, context.userId, "INVITATION_ACCEPTED", "invitation", invitation.id);
  await logAuditEvent(invitation.teamId, context.userId, "MEMBER_ADDED", "team_member", context.userId, {
    role: invitation.role,
  });

  return NextResponse.json({ success: true, teamId: invitation.teamId });
});
