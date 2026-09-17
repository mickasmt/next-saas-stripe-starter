"use client"

import { Check, Gift, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { isCurrentPlan, PlanCta } from "@/components/billing/plan-cta"
import { GridSection } from "@/components/marketing/grid-section"
import {
  enterprise,
  plans,
  type Plan,
} from "@/components/marketing/pricing/data"
import { buttonVariants } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { PlanName } from "@/modules/billing/plans"
import {
  formatAmount,
  monthlyAmount,
  yearlySavings,
  yearlySavingsLabel,
  type BillingViewer,
  type PlanPrices,
} from "@/modules/billing/pricing"

// The page header with the billing toggle, then the plan cards. Two bands:
// the header gets its own so the graph paper, which rises from the bottom of
// a band, sits right under the heading. The cards sit in grid cells split by
// the section rails, the way the landing page lays out its feature cards, and
// the Enterprise offer spans the row underneath.

export function PricingPlans({
  intro,
  prices,
  viewer,
}: {
  intro: React.ReactNode
  prices: PlanPrices
  viewer: BillingViewer
}) {
  const [yearly, setYearly] = useState(
    !viewer.signedIn || viewer.subscription?.interval !== "month"
  )
  const savingsLabel = yearlySavingsLabel(prices)
  // Paid plans without a Stripe price can't be bought, so they're not shown.
  const visiblePlans = plans.filter(
    (plan) => plan.key === "free" || prices[plan.key].month
  )

  return (
    <>
      <GridSection
        lines
        innerClassName="pt-16 pb-12"
        background={
          <div className="absolute inset-x-0 top-0 h-full opacity-15 dark:opacity-20">
            <div className="size-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] mask-[linear-gradient(transparent_25%,black)]" />
          </div>
        }
      >
        {intro}
        <div className="mt-10 flex justify-center">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-muted-foreground">
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span>
              Billed yearly
              {savingsLabel && (
                <span className="text-violet-600 dark:text-violet-400">
                  {" "}
                  ({savingsLabel})
                </span>
              )}
            </span>
          </label>
        </div>
      </GridSection>

      <GridSection innerClassName="px-0 sm:px-0">
        <div
          className={cn(
            "grid grid-cols-1 bg-background",
            visiblePlans.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
          )}
        >
          {visiblePlans.map((plan, index) => (
            <PlanCard
              key={plan.key}
              plan={plan}
              prices={plan.key === "free" ? null : prices[plan.key]}
              yearly={yearly}
              viewer={viewer}
              className={cn(
                index > 0 && "max-lg:border-t lg:border-l",
                "border-grid-border"
              )}
            />
          ))}
        </div>

        <EnterpriseRow />
      </GridSection>
    </>
  )
}

const ctaClassName =
  "mt-6 w-full hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"

function PlanCard({
  plan,
  prices,
  yearly,
  viewer,
  className,
}: {
  plan: Plan
  prices: PlanPrices[PlanName] | null
  yearly: boolean
  viewer: BillingViewer
  className?: string
}) {
  const current = isCurrentPlan(viewer, plan.key)
  // Falls back to the monthly price when no yearly price is set in Stripe.
  const stripePrice = prices && ((yearly && prices.year) || prices.month)
  const billedYearly = stripePrice?.interval === "year"
  const price = stripePrice
    ? formatAmount(monthlyAmount(stripePrice), stripePrice.currency)
    : "$0"
  const savings = billedYearly && prices ? yearlySavings(prices) : null

  return (
    <div
      className={cn(
        "relative flex flex-col px-4 py-8 sm:px-8 sm:py-10",
        plan.highlighted && "bg-violet-500/[0.04] dark:bg-violet-500/[0.07]",
        className
      )}
    >
      {plan.highlighted && (
        // Accent along the top edge of the recommended plan.
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#8b5cf6,#d946ef)]"
        />
      )}

      <div className="flex items-center gap-2">
        <h3 className="font-display text-xl font-medium">{plan.name}</h3>
        {current ? (
          <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium">
            Current plan
          </span>
        ) : (
          plan.highlighted && (
            <span className="flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
              <Sparkles className="size-3" />
              Most popular
            </span>
          )
        )}
      </div>
      <p className="mt-1 text-sm text-pretty text-muted-foreground">
        {plan.description}
      </p>

      <div className="mt-6 flex h-11 items-center gap-2.5">
        <p
          // Replays the entrance when the amount changes.
          key={price}
          className="animate-slide-up-fade font-display text-4xl font-medium tracking-tight tabular-nums [--offset:6px] motion-reduce:animate-none"
        >
          {price}
        </p>
        {savings && (
          <span className="flex animate-slide-up-fade items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs font-medium motion-reduce:animate-none">
            <Gift className="size-3.5 text-violet-500" />
            Save {savings}%
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {!stripePrice
          ? "Free forever"
          : billedYearly
            ? "per month, billed yearly"
            : "per month, billed monthly"}
      </p>

      <div>
        <PlanCta
          plan={plan.key}
          planName={plan.name}
          interval={billedYearly ? "year" : "month"}
          viewer={viewer}
          signedOutLabel={plan.cta.label}
          variant={plan.highlighted ? "default" : "outline"}
          size="lg"
          className={ctaClassName}
        />
      </div>

      <p className="mt-8 text-sm font-medium">{plan.featuresTitle}</p>
      <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5">
            <Check
              className={cn(
                "size-3.5 shrink-0",
                plan.highlighted
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-emerald-600 dark:text-emerald-400"
              )}
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function EnterpriseRow() {
  return (
    <div className="grid grid-cols-1 border-t border-grid-border bg-background md:grid-cols-[2fr_3fr]">
      <div className="px-4 py-8 sm:px-8 sm:py-10">
        <h3 className="font-display text-2xl font-medium">
          <span className="bg-[linear-gradient(90deg,#8b5cf6,#d946ef)] bg-clip-text text-transparent">
            {enterprise.name}
          </span>
        </h3>
        <p className="mt-2 text-sm text-pretty text-muted-foreground">
          {enterprise.description}
        </p>
        <Link
          href={enterprise.cta.href}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-6 px-5 hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
          )}
        >
          {enterprise.cta.label}
        </Link>
      </div>
      <ul className="grid grid-cols-1 gap-3 border-grid-border px-4 pb-8 text-sm sm:grid-cols-2 sm:px-8 md:content-center md:border-l md:py-10">
        {enterprise.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 shadow-xs"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
              <Check className="size-3 text-violet-600 dark:text-violet-400" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}
