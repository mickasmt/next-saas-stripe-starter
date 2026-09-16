import { ArrowUpRight, Sparkles } from "lucide-react"
import Link from "next/link"

import { GetStartedCard } from "@/components/marketing/get-started-card"
import { GridSection } from "@/components/marketing/grid-section"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { formatStars, getGithubStars } from "@/lib/github"
import { cn } from "@/lib/utils"

export async function HeroStarter() {
  const count = await getGithubStars()
  const stars = count ? formatStars(count) : null

  return (
    <GridSection lines innerClassName="pt-20 pb-12">
      {/* Wash rising with the grid, so the band is not flat white. A single
          two-stop gradient, unblurred: blurring several hues goes blotchy. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 top-0 -bottom-12 -z-1 overflow-hidden sm:-inset-x-12"
      >
        <div className="absolute -left-1/4 top-0 h-full w-[150%] opacity-15 dark:opacity-25">
          <div className="size-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] mask-[linear-gradient(transparent_25%,black)]" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="group flex animate-slide-up-fade divide-neutral-300 rounded-full border border-neutral-300 bg-background text-xs font-medium drop-shadow-sm transition-colors hover:bg-muted motion-reduce:animate-none sm:divide-x dark:divide-border dark:border-border"
        >
          <span className="py-1.5 pl-4 sm:pr-2.5">
            {stars ? `${stars} stars on GitHub` : "Open source on GitHub"}
          </span>
          <span className="flex items-center gap-1.5 p-1.5 pl-2.5 text-muted-foreground">
            <span className="hidden sm:block">Star us</span>
            <span className="rounded-full bg-muted p-0.5">
              <ArrowUpRight className="size-2.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
            </span>
          </span>
        </a>

        <h1 className="mt-5 animate-slide-up-fade font-display text-4xl font-medium text-balance [--offset:20px] [animation-delay:100ms] motion-reduce:animate-none sm:text-5xl sm:leading-[1.15]">
          The foundation for your next product
        </h1>

        <p className="mt-5 animate-slide-up-fade text-base text-balance text-muted-foreground [animation-delay:200ms] motion-reduce:animate-none sm:text-xl">
          Authentication, database, billing, roles, admin and more — ready to
          plug in when you need them. Build once. Evolve without starting over.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-fit animate-slide-up-fade gap-4 [--offset:5px] [animation-delay:300ms] motion-reduce:animate-none">
        <Link
          href="/register"
          className={cn(
            buttonVariants({ size: "lg" }),
            "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
          )}
        >
          Start for free
        </Link>
        <Link
          href={siteConfig.links.pricing}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
          )}
        >
          <Sparkles className="text-amber-500" />
          Explore Pro
        </Link>
      </div>

      <div className="mt-16 animate-slide-up-fade [animation-delay:400ms] motion-reduce:animate-none">
        <GetStartedCard stars={stars} />
      </div>
    </GridSection>
  )
}
