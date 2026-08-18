"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { ApiError, apiRequest } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormState = "idle" | "submitting" | "success" | "error";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!z.string().email().safeParse(email).success) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setState("submitting");
    setMessage(null);
    try {
      await apiRequest<{ accepted: boolean }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setState("success");
      setMessage(
        "If an eligible account exists, a password reset link has been sent.",
      );
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof ApiError
          ? error.message
          : "The request could not be completed.",
      );
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      {message ? (
        <p role="status" className="rounded-md border p-3 text-sm">
          {message}
        </p>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={state === "submitting" || state === "success"}
        />
      </div>
      <Button
        disabled={state === "submitting" || state === "success"}
        aria-busy={state === "submitting"}
      >
        {state === "submitting" ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 12) {
      setState("error");
      setMessage("Use at least 12 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setState("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (!email || !token) {
      setState("error");
      setMessage("This reset link is incomplete. Request a new one.");
      return;
    }
    setState("submitting");
    setMessage(null);
    try {
      await apiRequest<{ reset: boolean }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, token, password }),
      });
      setState("success");
      setMessage("Password updated. Redirecting to sign in…");
      window.setTimeout(() => router.replace("/login?reset=1"), 900);
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof ApiError
          ? error.message
          : "The password could not be reset.",
      );
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      {message ? (
        <p role="status" className="rounded-md border p-3 text-sm">
          {message}
        </p>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={state === "submitting" || state === "success"}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={state === "submitting" || state === "success"}
        />
      </div>
      <Button
        disabled={state === "submitting" || state === "success"}
        aria-busy={state === "submitting"}
      >
        {state === "submitting" ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
