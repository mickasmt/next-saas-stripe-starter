import "server-only"
import { and, desc, eq, inArray } from "drizzle-orm"

import { db } from "@/lib/db"
import { subscription as subscriptionTable } from "@/lib/db/schema"
import { stripeClient } from "@/lib/stripe"
import { plans } from "@/modules/billing/plans"

type SubscriptionRow = typeof subscriptionTable.$inferSelect

// Loose enough to accept both a drizzle row and the shape better-auth's
// `listActiveSubscriptions` returns (same fields, some typed as optional
// rather than nullable).
type SubscriptionLike = {
  id: string
  plan: string
  status: string
  stripeSubscriptionId?: string | null
  billingInterval?: string | null
  periodStart?: Date | null
  periodEnd?: Date | null
  cancelAtPeriodEnd?: boolean | null
  cancelAt?: Date | null
  canceledAt?: Date | null
}

const ENDED_STATUSES = ["canceled", "incomplete_expired"]

function planForPriceId(priceId: string | undefined) {
  if (!priceId) return undefined
  return plans.find(
    (plan) => plan.priceId === priceId || plan.annualDiscountPriceId === priceId
  )
}

function sameTime(a: Date | null | undefined, b: Date | null | undefined) {
  return (a?.getTime() ?? null) === (b?.getTime() ?? null)
}

// The billing portal's plan-switch flow needs the customer to confirm on a
// Stripe-hosted page, and cancellations land through a webhook — both can
// leave our row stale if the event is slow or missed. Reconciling against
// Stripe's live subscription on every billing page load means the UI never
// gets stuck showing the old plan or hiding a cancellation.
export async function reconcileSubscription<T extends SubscriptionLike>(
  row: T
): Promise<T> {
  if (!row.stripeSubscriptionId) return row

  const live = await stripeClient.subscriptions
    .retrieve(row.stripeSubscriptionId)
    .catch(() => null)
  if (!live) return row

  const item = live.items.data.find((item) => planForPriceId(item.price.id))
  const plan = item ? planForPriceId(item.price.id) : undefined

  const updates: Partial<SubscriptionRow> = {}
  if (plan && plan.name !== row.plan) updates.plan = plan.name
  if (live.status !== row.status) updates.status = live.status
  if (item) {
    const interval = item.price.recurring?.interval ?? null
    if (interval !== row.billingInterval) updates.billingInterval = interval
    const periodStart = new Date(item.current_period_start * 1000)
    if (!sameTime(row.periodStart, periodStart)) updates.periodStart = periodStart
    const periodEnd = new Date(item.current_period_end * 1000)
    if (!sameTime(row.periodEnd, periodEnd)) updates.periodEnd = periodEnd
  }
  if (live.cancel_at_period_end !== !!row.cancelAtPeriodEnd)
    updates.cancelAtPeriodEnd = live.cancel_at_period_end
  const cancelAt = live.cancel_at ? new Date(live.cancel_at * 1000) : null
  if (!sameTime(row.cancelAt, cancelAt)) updates.cancelAt = cancelAt
  const canceledAt = live.canceled_at ? new Date(live.canceled_at * 1000) : null
  if (!sameTime(row.canceledAt, canceledAt)) updates.canceledAt = canceledAt

  if (Object.keys(updates).length === 0) return row

  await db
    .update(subscriptionTable)
    .set(updates)
    .where(eq(subscriptionTable.id, row.id))

  return { ...row, ...updates }
}

// No active subscription left, but the org may have just canceled one —
// surfaced on the billing page so cancellation isn't a silent no-op.
export async function getLastEndedSubscription(organizationId: string) {
  const [row] = await db
    .select()
    .from(subscriptionTable)
    .where(
      and(
        eq(subscriptionTable.referenceId, organizationId),
        inArray(subscriptionTable.status, ENDED_STATUSES)
      )
    )
    .orderBy(desc(subscriptionTable.canceledAt))
    .limit(1)

  return row ?? null
}
