import { NavBar } from "@/components/layout/navbar"
import { SiteFooter } from "@/components/layout/site-footer"
import { marketingConfig } from "@/config/marketing"
import { Suspense } from "react"
import { ClerkProvider } from "@clerk/nextjs"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen flex-col">
        <Suspense fallback="...">
          <NavBar items={marketingConfig.mainNav} scroll={true} />
        </Suspense>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </ClerkProvider>
  )
}
