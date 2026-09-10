import type { components } from "@/lib/api/generated/schema";
import { apiRequest } from "@/lib/api/client";
import { getCsrfHeaders } from "@/lib/api/csrf";

export type TrackSummary = components["schemas"]["TrackSummary"];
export type TrackDetail = components["schemas"]["TrackDetail"];
export type Offering = components["schemas"]["Offering"];
export type CheckoutSession = components["schemas"]["CheckoutSession"];
export type PaymentStatusDetail = components["schemas"]["PaymentStatusDetail"];

export function listTracks() {
  return apiRequest<TrackSummary[]>("/catalog/tracks", { cache: "no-store" });
}

export function getTrack(trackSlug: string) {
  return apiRequest<TrackDetail>(`/catalog/tracks/${encodeURIComponent(trackSlug)}`, {
    cache: "no-store",
  });
}

function idempotencyKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createCheckoutSession(input: {
  offeringId: string;
  priceId: string;
  cohortId?: string | null;
}) {
  return apiRequest<CheckoutSession>("/checkout-sessions", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "Idempotency-Key": idempotencyKey(),
      ...getCsrfHeaders(),
    },
  });
}

export function getCheckoutSession(paymentIdOrReference: string) {
  return apiRequest<PaymentStatusDetail>(
    `/checkout-sessions/${encodeURIComponent(paymentIdOrReference)}`,
    { cache: "no-store" },
  );
}
