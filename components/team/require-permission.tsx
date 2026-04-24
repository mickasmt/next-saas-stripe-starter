import { TeamRole } from "@prisma/client";

import { hasPermission, type Permission } from "@/lib/permissions";

interface RequirePermissionProps {
  role: TeamRole | undefined;
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequirePermission({
  role,
  permission,
  children,
  fallback = null,
}: RequirePermissionProps) {
  if (!role || !hasPermission(role, permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
