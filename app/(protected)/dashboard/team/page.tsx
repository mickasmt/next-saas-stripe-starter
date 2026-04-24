import { redirect } from "next/navigation";
import { CalendarDays, Users } from "lucide-react";

import { getCurrentTeam, getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Team – SaaS Starter",
  description: "View your team details.",
});

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const teamContext = await getCurrentTeam();
  if (!teamContext) redirect("/dashboard/team/create");

  const { team, membership } = teamContext;

  return (
    <>
      <DashboardHeader
        heading={team.name}
        text={`Team slug: ${team.slug}`}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membership.role}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(team.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
