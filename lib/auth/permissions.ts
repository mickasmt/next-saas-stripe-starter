import { TeamRole } from "@prisma/client";

import { TeamPermission } from "./types";

export const ROLE_PERMISSIONS: Record<TeamRole, TeamPermission[]> = {
  OWNER: [
    "team:read",
    "team:write",
    "team:settings:update",
    "team:members:invite",
    "team:members:manage",
    "team:members:remove",
    "team:billing:manage",
    "team:delete",
  ],
  ADMIN: [
    "team:read",
    "team:write",
    "team:settings:update",
    "team:members:invite",
    "team:members:manage",
    "team:members:remove",
  ],
  MEMBER: ["team:read", "team:write"],
  VIEWER: ["team:read"],
};

export function hasPermission(
  role: TeamRole,
  permission: TeamPermission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
