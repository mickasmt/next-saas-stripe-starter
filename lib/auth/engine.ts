import { prisma } from "@/lib/db";

import { hasPermission } from "./permissions";
import { AuthResult, TeamPermission } from "./types";

export async function authorize(
  userId: string,
  teamId: string,
  permission: TeamPermission,
): Promise<AuthResult> {
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId, userId },
    },
  });

  if (!membership) {
    return { allowed: false, reason: "Not a member of this team" };
  }

  if (!hasPermission(membership.role, permission)) {
    return {
      allowed: false,
      reason: `Role ${membership.role} does not have permission ${permission}`,
    };
  }

  return { allowed: true };
}

export async function getTeamMembership(userId: string, teamId: string) {
  return prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId, userId },
    },
  });
}
