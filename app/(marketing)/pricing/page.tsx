import { constructMetadata } from "@/lib/utils";
import { PricingCards } from "@/components/pricing/pricing-cards";

export const metadata = constructMetadata({
  title: "Learning track pricing",
  description: "Choose self-paced or managed-cohort access.",
});

export default function PricingPage() {
  return (
    <div className="flex w-full flex-col gap-16 py-8">
      <PricingCards />
    </div>
  );
}
