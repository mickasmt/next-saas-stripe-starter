import { Check, Minus } from "lucide-react"

import { GridSection } from "@/components/marketing/grid-section"
import { Reveal } from "@/components/marketing/reveal"
import { cn } from "@/lib/utils"

// The case for modules against all-in-one kits. It compares approaches and
// never names another kit.
const approaches = [
  {
    title: "All-in-one kits",
    points: [
      "Every feature is wired into your app from day one",
      "Removing one means tracing its files and imports by hand",
      "Code you never use still ships and still needs upkeep",
    ],
    highlighted: false,
  },
  {
    title: "This starter",
    points: [
      "Switch a module off from the dev panel in one click",
      "Bring it back anytime, nothing is lost",
      "Delete it for good with one command, tested in CI",
    ],
    highlighted: true,
  },
]

export function WhyModular() {
  return (
    <GridSection className="bg-muted/40" innerClassName="py-16 sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-medium text-balance sm:text-4xl">
          Take what you need. Nothing else.
        </h2>
        <p className="mt-3 text-lg text-pretty text-muted-foreground">
          A starter should fit your product, not the other way around.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        {approaches.map((approach, index) => (
          <Reveal
            key={approach.title}
            delay={index * 60}
            className={cn(
              "rounded-2xl p-6 text-left",
              approach.highlighted
                ? "border border-violet-500/30 bg-background shadow-xl ring-4 shadow-violet-500/10 ring-violet-500/10"
                : "border bg-background/60"
            )}
          >
            <h3
              className={cn(
                "font-medium",
                approach.highlighted
                  ? "text-violet-700 dark:text-violet-300"
                  : "text-muted-foreground"
              )}
            >
              {approach.title}
            </h3>
            <ul className="mt-5 grid gap-4 text-sm">
              {approach.points.map((point) => (
                <li key={point} className="flex gap-3">
                  {approach.highlighted ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-violet-600 dark:text-violet-400" />
                  ) : (
                    <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                  )}
                  <span
                    className={cn(
                      !approach.highlighted && "text-muted-foreground"
                    )}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </GridSection>
  )
}
