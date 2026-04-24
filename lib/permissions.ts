import { TeamRole } from "@prisma/client";

export const PERMISSIONS = {
  TEAM_MANAGE: "team:manage",
  MEMBERS_INVITE: "members:invite",
  MEMBERS_REMOVE: "members:remove",
  MEMBERS_ROLE_CHANGE: "members:role_change",
  BILLING_MANAGE: "billing:manage",
  CONTENT_CREATE: "content:create",
  CONTENT_EDIT: "content:edit",
  CONTENT_DELETE: "content:delete",
  CONTENT_VIEW: "content:view",
  ANALYTICS_VIEW: "analytics:view",
  SETTINGS_MANAGE: "settings:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<TeamRole, Permission[]> = {
  [TeamRole.OWNER]: Object.values(PERMISSIONS),
  [TeamRole.ADMIN]: [
    PERMISSIONS.MEMBERS_INVITE,
    PERMISSIONS.MEMBERS_REMOVE,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  [TeamRole.MEMBER]: [
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
};

export function hasPermission(role: TeamRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: TeamRole,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: TeamRole,
  permissions: Permission[],
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
