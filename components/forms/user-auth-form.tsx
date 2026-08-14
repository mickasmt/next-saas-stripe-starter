"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { env } from "@/env.mjs";
import { ApiError, apiRequest } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";
import { useLearnerSession } from "@/components/providers/session-provider";

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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      if (registerMode) {
        await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({ ...data, email: data.email.toLowerCase() }),
        });
        toast.success("Check your email", {
          description: "Verify your address before signing in.",
        });
        router.push("/login");
      } else {
        await apiRequest("/auth/password-login", {
          method: "POST",
          body: JSON.stringify({ email: data.email.toLowerCase(), password: data.password }),
        });
        await refresh();
        router.push(searchParams.get("from") || "/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  }

  function signInWithGoogle() {
    const authOrigin = new URL(env.NEXT_PUBLIC_API_URL).origin;
    const callbackUrl = new URL(searchParams.get("from") || "/dashboard", env.NEXT_PUBLIC_APP_URL);
    window.location.assign(`${authOrigin}/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl.toString())}`);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        {registerMode ? (
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" autoComplete="name" disabled={isLoading} {...register("name")} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
        ) : null}
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" disabled={isLoading} {...register("email")} />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete={registerMode ? "new-password" : "current-password"} disabled={isLoading} {...register("password")} />
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <button className={cn(buttonVariants())} disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          {registerMode ? "Create account" : "Sign in"}
        </button>
      </form>
      <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div></div>
      <button type="button" className={cn(buttonVariants({ variant: "outline" }))} onClick={signInWithGoogle} disabled={isLoading}>
        <Icons.google className="mr-2 size-4" /> Google
      </button>
    </div>
  );
}
