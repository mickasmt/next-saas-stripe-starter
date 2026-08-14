"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { apiRequest } from "@/lib/api/client";
import type { LearnerSession } from "@/lib/api/types";

type SessionState = {
  data: LearnerSession | null;
  status: "loading" | "authenticated" | "unauthenticated";
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function LearnerSessionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LearnerSession | null>(null);
  const [status, setStatus] = useState<SessionState["status"]>("loading");

  const refresh = useCallback(async () => {
    try {
      const session = await apiRequest<LearnerSession | null>("/auth/session", {
        cache: "no-store",
      });
      setData(session);
      setStatus(session ? "authenticated" : "unauthenticated");
    } catch {
      setData(null);
      setStatus("unauthenticated");
    }
  }, []);

  const signOut = useCallback(async () => {
    await apiRequest<{ signedOut: boolean }>("/auth/logout", { method: "POST" });
    setData(null);
    setStatus("unauthenticated");
    window.location.assign("/");
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <SessionContext.Provider value={{ data, status, refresh, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useLearnerSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useLearnerSession must be used within LearnerSessionProvider");
  return session;
}
