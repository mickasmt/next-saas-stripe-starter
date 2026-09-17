import "server-only"

import { unstable_cache } from "next/cache"

import { stripeClient } from "@/lib/stripe"
import { plans, type PlanName } from "@/modules/billing/plans"
import { PRICES_CACHE_TAG } from "@/modules/billing/prices-tag"
import type { PlanPrice, PlanPrices } from "@/modules/billing/pricing"

async function fetchPrice(priceId: string | undefined) {
  if (!priceId) return null
  try {
    const price = await stripeClient.prices.retrieve(priceId)
    if (price.unit_amount === null || !price.recurring) return null
    return {
      amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring.interval as PlanPrice["interval"],
      intervalCount: price.recurring.interval_count,
    } satisfies PlanPrice
  } catch (error) {
    console.error(`Couldn't load Stripe price ${priceId}`, error)
    return null
  }
}

// Prices always come from Stripe, never from the codebase. Cached for 5
// minutes; the Stripe webhook clears the cache as soon as a price changes.
export const getPlanPrices = unstable_cache(
  async (): Promise<PlanPrices> => {
    const entries = await Promise.all(
      plans.map(async (plan) => {
        const [month, year] = await Promise.all([
          fetchPrice(plan.priceId),
          fetchPrice(plan.annualDiscountPriceId),
        ])
        return [plan.name, { month, year }] as const
      })
    )
    return Object.fromEntries(entries) as Record<PlanName, PlanPrices[PlanName]>
  },
  ["plan-prices"],
  { revalidate: 300, tags: [PRICES_CACHE_TAG] }
)
