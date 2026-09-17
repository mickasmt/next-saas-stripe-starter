import Link from "next/link"

import { OrganizationAvatar } from "@/components/dashboard/organization-avatar"
import type { ShellOrganization } from "@/components/dashboard/types"

// Shows the active organization. Switching between organizations plugs in
// here without changing the sidebar.
export function OrganizationSwitcher({
  organization,
}: {
  organization: ShellOrganization
}) {
  return (
    <Link
      href="/dashboard"
      className="flex h-10 min-w-0 items-center gap-2 rounded-lg px-2.5 font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <OrganizationAvatar organization={organization} className="size-5" />
      <span className="truncate">{organization.name}</span>
      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] leading-4 text-muted-foreground capitalize">
        {organization.role}
      </span>
    </Link>
  )
}
