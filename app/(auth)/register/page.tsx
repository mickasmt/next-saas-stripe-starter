import Link from "next/link"

import { AuthForm } from "@/components/auth/auth-form"
import { siteConfig } from "@/config/site"
import { getSafeRedirect } from "@/lib/auth/redirect"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Sign up",
  path: "/register",
  noIndex: true,
})

// Signing up and logging in are the same request now: an unknown address gets
// an account when it follows the link. The route stays so marketing CTAs can
// keep pointing at a page that says "create an account".
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const redirectTo = getSafeRedirect(next)

  return (
    <>
      <h1 className="mb-2 text-center text-xl font-semibold">
        Create your {siteConfig.name} account
      </h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Continue with Google. Email sign-in comes with Pro.
      </p>

      <AuthForm
        redirectTo={redirectTo}
        googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)}
      />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={
            next ? `/login?next=${encodeURIComponent(redirectTo)}` : "/login"
          }
          className="font-semibold text-foreground hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  )
}
