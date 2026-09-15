import type { Metadata } from "next"

import { AuthHeader } from "@/components/auth/auth-header"
import { LoginForm } from "@/components/auth/login-form"
import { siteConfig } from "@/config/site"
import { getSafeRedirect } from "@/lib/auth/redirect"

export const metadata: Metadata = {
  title: `Log in | ${siteConfig.name}`,
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams
  const redirectTo = getSafeRedirect(next)

  return (
    <>
      <AuthHeader
        prompt="Don't have an account?"
        href={
          next
            ? `/register?next=${encodeURIComponent(redirectTo)}`
            : "/register"
        }
        action="Sign up"
      />

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Log in to your {siteConfig.name} account
          </p>
        </div>

        <LoginForm
          redirectTo={redirectTo}
          googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)}
          initialError={
            error ? "Something went wrong. Please try again." : null
          }
        />
      </main>
    </>
  )
}
