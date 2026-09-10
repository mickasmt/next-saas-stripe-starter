import { getTrack, listTracks } from "@/lib/api/commerce";
import { CheckoutButton } from "@/components/pricing/checkout-button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const NGN_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatSubunits(amount: number) {
  return NGN_FORMATTER.format(amount / 100);
}

const OFFERING_COPY: Record<string, { label: string; benefits: string[] }> = {
  SELF_PACED: {
    label: "Self-paced track",
    benefits: [
      "Permanent access, learn at your own pace",
      "Quizzes, projects, and mastery checks",
      "Certificate eligibility on completion",
    ],
  },
  MANAGED_COHORT: {
    label: "Managed cohort",
    benefits: [
      "Everything in self-paced",
      "Scheduled releases, deadlines, and live sessions",
      "Facilitator support and attendance tracking",
    ],
  },
};

export async function PricingCards() {
  const tracks = await listTracks().catch(() => []);
  const track = tracks[0] ? await getTrack(tracks[0].slug).catch(() => null) : null;

  if (!track || track.offerings.length === 0) {
    return (
      <MaxWidthWrapper>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No offerings published yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Check back soon, or contact us if you were expecting to see pricing here.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center">
        <HeaderSection label="Pricing" title={`Choose how you want to learn ${track.title}`} />
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Prices are published in NGN. USD remains disabled for Phase 1.
        </p>
        <div className="grid gap-5 bg-inherit py-10 lg:grid-cols-2">
          {track.offerings.map((offering) => {
            const price = offering.prices.find((p) => p.enabled) ?? offering.prices[0];
            const copy = OFFERING_COPY[offering.kind] ?? { label: offering.title, benefits: [] };
            return (
              <div
                key={offering.id}
                className="flex flex-col overflow-hidden rounded-3xl border text-left shadow-sm"
              >
                <div className="space-y-3 bg-muted/50 p-6">
                  <p className="font-urban text-sm font-bold uppercase tracking-wider">
                    {copy.label}
                  </p>
                  <p className="text-3xl font-bold">
                    {price ? formatSubunits(price.amount) : "Unavailable"}
                  </p>
                </div>
                <div className="flex h-full flex-col justify-between gap-8 p-6">
                  <ul className="space-y-2 text-sm">
                    {copy.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                  {price && offering.kind === "SELF_PACED" ? (
                    <CheckoutButton offeringId={offering.id} priceId={price.id} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Cohort enrollment opens per schedule - contact us to join the next intake.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
