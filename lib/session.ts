import "server-only";

import { cache } from "react";

import { auth } from "@/auth";
import { hasPermission, type Permission } from "@/lib/permissions";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});

export async function currentUserCan(permission: Permission): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user?.activeTeamRole) return false;
  return hasPermission(user.activeTeamRole, permission);
}
