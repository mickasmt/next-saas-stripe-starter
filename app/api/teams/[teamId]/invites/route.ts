import { apiRequireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";
import { getTeamInvites } from "@/lib/team";

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.MEMBERS_INVITE,
    params.teamId,
  );

  if (error) return error;

  const invites = await getTeamInvites(context!.teamId);
  return Response.json(invites);
}
