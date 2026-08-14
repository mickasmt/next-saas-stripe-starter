export type LearnerUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  permissions?: string[];
};

export type LearnerSession = {
  user: LearnerUser;
  expiresAt: string;
};

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
