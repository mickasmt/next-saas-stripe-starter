import type { Metadata } from "next"

import { AuthHeader } from "@/components/auth/auth-header"
import { RegisterForm } from "@/components/auth/register-form"
import { siteConfig } from "@/config/site"
import { getSafeRedirect } from "@/lib/auth/redirect"

export const metadata: Metadata = {
  title: `Sign up | ${siteConfig.name}`,
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const redirectTo = getSafeRedirect(next)

  return (
    <>
      <AuthHeader
        prompt="Already have an account?"
        href={next ? `/login?next=${encodeURIComponent(redirectTo)}` : "/login"}
        action="Log in"
      />

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Get started with {siteConfig.name} in minutes
          </p>
        </div>

        <RegisterForm
          redirectTo={redirectTo}
          googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)}
        />
      </main>
    </>
  )
}
