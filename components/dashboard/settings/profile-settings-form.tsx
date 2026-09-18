"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import type { ShellUser } from "@/components/dashboard/types"
import { SectionCard } from "@/components/dashboard/section-card"
import { AvatarCard } from "@/components/dashboard/settings/avatar-card"
import { DeleteAccountCard } from "@/components/dashboard/settings/delete-account-card"
import { IdCard } from "@/components/dashboard/settings/id-card"
import { SaveCard } from "@/components/dashboard/settings/save-card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/client"

export function ProfileSettingsForm({
  user,
  hasPassword,
}: {
  user: ShellUser & { id: string; emailVerified: boolean }
  hasPassword: boolean
}) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [saving, startSave] = useTransition()

  function saveName() {
    startSave(async () => {
      const { error } = await authClient.updateUser({ name: name.trim() })
      if (error) {
        toast.error(error.message ?? "Couldn't update your name.")
        return
      }
      toast.success("Display name updated.")
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <AvatarCard title="Avatar" description="This is your avatar.">
        <UserAvatar user={user} fallbackClassName="text-xl" />
      </AvatarCard>

      <SaveCard
        title="Display Name"
        description="Please enter your full name, or a display name you are comfortable with."
        hint="Please use 32 characters at maximum."
        dirty={name.trim() !== user.name && name.trim().length > 0}
        pending={saving}
        onSave={saveName}
      >
        <div className="max-w-[300px]">
          <Label htmlFor="display-name" className="sr-only">
            Display name
          </Label>
          <Input
            id="display-name"
            value={name}
            maxLength={32}
            className="bg-card dark:bg-card"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
      </SaveCard>

      <SectionCard
        title="Email"
        description="The email address you use to sign in. It also receives account-related notifications."
        footer={<p>Emails must be verified to be used to sign in.</p>}
      >
        <div className="flex max-w-md items-center gap-2 rounded-md border bg-background px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate">{user.email}</span>
          {user.emailVerified && <Badge variant="secondary">Verified</Badge>}
          <Badge variant="outline">Primary</Badge>
        </div>
      </SectionCard>

      <IdCard
        title="User ID"
        description="This is your user ID."
        value={user.id}
      />

      <DeleteAccountCard hasPassword={hasPassword} />
    </div>
  )
}
