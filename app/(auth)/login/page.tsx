import Link from "next/link"

import { AuthForm } from "@/components/auth/auth-form"
import { siteConfig } from "@/config/site"
import { getSafeRedirect } from "@/lib/auth/redirect"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Log in",
  path: "/login",
  noIndex: true,
})

// Better Auth redirects a link that has expired or was already spent back
// here, with the reason in `?error=`.
function describeError(error?: string) {
  if (!error) return null
  if (error === "INVALID_TOKEN") {
    return "That link has expired or was already used. Ask for a new one."
  }
  return "Something went wrong. Please try again."
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
      <h1 className="mb-2 text-center text-xl font-semibold">
        Log in to your {siteConfig.name} account
      </h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Continue with Google. Email sign-in comes with Pro.
      </p>

      <AuthForm
        redirectTo={redirectTo}
        googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)}
        initialError={describeError(error)}
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
