"use client"

import {
  AuthDivider,
  AuthField,
  GoogleButton,
  SubmitButton,
} from "@/components/auth/auth-ui"

// Email sign-in (magic link) ships with Pro. The field below is only a
// preview: there is no handler, and the server registers no email sign-in
// endpoint, so removing `disabled` in the browser does nothing.
export function AuthForm({
  redirectTo,
  googleEnabled,
  initialError,
}: {
  redirectTo: string
  googleEnabled: boolean
  initialError?: string | null
}) {
  return (
    <div className="grid gap-4">
      <form onSubmit={(event) => event.preventDefault()} className="grid gap-4">
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@company.com"
          autoComplete="email"
          disabled
        />

        <p className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-700 dark:text-violet-300">
          Magic link sign-in is a Pro feature. Use Google to try the app.
        </p>

        {initialError && (
          <p className="text-sm text-destructive">{initialError}</p>
        )}

        <SubmitButton pending={false} disabled>
          Log in with email
        </SubmitButton>
      </form>

      {googleEnabled && (
        <>
          <AuthDivider />
          <GoogleButton redirectTo={redirectTo} onError={() => {}} />
        </>
      )}
    </div>
  )
}
