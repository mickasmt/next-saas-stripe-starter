"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ApiError, apiRequest } from "@/lib/api/client";

export function VerifyEmailState() {
  const searchParams = useSearchParams();
  const started = useRef(false);
  const [state, setState] = useState<
    "waiting" | "verifying" | "verified" | "error"
  >("waiting");
  const [message, setMessage] = useState(
    "Check your inbox and open the verification link.",
  );
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token || started.current) return;
    started.current = true;
    setState("verifying");
    setMessage("Verifying your email address…");
    void apiRequest<{ verified: boolean }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, token }),
    })
      .then(() => {
        setState("verified");
        setMessage("Your email is verified. You can now sign in.");
      })
      .catch((error) => {
        setState("error");
        setMessage(
          error instanceof ApiError
            ? error.message
            : "The verification link is invalid or expired.",
        );
      });
  }, [email, token]);

  return (
    <div className="grid gap-4 text-center">
      <p
        role="status"
        aria-live="polite"
        className="rounded-md border p-4 text-sm"
      >
        {message}
      </p>
      {state === "verified" ? (
        <Link className="underline underline-offset-4" href="/login?verified=1">
          Continue to sign in
        </Link>
      ) : null}
      {state === "error" ? (
        <Link className="underline underline-offset-4" href="/register">
          Create a new account or try again
        </Link>
      ) : null}
    </div>
  );
}
