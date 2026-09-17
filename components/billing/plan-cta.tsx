"use client"

import Link from "next/link"

import {
  UpgradeButton,
  type Interval,
} from "@/components/billing/upgrade-button"
import type { PlanKey } from "@/components/marketing/pricing/data"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PlanName } from "@/modules/billing/plans"
import type { BillingViewer } from "@/modules/billing/pricing"

export function isCurrentPlan(viewer: BillingViewer, plan: PlanKey) {
  if (!viewer.signedIn) return false
  return plan === "free"
    ? !viewer.subscription
    : viewer.subscription?.plan === plan
}

// A plan's call to action, adapted to the visitor: sign up when signed out,
// then dashboard, upgrade, switch or manage depending on their subscription.
export function PlanCta({
  plan,
  planName,
  interval,
  viewer,
  signedOutLabel,
  compact,
  variant,
  size,
  className,
}: {
  plan: PlanKey
  planName: string
  interval: Interval
  viewer: BillingViewer
  signedOutLabel: string
  // Shorter labels for narrow columns.
  compact?: boolean
  variant: "default" | "outline"
  size: "sm" | "lg"
  className?: string
}) {
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {label}
    </Link>
  )
  const upgrade = (label: string) => (
    <UpgradeButton
      plan={plan as PlanName}
      interval={interval}
      variant={variant}
      size={size}
      className={className}
    >
      {label}
    </UpgradeButton>
  )

  if (!viewer.signedIn) {
    return plan === "free"
      ? link("/register", signedOutLabel)
      : upgrade(signedOutLabel)
  }

  const current = viewer.subscription

  if (plan === "free") {
    // Going back to Free means canceling, which happens in the billing portal.
    return current && viewer.canManage
      ? link("/dashboard/billing", "Manage billing")
      : link("/dashboard", "Go to dashboard")
  }

  if (!viewer.canManage) return link("/dashboard/billing", "View billing")

  if (current?.plan === plan) {
    return current.interval === interval
      ? link("/dashboard/billing", "Manage plan")
      : upgrade(interval === "year" ? "Switch to yearly" : "Switch to monthly")
  }

  if (current) return upgrade(compact ? "Switch plan" : `Switch to ${planName}`)
  return upgrade(compact ? "Upgrade" : `Upgrade to ${planName}`)
}
