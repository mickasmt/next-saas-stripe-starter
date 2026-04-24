import "server-only";

import { auth } from "@/auth";
import { hasPermission, type Permission } from "@/lib/permissions";

export async function requireTeamPermission(permission: Permission) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.activeTeamId || !session.user.activeTeamRole) {
    throw new Error("No active team");
  }

  if (!hasPermission(session.user.activeTeamRole, permission)) {
    throw new Error("Insufficient permissions");
  }

  return {
    user: session.user,
    teamId: session.user.activeTeamId,
    teamRole: session.user.activeTeamRole,
  };
}

export async function apiRequireTeamPermission(permission: Permission) {
  const session = await auth();

  if (!session?.user) {
    return {
      error: new Response("Unauthorized", { status: 401 }),
      context: null,
    };
  }

  if (!session.user.activeTeamId || !session.user.activeTeamRole) {
    return {
      error: new Response("No active team", { status: 400 }),
      context: null,
    };
  }

  if (!hasPermission(session.user.activeTeamRole, permission)) {
    return {
      error: new Response("Insufficient permissions", { status: 403 }),
      context: null,
    };
  }

  return {
    error: null,
    context: {
      user: session.user,
      teamId: session.user.activeTeamId,
      teamRole: session.user.activeTeamRole,
    },
  };
}
