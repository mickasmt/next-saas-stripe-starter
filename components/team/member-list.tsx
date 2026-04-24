"use client";

import { useState } from "react";
import { TeamRole } from "@prisma/client";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { changeMemberRole, removeMember } from "@/actions/manage-members";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RoleBadge } from "./role-badge";

type Member = {
  id: string;
  role: TeamRole;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

interface MemberListProps {
  members: Member[];
  teamId: string;
  currentUserId: string;
  canManageMembers: boolean;
  canChangeRoles: boolean;
}

export function MemberList({
  members,
  teamId,
  currentUserId,
  canManageMembers,
  canChangeRoles,
}: MemberListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const ownerCount = members.filter((m) => m.role === TeamRole.OWNER).length;

  async function handleRemove(memberId: string) {
    setLoading(memberId);
    const result = await removeMember(teamId, memberId);
    if (result.status === "error") {
      toast.error(result.message);
    } else {
      toast.success("Member removed");
    }
    setLoading(null);
  }

  async function handleRoleChange(memberId: string, role: TeamRole) {
    setLoading(memberId);
    const result = await changeMemberRole(teamId, { memberId, role });
    if (result.status === "error") {
      toast.error(result.message);
    } else {
      toast.success("Role updated");
    }
    setLoading(null);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          {(canManageMembers || canChangeRoles) && (
            <TableHead className="w-[50px]" />
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const isLastOwner =
            member.role === TeamRole.OWNER && ownerCount <= 1;
          const isSelf = member.user.id === currentUserId;

          return (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.user.name || "Unknown"}
                      {isSelf && (
                        <span className="ml-1 text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={member.role} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(member.createdAt)}
              </TableCell>
              {(canManageMembers || canChangeRoles) && (
                <TableCell>
                  {!isSelf && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={loading === member.id}
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canChangeRoles && !isLastOwner && (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Change Role
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {[TeamRole.ADMIN, TeamRole.MEMBER, TeamRole.VIEWER].map((role) => (
                                <DropdownMenuItem
                                  key={role}
                                  disabled={member.role === role}
                                  onClick={() =>
                                    handleRoleChange(member.id, role)
                                  }
                                >
                                  {role.charAt(0) + role.slice(1).toLowerCase()}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        )}
                        {canManageMembers && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              disabled={isLastOwner}
                              onClick={() => handleRemove(member.id)}
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
