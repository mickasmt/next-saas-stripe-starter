import { TeamRole } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const roleConfig: Record<TeamRole, { label: string; className: string }> = {
  [TeamRole.OWNER]: {
    label: "Owner",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  [TeamRole.ADMIN]: {
    label: "Admin",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  [TeamRole.MEMBER]: {
    label: "Member",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
};

export function RoleBadge({ role }: { role: TeamRole }) {
  const config = roleConfig[role];
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
