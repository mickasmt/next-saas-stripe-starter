import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import { AcceptInvitationButton } from "./accept-button";

export const metadata: Metadata = {
  title: "Team Invitation",
  description: "Accept your team invitation",
};

interface InvitationPageProps {
  params: { token: string };
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { token } = params;
  const user = await getCurrentUser();

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      team: { select: { name: true } },
      inviter: { select: { name: true, email: true } },
    },
  });

  if (!invitation) {
    return (
      <InvitationLayout>
        <Icons.warning className="mx-auto size-8 text-destructive" />
        <h1 className="text-2xl font-semibold">Invalid Invitation</h1>
        <p className="text-sm text-muted-foreground">
          This invitation link is invalid or has been removed.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go Home
        </Link>
      </InvitationLayout>
    );
  }

  if (invitation.status === "REVOKED") {
    return (
      <InvitationLayout>
        <Icons.warning className="mx-auto size-8 text-destructive" />
        <h1 className="text-2xl font-semibold">Invitation Revoked</h1>
        <p className="text-sm text-muted-foreground">
          This invitation has been revoked by the team admin.
        </p>
      </InvitationLayout>
    );
  }

  if (invitation.status === "ACCEPTED") {
    return (
      <InvitationLayout>
        <Icons.check className="mx-auto size-8 text-green-500" />
        <h1 className="text-2xl font-semibold">Already Accepted</h1>
        <p className="text-sm text-muted-foreground">
          This invitation has already been accepted.
        </p>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Go to Dashboard
        </Link>
      </InvitationLayout>
    );
  }

  if (invitation.expiresAt < new Date()) {
    return (
      <InvitationLayout>
        <Icons.warning className="mx-auto size-8 text-yellow-500" />
        <h1 className="text-2xl font-semibold">Invitation Expired</h1>
        <p className="text-sm text-muted-foreground">
          This invitation has expired. Please ask the team admin to send a new
          one.
        </p>
      </InvitationLayout>
    );
  }

  // Not authenticated — redirect to login with callback
  if (!user) {
    redirect(`/login?callbackUrl=/invitation/${token}`);
  }

  return (
    <InvitationLayout>
      <Icons.logo className="mx-auto size-8" />
      <h1 className="text-2xl font-semibold">Team Invitation</h1>
      <p className="text-sm text-muted-foreground">
        <strong>
          {invitation.inviter.name || invitation.inviter.email}
        </strong>{" "}
        has invited you to join{" "}
        <strong>{invitation.team.name}</strong> as a{" "}
        <strong>{invitation.role.toLowerCase()}</strong>.
      </p>
      <AcceptInvitationButton token={token} />
    </InvitationLayout>
  );
}

function InvitationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-4 sm:w-[400px]">
        {children}
      </div>
    </div>
  );
}
