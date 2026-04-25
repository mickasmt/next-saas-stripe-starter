import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCurrentUser, getCurrentTeam } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { InvitationCard } from "@/components/dashboard/invitation-card";
import { InviteMemberButton } from "@/components/forms/invite-member-form";

export const metadata = constructMetadata({
  title: "Invitations – SaaS Starter",
  description: "Manage team invitations.",
});

export default async function InvitationsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const teamData = await getCurrentTeam();
  if (!teamData) redirect("/dashboard/team");

  const invitations = await prisma.invitation.findMany({
    where: { teamId: teamData.team.id },
    include: {
      inviter: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const currentUserRole = teamData.membership.role;
  const canInvite = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  return (
    <>
      <DashboardHeader
        heading="Invitations"
        text="Manage pending invitations to your team."
      >
        {canInvite && (
          <InviteMemberButton teamId={teamData.team.id} />
        )}
      </DashboardHeader>
      <div className="divide-y divide-muted">
        {invitations.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No invitations yet.
          </p>
        ) : (
          invitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={{
                id: invitation.id,
                email: invitation.email,
                role: invitation.role,
                status: invitation.status,
                token: invitation.token,
                expiresAt: invitation.expiresAt,
                createdAt: invitation.createdAt,
                inviter: invitation.inviter,
              }}
              canManage={canInvite}
            />
          ))
        )}
      </div>
    </>
  );
}
