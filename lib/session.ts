import "server-only";

import { cache } from "react";
import { auth } from "@/auth";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});