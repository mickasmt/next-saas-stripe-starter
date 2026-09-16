import { Scale, Sparkles, Star } from "lucide-react"
import Link from "next/link"

import { GridSection } from "@/components/marketing/grid-section"
import { getStarterCta } from "@/components/marketing/starter-cta"
import { formatStars, getGithubStars } from "@/lib/github"

// The dark band that closes the landing page, adapted from dub.co's 2025 one:
// a notch hanging from the section above, graph paper, a soft color glow and
// the two calls to action.

export async function ClosingCta() {
  const [count, cta] = await Promise.all([getGithubStars(), getStarterCta()])

  const proof = [
    {
      icon: Star,
      label: count ? `${formatStars(count)} stars on GitHub` : "Open source",
    },
    { icon: Scale, label: "MIT licensed" },
  ]

  return (
    <>
      {/* Empty band so the notch hangs from plain page background. */}
      <GridSection className="border-b-0" innerClassName="h-12">
        {null}
      </GridSection>
      <section className="relative overflow-hidden bg-neutral-900 px-4 dark:bg-neutral-950">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        >
          <div className="absolute -inset-10 bg-[conic-gradient(from_-81deg,#3A8BFD_-72deg,#855AFC_33deg,#F00_70deg,#EAB308_136deg,#5CFF80_214deg,#00FFF9_259deg,#3A8BFD_288deg,#855AFC_393deg)] blur-[30px]" />
        </div>

        <div className="relative mx-auto max-w-grid-width">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 border-x border-white/5 mask-[linear-gradient(black,transparent)]" />
            <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2">
              <div className="absolute inset-0 grid-lines mask-[linear-gradient(black,transparent),radial-gradient(black,transparent)] [mask-composite:intersect] text-white/15" />
            </div>
          </div>

          {/* Notch: the page background hanging into the band. */}
          <div
            aria-hidden
            className="relative mx-auto flex h-8 max-w-screen-sm -translate-y-px items-start justify-center text-background sm:h-16"
          >
            <NotchCorner />
            <div className="h-[calc(100%+1px)] grow bg-current" />
            <NotchCorner className="-scale-x-100" />
          </div>

          <div className="relative flex flex-col items-center px-4 pt-24 pb-32 text-center">
            <h2 className="max-w-lg font-display text-4xl font-medium text-balance text-neutral-50 sm:text-5xl">
              Ship the product, not the plumbing
            </h2>
            <p className="mt-6 max-w-[560px] text-lg font-medium text-pretty text-neutral-400 sm:text-xl">
              Start from the free, modular starter today. Add Pro when you want
              onboarding, emails and team billing done for you.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={cta.href}
                {...(cta.external && { target: "_blank", rel: "noreferrer" })}
                className="flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 ring-white/20 transition-all hover:ring"
              >
                {cta.label}
              </Link>
              <Link
                href="#pro"
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-transparent bg-white/20 px-5 text-sm font-medium text-white ring-white/10 backdrop-blur-sm transition-all hover:ring"
              >
                <Sparkles className="size-4 text-violet-300" />
                Explore Pro
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-8">
              {proof.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-sm text-white/85"
                >
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/15">
                    <Icon className="size-3 text-white" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

function NotchCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 85 64"
      fill="none"
      className={`h-full w-auto shrink-0 translate-y-px overflow-visible ${className ?? "translate-x-px"}`}
    >
      <rect y="-1" width="85" height="1" fill="currentColor" />
      <path
        d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
        fill="currentColor"
      />
    </svg>
  )
}
