import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { apiRequireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";

export async function DELETE(
  _req: Request,
  { params }: { params: { teamId: string; inviteId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.MEMBERS_INVITE,
    params.teamId,
  );
  if (error) return error;

  await prisma.teamInvite.delete({
    where: { id: params.inviteId, teamId: params.teamId },
  });

  await logAudit({
    teamId: params.teamId,
    userId: context!.user.id!,
    action: "invite.revoked",
    targetId: params.inviteId,
  });

  return new Response(null, { status: 204 });
}
