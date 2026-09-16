"use client"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavFind } from "@/components/dashboard/nav-find"
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import type { ShellOrganization, ShellUser } from "@/components/dashboard/types"
import { UserMenu } from "@/components/dashboard/user-menu"
import type { NavSection } from "@/config/nav"
import { cn } from "@/lib/utils"

export type SidebarProps = {
  nav: NavSection[]
  settingsNav: NavSection[]
  organization: ShellOrganization
  user: ShellUser
  onNavigate?: () => void
}

export function Sidebar({
  nav,
  settingsNav,
  organization,
  user,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname()
  const inSettings = pathname.startsWith("/dashboard/settings")
  const findItems = [...nav, ...settingsNav]
    .flatMap((section) => section.items)
    .filter((item, i, all) => all.findIndex((x) => x.href === item.href) === i)

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-1 px-2 pt-2">
        <OrganizationSwitcher organization={organization} />
        <NavFind items={findItems} onNavigate={onNavigate} />
      </div>

      <div className="mt-2.5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-3">
        {/* Keyed so the panel slides when entering/leaving settings. */}
        <div
          key={inSettings ? "settings" : "main"}
          className={cn(
            "flex animate-in flex-col gap-px duration-200 fade-in",
            inSettings ? "slide-in-from-right-4" : "slide-in-from-left-4"
          )}
        >
          {inSettings && (
            <div className="px-2">
              <Link
                href="/dashboard"
                onClick={onNavigate}
                className="flex h-9 items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <span className="grid size-9 place-items-center">
                  <ChevronLeft className="size-4" />
                </span>
                <span className="flex-1 text-center font-medium">Settings</span>
                <span className="size-9" />
              </Link>
            </div>
          )}
          <SidebarNav
            sections={inSettings ? settingsNav : nav}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      <div className="p-2">
        <UserMenu user={user} />
      </div>
    </div>
  )
}
