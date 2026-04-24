import crypto from "crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withTeamAuth } from "@/lib/auth/wrappers";
import { logAuditEvent } from "@/lib/audit";

export const GET = withTeamAuth("team:members:invite", async (_context, _req, params) => {
  const invitations = await prisma.invitation.findMany({
    where: { teamId: params.teamId },
    include: {
      inviter: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invitations);
});

export const POST = withTeamAuth("team:members:invite", async (context, req, params) => {
  const { email, role } = await req.json();

  if (!email || !role) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Email and role are required" } },
      { status: 400 },
    );
  }

  // Check for existing pending invitation
  const existing = await prisma.invitation.findFirst({
    where: { teamId: params.teamId, email, status: "PENDING" },
  });
  if (existing) {
    return NextResponse.json(
      { error: { code: "CONFLICT", message: "An invitation is already pending for this email" } },
      { status: 409 },
    );
  }

  // Check if already a member
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: params.teamId, userId: existingUser.id } },
    });
    if (membership) {
      return NextResponse.json(
        { error: { code: "CONFLICT", message: "User is already a member of this team" } },
        { status: 409 },
      );
    }
  }

  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invitation = await prisma.invitation.create({
    data: {
      teamId: params.teamId,
      email,
      role,
      token,
      status: "PENDING",
      invitedBy: context.userId,
      expiresAt,
    },
  });

  await logAuditEvent(params.teamId, context.userId, "INVITATION_ISSUED", "invitation", invitation.id, {
    email,
    role,
  });

  return NextResponse.json(invitation, { status: 201 });
});
