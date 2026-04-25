"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TeamRole } from "@prisma/client";
import { toast } from "sonner";

import { updateMemberRole, removeMember, leaveTeam } from "@/actions/member";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Icons } from "@/components/shared/icons";

interface MemberCardProps {
  member: {
    id: string;
    userId: string;
    role: TeamRole;
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    };
  };
  currentUserId: string;
  currentUserRole: TeamRole;
  teamId: string;
  ownerCount: number;
}

const roleBadgeVariant: Record<TeamRole, "default" | "secondary" | "outline"> = {
  OWNER: "default",
  ADMIN: "secondary",
  MEMBER: "outline",
};

const roleDescriptions: Record<TeamRole, string> = {
  OWNER: "Full control including billing and team deletion",
  ADMIN: "Manage members, invitations, and team settings",
  MEMBER: "Read and write access to team resources",
};

export function MemberCard({
  member,
  currentUserId,
  currentUserRole,
  teamId,
  ownerCount,
}: MemberCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isCurrentUser = member.userId === currentUserId;
  const canManage =
    (currentUserRole === "OWNER" || currentUserRole === "ADMIN") &&
    !isCurrentUser;
  const isLastOwner = member.role === "OWNER" && ownerCount <= 1;

  // Show leave button: for current user, unless they're the last owner
  const canLeave = isCurrentUser && !isLastOwner;

  const handleRoleChange = (newRole: TeamRole) => {
    // Confirmation for promoting to Owner (destructive-level power)
    if (newRole === "OWNER") {
      const name = member.user.name || member.user.email || "this member";
      if (!confirm(`Are you sure you want to make ${name} an Owner? Owners have full control over the team, including the ability to delete it and manage billing.`)) {
        return;
      }
    }
    startTransition(async () => {
      const result = await updateMemberRole(member.id, { role: newRole });
      if (result.status === "success") {
        toast.success("Role updated.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update role.");
      }
    });
  };

  const handleRemove = () => {
    const name = member.user.name || member.user.email || "this member";
    if (!confirm(`Are you sure you want to remove ${name} from the team? They will lose access to all team resources.`)) {
      return;
    }
    startTransition(async () => {
      const result = await removeMember(member.id);
      if (result.status === "success") {
        toast.success("Member removed. Their personal workspace is unaffected.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to remove member.");
      }
    });
  };

  const handleLeave = () => {
    if (!confirm("Are you sure you want to leave this team? You will lose access to all team resources. Your personal workspace is unaffected.")) {
      return;
    }
    startTransition(async () => {
      const result = await leaveTeam(teamId);
      if (result.status === "success") {
        toast.success("You have left the team. Your personal workspace is unaffected.");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to leave team.");
      }
    });
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <UserAvatar
          user={{ name: member.user.name, image: member.user.image }}
        />
        <div>
          <p className="text-sm font-medium">
            {member.user.name || "Unnamed"}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-muted-foreground">(you)</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">{member.user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <Badge variant={roleBadgeVariant[member.role]}>{member.role}</Badge>
          <span className="mt-0.5 text-[11px] text-muted-foreground">
            {roleDescriptions[member.role]}
          </span>
        </div>

        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isPending}>
                <Icons.ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {member.role !== "OWNER" && currentUserRole === "OWNER" && (
                <DropdownMenuItem onClick={() => handleRoleChange("OWNER")}>
                  Make Owner
                </DropdownMenuItem>
              )}
              {member.role !== "ADMIN" && (
                <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")}>
                  Make Admin
                </DropdownMenuItem>
              )}
              {member.role !== "MEMBER" && (
                <DropdownMenuItem onClick={() => handleRoleChange("MEMBER")}>
                  Make Member
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleRemove}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {canLeave && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLeave}
            disabled={isPending}
          >
            Leave
          </Button>
        )}
      </div>
    </div>
  );
}
