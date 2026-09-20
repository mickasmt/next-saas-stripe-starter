import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"

import { proPricing } from "@/components/marketing/pro-showcase"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

// Sidebar card on blog and changelog posts, pointing at the Pro page instead
// of the free-starter CTA used elsewhere.
export function ProCtaCard({ className }: { className?: string }) {
  return (
    <Link
      href={siteConfig.links.pro}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-background p-4 transition-colors hover:bg-background/60",
        className
      )}
    >
      <ArrowUpRight className="absolute top-4 right-4 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      <span className="flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400">
        <Sparkles className="size-3.5" />
        SaaS Starter Pro
      </span>
      <p className="mt-2 pr-6 text-sm font-semibold">
        Get Pro for {proPricing.earlyBird}{" "}
        <span className="text-muted-foreground line-through">
          {proPricing.regular}
        </span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Onboarding, teams and billing, ready to ship. One-time payment.
      </p>
    </Link>
  )
}
