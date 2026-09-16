"use client"

import { Check, Copy, Star, Terminal } from "lucide-react"
import { useState } from "react"

import { GitHubIcon } from "@/components/shared/icons"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const INSTALL_COMMAND = `npx create-next-app my-saas --example "${siteConfig.links.github}"`

const STACK = ["Next.js", "Better Auth", "Drizzle", "Stripe"]

export function GetStartedCard({ stars }: { stars: string | null }) {
  const [copied, setCopied] = useState(false)

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access denied — nothing to fall back to.
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-neutral-900/5 bg-neutral-500/5 p-4 shadow-lg shadow-neutral-900/5 backdrop-blur sm:p-6 dark:border-white/10 dark:bg-white/5">
      <div className="absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border bg-neutral-50 px-2 py-0.5 text-xs text-muted-foreground dark:bg-neutral-900">
        <Terminal className="size-3.5 text-foreground" />
        Get started
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-neutral-900/10 bg-background px-3.5 py-3 dark:border-white/10">
        <span className="shrink-0 font-mono text-sm text-muted-foreground select-none">
          $
        </span>
        <code className="min-w-0 flex-1 truncate font-mono text-sm">
          {INSTALL_COMMAND}
        </code>
        <button
          type="button"
          onClick={copyCommand}
          aria-label="Copy install command"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>

      <a
        href={siteConfig.links.github}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "mt-3 flex items-center gap-3 rounded-xl border border-neutral-900/10 bg-background p-3.5 text-left shadow-sm transition-colors hover:bg-muted dark:border-white/10"
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <GitHubIcon className="size-5 text-foreground" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">
            mickasmt/next-saas-stripe-starter
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            ↳ {STACK.join(" · ")}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium">
          <Star className="size-3 fill-amber-500 text-amber-500" />
          {stars ?? "3K"}
        </span>
      </a>
    </div>
  )
}
