"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { InvitationStatus, TeamRole } from "@prisma/client";
import { toast } from "sonner";

import { revokeInvitation } from "@/actions/invitation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Invitation = {
  id: string;
  email: string;
  role: TeamRole;
  status: InvitationStatus;
  expiresAt: Date;
  inviter: { name: string | null; email: string | null };
};

interface TeamInvitationsListProps {
  invitations: Invitation[];
  teamId: string;
  canManage: boolean;
}

const STATUS_VARIANT: Record<
  InvitationStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  PENDING: "default",
  ACCEPTED: "secondary",
  REVOKED: "destructive",
  EXPIRED: "outline",
};

export function TeamInvitationsList({
  invitations,
  teamId,
  canManage,
}: TeamInvitationsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRevoke(invitationId: string) {
    startTransition(async () => {
      const result = await revokeInvitation(teamId, invitationId);
      if (result.status === "error") {
        toast.error(result.error);
      } else {
        toast.success("Invitation revoked");
        router.refresh();
      }
    });
  }

  if (!invitations.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No invitations yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Invitations ({invitations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-medium">{invitation.email}</p>
                <p className="text-xs text-muted-foreground">
                  Invited by {invitation.inviter.name || invitation.inviter.email}{" "}
                  as {invitation.role.toLowerCase()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[invitation.status]}>
                  {invitation.status}
                </Badge>

                {canManage && invitation.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleRevoke(invitation.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
