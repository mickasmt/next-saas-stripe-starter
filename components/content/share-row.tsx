"use client"

import { GitHubIcon, XIcon } from "@/components/shared/icons"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

// Share intent on X plus a link to the repo (no app credentials or tracking
// involved). Reads the current URL client-side to avoid needing a
// configured site origin.
export function ShareRow({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  function shareOnX() {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(title)
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={shareOnX}
        aria-label="Share on X"
        className="flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <XIcon className="size-4" />
      </button>
      <a
        href={siteConfig.links.github}
        target="_blank"
        rel="noreferrer"
        aria-label="View on GitHub"
        className="flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <GitHubIcon className="size-4" />
      </a>
    </div>
  )
}
