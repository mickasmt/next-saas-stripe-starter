import { redirect } from "next/navigation";

import { getCurrentUser, getCurrentTeam } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Team – SaaS Starter",
  description: "Manage your team.",
});

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const teamData = await getCurrentTeam();

  if (!teamData) {
    return (
      <>
        <DashboardHeader
          heading="Team"
          text="You don't have a team yet. Create one to get started."
        />
      </>
    );
  }

  const { team, membership } = teamData;

  return (
    <>
      <DashboardHeader
        heading={team.name}
        text="Team overview and information."
      />
      <div className="divide-y divide-muted pb-10">
        <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Team Slug</p>
            <p className="mt-1 font-medium">{team.slug}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Your Role</p>
            <p className="mt-1 font-medium">{membership.role}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="mt-1 font-medium">
              {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
