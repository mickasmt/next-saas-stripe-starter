import { redirect } from "next/navigation";

import { getCurrentUser, getCurrentTeam } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { TeamNameForm } from "@/components/forms/team-name-form";
import { DeleteTeamSection } from "@/components/dashboard/delete-team-section";

export const metadata = constructMetadata({
  title: "Team Settings – SaaS Starter",
  description: "Configure your team settings.",
});

export default async function TeamSettingsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const teamData = await getCurrentTeam();
  if (!teamData) redirect("/dashboard/team");

  const { team, membership } = teamData;
  const isOwner = membership.role === "OWNER";

  return (
    <>
      <DashboardHeader
        heading="Team Settings"
        text="Manage your team settings."
      />
      <div className="divide-y divide-muted pb-10">
        <TeamNameForm team={{ id: team.id, name: team.name }} />
        {isOwner && <DeleteTeamSection teamId={team.id} />}
      </div>
    </>
  );
}
