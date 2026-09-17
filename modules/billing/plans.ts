import type { StripePlan } from "@better-auth/stripe"

// Plans are resolved server-side from their name. Never trust a priceId or an
// amount sent by the client (see CVE-2026-4547 on the v1 starter).
export const plans = [
  {
    name: "pro",
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    annualDiscountPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  },
  {
    name: "business",
    priceId: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    annualDiscountPriceId: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID,
  },
] satisfies StripePlan[]

export type PlanName = (typeof plans)[number]["name"]

// Platform admins get this plan without a subscription.
export const adminPlan: PlanName = "business"
