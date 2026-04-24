import { apiRequireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";
import { getTeamMembers } from "@/lib/team";

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.CONTENT_VIEW,
    params.teamId,
  );

  if (error) return error;

  const members = await getTeamMembers(context!.teamId);
  return Response.json(members);
}
