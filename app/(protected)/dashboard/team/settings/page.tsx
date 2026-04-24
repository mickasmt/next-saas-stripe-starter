import { redirect } from "next/navigation";

import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentTeam, getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { TeamDangerZone } from "@/components/dashboard/team-danger-zone";
import { TeamSettingsForm } from "@/components/forms/team-settings-form";

export const metadata = constructMetadata({
  title: "Team Settings – SaaS Starter",
  description: "Configure your team settings.",
});

export default async function TeamSettingsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const teamContext = await getCurrentTeam();
  if (!teamContext) redirect("/dashboard/team/create");

  const { team, membership } = teamContext;

  const canEdit = hasPermission(membership.role, "team:settings:update");
  if (!canEdit) redirect("/dashboard/team");

  const isOwner = membership.role === "OWNER";

  return (
    <>
      <DashboardHeader
        heading="Team Settings"
        text="Manage your team configuration."
      />
      <div className="divide-y divide-muted pb-10">
        <TeamSettingsForm team={team} />
        <TeamDangerZone teamId={team.id} isOwner={isOwner} />
      </div>
    </>
  );
}
