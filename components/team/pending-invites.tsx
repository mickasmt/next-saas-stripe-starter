"use client";

import { useState } from "react";
import { TeamRole } from "@prisma/client";
import { toast } from "sonner";

import { revokeInvite } from "@/actions/manage-invites";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RoleBadge } from "./role-badge";

type Invite = {
  id: string;
  email: string;
  role: TeamRole;
  expiresAt: Date;
  createdAt: Date;
};

interface PendingInvitesProps {
  invites: Invite[];
  teamId: string;
  canManageInvites: boolean;
}

export function PendingInvites({
  invites,
  teamId,
  canManageInvites,
}: PendingInvitesProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRevoke(inviteId: string) {
    setLoading(inviteId);
    const result = await revokeInvite(teamId, inviteId);
    if (result.status === "error") {
      toast.error(result.message);
    } else {
      toast.success("Invite revoked");
    }
    setLoading(null);
  }

  if (invites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No pending invitations.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Expires</TableHead>
          {canManageInvites && <TableHead className="w-[100px]" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {invites.map((invite) => (
          <TableRow key={invite.id}>
            <TableCell className="text-sm">{invite.email}</TableCell>
            <TableCell>
              <RoleBadge role={invite.role} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(invite.expiresAt)}
            </TableCell>
            {canManageInvites && (
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  disabled={loading === invite.id}
                  onClick={() => handleRevoke(invite.id)}
                >
                  Revoke
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
