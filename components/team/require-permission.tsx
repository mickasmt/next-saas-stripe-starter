"use client";

import { useSession } from "next-auth/react";
import { TeamRole } from "@prisma/client";

import { hasPermission, type Permission } from "@/lib/permissions";

interface RequirePermissionProps {
  action: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client component that reads the current user's team role from session
 * and conditionally renders children based on whether they have the permission.
 *
 * Usage: <RequirePermission action="members:invite">...</RequirePermission>
 */
export function RequirePermission({
  action,
  children,
  fallback = null,
}: RequirePermissionProps) {
  const { data: session } = useSession();
  const role = session?.user?.activeTeamRole as TeamRole | undefined;

  if (!role || !hasPermission(role, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
