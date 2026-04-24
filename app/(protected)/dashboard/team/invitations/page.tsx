import { redirect } from "next/navigation";

import { getTeamInvitations } from "@/actions/invitation";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentTeam, getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { InviteMemberButton } from "@/components/dashboard/invite-member-button";
import { TeamInvitationsList } from "@/components/dashboard/team-invitations-list";

export const metadata = constructMetadata({
  title: "Invitations – SaaS Starter",
  description: "Manage team invitations.",
});

export default async function TeamInvitationsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const teamContext = await getCurrentTeam();
  if (!teamContext) redirect("/dashboard/team/create");

  const { team, membership } = teamContext;
  const { data: invitations } = await getTeamInvitations(team.id);

  const canInvite = hasPermission(membership.role, "team:members:invite");

  return (
    <>
      <DashboardHeader
        heading="Invitations"
        text="Manage pending team invitations."
      >
        {canInvite && <InviteMemberButton teamId={team.id} />}
      </DashboardHeader>
      <TeamInvitationsList
        invitations={invitations}
        teamId={team.id}
        canManage={canInvite}
      />
    </>
  );
}
