import "server-only";

import { prisma } from "@/lib/db";

export async function getTeamMembership(userId: string, teamId: string) {
  return prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
    include: { team: { select: { slug: true, name: true } } },
  });
}

export async function getUserTeams(userId: string) {
  return prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTeamMembers(teamId: string) {
  return prisma.teamMember.findMany({
    where: { teamId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTeamInvites(teamId: string) {
  return prisma.teamInvite.findMany({
    where: { teamId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPendingInvitesForUser(email: string) {
  return prisma.teamInvite.findMany({
    where: { email, status: "PENDING" },
    include: {
      team: { select: { id: true, name: true, slug: true } },
    },
  });
}
