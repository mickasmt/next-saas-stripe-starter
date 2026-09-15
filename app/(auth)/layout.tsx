import Link from "next/link"
import { redirect } from "next/navigation"

import { AuthPanel } from "@/components/auth/auth-panel"
import { siteConfig } from "@/config/site"
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/redirect"
import { getSession } from "@/lib/auth/session"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (await getSession()) redirect(DEFAULT_LOGIN_REDIRECT)

  return (
    <div className="grid min-h-svh gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-3 py-3 sm:px-6">
        {children}

        <p className="mx-auto max-w-xs text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
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
          .
        </p>
      </div>

      <AuthPanel />
    </div>
  )
}
