"use client"

import { Check, List } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

type Tab = { key: string; label: string; href: string }

// A segmented control whose active pill slides to the clicked tab instead of
// just popping into place. Renders as plain <Link>s so it degrades to normal
// navigation without JS; the sliding indicator is a progressive enhancement.
export function CategoryTabs({
  tabs,
  active,
  className,
}: {
  tabs: Tab[]
  active: string
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const [indicator, setIndicator] = useState<{
    left: number
    width: number
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const el = tabRefs.current.get(active)
    if (!container || !el) return

    const update = () => {
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicator({ left: elRect.left - containerRect.left, width: elRect.width })
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [active])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-wrap items-center justify-center gap-1",
        className
      )}
    >
      {indicator && (
        <div
          aria-hidden
          className="absolute inset-y-0 rounded-lg bg-neutral-900 transition-[left,width] duration-300 ease-out dark:bg-white"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          ref={(el) => {
            if (el) tabRefs.current.set(tab.key, el)
          }}
          className={cn(
            "relative z-10 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
            tab.key === active
              ? "text-white dark:text-neutral-900"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}

// The same tabs for narrow screens, where a wrapping row gets cramped: a
// full-width "Categories" button that opens the list in a bottom drawer
// you can swipe down to dismiss.
export function CategoryMenu({
  tabs,
  active,
  className,
}: {
  tabs: Tab[]
  active: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
      <DrawerTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm",
              className
            )}
          />
        }
      >
        <List className="size-4" />
        Categories
      </DrawerTrigger>

      <DrawerContent>
        <DrawerTitle className="sr-only">Categories</DrawerTitle>
        <nav className="flex flex-col p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              onClick={() => setOpen(false)}
              aria-current={tab.key === active ? "page" : undefined}
              className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              {tab.label}
              {tab.key === active && <Check className="size-4" />}
            </Link>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  )
}
