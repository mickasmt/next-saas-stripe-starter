import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withTeamAuth } from "@/lib/auth/wrappers";
import { logAuditEvent } from "@/lib/audit";

export const DELETE = withTeamAuth("team:members:invite", async (context, _req, params) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: params.invitationId },
  });

  if (!invitation || invitation.teamId !== params.teamId) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Invitation not found" } },
      { status: 404 },
    );
  }

  await prisma.invitation.update({
    where: { id: params.invitationId },
    data: { status: "REVOKED" },
  });

  await logAuditEvent(
    params.teamId,
    context.userId,
    "INVITATION_REVOKED",
    "invitation",
    params.invitationId,
    { email: invitation.email },
  );

  return NextResponse.json({ success: true });
});
