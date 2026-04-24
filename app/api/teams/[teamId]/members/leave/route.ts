import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withUserAuth } from "@/lib/auth/wrappers";
import { clearCurrentTeam } from "@/lib/session";
import { logAuditEvent } from "@/lib/audit";

export const POST = withUserAuth(async (context, _req, params) => {
  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: params.teamId, userId: context.userId } },
  });

  if (!membership) {
    return NextResponse.json(
      { error: { code: "NOT_MEMBER", message: "Not a member of this team" } },
      { status: 403 },
    );
  }

  if (membership.role === "OWNER") {
    const ownerCount = await prisma.teamMember.count({
      where: { teamId: params.teamId, role: "OWNER" },
    });
    if (ownerCount <= 1) {
      return NextResponse.json(
        { error: { code: "LAST_OWNER", message: "Cannot leave as the last owner" } },
        { status: 400 },
      );
    }
  }

  await prisma.teamMember.delete({ where: { id: membership.id } });

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { currentTeamId: true },
  });
  if (user?.currentTeamId === params.teamId) {
    await clearCurrentTeam();
  }

  await logAuditEvent(params.teamId, context.userId, "MEMBER_LEFT", "team_member", context.userId);

  return NextResponse.json({ success: true });
});
