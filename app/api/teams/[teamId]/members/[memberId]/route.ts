import { NextResponse } from "next/server";
import { TeamRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import { withTeamAuth } from "@/lib/auth/wrappers";
import { logAuditEvent } from "@/lib/audit";

export const PATCH = withTeamAuth("team:members:manage", async (context, req, params) => {
  const { role } = await req.json() as { role: TeamRole };

  const member = await prisma.teamMember.findUnique({
    where: { id: params.memberId },
  });
  if (!member || member.teamId !== params.teamId) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Member not found" } },
      { status: 404 },
    );
  }

  if (member.role === "OWNER" && role !== "OWNER") {
    const ownerCount = await prisma.teamMember.count({
      where: { teamId: params.teamId, role: "OWNER" },
    });
    if (ownerCount <= 1) {
      return NextResponse.json(
        { error: { code: "LAST_OWNER", message: "Cannot change role of the last owner" } },
        { status: 400 },
      );
    }
  }

  const oldRole = member.role;
  const updated = await prisma.teamMember.update({
    where: { id: params.memberId },
    data: { role },
  });

  await logAuditEvent(params.teamId, context.userId, "ROLE_UPDATED", "team_member", params.memberId, {
    oldRole,
    newRole: role,
  });

  return NextResponse.json(updated);
});

export const DELETE = withTeamAuth("team:members:remove", async (context, _req, params) => {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.memberId },
  });
  if (!member || member.teamId !== params.teamId) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Member not found" } },
      { status: 404 },
    );
  }

  if (member.role === "OWNER") {
    const ownerCount = await prisma.teamMember.count({
      where: { teamId: params.teamId, role: "OWNER" },
    });
    if (ownerCount <= 1) {
      return NextResponse.json(
        { error: { code: "LAST_OWNER", message: "Cannot remove the last owner" } },
        { status: 400 },
      );
    }
  }

  await prisma.teamMember.delete({ where: { id: params.memberId } });

  const removedUser = await prisma.user.findUnique({
    where: { id: member.userId },
    select: { currentTeamId: true },
  });
  if (removedUser?.currentTeamId === params.teamId) {
    await prisma.user.update({
      where: { id: member.userId },
      data: { currentTeamId: null },
    });
  }

  await logAuditEvent(params.teamId, context.userId, "MEMBER_REMOVED", "team_member", params.memberId, {
    removedUserId: member.userId,
  });

  return NextResponse.json({ success: true });
});
