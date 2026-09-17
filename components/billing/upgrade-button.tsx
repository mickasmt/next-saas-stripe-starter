"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/client"
import type { PlanName } from "@/modules/billing/plans"

export type Interval = "month" | "year"

export function billingHref(plan: PlanName, interval: Interval) {
  return `/dashboard/billing?plan=${plan}&interval=${interval}`
}

// Opens the checkout for the active organization. Signed-out visitors go
// through sign-up first and land back on billing, which resumes the checkout.
export function useUpgrade() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upgrade(plan: PlanName, interval: Interval) {
    setPending(true)
    setError(null)

    const { data: session } = await authClient.getSession()
    if (!session) {
      const next = encodeURIComponent(billingHref(plan, interval))
      router.push(`/register?next=${next}`)
      return
    }

    const { error } = await authClient.subscription.upgrade({
      plan,
      annual: interval === "year",
      customerType: "organization",
      successUrl: "/dashboard/billing?checkout=success",
      cancelUrl: window.location.pathname,
      returnUrl: "/dashboard/billing",
    })

    // On success the client redirects to Stripe, so only errors land here.
    if (error) {
      setError(error.message ?? "Couldn't start the checkout.")
      setPending(false)
    }
  }

  return { upgrade, pending, error }
}

export function UpgradeButton({
  plan,
  interval,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  plan: PlanName
  interval: Interval
}) {
  const { upgrade, pending, error } = useUpgrade()

  return (
    <>
      <Button
        {...props}
        disabled={pending || props.disabled}
        onClick={() => upgrade(plan, interval)}
      >
        {pending ? "Redirecting..." : children}
      </Button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </>
  )
}
