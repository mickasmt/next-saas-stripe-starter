import Link from "next/link"
import { redirect } from "next/navigation"

import { AuthPanel } from "@/components/auth/auth-panel"
import { GridBackground } from "@/components/shared/grid-background"
import { Logo } from "@/components/shared/logo"
import { siteConfig } from "@/config/site"
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/redirect"
import { getSession } from "@/lib/auth/session"
import { requireFeature } from "@/lib/features/guard"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireFeature("auth")
  if (await getSession()) redirect(DEFAULT_LOGIN_REDIRECT)

  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="relative flex flex-col items-center px-4 py-8">
        <GridBackground />

        <Logo className="relative" />

        <main className="relative flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          {children}
        </main>

        <p className="relative text-center text-xs text-muted-foreground">
          By continuing, you agree to {siteConfig.name}&apos;s{" "}
          <Link
            href={siteConfig.links.terms}
            className="font-medium text-foreground hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href={siteConfig.links.privacy}
            className="font-medium text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>

      <AuthPanel />
    </div>
  )
}
