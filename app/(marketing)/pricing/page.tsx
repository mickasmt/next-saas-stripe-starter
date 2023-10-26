
import { PricingCards } from '@/components/sections/pricing-cards';
import { PricingFaq } from '@/components/sections/pricing-faq';

export const metadata = {
  title: "Pricing",
}

export default function PricingPage() {
  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards />
      <hr className='container' />
      <PricingFaq />
    </div>
  )
}