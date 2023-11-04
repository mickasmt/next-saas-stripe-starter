import * as React from "react"
import { SubscriptionPlan, UserSubscriptionPlan } from "types"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/shared/icons"

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({ year, offer, subscriptionPlan }: BillingFormButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(!isLoading)

    // Get a Stripe session URL.
    const response = await fetch("/api/users/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: offer.stripeIds[year ? "yearly" : "monthly"]
      })
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      })
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage an existing subscription.
    const session = await response.json()
    if (session) {
      window.location.href = session.url
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        {subscriptionPlan.stripePriceId === offer.stripeIds[year ? "yearly" : "monthly"]
          ? "Manage Subscription"
          : "Upgrade"}
      </Button>
    </form>
  )
}
