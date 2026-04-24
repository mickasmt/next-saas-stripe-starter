import { redirect } from "next/navigation";
import { TeamRole } from "@prisma/client";

import { getActiveTeamId } from "@/lib/active-team";
import { prisma } from "@/lib/db";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/session";
import { getTeamInvites, getTeamMembers } from "@/lib/team";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import { MemberList } from "@/components/team/member-list";
import { PendingInvites } from "@/components/team/pending-invites";
import { CreateTeamButton } from "./create-team-button";
import { TeamDangerZone } from "./team-danger-zone";
import { TeamInfoForm } from "./team-info-form";

export const metadata = constructMetadata({
  title: "Team Settings – SaaS Starter",
  description: "Manage your team settings and members.",
});

export default async function TeamSettingsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const activeTeamId = await getActiveTeamId();
  if (!activeTeamId) {
    return (
      <>
        <DashboardHeader
          heading="Team Settings"
          text="Create or join a team to manage settings."
        />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Icons.users className="size-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium">No team yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a team to start collaborating with others.
              </p>
            </div>
            <CreateTeamButton />
          </CardContent>
        </Card>
      </>
    );
  }

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: activeTeamId, userId: user.id } },
  });

  if (!membership) redirect("/dashboard");

  const team = await prisma.team.findUnique({
    where: { id: activeTeamId },
  });

  if (!team) redirect("/dashboard");

  const [members, invites] = await Promise.all([
    getTeamMembers(activeTeamId),
    getTeamInvites(activeTeamId),
  ]);

  const role = membership.role;
  const canManageTeam = hasPermission(role, PERMISSIONS.TEAM_MANAGE);
  const canInvite = hasPermission(role, PERMISSIONS.MEMBERS_INVITE);
  const canRemove = hasPermission(role, PERMISSIONS.MEMBERS_REMOVE);
  const canChangeRoles = hasPermission(role, PERMISSIONS.MEMBERS_ROLE_CHANGE);

  return (
    <>
      <DashboardHeader
        heading="Team Settings"
        text={`Manage settings for ${team.name}.`}
      />
      <div className="space-y-6 pb-10">
        {canManageTeam && (
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>
                Update your team name and slug.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamInfoForm
                teamId={team.id}
                defaultValues={{ name: team.name, slug: team.slug }}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {members.length} member{members.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            {canInvite && <InviteMemberDialog teamId={activeTeamId} />}
          </CardHeader>
          <CardContent>
            <MemberList
              members={members}
              teamId={activeTeamId}
              currentUserId={user.id}
              canManageMembers={canRemove}
              canChangeRoles={canChangeRoles}
            />
          </CardContent>
        </Card>

        {canInvite && invites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                {invites.length} pending invite{invites.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PendingInvites
                invites={invites}
                teamId={activeTeamId}
                canManageInvites={canInvite}
              />
            </CardContent>
          </Card>
        )}

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Leave or delete this team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamDangerZone
              teamId={activeTeamId}
              teamName={team.name}
              isOwner={role === TeamRole.OWNER}
              canDelete={canManageTeam}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
