import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import { RoleBadge } from "@/components/team/role-badge";

import { InviteActions } from "./invite-actions";

export const metadata = constructMetadata({
  title: "Team Invitation – SaaS Starter",
  description: "Accept or decline a team invitation.",
});

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const invite = await prisma.teamInvite.findUnique({
    where: { token: params.token },
    include: { team: { select: { name: true, slug: true, image: true } } },
  });

  if (!invite) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <Icons.warning className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="text-lg font-medium">Invitation not found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This invitation may have been revoked or doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invite.status !== "PENDING") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-lg font-medium">
              Invitation {invite.status.toLowerCase()}
            </p>
            <Link href="/dashboard" className="mt-4 text-sm text-primary underline">
              Go to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (new Date() > invite.expiresAt) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <Icons.warning className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="text-lg font-medium">Invitation expired</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please ask the team admin to send a new invitation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = await getCurrentUser();

  // Not logged in
  if (!user) {
    const callbackUrl = encodeURIComponent(`/invite/${params.token}`);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>You&apos;re invited to {invite.team.name}</CardTitle>
            <CardDescription>
              Sign in to accept this invitation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <RoleBadge role={invite.role} />
            <Link
              href={`/login?callbackUrl=${callbackUrl}`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign in to continue
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Email mismatch
  if (user.email !== invite.email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <Icons.warning className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="text-lg font-medium">Email mismatch</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This invitation was sent to <strong>{invite.email}</strong>, but
              you&apos;re signed in as <strong>{user.email}</strong>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Join {invite.team.name}</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join as a
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <RoleBadge role={invite.role} />
          <InviteActions token={params.token} />
        </CardContent>
      </Card>
    </div>
  );
}
