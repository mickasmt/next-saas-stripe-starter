import { GitFork, Scale, Sparkles, Star } from "lucide-react"
import Link from "next/link"

import { GridSection } from "@/components/marketing/grid-section"
import { getStarterCta } from "@/components/marketing/starter-cta"
import { GitHubIcon } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getGithubRepo } from "@/lib/github"
import { cn } from "@/lib/utils"

// Closes the landing page: the last call to action next to a card of the
// GitHub repository, whose stars and forks are the starter's strongest proof.

export async function ClosingCta() {
  const [repo, cta] = await Promise.all([getGithubRepo(), getStarterCta()])
  const format = new Intl.NumberFormat("en")
  const [owner, name] = new URL(siteConfig.links.github).pathname
    .slice(1)
    .split("/")

  const stats = [
    ...(repo
      ? [
          { icon: Star, label: "Stars", value: format.format(repo.stars) },
          { icon: GitFork, label: "Forks", value: format.format(repo.forks) },
        ]
      : []),
    { icon: Scale, label: "License", value: "MIT" },
  ]

  return (
    <GridSection
      lines
      innerClassName="py-20 sm:py-28"
      background={
        <div className="absolute inset-0 opacity-15 dark:opacity-25">
          <div className="size-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#d946ef)] mask-[linear-gradient(transparent_30%,black)]" />
        </div>
      }
    >
      <div className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,420px)] md:gap-16">
        <div className="text-center md:text-left">
          <h2 className="font-display text-4xl font-medium text-balance sm:text-5xl sm:leading-[1.1]">
            Ship the product, not the plumbing
          </h2>
          <p className="mt-5 text-lg text-pretty text-muted-foreground">
            Start from the free, modular starter today. Add Pro when you want
            onboarding, emails and team billing done for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href={cta.href}
              {...(cta.external && { target: "_blank", rel: "noreferrer" })}
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
              )}
            >
              {cta.label}
            </Link>
            <Link
              href="#pro"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
              )}
            >
              <Sparkles className="text-violet-500" />
              Explore Pro
            </Link>
          </div>
        </div>

        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="group block rounded-2xl border bg-background p-6 text-left shadow-xl shadow-violet-500/10 transition-shadow hover:shadow-2xl hover:shadow-violet-500/15 dark:shadow-black/40"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <GitHubIcon className="size-5" />
            </span>
            <p className="min-w-0 truncate text-sm">
              <span className="text-muted-foreground">{owner} / </span>
              <span className="font-semibold">{name}</span>
            </p>
            <span className="ml-auto rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
              Public
            </span>
          </div>

          <p className="mt-4 text-sm text-pretty text-muted-foreground">
            {siteConfig.description}
          </p>

          <dl
            className="mt-6 grid divide-x rounded-xl border bg-muted/40"
            style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
          >
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="px-3 py-3 text-center">
                <dt className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="size-3.5" />
                  {label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-medium tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#3178c6]" />
              TypeScript
            </span>
            <span className="flex h-8 items-center gap-1.5 rounded-md border bg-background px-3 font-medium text-foreground transition-colors group-hover:bg-muted">
              <Star className="size-3.5 text-amber-500" />
              Star on GitHub
            </span>
          </div>
        </a>
      </div>
    </GridSection>
  )
}
