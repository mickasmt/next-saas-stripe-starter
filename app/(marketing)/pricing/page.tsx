
import { PricingCards } from '@/components/sections/pricing-cards';
import { PricingFaq } from '@/components/sections/pricing-faq';
import { getCurrentUser } from '@/lib/session';
import { getUserSubscriptionPlan } from '@/lib/subscription';
import { stripe } from "@/lib/stripe"

export const metadata = {
  title: "Pricing",
}

export default async function PricingPage() {
  const user = await getCurrentUser()
  let subscriptionPlan
  let isCanceled = false
  
  if (user) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id)

    // If user has a pro plan, check cancel status on Stripe.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(
        subscriptionPlan.stripeSubscriptionId
      )
      isCanceled = stripePlan.cancel_at_period_end
    }
  }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards userId={user?.id} subscriptionPlan={{
        ...subscriptionPlan,
        isCanceled,
      }} />
      <hr className='container' />
      <PricingFaq />
    </div>
  )
}