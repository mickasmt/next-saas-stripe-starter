import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { apiRequest } from "@/lib/api/client";
import type { LearnerSession } from "@/lib/api/types";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  try {
    const session = await apiRequest<LearnerSession | null>("/auth/session", {
      cache: "no-store",
      headers: { cookie: cookieStore.toString() },
    });
    return session?.user;
  } catch {
    return undefined;
  }
});
