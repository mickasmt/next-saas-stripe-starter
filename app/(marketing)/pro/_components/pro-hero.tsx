import { Sparkles } from "lucide-react"
import Link from "next/link"

import { ProHeroVisual } from "./pro-hero-visual"
import { proPurchaseHref } from "./purchase"
import { GridSection } from "@/components/marketing/grid-section"
import { proPricing } from "@/components/marketing/pro-showcase"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ProHero() {
  return (
    <GridSection
      lines
      innerClassName="pt-16 pb-12"
      background={
        <div className="absolute top-0 -left-1/4 h-full w-[150%] opacity-15 dark:opacity-25">
          <div className="size-full bg-[linear-gradient(90deg,#8b5cf6,#d946ef)] mask-[linear-gradient(transparent_25%,black)]" />
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <span className="flex animate-slide-up-fade items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-700 motion-reduce:animate-none dark:text-violet-300">
          <Sparkles className="size-3.5" />
          SaaS Starter Pro
        </span>

        <h1 className="mt-5 animate-slide-up-fade font-display text-4xl font-medium text-balance [--offset:20px] [animation-delay:100ms] motion-reduce:animate-none sm:text-5xl sm:leading-[1.15]">
          The weeks of polish. <br className="hidden sm:block" />
          Already done.
        </h1>

        <p className="mt-5 animate-slide-up-fade text-base text-balance text-muted-foreground [animation-delay:200ms] motion-reduce:animate-none sm:text-xl">
          Onboarding, emails, teams and seat billing,{" "}
          <br className="hidden sm:block" />
          built on top of the free starter.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-fit animate-slide-up-fade flex-wrap justify-center gap-4 [--offset:5px] [animation-delay:300ms] motion-reduce:animate-none">
        <Link
          href={proPurchaseHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
          )}
        >
          Get Pro for {proPricing.earlyBird}
          <span className="text-sm text-primary-foreground/60 line-through">
            {proPricing.regular}
          </span>
        </Link>
        <Link
          href="#pro"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
          )}
        >
          See what&apos;s included
        </Link>
      </div>

      <p className="mt-4 animate-slide-up-fade text-center text-sm text-muted-foreground [animation-delay:350ms] motion-reduce:animate-none">
        One-time payment.
      </p>

      <div className="mt-12 animate-slide-up-fade [animation-delay:400ms] motion-reduce:animate-none">
        <ProHeroVisual />
      </div>
    </GridSection>
  )
}
