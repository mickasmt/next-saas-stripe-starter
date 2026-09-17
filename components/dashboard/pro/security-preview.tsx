import { Laptop, Smartphone } from "lucide-react"

import { SectionCard } from "@/components/dashboard/section-card"
import { LockedCard } from "@/components/dashboard/pro/locked-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const sessions = [
  {
    device: "Chrome on macOS — Austin, TX",
    detail: "Current session",
    icon: Laptop,
    current: true,
  },
  {
    device: "Safari on iOS — Austin, TX",
    detail: "Last active 3 hours ago",
    icon: Smartphone,
  },
  {
    device: "Chrome on Windows — Denver, CO",
    detail: "Last active 6 days ago",
    icon: Laptop,
  },
]

export function SecurityPreview() {
  return (
    <div className="flex flex-col gap-6">
      <LockedCard
        title="Password"
        description="Used to sign in with your email address."
        hint="Please use 8 characters at minimum."
        action="Update"
      >
        <div className="max-w-[300px]">
          <Label htmlFor="new-password" className="sr-only">
            New password
          </Label>
          <Input
            id="new-password"
            type="password"
            disabled
            defaultValue="password"
            className="bg-background"
          />
        </div>
      </LockedCard>

      <LockedCard
        title="Two-factor authentication"
        description="Ask for a code from your authenticator app at sign-in."
        hint="Recovery codes are generated once enabled."
        action="Enable"
      >
        <Badge variant="outline">Disabled</Badge>
      </LockedCard>

      <SectionCard
        title="Active sessions"
        description="Devices currently signed in to your account."
        footer={<p>Revoking a session signs that device out immediately.</p>}
      >
        <div className="divide-y rounded-md border bg-background">
          {sessions.map((session) => (
            <div
              key={session.device}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <session.icon className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{session.device}</p>
                  <p className="text-muted-foreground">{session.detail}</p>
                </div>
              </div>
              {session.current ? (
                <Badge variant="outline">Current</Badge>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
