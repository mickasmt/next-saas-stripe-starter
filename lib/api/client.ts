import { env } from "@/env.mjs";
export { LMS_API_CONTRACT_VERSION } from "@/lib/api/generated/version";
import type { ErrorEnvelope, SuccessEnvelope } from "@/lib/api/types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly correlationId?: string,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const body = (await response.json()) as SuccessEnvelope<T> | ErrorEnvelope;
  if (!response.ok || "error" in body) {
    const error = "error" in body ? body.error : undefined;
    throw new ApiError(
      response.status,
      error?.code ?? "INTERNAL_ERROR",
      error?.message ?? "The LMS API request failed.",
      body.meta?.correlationId,
    );
  }

  return body.data;
}
