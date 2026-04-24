import { redirect } from "next/navigation";

import { getTeamMembers } from "@/actions/member";
import { getCurrentTeam, getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { TeamMembersList } from "@/components/dashboard/team-members-list";

export const metadata = constructMetadata({
  title: "Team Members – SaaS Starter",
  description: "Manage your team members.",
});

export default async function TeamMembersPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const teamContext = await getCurrentTeam();
  if (!teamContext) redirect("/dashboard/team/create");

  const { team, membership } = teamContext;
  const { data: members } = await getTeamMembers(team.id);

  return (
    <>
      <DashboardHeader
        heading="Members"
        text="Manage your team members and their roles."
      />
      <TeamMembersList
        members={members}
        teamId={team.id}
        currentUserId={user.id}
        currentUserRole={membership.role}
      />
    </>
  );
}
