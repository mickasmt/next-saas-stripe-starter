import { Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

// Free version only: sells Pro to whoever cloned the starter. Delete it
// (and components/dashboard/pro) when shipping your own product.
export function ProSidebarCard() {
  return (
    <div className="mb-1 rounded-lg border border-violet-500/30 bg-violet-500/8 p-3 dark:border-violet-400/25 dark:bg-violet-400/8">
      <p className="flex items-center gap-1.5 font-medium text-violet-900 dark:text-violet-50">
        <Sparkles className="size-3.5 shrink-0 text-violet-600 dark:text-violet-300" />
        Ship the rest with Pro
      </p>
      <p className="mt-1 text-violet-900/70 dark:text-violet-100/70">
        A lot more is already built and ready to use.
      </p>
      <Button
        size="sm"
        nativeButton={false}
        render={<Link href={siteConfig.links.pro} />}
        className="mt-3 w-full border-violet-500/40 bg-violet-500/10 text-violet-700 hover:bg-violet-500/15 hover:text-violet-800 dark:border-violet-400/50 dark:bg-violet-400/15 dark:text-violet-100 dark:hover:bg-violet-400/25"
      >
        Get Pro
      </Button>
    </div>
  )
}
