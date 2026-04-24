"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { setActiveTeamId } from "@/lib/active-team";
import { prisma } from "@/lib/db";

export async function switchTeam(teamId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify membership
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId: session.user.id },
      },
    });

    if (!membership) {
      return { status: "error" as const, message: "Not a team member" };
    }

    await setActiveTeamId(teamId);
    revalidatePath("/dashboard");

    return { status: "success" as const };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error" as const, message: error.message };
    }
    return { status: "error" as const, message: "Failed to switch team" };
  }
}
