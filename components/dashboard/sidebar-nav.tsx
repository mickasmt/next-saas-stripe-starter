"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navIcons } from "@/components/dashboard/nav-icons"
import type { NavItem, NavSection } from "@/config/nav"
import { cn } from "@/lib/utils"

// The most specific matching href wins, so /dashboard isn't active on /dashboard/billing.
function getActiveHref(pathname: string, items: NavItem[]) {
  return items
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href
}

export function SidebarNav({
  sections,
  onNavigate,
}: {
  sections: NavSection[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const activeHref = getActiveHref(
    pathname,
    sections.flatMap((section) => section.items)
  )

  return (
    <nav className="grid gap-5">
      {sections.map((section, index) => (
        <div key={section.title ?? index} className="grid gap-0.5">
          {section.title && (
            <p className="mb-1 px-2.5 text-xs font-medium text-muted-foreground">
              {section.title}
            </p>
          )}
          {section.items.map((item) => {
            const Icon = navIcons[item.icon]
            const active = item.href === activeHref

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground",
                  active && "bg-foreground/[0.07] font-medium text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.title}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
