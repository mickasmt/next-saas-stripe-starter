import "server-only";

import { auth } from "@/auth";
import { hasPermission, type Permission } from "@/lib/permissions";

export async function requireTeamPermission(
  permission: Permission,
  teamId?: string,
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.activeTeamId || !session.user.activeTeamRole) {
    throw new Error("No active team");
  }

  // If a teamId is provided, verify it matches the active team
  if (teamId && teamId !== session.user.activeTeamId) {
    throw new Error("Team mismatch — you can only manage your active team");
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

export async function apiRequireTeamPermission(
  permission: Permission,
  teamId?: string,
) {
  const session = await auth();

  if (!session?.user) {
    return {
      error: Response.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
      context: null,
    };
  }

  if (!session.user.activeTeamId || !session.user.activeTeamRole) {
    return {
      error: Response.json(
        { error: "No active team" },
        { status: 400 },
      ),
      context: null,
    };
  }

  if (teamId && teamId !== session.user.activeTeamId) {
    return {
      error: Response.json(
        { error: "Team mismatch" },
        { status: 403 },
      ),
      context: null,
    };
  }

  if (!hasPermission(session.user.activeTeamRole, permission)) {
    return {
      error: Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      ),
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
