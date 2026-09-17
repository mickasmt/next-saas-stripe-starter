import type { PlanName } from "@/modules/billing/plans"

export type PlanPrice = {
  // Smallest currency unit (cents), as Stripe returns it.
  amount: number
  currency: string
  interval: "day" | "week" | "month" | "year"
  intervalCount: number
}

export type PlanPrices = Record<
  PlanName,
  { month: PlanPrice | null; year: PlanPrice | null }
>

export function formatAmount(amount: number, currency: string) {
  const value = amount / 100
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// What the price costs per month, e.g. a yearly price divided by 12.
export function monthlyAmount(price: PlanPrice) {
  const months =
    price.interval === "year"
      ? 12 * price.intervalCount
      : price.interval === "month"
        ? price.intervalCount
        : null
  return months ? Math.round(price.amount / months) : price.amount
}

// Percentage saved by paying yearly, or null when there's no saving.
export function yearlySavings(prices: PlanPrices[PlanName]) {
  if (!prices.month || !prices.year) return null
  const monthly = monthlyAmount(prices.month)
  if (monthly === 0) return null
  const percent = Math.round((1 - monthlyAmount(prices.year) / monthly) * 100)
  return percent > 0 ? percent : null
}

// Label for the yearly toggle, e.g. "save 20%" or "save up to 25%".
export function yearlySavingsLabel(prices: PlanPrices) {
  const savings = [
    ...new Set(
      Object.values(prices)
        .map(yearlySavings)
        .filter((percent): percent is number => percent !== null)
    ),
  ]
  if (!savings.length) return null
  return savings.length === 1
    ? `save ${savings[0]}%`
    : `save up to ${Math.max(...savings)}%`
}

// Who is looking at the pricing page, so its buttons match their situation.
export type BillingViewer =
  | { signedIn: false }
  | {
      signedIn: true
      canManage: boolean
      subscription: { plan: PlanName; interval: "month" | "year" } | null
    }
