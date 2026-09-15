import type { ShellOrganization } from "@/components/dashboard/types"

// Shows the active organization. Switching between organizations plugs in
// here without changing the sidebar.
export function OrganizationSwitcher({
  organization,
}: {
  organization: ShellOrganization
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg p-1.5">
      {organization.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={organization.logo}
          alt=""
          className="size-8 shrink-0 rounded-md border object-cover"
        />
      ) : (
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-linear-to-br from-neutral-700 to-neutral-950 text-sm font-semibold text-white ring-1 ring-foreground/10">
          {organization.name.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{organization.name}</p>
        <p className="truncate text-xs text-muted-foreground capitalize">
          {organization.role}
        </p>
      </div>
    </div>
  )
}
