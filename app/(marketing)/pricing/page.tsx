import { PricingCards } from '@/components/pricing-cards';
import { PricingFaq } from '@/components/pricing-faq';
import { getUserAuth } from '@/lib/auth'
import { getUserSubscriptionPlan } from '@/lib/stripe/subscription';

export const metadata = {
  title: "Pricing",
}

export default async function PricingPage() {
  const { session } = await getUserAuth();

  let subscriptionPlan;
  if (session) {
    subscriptionPlan = await getUserSubscriptionPlan()
  }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards subscriptionPlan={subscriptionPlan} />
      <hr className='container' />
      <PricingFaq />
    </div>
  )
}