import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withUserAuth } from "@/lib/auth/wrappers";
import { createTeamSchema } from "@/lib/validations/team";
import { setCurrentTeam } from "@/lib/session";
import { logAuditEvent } from "@/lib/audit";

export const GET = withUserAuth(async (context) => {
  const teams = await prisma.teamMember.findMany({
    where: { userId: context.userId },
    include: { team: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(teams.map((m) => ({
    id: m.team.id,
    name: m.team.name,
    slug: m.team.slug,
    role: m.role,
    createdAt: m.team.createdAt,
  })));
});

export const POST = withUserAuth(async (context, req) => {
  const body = await req.json();
  const parsed = createTeamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
      { status: 400 },
    );
  }

  const existing = await prisma.team.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: { code: "CONFLICT", message: "A team with this slug already exists" } },
      { status: 409 },
    );
  }

  const team = await prisma.$transaction(async (tx) => {
    const team = await tx.team.create({
      data: { name: parsed.data.name, slug: parsed.data.slug },
    });
    await tx.teamMember.create({
      data: { teamId: team.id, userId: context.userId, role: "OWNER" },
    });
    await tx.user.update({
      where: { id: context.userId },
      data: { currentTeamId: team.id },
    });
    return team;
  });

  await setCurrentTeam(team.id);
  await logAuditEvent(team.id, context.userId, "TEAM_CREATED", "team", team.id, {
    name: team.name,
    slug: team.slug,
  });

  return NextResponse.json(team, { status: 201 });
});
