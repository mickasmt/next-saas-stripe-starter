import { Suspense } from "react";

import { VerifyEmailState } from "@/components/forms/verify-email-state";

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-muted-foreground text-sm">
          Email verification is required before password sign-in.
        </p>
      </div>
      <Suspense fallback={<p role="status">Loading verification state…</p>}>
        <VerifyEmailState />
      </Suspense>
    </div>
  );
}
