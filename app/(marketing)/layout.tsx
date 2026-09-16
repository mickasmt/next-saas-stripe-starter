import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"

// Satoshi's license (ITF FFL) forbids committing the font files to a public
// repository, so it is loaded from the Fontshare API instead of next/font.
const SATOSHI_CSS =
  "https://api.fontshare.com/v2/css?f[]=satoshi@500&display=swap"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
      <link rel="stylesheet" href={SATOSHI_CSS} precedence="default" />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
