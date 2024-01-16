"use client"

import { generateUserStripe } from '@/actions/generate-user-stripe'
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types"
import { useTransition } from 'react'

interface BillingFormButtonProps {
  plan: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({ year, plan, subscriptionPlan }: BillingFormButtonProps) {
  let [isPending, startTransition] = useTransition();
  const generateUserStripeSession = generateUserStripe.bind(
    null,
    plan.stripeIds[year ? "yearly" : "monthly"]
  );


    // console.log({ subscriptionPlan, offer, year })

  const stripeSessionAction = () => startTransition(async () => await generateUserStripeSession());

  return (
    <Button
      variant="default"
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>
          {subscriptionPlan.stripePriceId === plan.stripeIds[year ? "yearly" : "monthly"]
            ? "Manage Subscription"
            : "Upgrade"}
        </>
      )}
    </Button>
  )
}
