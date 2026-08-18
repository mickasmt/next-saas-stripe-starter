import Link from "next/link";

import { ForgotPasswordForm } from "@/components/forms/password-reset-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-muted-foreground text-sm">
          We’ll send a one-hour reset link if the account is eligible.
        </p>
      </div>
      <ForgotPasswordForm />
      <Link
        className="text-center text-sm underline underline-offset-4"
        href="/login"
      >
        Back to sign in
      </Link>
    </div>
  );
}
