"use client"

import {
  AnchorProvider,
  useActiveAnchor,
  type TOCItemType,
} from "fumadocs-core/toc"
import { AlignLeft } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

// "On this page" list for any Fumadocs page (`page.data.toc`), with a bar
// that slides to the heading currently in view. Place it in a sticky column.
export function TableOfContents({
  items,
  className,
}: {
  items: TOCItemType[]
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <AnchorProvider toc={items} single>
      <nav aria-label="On this page" className={className}>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <AlignLeft className="size-4" />
          On this page
        </p>
        <TocList items={items} />
      </nav>
    </AnchorProvider>
  )
}

function TocList({ items }: { items: TOCItemType[] }) {
  const activeId = useActiveAnchor()
  const listRef = useRef<HTMLUListElement>(null)
  const [bar, setBar] = useState<{ top: number; height: number } | null>(null)

  useLayoutEffect(() => {
    const link = activeId
      ? listRef.current?.querySelector<HTMLElement>(
          `[data-id="${CSS.escape(activeId)}"]`
        )
      : null
    setBar(link ? { top: link.offsetTop, height: link.offsetHeight } : null)
  }, [activeId])

  return (
    <ul
      ref={listRef}
      className="relative mt-4 grid gap-4 border-l-2 border-border"
    >
      {bar && (
        <span
          aria-hidden
          className="absolute -left-0.5 w-0.5 bg-foreground transition-[top,height] duration-200 ease-out"
          style={bar}
        />
      )}
      {items.map((item) => {
        const id = item.url.slice(1)
        const active = id === activeId

        return (
          <li key={item.url} data-id={id}>
            <a
              href={item.url}
              aria-current={active ? "location" : undefined}
              className={cn(
                "block text-sm text-muted-foreground transition-colors hover:text-foreground",
                active && "text-foreground"
              )}
              style={{ paddingLeft: 16 + (item.depth - 2) * 12 }}
            >
              {item.title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
