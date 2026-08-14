import { constructMetadata } from "@/lib/utils";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata = constructMetadata({ title: "Learning track pricing", description: "Choose self-paced or managed-cohort access." });

export default function PricingPage() {
  return <div className="flex w-full flex-col gap-16 py-8"><PricingCards /><hr className="container" /><ComparePlans /><PricingFaq /></div>;
}
