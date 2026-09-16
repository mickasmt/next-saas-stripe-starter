import Link from "next/link"

import { SiteHeaderBackdrop } from "@/components/marketing/site-header-backdrop"
import { Logo } from "@/components/shared/logo"
import { buttonVariants } from "@/components/ui/button"
import type { FeatureKey } from "@/config/features"
import { siteConfig } from "@/config/site"
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/redirect"
import { getSession } from "@/lib/auth/session"
import { getFeatures } from "@/lib/features/resolve"
import { cn } from "@/lib/utils"

// `feature`: hidden while this flag is off.
const links: {
  title: string
  href: string
  external?: boolean
  feature?: FeatureKey
}[] = [
  { title: "Pricing", href: siteConfig.links.pricing, feature: "billing" },
  { title: "Blog", href: "/blog", feature: "blog" },
  { title: "Changelog", href: "/changelog", feature: "changelog" },
  { title: "Docs", href: "/docs", feature: "docs" },
]

export async function SiteHeader() {
  const features = await getFeatures()
  // The session is never read with auth off: there may be no database.
  const session = features.auth ? await getSession() : null
  const visibleLinks = links.filter(
    (link) => !link.feature || features[link.feature]
  )

  return (
    <header className="sticky top-0 z-40 w-full">
      <SiteHeaderBackdrop />
      <div className="relative mx-auto grid h-14 max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-3 lg:px-4 xl:px-0">
        <Logo className="text-sm" />

        <nav className="hidden items-center sm:flex">
          {visibleLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              {...(link.external && { target: "_blank", rel: "noreferrer" })}
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-900/5 hover:text-foreground dark:text-white/90 dark:hover:bg-white/10"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="col-start-3 flex justify-end gap-2">
          {!features.auth ? null : session ? (
            <Link
              href={DEFAULT_LOGIN_REDIRECT}
              className={cn(buttonVariants({ size: "sm" }), "px-4")}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }), "px-4")}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
