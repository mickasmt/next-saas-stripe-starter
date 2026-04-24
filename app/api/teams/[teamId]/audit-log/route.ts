import { prisma } from "@/lib/db";
import { apiRequireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.TEAM_MANAGE,
    params.teamId,
  );
  if (error) return error;

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const cursor = url.searchParams.get("cursor") || undefined;

  const logs = await prisma.auditLog.findMany({
    where: { teamId: context!.teamId },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = logs.length > limit;
  const items = hasMore ? logs.slice(0, limit) : logs;

  return Response.json({
    items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
}
