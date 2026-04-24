import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});

export const getCurrentTeam = cache(async () => {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const currentTeamId = user.currentTeamId;

  if (!currentTeamId) {
    // Try to auto-select the first team the user belongs to
    const firstMembership = await prisma.teamMember.findFirst({
      where: { userId: user.id },
      include: { team: true },
      orderBy: { createdAt: "asc" },
    });

    if (firstMembership) {
      await prisma.user.update({
        where: { id: user.id },
        data: { currentTeamId: firstMembership.teamId },
      });
      return {
        team: firstMembership.team,
        membership: firstMembership,
      };
    }

    return null;
  }

  // Validate that the user is still a member of the current team
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId: currentTeamId, userId: user.id },
    },
    include: { team: true },
  });

  if (!membership) {
    // Context repair: current team is stale, find another or clear
    const fallback = await prisma.teamMember.findFirst({
      where: { userId: user.id },
      include: { team: true },
      orderBy: { createdAt: "asc" },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { currentTeamId: fallback?.teamId ?? null },
    });

    if (fallback) {
      return { team: fallback.team, membership: fallback };
    }

    return null;
  }

  return { team: membership.team, membership };
});