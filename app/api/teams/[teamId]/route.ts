import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withTeamAuth } from "@/lib/auth/wrappers";
import { updateTeamSchema } from "@/lib/validations/team";
import { logAuditEvent } from "@/lib/audit";

export const GET = withTeamAuth("team:read", async (context, _req, params) => {
  const team = await prisma.team.findUnique({
    where: { id: params.teamId },
    include: { _count: { select: { members: true } } },
  });

  if (!team) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Team not found" } },
      { status: 404 },
    );
  }

  return NextResponse.json(team);
});

export const PATCH = withTeamAuth("team:settings:update", async (context, req, params) => {
  const body = await req.json();
  const parsed = updateTeamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
      { status: 400 },
    );
  }

  const team = await prisma.team.update({
    where: { id: params.teamId },
    data: { name: parsed.data.name },
  });

  await logAuditEvent(params.teamId, context.userId, "TEAM_UPDATED", "team", params.teamId, {
    name: parsed.data.name,
  });

  return NextResponse.json(team);
});

export const DELETE = withTeamAuth("team:delete", async (context, _req, params) => {
  if (context.team?.role !== "OWNER") {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Only owners can delete a team" } },
      { status: 403 },
    );
  }

  const members = await prisma.teamMember.findMany({
    where: { teamId: params.teamId },
    select: { userId: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.user.updateMany({
      where: {
        id: { in: members.map((m) => m.userId) },
        currentTeamId: params.teamId,
      },
      data: { currentTeamId: null },
    });
    await tx.team.delete({ where: { id: params.teamId } });
  });

  await logAuditEvent(params.teamId, context.userId, "TEAM_DELETED", "team", params.teamId);

  return NextResponse.json({ success: true });
});
