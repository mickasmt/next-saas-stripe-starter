import { ArrowUpRight, Sparkles } from "lucide-react"
import Link from "next/link"

import { GridSection } from "@/components/marketing/grid-section"
import { ModuleDeck } from "@/components/marketing/module-deck"
import { getStarterCta } from "@/components/marketing/starter-cta"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getAppMode } from "@/lib/app-mode"
import { formatStars, getGithubStars } from "@/lib/github"
import { cn } from "@/lib/utils"

// Same component on both deployments: only the copy changes with the mode.
// Edit `heroContent.pro` to match what the Pro repo actually ships.
const heroContent = {
  free: {
    badge: "Open source on GitHub",
    title: (
      <>
        One starter. <br className="hidden sm:block" />
        Any project.
      </>
    ),
    subtitle: (
      <>
        A modular Next.js foundation. <br className="hidden sm:block" />
        Begin with a blog, end up with a SaaS.
      </>
    ),
  },
  pro: {
    badge: "SaaS Starter Pro",
    title: (
      <>
        The weeks of polish. <br className="hidden sm:block" />
        Already done.
      </>
    ),
    subtitle: (
      <>
        Onboarding, emails, team billing and more. <br className="hidden sm:block" />
        Try the demo, then decide.
      </>
    ),
  },
}

export async function HeroStarter() {
  const mode = getAppMode()
  const content = heroContent[mode]
  const count = mode === "free" ? await getGithubStars() : null
  const stars = count ? formatStars(count) : null
  const cta = await getStarterCta()

  return (
    <GridSection
      lines
      innerClassName="pt-16 pb-8"
      background={
        // Wash rising with the grid, between the rails only. Same colors as
        // the closing CTA's wash for a consistent hue across the page.
        <div className="absolute top-0 -left-1/4 h-full w-[150%] opacity-15 dark:opacity-25">
          <div className="size-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#d946ef)] mask-[linear-gradient(transparent_25%,black)]" />
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        {mode === "free" ? (
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="group flex animate-slide-up-fade divide-neutral-300 rounded-full border border-neutral-300 bg-background text-xs font-medium drop-shadow-sm transition-colors hover:bg-muted motion-reduce:animate-none sm:divide-x dark:divide-border dark:border-border"
          >
            <span className="py-1.5 pl-4 sm:pr-2.5">
              {stars ? `${stars} stars on GitHub` : content.badge}
            </span>
            <span className="flex items-center gap-1.5 p-1.5 pl-2.5 text-muted-foreground">
              <span className="hidden sm:block">Star us</span>
              <span className="rounded-full bg-muted p-0.5">
                <ArrowUpRight className="size-2.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
              </span>
            </span>
          </a>
        ) : (
          <span className="flex animate-slide-up-fade items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-700 motion-reduce:animate-none dark:text-violet-300">
            <Sparkles className="size-3.5" />
            {content.badge}
          </span>
        )}

        <h1 className="mt-5 animate-slide-up-fade font-display text-4xl font-medium text-balance [--offset:20px] [animation-delay:100ms] motion-reduce:animate-none sm:text-5xl sm:leading-[1.15]">
          {content.title}
        </h1>

        <p className="mt-5 animate-slide-up-fade text-base text-balance text-muted-foreground [animation-delay:200ms] motion-reduce:animate-none sm:text-xl">
          {content.subtitle}
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-fit animate-slide-up-fade gap-4 [--offset:5px] [animation-delay:300ms] motion-reduce:animate-none">
        <Link
          href={cta.href}
          {...(cta.external && { target: "_blank", rel: "noreferrer" })}
          className={cn(
            buttonVariants({ size: "lg" }),
            "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
          )}
        >
          {mode === "pro" ? "Try Pro Demo" : cta.label}
        </Link>
        <Link
          href={mode === "pro" ? siteConfig.links.pro : "#pro"}
          {...(mode === "pro" && { target: "_blank", rel: "noreferrer" })}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
          )}
        >
          <Sparkles className="text-violet-500" />
          {mode === "pro" ? "Buy Pro" : "Explore Pro"}
        </Link>
      </div>

      <div className="mt-12 animate-slide-up-fade [animation-delay:400ms] motion-reduce:animate-none">
        <ModuleDeck />
      </div>
    </GridSection>
  )
}
