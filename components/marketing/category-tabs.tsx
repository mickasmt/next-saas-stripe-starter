"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type Tab = { key: string; label: string; href: string }

// A segmented control whose active pill slides to the clicked tab instead of
// just popping into place. Renders as plain <Link>s so it degrades to normal
// navigation without JS; the sliding indicator is a progressive enhancement.
export function CategoryTabs({
  tabs,
  active,
}: {
  tabs: Tab[]
  active: string
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
      className="relative flex flex-wrap items-center justify-center gap-1"
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
            "relative z-10 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
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
