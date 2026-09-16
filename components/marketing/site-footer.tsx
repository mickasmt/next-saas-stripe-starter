import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import type { FeatureKey } from "@/config/features"
import { siteConfig } from "@/config/site"
import { getFeatures } from "@/lib/features/resolve"

type FooterColumn = {
  title: string
  // Hidden while this flag is off.
  links: { title: string; href: string; feature?: FeatureKey }[]
}

const columns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { title: "Pricing", href: siteConfig.links.pricing, feature: "billing" },
      { title: "Dashboard", href: "/dashboard", feature: "auth" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Blog", href: "/blog", feature: "blog" }, // module:blog
      { title: "Changelog", href: "/changelog", feature: "changelog" }, // module:changelog
      { title: "Docs", href: "/docs", feature: "docs" }, // module:docs
      { title: "GitHub", href: siteConfig.links.github },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Terms", href: siteConfig.links.terms },
      { title: "Privacy", href: siteConfig.links.privacy },
    ],
  },
]

export async function SiteFooter() {
  const features = await getFeatures()
  const visibleColumns = columns
    .map((column) => ({
      ...column,
      links: column.links.filter(
        (link) => !link.feature || features[link.feature]
      ),
    }))
    .filter((column) => column.links.length > 0)

  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        {visibleColumns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-medium">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {siteConfig.name}. Open source under the
          MIT license.
        </p>
      </div>
    </footer>
  )
}
