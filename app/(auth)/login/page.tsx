import type { Metadata } from "next"
import Link from "next/link"

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
      <h1 className="mb-8 text-center text-xl font-semibold">
        Log in to your {siteConfig.name} account
      </h1>

      <LoginForm
        redirectTo={redirectTo}
        googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)}
        initialError={error ? "Something went wrong. Please try again." : null}
      />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={
            next
              ? `/register?next=${encodeURIComponent(redirectTo)}`
              : "/register"
          }
          className="font-semibold text-foreground hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  )
}
