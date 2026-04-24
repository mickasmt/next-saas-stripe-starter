"use server";

import { revalidatePath } from "next/cache";
import { TeamRole } from "@prisma/client";

import { auth } from "@/auth";
import { setActiveTeamId } from "@/lib/active-team";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { createTeamSchema } from "@/lib/validations/team";

type CreateTeamInput = {
  name: string;
  slug: string;
};

export async function createTeam(data: CreateTeamInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { name, slug } = createTeamSchema.parse(data);

    // Check slug uniqueness
    const existing = await prisma.team.findUnique({ where: { slug } });
    if (existing) {
      return { status: "error" as const, message: "Slug already taken" };
    }

    const userId = session.user.id;

    // Create team + owner membership in a transaction
    const team = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name, slug },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId,
          role: TeamRole.OWNER,
        },
      });

      return team;
    });

    await logAudit({
      teamId: team.id,
      userId,
      action: "team.created",
      targetType: "team",
      targetId: team.id,
      metadata: { name, slug },
    });

    await setActiveTeamId(team.id);
    revalidatePath("/dashboard");

    return { status: "success" as const, teamId: team.id };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { status: "error" as const, message: "Unauthorized" };
    }
    return { status: "error" as const, message: "Failed to create team" };
  }
}
