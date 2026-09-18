import Link from "next/link"

import { GridSection } from "@/components/marketing/grid-section"
import { contactHref } from "@/components/marketing/pricing/data"
import { PricingComparison } from "@/components/marketing/pricing/pricing-comparison"
import { PricingFaq } from "@/components/marketing/pricing/pricing-faq"
import { PricingPlans } from "@/components/marketing/pricing/pricing-plans"
import { buttonVariants } from "@/components/ui/button"
import { requireFeature } from "@/lib/features/guard"
import { buildMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"
import { getPlanPrices } from "@/modules/billing/prices"
import { getBillingViewer } from "@/modules/billing/viewer"

export const metadata = buildMetadata({
  title: "Pricing",
  description: "Plans for every stage, from side project to enterprise.",
  path: "/pricing",
})

export default async function PricingPage() {
  await requireFeature("billing")
  const [prices, viewer] = await Promise.all([
    getPlanPrices(),
    getBillingViewer(),
  ])

  return (
    <>
      <PricingPlans
        prices={prices}
        viewer={viewer}
        intro={
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <h1 className="animate-slide-up-fade font-display text-4xl font-medium text-balance [--offset:20px] motion-reduce:animate-none sm:text-5xl sm:leading-[1.15]">
              Simple pricing that grows with you
            </h1>
            <p className="mt-5 animate-slide-up-fade text-base text-balance text-muted-foreground [animation-delay:100ms] motion-reduce:animate-none sm:text-lg">
              Pick a plan for where you are today.{" "}
              <br className="hidden sm:block" />
              Start for free, no credit card required.
            </p>
          </div>
        }
      />

      <GridSection innerClassName="px-0 sm:px-0">
        <PricingComparison prices={prices} viewer={viewer} />
      </GridSection>

      <GridSection innerClassName="px-0 sm:px-0">
        <PricingFaq />
      </GridSection>

      <GridSection
        lines
        innerClassName="py-20"
        background={
          <div className="absolute inset-0 opacity-15 dark:opacity-25">
            <div className="size-full bg-[linear-gradient(90deg,#8b5cf6,#d946ef)] mask-[linear-gradient(transparent_30%,black)]" />
          </div>
        }
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-md font-display text-3xl font-medium text-balance sm:text-4xl">
            Start free, upgrade when you&apos;re ready
          </h2>
          <p className="mt-3 max-w-md text-pretty text-muted-foreground">
            Your data and settings carry over to every plan.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={viewer.signedIn ? "/dashboard" : "/register"}
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
              )}
            >
              {viewer.signedIn ? "Go to dashboard" : "Start for free"}
            </Link>
            <Link
              href={contactHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
              )}
            >
              Contact sales
            </Link>
          </div>
        </div>
      </GridSection>
    </>
  )
}
