"use client"

import { generateUserStripe, type responseAction } from '@/actions/generate-user-stripe'
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"
import { toast } from "@/components/ui/use-toast"
import { useTransition } from 'react'
import { redirect } from 'next/navigation'

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({ year, offer, subscriptionPlan }: BillingFormButtonProps) {
  let [isPending, startTransition] = useTransition();
  const generateUserStripeSession = generateUserStripe.bind(
    null,
    offer.stripeIds[year ? "yearly" : "monthly"]
  );

  const stripeSessionAction = () => startTransition(async () => {
    const res: responseAction = await generateUserStripeSession();

    if (res.status === "success") redirect(res.stripeUrl as string);

    toast({
      title: "Something went wrong.",
      description: "Your name was not updated. Please try again.",
      variant: "destructive",
    });
  });

  return (
    <Button
      variant="default"
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </>
      ) : (
        <>
          {subscriptionPlan.stripePriceId === offer.stripeIds[year ? "yearly" : "monthly"]
            ? "Manage Subscription"
            : "Upgrade"}
        </>
      )}
    </Button>
  )
}
