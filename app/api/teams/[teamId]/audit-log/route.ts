import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withTeamAuth } from "@/lib/auth/wrappers";

export const GET = withTeamAuth("team:read", async (_context, req, params) => {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { teamId: params.teamId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({
      where: { teamId: params.teamId },
    }),
  ]);

  return NextResponse.json({
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
