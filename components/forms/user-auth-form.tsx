"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { env } from "@/env.mjs";
import { ApiError, apiRequest } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLearnerSession } from "@/components/providers/session-provider";
import { Icons } from "@/components/shared/icons";

const schema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(12).max(128),
});

type FormData = z.infer<typeof schema>;

export function UserAuthForm({
  className,
  type = "login",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { type?: "login" | "register" }) {
  const registerMode = type === "register";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useLearnerSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const notice =
    searchParams.get("verified") === "1"
      ? "Email verified. Sign in to continue."
      : searchParams.get("reset") === "1"
        ? "Password updated. Sign in with your new password."
        : null;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    if (registerMode && !data.name?.trim()) {
      setError("name", { message: "Enter your name." });
      return;
    }
    setIsLoading(true);
    setFormError(null);
    try {
      if (registerMode) {
        await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({ ...data, email: data.email.toLowerCase() }),
        });
        toast.success("Check your email", {
          description: "Verify your address before signing in.",
        });
        router.push(
          `/verify-email?email=${encodeURIComponent(data.email.toLowerCase())}`,
        );
      } else {
        await apiRequest("/auth/password-login", {
          method: "POST",
          body: JSON.stringify({
            email: data.email.toLowerCase(),
            password: data.password,
          }),
        });
        await refresh();
        const requestedPath = searchParams.get("from");
        const returnPath =
          requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
            ? requestedPath
            : "/dashboard";
        router.push(returnPath);
        router.refresh();
      }
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Authentication failed.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  function signInWithGoogle() {
    const authOrigin = new URL(env.NEXT_PUBLIC_API_URL).origin;
    const requestedPath = searchParams.get("from");
    const returnPath =
      requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
        ? requestedPath
        : "/dashboard";
    const callbackUrl = new URL(returnPath, env.NEXT_PUBLIC_APP_URL);
    window.location.assign(
      `${authOrigin}/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl.toString())}`,
    );
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        {notice && !registerMode ? (
          <div
            role="status"
            className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm"
          >
            {notice}
          </div>
        ) : null}
        {formError ? (
          <div
            role="alert"
            className="border-destructive/40 bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
          >
            {formError}
          </div>
        ) : null}
        {registerMode ? (
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoComplete="name"
              disabled={isLoading}
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && (
              <p role="alert" className="text-destructive text-xs">
                {errors.name.message}
              </p>
            )}
          </div>
        ) : null}
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="text-destructive text-xs">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={registerMode ? "new-password" : "current-password"}
            disabled={isLoading}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <p role="alert" className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
        {!registerMode ? (
          <div className="text-right">
            <Link
              className="hover:text-primary text-sm underline underline-offset-4"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
        ) : null}
        <button
          className={cn(buttonVariants())}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          {registerMode ? "Create account" : "Sign in"}
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={signInWithGoogle}
        disabled={isLoading}
      >
        <Icons.google className="mr-2 size-4" /> Google
      </button>
    </div>
  );
}
