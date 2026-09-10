"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getCheckoutSession, type PaymentStatusDetail } from "@/lib/api/commerce";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20;

export function PaymentStatus({ reference }: { reference: string | null }) {
  const [payment, setPayment] = useState<PaymentStatusDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    let attempts = 0;

    async function poll() {
      try {
        const result = await getCheckoutSession(reference!);
        if (cancelled) return;
        // Genuinely async: gated by a network round-trip and a polling
        // timer, not a synchronous render-cascade the rule is meant to catch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPayment(result);
        attempts += 1;
        if (result.status === "PENDING" && attempts < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) setError("We couldn't find that payment.");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (!reference) {
    return (
      <StatusCard
        icon="close"
        title="Payment not found"
        description="No payment reference was provided."
        action={<BackToPricing />}
      />
    );
  }

  if (error) {
    return <StatusCard icon="close" title="Payment not found" description={error} action={<BackToPricing />} />;
  }

  if (!payment) {
    return (
      <StatusCard
        icon="spinner"
        title="Checking payment status..."
        description="This only takes a moment."
      />
    );
  }

  switch (payment.status) {
    case "PENDING":
      return (
        <StatusCard
          icon="spinner"
          title="Confirming your payment"
          description="Paystack hasn't confirmed this transaction yet. This page will update automatically."
        />
      );
    case "SUCCEEDED":
      return (
        <StatusCard
          icon="check"
          title="Payment successful"
          description="Your access has been granted."
          action={
            <Link href="/dashboard">
              <Button>Go to dashboard</Button>
            </Link>
          }
        />
      );
    case "CANCELLED":
      return (
        <StatusCard
          icon="close"
          title="Checkout expired"
          description="This checkout session expired before payment was completed."
          action={<BackToPricing />}
        />
      );
    case "FAILED":
      return (
        <StatusCard
          icon="close"
          title="Payment failed"
          description="Paystack reported this transaction as unsuccessful. You have not been charged."
          action={<BackToPricing />}
        />
      );
    case "REFUNDED":
    case "CHARGEBACK":
    case "DISPUTED":
      return (
        <StatusCard
          icon="close"
          title="Access no longer active"
          description="This payment's access was reversed. Contact support if you believe this is a mistake."
        />
      );
    default:
      return null;
  }
}

function StatusCard({
  icon,
  title,
  description,
  action,
}: {
  icon: keyof typeof Icons;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  const Icon = Icons[icon];
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-lg border p-10 text-center">
      <Icon className={icon === "spinner" ? "size-10 animate-spin" : "size-10"} />
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

function BackToPricing() {
  return (
    <Link href="/pricing">
      <Button variant="outline">Back to pricing</Button>
    </Link>
  );
}
