import Link from "next/link"

import { RegisterForm } from "@/components/auth/register-form"
import { siteConfig } from "@/config/site"
import { getSafeRedirect } from "@/lib/auth/redirect"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Sign up",
  path: "/register",
  noIndex: true,
})

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const redirectTo = getSafeRedirect(next)

  return (
    <>
      <h1 className="mb-8 text-center text-xl font-semibold">
        Create your {siteConfig.name} account
      </h1>

      <RegisterForm
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
