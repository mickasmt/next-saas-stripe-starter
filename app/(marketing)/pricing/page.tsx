
import { PricingCards } from '@/components/pricing-cards';
import { PricingFaq } from '@/components/pricing-faq';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserSubscriptionPlan } from '@/lib/subscription';
import { currentUser } from '@clerk/nextjs';

export const metadata = {
  title: "Pricing",
}

export default async function PricingPage() {
  // const user = await currentUser();
  // let subscriptionPlan;

  // if (user) {
  //   subscriptionPlan = await getUserSubscriptionPlan(user.id)
  // }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      {/* <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} /> */}
      <hr className='container' />
      <PricingFaq />
    </div>
  )
}