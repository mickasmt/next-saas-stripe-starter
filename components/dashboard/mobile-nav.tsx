"use client"

import { Menu } from "lucide-react"
import { useState } from "react"

import { Sidebar, type SidebarProps } from "@/components/dashboard/sidebar"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav(props: Omit<SidebarProps, "onNavigate">) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-sidebar/80 px-3 backdrop-blur lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        >
          <Menu />
        </SheetTrigger>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-72 bg-sidebar p-0"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar {...props} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <Logo className="text-sm" />
    </header>
  )
}
