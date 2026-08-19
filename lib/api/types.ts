import type { components } from "@/lib/api/generated/schema";

export type LearnerSession = components["schemas"]["Session"];
export type LearnerUser = LearnerSession["user"];

export type ApiMeta = {
  correlationId: string;
  timestamp: string;
};

export type SuccessEnvelope<T> = {
  data: T;
  meta: ApiMeta;
};

export type ErrorEnvelope = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: ApiMeta;
};
