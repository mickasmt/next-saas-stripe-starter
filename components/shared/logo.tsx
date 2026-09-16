import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

// Without the link, for layouts that provide their own (e.g. Fumadocs).
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
    >
      <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.6 3.7L12 11.7 5.4 8 12 4.3Z" />
        </svg>
      </span>
      {siteConfig.name}
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/">
      <LogoMark className={className} />
    </Link>
  )
}
