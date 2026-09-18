"use client"

import { BookOpen } from "lucide-react" // module:docs
import { Menu } from "lucide-react"
import Link from "next/link" // module:docs
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Sidebar, type SidebarProps } from "@/components/dashboard/sidebar"
import { getActiveItem } from "@/components/dashboard/sidebar-nav"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getActivePanel } from "@/lib/nav"

// Three-column top bar: menu, page title, actions.
export function DashboardHeader(props: Omit<SidebarProps, "onNavigate">) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panel = getActivePanel(pathname, props.panels)
  const title =
    panel?.title ??
    getActiveItem(
      pathname,
      props.nav.flatMap((section) => section.items)
    )?.title

  return (
    <header className="sticky top-0 z-30 grid h-14 grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-center gap-2 border-b border-divider bg-background">
      <div className="flex items-center gap-1 pl-2 md:pl-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Open menu"
                className="md:hidden"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent
            data-dashboard
            side="left"
            showCloseButton={false}
            className="w-72 border-divider bg-sidebar p-0"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Sidebar {...props} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <p className="truncate text-center font-medium">{title}</p>

      <div className="flex items-center justify-end pr-2 md:pr-4">
        {/* module:docs start */}
        <Button
          variant="ghost"
          size="sm"
          className="px-2 font-medium"
          nativeButton={false}
          render={<Link href="/docs" />}
        >
          <BookOpen className="text-muted-foreground" />
          <span className="hidden sm:inline">Docs</span>
        </Button>
        {/* module:docs end */}
      </div>
    </header>
  )
}
