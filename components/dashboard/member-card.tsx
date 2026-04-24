"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TeamRole } from "@prisma/client";
import { toast } from "sonner";

import { updateMemberRole, removeMember } from "@/actions/member";
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
}

const roleBadgeVariant: Record<TeamRole, "default" | "secondary" | "outline"> = {
  OWNER: "default",
  ADMIN: "secondary",
  MEMBER: "outline",
};

export function MemberCard({
  member,
  currentUserId,
  currentUserRole,
  teamId,
}: MemberCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const canManage =
    (currentUserRole === "OWNER" || currentUserRole === "ADMIN") &&
    member.userId !== currentUserId;

  const handleRoleChange = (newRole: TeamRole) => {
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
    startTransition(async () => {
      const result = await removeMember(member.id);
      if (result.status === "success") {
        toast.success("Member removed.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to remove member.");
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
            {member.userId === currentUserId && (
              <span className="ml-2 text-xs text-muted-foreground">(you)</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">{member.user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={roleBadgeVariant[member.role]}>{member.role}</Badge>

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
      </div>
    </div>
  );
}
