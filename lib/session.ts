import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import type { AuthContext } from "@/lib/auth/types";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});

function signCookie(value: string): string {
  const crypto = require("crypto") as typeof import("crypto");
  const secret = process.env.AUTH_SECRET || "";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("base64url");
  return `${value}.${signature}`;
}

function verifyCookie(signed: string): string | null {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  if (signCookie(value) === signed) return value;
  return null;
}

export async function getCurrentTeam() {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  // Try cookie first
  const cookieStore = await cookies();
  const teamCookie = cookieStore.get("__team_ctx")?.value;
  let teamId: string | null = null;

  if (teamCookie) {
    teamId = verifyCookie(teamCookie);
  }

  // Fall back to DB currentTeamId
  if (!teamId) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { currentTeamId: true },
    });
    teamId = dbUser?.currentTeamId ?? null;
  }

  if (!teamId) return null;

  // Validate membership
  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: user.id } },
    include: { team: true },
  });

  if (membership) {
    return { team: membership.team, membership };
  }

  // Stale context repair: find first valid membership
  const fallback = await prisma.teamMember.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: { team: true },
  });

  if (fallback) {
    await setCurrentTeam(fallback.teamId);
    return { team: fallback.team, membership: fallback };
  }

  // No memberships at all — clear context
  await clearCurrentTeam();
  return null;
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const teamData = await getCurrentTeam();

  return {
    userId: user.id,
    globalRole: user.role,
    team: teamData
      ? { teamId: teamData.team.id, role: teamData.membership.role }
      : null,
  };
}

export async function setCurrentTeam(teamId: string) {
  const user = await getCurrentUser();
  if (!user?.id) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { currentTeamId: teamId },
  });

  const cookieStore = await cookies();
  cookieStore.set("__team_ctx", signCookie(teamId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

export async function clearCurrentTeam() {
  const user = await getCurrentUser();
  if (!user?.id) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { currentTeamId: null },
  });

  const cookieStore = await cookies();
  cookieStore.delete("__team_ctx");
}
