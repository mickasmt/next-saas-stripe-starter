import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SectionCard } from "@/components/dashboard/section-card"

const members = [
  {
    name: "Alex Moreau",
    email: "alex@acme.com",
    role: "Owner",
    joined: "Jan 2026",
  },
  {
    name: "Dana Whitfield",
    email: "dana@acme.com",
    role: "Admin",
    joined: "Mar 2026",
  },
  {
    name: "Sam Okafor",
    email: "sam@acme.com",
    role: "Member",
    joined: "Jun 2026",
  },
  {
    name: "Lea Brandt",
    email: "lea@acme.com",
    role: "Member",
    joined: "Aug 2026",
  },
]

const invitations = [
  { email: "chris@acme.com", role: "Member", sent: "2 days ago" },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function MembersPreview() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Members"
        description="People with access to this organization."
        footer={
          <>
            <p>4 of 10 seats used.</p>
            <Button
              size="sm"
              disabled
              className="px-2.5 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:ring-1 disabled:ring-border"
            >
              Invite member
            </Button>
          </>
        }
      >
        <div className="overflow-x-auto rounded-md border bg-background">
          <table className="w-full text-left">
            <thead className="border-b text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Member</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((member) => (
                <tr key={member.email}>
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {initials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{member.name}</p>
                        <p className="truncate text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={member.role === "Owner" ? "default" : "outline"}
                    >
                      {member.role}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 whitespace-nowrap text-muted-foreground sm:table-cell">
                    {member.joined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Pending invitations"
        description="Invitations waiting to be accepted."
        footer={<p>Invitations expire after 7 days.</p>}
      >
        <div className="divide-y rounded-md border bg-background">
          {invitations.map((invitation) => (
            <div
              key={invitation.email}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{invitation.email}</p>
                <p className="text-muted-foreground">
                  {invitation.role} · sent {invitation.sent}
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Revoke
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
