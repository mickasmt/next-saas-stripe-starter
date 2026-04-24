import { TeamRole } from "@prisma/client";

import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { getUserTeams } from "@/lib/team";
import { createTeamSchema } from "@/lib/validations/team";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await getUserTeams(session.user.id);
  const teams = memberships.map((m) => ({
    ...m.team,
    role: m.role,
  }));

  return Response.json(teams);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createTeamSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, slug } = parsed.data;

  const existing = await prisma.team.findUnique({ where: { slug } });
  if (existing) {
    return Response.json({ error: "Slug already taken" }, { status: 409 });
  }

  const userId = session.user.id;

  const team = await prisma.$transaction(async (tx) => {
    const team = await tx.team.create({ data: { name, slug, ownerId: userId } });
    await tx.teamMember.create({
      data: { teamId: team.id, userId, role: TeamRole.OWNER },
    });
    return team;
  });

  await logAudit({
    teamId: team.id,
    userId,
    action: "team.created",
    targetType: "team",
    targetId: team.id,
    metadata: { name, slug },
  });

  return Response.json(team, { status: 201 });
}
