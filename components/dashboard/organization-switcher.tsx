import Link from "next/link"

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
      {organization.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={organization.logo}
          alt=""
          className="size-5 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-[10px] font-semibold text-white">
          {organization.name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="truncate">{organization.name}</span>
      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] leading-4 text-muted-foreground capitalize">
        {organization.role}
      </span>
    </Link>
  )
}
