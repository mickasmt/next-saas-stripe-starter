"use client"

import { CornerDownLeft, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { navIcons } from "@/components/dashboard/nav-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { NavItem } from "@/config/nav"
import { cn } from "@/lib/utils"

// "Find": jump to any dashboard page, opened with F.
export function NavFind({
  items,
  onNavigate,
}: {
  items: NavItem[]
  onNavigate?: () => void
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [highlighted, setHighlighted] = useState(0)

  const results = items.filter((item) =>
    item.title.toLowerCase().includes(query.trim().toLowerCase())
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (
        event.key.toLowerCase() !== "f" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      )
        return
      event.preventDefault()
      setOpen(true)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function changeOpen(next: boolean) {
    setOpen(next)
    if (!next) {
      setQuery("")
      setHighlighted(0)
    }
  }

  function go(item: NavItem | undefined) {
    if (!item) return
    changeOpen(false)
    onNavigate?.()
    router.push(item.href)
  }

  function onInputKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      setHighlighted((i) => (i + step + results.length) % results.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      go(results[highlighted])
    }
  }

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger className="flex h-9 w-full items-center gap-2 rounded-lg bg-card px-2.5 text-muted-foreground ring-1 ring-input transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50">
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Find...</span>
        <kbd className="grid h-5 min-w-5 place-items-center rounded-sm bg-muted px-1 font-sans text-xs text-muted-foreground">
          F
        </kbd>
      </PopoverTrigger>
      <PopoverContent
        data-dashboard
        align="start"
        sideOffset={6}
        initialFocus={inputRef}
        className="w-(--anchor-width) min-w-60 gap-0 rounded-lg bg-card p-0 ring-input"
      >
        <input
          ref={inputRef}
          value={query}
          placeholder="Find a page..."
          aria-label="Find a page"
          onChange={(event) => {
            setQuery(event.target.value)
            setHighlighted(0)
          }}
          onKeyDown={onInputKeyDown}
          className="h-10 border-b border-border bg-transparent px-3 outline-none placeholder:text-muted-foreground"
        />
        <div className="flex max-h-72 flex-col gap-px overflow-y-auto p-1">
          {results.length === 0 && (
            <p className="px-2.5 py-6 text-center text-muted-foreground">
              No pages found.
            </p>
          )}
          {results.map((item, index) => {
            const Icon = navIcons[item.icon ?? "settings"]
            const active = index === highlighted

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item)}
                onMouseMove={() => setHighlighted(index)}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-left text-muted-foreground",
                  active && "bg-accent text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1 truncate">{item.title}</span>
                {active && <CornerDownLeft className="size-3.5" />}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
