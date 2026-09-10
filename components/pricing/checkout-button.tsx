"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import { createCheckoutSession } from "@/lib/api/commerce";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function CheckoutButton({
  offeringId,
  priceId,
  label = "Buy now",
}: {
  offeringId: string;
  priceId: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const session = await createCheckoutSession({ offeringId, priceId });
      window.location.href = session.authorizationUrl;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent("/pricing")}`);
        return;
      }
      toast({
        title: "Checkout unavailable",
        description:
          error instanceof ApiError ? error.message : "Something went wrong starting checkout.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <Button onClick={onClick} disabled={loading} className="w-full">
      {loading ? "Starting checkout..." : label}
    </Button>
  );
}
