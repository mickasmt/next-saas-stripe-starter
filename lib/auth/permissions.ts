import { TeamRole } from "@prisma/client";

import type { TeamPermission } from "./types";

const OWNER_PERMISSIONS: TeamPermission[] = [
  "team:read",
  "team:write",
  "team:settings:update",
  "team:members:invite",
  "team:members:manage",
  "team:members:remove",
  "team:billing:manage",
  "team:delete",
];

const ADMIN_PERMISSIONS: TeamPermission[] = [
  "team:read",
  "team:write",
  "team:settings:update",
  "team:members:invite",
  "team:members:manage",
  "team:members:remove",
];

const MEMBER_PERMISSIONS: TeamPermission[] = [
  "team:read",
  "team:write",
];

const ROLE_PERMISSIONS: Record<TeamRole, TeamPermission[]> = {
  OWNER: OWNER_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  MEMBER: MEMBER_PERMISSIONS,
};

export function hasPermission(role: TeamRole, permission: TeamPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
