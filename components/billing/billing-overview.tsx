"use client"

import { Check, CircleCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { useUpgrade, type Interval } from "@/components/billing/upgrade-button"
import { SectionCard } from "@/components/dashboard/section-card"
import { plans as pricingPlans } from "@/components/marketing/pricing/data"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"
import type { PlanName } from "@/modules/billing/plans"
import {
  formatAmount,
  monthlyAmount,
  yearlySavingsLabel,
  type PlanPrices,
} from "@/modules/billing/pricing"

type Subscription = {
  plan: PlanName
  status: string
  interval: Interval
  periodEnd: string | null
  // Set when the subscription is scheduled to end.
  cancelAt: string | null
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

function formatDate(value: string | null) {
  return value ? dateFormat.format(new Date(value)) : null
}

export function BillingOverview({
  subscription,
  canManage,
  prices,
  resume,
  checkoutSucceeded,
}: {
  subscription: Subscription | null
  prices: PlanPrices
  canManage: boolean
  resume: { plan: PlanName; interval: Interval } | null
  checkoutSucceeded: boolean
}) {
  const router = useRouter()
  const { upgrade, pending, error } = useUpgrade()
  const [pendingPlan, setPendingPlan] = useState<PlanName | null>(null)
  const [interval, setBillingInterval] = useState<Interval>(
    resume?.interval ?? subscription?.interval ?? "year"
  )
  const [portalPending, setPortalPending] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const resumed = useRef(false)

  const current = pricingPlans.find(
    (plan) => plan.key === (subscription?.plan ?? "free")
  )
  // Plans without a Stripe price can't be bought, so they're not shown.
  const paidPlans = pricingPlans.filter(
    (plan) => plan.key !== "free" && prices[plan.key].month
  )
  const currentPrice = subscription
    ? prices[subscription.plan]?.[subscription.interval]
    : null

  function startCheckout(plan: PlanName, nextInterval: Interval) {
    setPendingPlan(plan)
    upgrade(plan, nextInterval)
  }

  // Picks up the checkout a visitor started from the pricing page before
  // signing up. Runs once, and never over the plan they already have.
  useEffect(() => {
    if (resumed.current || !resume || !canManage) return
    resumed.current = true
    router.replace("/dashboard/billing")
    if (
      subscription?.plan === resume.plan &&
      subscription.interval === resume.interval
    )
      return
    // Deferred: starting it sets state, which effects shouldn't do synchronously.
    setTimeout(() => startCheckout(resume.plan, resume.interval))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Drops ?checkout=success so a reload doesn't show the banner again. Plain
  // history API: the banner stays until the user leaves, with no refetch.
  useEffect(() => {
    if (checkoutSucceeded) {
      window.history.replaceState(null, "", "/dashboard/billing")
    }
  }, [checkoutSucceeded])

  async function openPortal() {
    setPortalPending(true)
    setPortalError(null)
    const { error } = await authClient.subscription.billingPortal({
      customerType: "organization",
      returnUrl: "/dashboard/billing",
    })
    if (error) {
      setPortalError(error.message ?? "Couldn't open the billing portal.")
      setPortalPending(false)
    }
  }

  const renewal = subscription?.cancelAt
    ? `Ends on ${formatDate(subscription.cancelAt)}`
    : subscription?.periodEnd
      ? `Renews on ${formatDate(subscription.periodEnd)}`
      : null

  return (
    <div className="flex flex-col gap-6">
      {checkoutSucceeded && (
        <p className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-400">
          <CircleCheck className="size-4 shrink-0" />
          Thanks! Your subscription is active.
        </p>
      )}
      {(error || portalError) && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
          {error ?? portalError}
        </p>
      )}

      <SectionCard
        title="Current Plan"
        description={
          subscription
            ? "Your organization's subscription. Invoices, payment methods and cancellation live in the billing portal."
            : "Your organization is on the Free plan. Upgrade anytime to unlock more."
        }
        footer={
          <>
            <p>
              {canManage
                ? subscription
                  ? "Changes made in the portal show up here within seconds."
                  : "Payments are processed securely."
                : "Only owners and admins can manage billing."}
            </p>
            {canManage && subscription && (
              <Button
                size="sm"
                className="px-2.5"
                disabled={portalPending}
                onClick={openPortal}
              >
                {portalPending ? "Opening..." : "Manage subscription"}
              </Button>
            )}
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-2xl font-semibold tracking-[-0.04em]">
            {current?.name ?? subscription?.plan}
          </span>
          {subscription && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                subscription.cancelAt
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              )}
            >
              {subscription.cancelAt
                ? "Canceling"
                : subscription.status === "trialing"
                  ? "Trial"
                  : "Active"}
            </span>
          )}
          {subscription && (
            <span className="text-muted-foreground">
              {currentPrice
                ? `${formatAmount(currentPrice.amount, currentPrice.currency)} / ${subscription.interval}`
                : `Billed ${subscription.interval === "year" ? "yearly" : "monthly"}`}
              {renewal && ` · ${renewal}`}
            </span>
          )}
        </div>
      </SectionCard>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Plans</h2>
            <p className="mt-1 text-muted-foreground">
              Upgrades apply right away, with a prorated charge.
            </p>
          </div>
          <IntervalToggle
            value={interval}
            onChange={setBillingInterval}
            savingsLabel={yearlySavingsLabel(prices)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {paidPlans.map((plan) => {
            const key = plan.key as PlanName
            const isCurrent =
              subscription?.plan === key && subscription.interval === interval
            const price = prices[key][interval]

            return (
              <div
                key={plan.key}
                className={cn(
                  "flex flex-col rounded-lg border bg-card p-5",
                  isCurrent && "ring-1 ring-foreground/40"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{plan.name}</h3>
                  {isCurrent && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Current plan
                    </span>
                  )}
                </div>
                <p className="mt-1 text-muted-foreground">{plan.description}</p>
                {price ? (
                  <p className="mt-4">
                    <span className="text-3xl font-semibold tracking-[-0.04em] tabular-nums">
                      {formatAmount(monthlyAmount(price), price.currency)}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      / month
                      {interval === "year"
                        ? `, ${formatAmount(price.amount, price.currency)} billed yearly`
                        : ""}
                    </span>
                  </p>
                ) : (
                  <p className="mt-4 text-muted-foreground">
                    Not available with {interval}ly billing.
                  </p>
                )}
                <ul className="mt-4 flex flex-1 flex-col gap-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-muted-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {canManage && (
                  <Button
                    className="mt-5 w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || pending || !price}
                    onClick={() => startCheckout(key, interval)}
                  >
                    {pending && pendingPlan === key
                      ? "Redirecting..."
                      : isCurrent
                        ? "Current plan"
                        : subscription
                          ? `Switch to ${plan.name}`
                          : `Upgrade to ${plan.name}`}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function IntervalToggle({
  value,
  onChange,
  savingsLabel,
}: {
  value: Interval
  onChange: (value: Interval) => void
  savingsLabel: string | null
}) {
  const options: { value: Interval; label: React.ReactNode }[] = [
    { value: "month", label: "Monthly" },
    {
      value: "year",
      label: (
        <>
          Yearly
          {savingsLabel && (
            <span className="text-muted-foreground"> ({savingsLabel})</span>
          )}
        </>
      ),
    },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Billing interval"
      className="flex rounded-lg bg-card p-1 ring-1 ring-input"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-7 rounded-md px-3 font-medium text-muted-foreground transition-colors hover:text-foreground",
            value === option.value && "bg-accent text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
