import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { apiRequireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";
import { updateTeamSchema } from "@/lib/validations/team";

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.CONTENT_VIEW,
    params.teamId,
  );
  if (error) return error;

  const team = await prisma.team.findUnique({
    where: { id: context!.teamId },
  });

  if (!team) {
    return Response.json({ error: "Team not found" }, { status: 404 });
  }

  return Response.json(team);
}

export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.TEAM_MANAGE,
    params.teamId,
  );
  if (error) return error;

  const body = await req.json();
  const parsed = updateTeamSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (parsed.data.slug) {
    const existing = await prisma.team.findFirst({
      where: { slug: parsed.data.slug, id: { not: params.teamId } },
    });
    if (existing) {
      return Response.json({ error: "Slug already taken" }, { status: 409 });
    }
  }

  const team = await prisma.team.update({
    where: { id: params.teamId },
    data: parsed.data,
  });

  await logAudit({
    teamId: params.teamId,
    userId: context!.user.id!,
    action: "team.updated",
    metadata: parsed.data,
  });

  return Response.json(team);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { teamId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.TEAM_MANAGE,
    params.teamId,
  );
  if (error) return error;

  await logAudit({
    teamId: params.teamId,
    userId: context!.user.id!,
    action: "team.deleted",
  });

  await prisma.team.delete({ where: { id: params.teamId } });

  return new Response(null, { status: 204 });
}
