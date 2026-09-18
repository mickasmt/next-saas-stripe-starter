import { Sparkles } from "lucide-react"
import Link from "next/link"

import { HeaderUserMenu } from "@/components/marketing/header-user-menu"
import { SiteHeaderBackdrop } from "@/components/marketing/site-header-backdrop"
import { Logo } from "@/components/shared/logo"
import { buttonVariants } from "@/components/ui/button"
import type { FeatureKey } from "@/config/features"
import { dashboardNav } from "@/config/nav"
import { siteConfig } from "@/config/site"
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/redirect"
import { getSession } from "@/lib/auth/session"
import { getFeatures } from "@/lib/features/resolve"
import { filterNav } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { getViewRole } from "@/modules/admin/preview" // module:admin

// `feature`: hidden while this flag is off.
const links: {
  title: string
  href: string
  external?: boolean
  feature?: FeatureKey
}[] = [
  { title: "Pricing", href: siteConfig.links.pricing, feature: "billing" },
  { title: "Blog", href: "/blog", feature: "blog" }, // module:blog
  { title: "Docs", href: "/docs", feature: "docs" }, // module:docs
]

const linkClassName =
  "rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-900/5 hover:text-foreground dark:text-white/90 dark:hover:bg-white/10"

export async function SiteHeader() {
  const features = await getFeatures()
  // The session is never read with auth off: there may be no database.
  const session = features.auth ? await getSession() : null
  const visibleLinks = links.filter(
    (link) => !link.feature || features[link.feature]
  )

  let menuItems: { title: string; href: string }[] = []
  if (session) {
    let role = session.user.role
    role = await getViewRole(session) // module:admin
    menuItems = filterNav(dashboardNav, { features, role })
      .flatMap((section) => section.items)
      .map((item) =>
        item.href === DEFAULT_LOGIN_REDIRECT
          ? { ...item, title: "Dashboard" }
          : item
      )
      .filter(
        (item) =>
          item.href === DEFAULT_LOGIN_REDIRECT ||
          item.href === "/dashboard/settings/profile" ||
          item.href === "/admin"
      )
  }

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
              className={linkClassName}
            >
              {link.title}
            </Link>
          ))}
          {/* Signed-in visitors get the "Get Pro" button instead. */}
          {!session && (
            <Link
              href={siteConfig.links.pro}
              className={cn(linkClassName, "group flex items-center gap-1.5")}
            >
              <Sparkles className="size-3.5 text-violet-500 transition-transform group-hover:rotate-12 dark:text-violet-300" />
              <span className="animate-shine bg-[linear-gradient(110deg,#7c3aed_35%,#e879f9_50%,#7c3aed_65%)] bg-size-[250%_100%] bg-clip-text text-transparent motion-reduce:animate-none dark:bg-[linear-gradient(110deg,#c4b5fd_35%,#fae8ff_50%,#c4b5fd_65%)]">
                Pro
              </span>
            </Link>
          )}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-2">
          {!features.auth ? null : session ? (
            <>
              <Link
                href={siteConfig.links.pro}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-violet-500/40 bg-violet-500/10 px-3 text-violet-700 hover:bg-violet-500/15 hover:text-violet-800 dark:border-violet-400/50 dark:bg-violet-400/15 dark:text-violet-100 dark:hover:bg-violet-400/25 dark:hover:text-white"
                )}
              >
                <Sparkles />
                Get Pro
              </Link>
              <HeaderUserMenu
                user={{
                  name: session.user.name,
                  email: session.user.email,
                  image: session.user.image ?? null,
                }}
                items={menuItems}
              />
            </>
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
