import { Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

// Header of a locked page: says what Pro ships, links to the offer.
export function ProBanner({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-violet-500/30 bg-violet-500/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-violet-400/25 dark:bg-violet-400/8">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-600 dark:text-violet-300" />
        <div className="min-w-0">
          <p className="font-medium text-violet-900 dark:text-violet-50">
            {title}
          </p>
          <p className="text-violet-900/70 dark:text-violet-100/70">
            {description}
          </p>
        </div>
      </div>
      <Button
        size="sm"
        nativeButton={false}
        render={
          <Link href={siteConfig.links.pro} target="_blank" rel="noreferrer" />
        }
        className="shrink-0 self-start border-violet-500/40 bg-violet-500/10 text-violet-700 hover:bg-violet-500/15 hover:text-violet-800 sm:self-auto dark:border-violet-400/50 dark:bg-violet-400/15 dark:text-violet-100 dark:hover:bg-violet-400/25"
      >
        About Pro
      </Button>
    </div>
  )
}
