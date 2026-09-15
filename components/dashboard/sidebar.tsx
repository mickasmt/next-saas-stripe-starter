import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import type { ShellOrganization, ShellUser } from "@/components/dashboard/types"
import { UserMenu } from "@/components/dashboard/user-menu"
import type { NavSection } from "@/config/nav"

export type SidebarProps = {
  nav: NavSection[]
  organization: ShellOrganization
  user: ShellUser
  onNavigate?: () => void
}

export function Sidebar({ nav, organization, user, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <OrganizationSwitcher organization={organization} />
      <div className="flex-1 overflow-y-auto">
        <SidebarNav sections={nav} onNavigate={onNavigate} />
      </div>
      <UserMenu user={user} />
    </div>
  )
}
