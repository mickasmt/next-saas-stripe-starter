import { GoogleOneTap } from "@/components/auth/google-one-tap"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { getSession } from "@/lib/auth/session"
import { isFeatureEnabled } from "@/lib/features/resolve"

// Satoshi's license (ITF FFL) forbids committing the font files to a public
// repository, so it is loaded from the Fontshare API instead of next/font.
const SATOSHI_CSS =
  "https://api.fontshare.com/v2/css?f[]=satoshi@500&display=swap"

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The session is never read with auth off: there may be no database.
  const auth = await isFeatureEnabled("auth")
  const oneTap =
    auth &&
    Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) &&
    !(await getSession())

  return (
    <div className="flex min-h-svh flex-col">
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
      <link rel="stylesheet" href={SATOSHI_CSS} precedence="default" />
      {oneTap && <GoogleOneTap />}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
