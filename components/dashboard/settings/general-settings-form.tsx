"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/client"

type Organization = {
  id: string
  name: string
  slug: string
}

function SettingsCard({
  title,
  description,
  hint,
  dirty,
  pending,
  onSave,
  children,
}: {
  title: string
  description: string
  hint: string
  dirty: boolean
  pending: boolean
  onSave: () => void
  children: React.ReactNode
}) {
  return (
    <SectionCard
      title={title}
      description={description}
      footer={
        <>
          <p>{hint}</p>
          <Button
            size="sm"
            disabled={!dirty || pending}
            onClick={onSave}
            className="px-2.5 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:ring-1 disabled:ring-border"
          >
            {pending ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      {children}
    </SectionCard>
  )
}

export function GeneralSettingsForm({
  organization,
  canEdit,
}: {
  organization: Organization
  canEdit: boolean
}) {
  const router = useRouter()
  const [name, setName] = useState(organization.name)
  const [slug, setSlug] = useState(organization.slug)
  const [error, setError] = useState<string | null>(null)
  const [nameSaving, startNameSave] = useTransition()
  const [slugSaving, startSlugSave] = useTransition()

  function saveName() {
    setError(null)
    startNameSave(async () => {
      const { error } = await authClient.organization.update({
        organizationId: organization.id,
        data: { name },
      })
      if (error) setError(error.message ?? "Couldn't update the name.")
      else router.refresh()
    })
  }

  function saveSlug() {
    setError(null)
    startSlugSave(async () => {
      const { error } = await authClient.organization.update({
        organizationId: organization.id,
        data: { slug },
      })
      if (error) setError(error.message ?? "Couldn't update the slug.")
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
          {error}
        </p>
      )}

      <SettingsCard
        title="Organization Name"
        description="This is the name of your organization."
        hint="Please use 32 characters at maximum."
        dirty={name.trim() !== organization.name && name.trim().length > 0}
        pending={nameSaving}
        onSave={saveName}
      >
        <div className="max-w-[300px]">
          <Label htmlFor="org-name" className="sr-only">
            Organization name
          </Label>
          <Input
            id="org-name"
            value={name}
            maxLength={32}
            className="bg-card dark:bg-card"
            disabled={!canEdit}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Organization Slug"
        description="This is your organization's unique slug."
        hint="Only lowercase letters, numbers, and dashes."
        dirty={
          slug.trim() !== organization.slug && /^[a-z0-9-]+$/.test(slug.trim())
        }
        pending={slugSaving}
        onSave={saveSlug}
      >
        <div className="max-w-[300px]">
          <Label htmlFor="org-slug" className="sr-only">
            Organization slug
          </Label>
          <Input
            id="org-slug"
            value={slug}
            pattern="^[a-z0-9-]+$"
            className="bg-card dark:bg-card"
            disabled={!canEdit}
            onChange={(event) => setSlug(event.target.value)}
          />
        </div>
      </SettingsCard>

      {!canEdit && (
        <p className="text-muted-foreground">
          Only owners and admins can change these settings.
        </p>
      )}
    </div>
  )
}
