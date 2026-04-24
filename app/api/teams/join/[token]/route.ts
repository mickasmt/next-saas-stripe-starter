import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: { token: string } },
) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const invite = await prisma.teamInvite.findUnique({
    where: { token: params.token },
    include: { team: { select: { name: true } } },
  });

  if (!invite || invite.status !== "PENDING") {
    return Response.json({ error: "Invite not found or no longer valid" }, { status: 404 });
  }

  if (invite.email !== session.user.email) {
    return Response.json({ error: "Email mismatch" }, { status: 403 });
  }

  if (new Date() > invite.expiresAt) {
    await prisma.teamInvite.update({
      where: { id: invite.id },
      data: { status: "EXPIRED" },
    });
    return Response.json({ error: "Invite expired" }, { status: 410 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.teamMember.create({
      data: { teamId: invite.teamId, userId, role: invite.role },
    });
    await tx.teamInvite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" },
    });
  });

  await logAudit({
    teamId: invite.teamId,
    userId,
    action: "member.joined",
    metadata: { role: invite.role },
  });

  return Response.json({
    teamId: invite.teamId,
    teamName: invite.team.name,
    role: invite.role,
  });
}
