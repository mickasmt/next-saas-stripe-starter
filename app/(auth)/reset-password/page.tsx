import { Suspense } from "react";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/forms/password-reset-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Choose a new password</h1>
        <p className="text-muted-foreground text-sm">
          Your other sessions will be signed out after the password changes.
        </p>
      </div>
      <Suspense fallback={<p role="status">Loading reset form…</p>}>
        <ResetPasswordForm />
      </Suspense>
      <Link
        className="text-center text-sm underline underline-offset-4"
        href="/login"
      >
        Back to sign in
      </Link>
    </div>
  );
}
