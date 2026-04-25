import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { AcceptInvitationButton } from "@/components/dashboard/accept-invitation-button";

export const metadata = constructMetadata({
  title: "Accept Invitation – SaaS Starter",
  description: "Accept a team invitation.",
});

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      team: { select: { name: true, slug: true } },
      inviter: { select: { name: true, email: true } },
    },
  });

  if (!invitation) {
    return (
      <>
        <DashboardHeader
          heading="Invitation Not Found"
          text="This invitation link is invalid."
        />
      </>
    );
  }

  const isExpired = invitation.expiresAt < new Date();

  if (invitation.status !== "PENDING") {
    return (
      <>
        <DashboardHeader
          heading="Invitation Unavailable"
          text={`This invitation has already been ${invitation.status.toLowerCase()}.`}
        />
      </>
    );
  }

  if (isExpired) {
    return (
      <>
        <DashboardHeader
          heading="Invitation Expired"
          text="This invitation has expired. Please ask the team admin to send a new one."
        />
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        heading="Team Invitation"
        text={`You've been invited to join a team.`}
      />
      <div className="rounded-lg border p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Team</p>
            <p className="text-lg font-medium">{invitation.team.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">{invitation.role}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Invited by</p>
            <p className="font-medium">
              {invitation.inviter.name || invitation.inviter.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expires</p>
            <p className="font-medium">
              {new Date(invitation.expiresAt).toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            By accepting, you&apos;ll be added to this team and can switch to it
            from your dashboard. Your personal workspace is unaffected.
          </p>
          <AcceptInvitationButton token={token} />
        </div>
      </div>
    </>
  );
}
