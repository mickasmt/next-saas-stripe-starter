"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navIcons } from "@/components/dashboard/nav-icons"
import { Badge } from "@/components/ui/badge"
import type { NavItem, NavSection } from "@/config/nav"
import { cn } from "@/lib/utils"

// The most specific matching href wins, so /dashboard isn't active on /dashboard/billing.
export function getActiveItem(pathname: string, items: NavItem[]) {
  return items
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]
}

export function SidebarNav({
  sections,
  onNavigate,
}: {
  sections: NavSection[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const activeHref = getActiveItem(
    pathname,
    sections.flatMap((section) => section.items)
  )?.href

  return (
    <nav className="flex flex-col gap-3 px-2">
      {sections.map((section, index) => (
        <div
          key={section.title ?? index}
          className={cn(
            "flex flex-col gap-px",
            index > 0 && "border-t border-divider pt-3"
          )}
        >
          {section.title && (
            <p className="px-2.5 pb-1 text-xs font-medium text-muted-foreground">
              {section.title}
            </p>
          )}
          {section.items.map((item) => {
            const Icon = item.icon && navIcons[item.icon]
            const active = item.href === activeHref

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-lg px-2.5 font-medium tracking-[-0.02em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                  active && "bg-accent text-foreground"
                )}
              >
                {Icon && <Icon className="size-4 shrink-0" />}
                <span className="truncate">{item.title}</span>
                {item.pro && (
                  <Badge
                    variant="outline"
                    className="ml-auto shrink-0 border-violet-500/40 bg-violet-500/10 text-violet-700 dark:border-violet-400/40 dark:bg-violet-400/12 dark:text-violet-200"
                  >
                    Pro
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
