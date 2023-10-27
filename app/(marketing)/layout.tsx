import { NavBar } from "@/components/layout/navbar"
import { SiteFooter } from "@/components/layout/site-footer"
import { marketingConfig } from "@/config/marketing"
import { getCurrentUser } from "@/lib/session"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={user} items={marketingConfig.mainNav} scroll={true} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
