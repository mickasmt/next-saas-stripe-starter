import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withUserAuth } from "@/lib/auth/wrappers";
import { getCurrentTeam, setCurrentTeam } from "@/lib/session";

export const GET = withUserAuth(async () => {
  const teamData = await getCurrentTeam();
  if (!teamData) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    id: teamData.team.id,
    name: teamData.team.name,
    slug: teamData.team.slug,
    role: teamData.membership.role,
  });
});

export const PUT = withUserAuth(async (context, req) => {
  const { teamId } = await req.json();

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: context.userId } },
  });
  if (!membership) {
    return NextResponse.json(
      { error: { code: "NOT_MEMBER", message: "Not a member of this team" } },
      { status: 403 },
    );
  }

  await setCurrentTeam(teamId);
  return NextResponse.json({ success: true });
});
