import { constructMetadata } from "@/lib/utils";
import { PaymentStatus } from "@/components/payment/payment-status";

export const metadata = constructMetadata({
  title: "Payment status",
  description: "Confirming your checkout with Paystack.",
});

export default async function PaymentCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref ?? null;

  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <PaymentStatus reference={reference} />
    </div>
  );
}
