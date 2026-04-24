"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TeamRole } from "@prisma/client";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { removeMember, updateMemberRole } from "@/actions/member";
import { hasPermission } from "@/lib/auth/permissions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Member = {
  id: string;
  role: TeamRole;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

interface TeamMembersListProps {
  members: Member[];
  teamId: string;
  currentUserId: string;
  currentUserRole: TeamRole;
}

const ROLE_VARIANT: Record<TeamRole, "default" | "secondary" | "outline"> = {
  OWNER: "default",
  ADMIN: "secondary",
  MEMBER: "outline",
};

export function TeamMembersList({
  members,
  teamId,
  currentUserId,
  currentUserRole,
}: TeamMembersListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const canManage = hasPermission(currentUserRole, "team:members:manage");
  const canRemove = hasPermission(currentUserRole, "team:members:remove");

  function handleRoleChange(memberId: string, role: "ADMIN" | "MEMBER") {
    startTransition(async () => {
      const result = await updateMemberRole(teamId, memberId, { role });
      if (result.status === "error") {
        toast.error(result.error);
      } else {
        toast.success("Role updated");
        router.refresh();
      }
    });
  }

  function handleRemove(memberId: string) {
    startTransition(async () => {
      const result = await removeMember(teamId, memberId);
      if (result.status === "error") {
        toast.error(result.error);
      } else {
        toast.success("Member removed");
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Team Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={member.user.image || ""} />
                  <AvatarFallback>
                    {member.user.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.user.name || "Unknown"}
                    {member.user.id === currentUserId && (
                      <span className="ml-1 text-muted-foreground">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={ROLE_VARIANT[member.role]}>
                  {member.role}
                </Badge>

                {(canManage || canRemove) &&
                  member.user.id !== currentUserId &&
                  member.role !== "OWNER" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={isPending}
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canManage && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(
                                  member.id,
                                  member.role === "ADMIN" ? "MEMBER" : "ADMIN",
                                )
                              }
                            >
                              {member.role === "ADMIN"
                                ? "Demote to Member"
                                : "Promote to Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {canRemove && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleRemove(member.id)}
                          >
                            Remove from team
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
