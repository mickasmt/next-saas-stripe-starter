import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCurrentUser, getCurrentTeam } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { MemberCard } from "@/components/dashboard/member-card";
import { InviteMemberButton } from "@/components/forms/invite-member-form";

export const metadata = constructMetadata({
  title: "Members – SaaS Starter",
  description: "Manage team members.",
});

export default async function MembersPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const userId = user.id!;

  const teamData = await getCurrentTeam();
  if (!teamData) redirect("/dashboard/team");

  const members = await prisma.teamMember.findMany({
    where: { teamId: teamData.team.id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const currentUserRole = teamData.membership.role;
  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  const ownerCount = members.filter((m) => m.role === "OWNER").length;

  return (
    <>
      <DashboardHeader
        heading="Members"
        text="Manage your team members and their roles."
      >
        {canManage && (
          <InviteMemberButton teamId={teamData.team.id} />
        )}
      </DashboardHeader>
      <div className="divide-y divide-muted">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={{
              id: member.id,
              userId: member.userId,
              role: member.role,
              user: {
                name: member.user.name,
                email: member.user.email,
                image: member.user.image,
              },
            }}
            currentUserId={userId}
            currentUserRole={currentUserRole}
            teamId={teamData.team.id}
            ownerCount={ownerCount}
          />
        ))}
      </div>
    </>
  );
}
