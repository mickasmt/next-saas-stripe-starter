import * as React from "react"
import { useFormState, useFormStatus } from 'react-dom'

import { generateUserStripe } from '@/actions/generate-user-stripe'
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"
import { toast } from "@/components/ui/use-toast"

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

const initialState = {
  message: null,
}

export function BillingFormButton({ year, offer, subscriptionPlan }: BillingFormButtonProps) {
  const { pending } = useFormStatus();
  const generateUserStripeSession = generateUserStripe.bind(
    null,
    offer.stripeIds[year ? "yearly" : "monthly"]
  );
  const [state, formAction] = useFormState(generateUserStripeSession, initialState)

  if (state?.message) {
    return toast({
      title: "Something went wrong.",
      description: state.message,
      variant: "destructive",
    })
  }

  return (
    <form action={formAction}>
      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={pending}
      >
        {pending && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        {subscriptionPlan.stripePriceId === offer.stripeIds[year ? "yearly" : "monthly"]
          ? "Manage Subscription"
          : "Upgrade"}
      </Button>
    </form>
  )
}
