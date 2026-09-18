import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

import { proPurchaseHref } from "./purchase"
import { GridSection } from "@/components/marketing/grid-section"
import { LaunchBadge, proPricing } from "@/components/marketing/pro-showcase"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const included = [
  "Private repository access",
  "Every Pro module, current and future",
  "Lifetime updates",
  "One-time payment, no subscription",
]

export function ProCta() {
  return (
    <GridSection
      lines
      innerClassName="py-20 sm:py-28"
      background={
        <div className="absolute inset-0 opacity-15 dark:opacity-25">
          <div className="size-full bg-[linear-gradient(90deg,#8b5cf6,#d946ef)] mask-[linear-gradient(transparent_30%,black)]" />
        </div>
      }
    >
      <div className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,380px)] md:gap-16">
        <div className="text-center md:text-left">
          <h2 className="font-display text-4xl font-medium text-balance sm:text-5xl sm:leading-[1.1]">
            Skip straight to the product
          </h2>
          <p className="mt-5 text-lg text-pretty text-muted-foreground">
            Pay once, clone the private repository and ship the parts your
            customers see first this week.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-6 text-left shadow-xl shadow-violet-500/10 dark:shadow-black/40">
          <p className="flex items-center gap-2 text-sm font-medium text-violet-700 dark:text-violet-300">
            <Sparkles className="size-4" />
            SaaS Starter Pro
          </p>
          <LaunchBadge className="mt-4" />
          <p className="mt-3 font-display text-5xl font-medium">
            <span className="mr-2 text-2xl text-muted-foreground line-through">
              {proPricing.regular}
            </span>
            {proPricing.earlyBird}
          </p>
          <p className="mt-2 text-sm font-medium text-violet-700 dark:text-violet-300">
            {proPricing.earlyBirdNote}, then {proPricing.regular}.
          </p>

          <ul className="mt-6 space-y-2 text-sm">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-violet-600 dark:text-violet-400" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href={proPurchaseHref}
            className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}
          >
            Get Pro
          </Link>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Or start with the free starter on GitHub
          </a>
        </div>
      </div>
    </GridSection>
  )
}
