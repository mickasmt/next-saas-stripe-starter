"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { InvitationStatus, TeamRole } from "@prisma/client";
import { toast } from "sonner";

import { revokeInvitation } from "@/actions/invitation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface InvitationCardProps {
  invitation: {
    id: string;
    email: string;
    role: TeamRole;
    status: InvitationStatus;
    expiresAt: Date;
    createdAt: Date;
    inviter: { name: string | null; email: string | null };
  };
  canManage: boolean;
}

const statusBadge: Record<InvitationStatus, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  ACCEPTED: "default",
  REVOKED: "destructive",
  EXPIRED: "outline",
};

export function InvitationCard({ invitation, canManage }: InvitationCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isExpired = invitation.status === "PENDING" && new Date(invitation.expiresAt) < new Date();
  const displayStatus = isExpired ? "EXPIRED" : invitation.status;

  const handleRevoke = () => {
    startTransition(async () => {
      const result = await revokeInvitation(invitation.id);
      if (result.status === "success") {
        toast.success("Invitation revoked.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to revoke invitation.");
      }
    });
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{invitation.email}</p>
          <Badge variant={statusBadge[displayStatus]}>{displayStatus}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Role: {invitation.role} &middot; Invited by{" "}
          {invitation.inviter.name || invitation.inviter.email} &middot;{" "}
          {new Date(invitation.createdAt).toLocaleDateString()}
        </p>
      </div>

      {canManage && invitation.status === "PENDING" && !isExpired && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRevoke}
          disabled={isPending}
        >
          {isPending ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : null}
          Revoke
        </Button>
      )}
    </div>
  );
}
