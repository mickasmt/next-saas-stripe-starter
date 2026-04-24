import { TeamRole } from "@prisma/client";

import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { apiRequireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";
import { updateMemberRoleSchema } from "@/lib/validations/team";

export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string; memberId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.MEMBERS_ROLE_CHANGE,
    params.teamId,
  );
  if (error) return error;

  const body = await req.json();
  const parsed = updateMemberRoleSchema.safeParse({
    memberId: params.memberId,
    ...body,
  });
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const member = await prisma.teamMember.findUnique({
    where: { id: params.memberId, teamId: params.teamId },
  });

  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  if (member.role === TeamRole.OWNER) {
    const ownerCount = await prisma.teamMember.count({
      where: { teamId: params.teamId, role: TeamRole.OWNER },
    });
    if (ownerCount <= 1) {
      return Response.json(
        { error: "Cannot demote the last owner" },
        { status: 400 },
      );
    }
  }

  const updated = await prisma.teamMember.update({
    where: { id: params.memberId },
    data: { role: parsed.data.role },
  });

  await logAudit({
    teamId: params.teamId,
    userId: context!.user.id!,
    action: "member.role_changed",
    targetId: member.userId,
    metadata: { fromRole: member.role, toRole: parsed.data.role },
  });

  return Response.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { teamId: string; memberId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.MEMBERS_REMOVE,
    params.teamId,
  );
  if (error) return error;

  const member = await prisma.teamMember.findUnique({
    where: { id: params.memberId, teamId: params.teamId },
  });

  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  if (member.role === TeamRole.OWNER) {
    const ownerCount = await prisma.teamMember.count({
      where: { teamId: params.teamId, role: TeamRole.OWNER },
    });
    if (ownerCount <= 1) {
      return Response.json(
        { error: "Cannot remove the last owner" },
        { status: 400 },
      );
    }
  }

  await prisma.teamMember.delete({ where: { id: params.memberId } });

  await logAudit({
    teamId: params.teamId,
    userId: context!.user.id!,
    action: "member.removed",
    targetId: member.userId,
  });

  return new Response(null, { status: 204 });
}
