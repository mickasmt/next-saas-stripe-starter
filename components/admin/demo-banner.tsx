"use client"

import { ArrowRight, FlaskConical } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useOptimistic, useTransition } from "react"

import { setPreviewRole } from "@/modules/admin/preview-actions"

type Role = "admin" | "user"

// Live demo: visitors pick the role the dashboard is shown with.
export function DemoBanner({ role }: { role: Role }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [value, setValue] = useOptimistic(role)

  function change(next: Role) {
    startTransition(async () => {
      setValue(next)
      await setPreviewRole(next)
      router.refresh()
    })
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-lg border bg-card px-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="font-medium">You&apos;re on the live demo</p>
          <p className="text-muted-foreground">
            Pick a role to see the dashboard as a user or as an admin. It resets
            when you sign in again.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {value === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-1 font-medium hover:underline"
          >
            Open admin panel
            <ArrowRight className="size-3.5" />
          </Link>
        )}
        <label className="flex items-center gap-2 font-medium">
          Role
          <select
            value={value}
            disabled={pending}
            onChange={(event) => change(event.target.value as Role)}
            className="h-8 rounded-lg border border-input bg-background px-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
    </div>
  )
}
