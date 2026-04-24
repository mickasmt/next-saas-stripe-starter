import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withTeamAuth } from "@/lib/auth/wrappers";

export const GET = withTeamAuth("team:read", async (_context, _req, params) => {
  const members = await prisma.teamMember.findMany({
    where: { teamId: params.teamId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(members);
});
