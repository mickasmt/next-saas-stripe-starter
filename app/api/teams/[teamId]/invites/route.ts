import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/email";
import { apiRequireTeamPermission } from "@/lib/guards";
import { PERMISSIONS } from "@/lib/permissions";
import { getTeamInvites } from "@/lib/team";
import { inviteMemberSchema } from "@/lib/validations/team";
import { TeamInviteEmail } from "@/emails/team-invite-email";

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.MEMBERS_INVITE,
    params.teamId,
  );

  if (error) return error;

  const invites = await getTeamInvites(context!.teamId);
  return Response.json(invites);
}

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } },
) {
  const { error, context } = await apiRequireTeamPermission(
    PERMISSIONS.MEMBERS_INVITE,
    params.teamId,
  );
  if (error) return error;

  const body = await req.json();
  const parsed = inviteMemberSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, role } = parsed.data;

  // Check if already a member
  const existingMember = await prisma.teamMember.findFirst({
    where: { teamId: params.teamId, user: { email } },
  });
  if (existingMember) {
    return Response.json(
      { error: "User is already a team member" },
      { status: 409 },
    );
  }

  // Check for existing pending invite
  const existingInvite = await prisma.teamInvite.findUnique({
    where: { teamId_email: { teamId: params.teamId, email } },
  });
  if (existingInvite?.status === "PENDING") {
    return Response.json(
      { error: "An invite is already pending for this email" },
      { status: 409 },
    );
  }
  if (existingInvite) {
    await prisma.teamInvite.delete({ where: { id: existingInvite.id } });
  }

  const team = await prisma.team.findUnique({
    where: { id: params.teamId },
    select: { name: true },
  });

  const invite = await prisma.teamInvite.create({
    data: {
      teamId: params.teamId,
      email,
      role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Send invite email
  const inviteUrl = `${env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;
  try {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to:
        process.env.NODE_ENV === "development"
          ? "delivered@resend.dev"
          : email,
      subject: `Join ${team?.name} on ${siteConfig.name}`,
      react: TeamInviteEmail({
        inviterName: context!.user.name || "A team member",
        teamName: team?.name || "a team",
        inviteUrl,
        role,
        siteName: siteConfig.name,
      }),
    });
  } catch {
    console.error("Failed to send invite email");
  }

  await logAudit({
    teamId: params.teamId,
    userId: context!.user.id!,
    action: "member.invited",
    metadata: { email, role },
  });

  return Response.json(invite, { status: 201 });
}
