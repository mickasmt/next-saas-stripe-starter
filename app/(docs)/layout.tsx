import Link from "next/link"

import { DocsSearch } from "@/components/docs/search"
import { DocsSidebarNav } from "@/components/docs/sidebar-nav"
import { NavBar } from "@/components/layout/navbar"
import { SiteFooter } from "@/components/layout/site-footer"
import { Icons } from "@/components/shared/icons"
import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { ClerkProvider } from "@clerk/nextjs"

interface DocsLayoutProps {
  children: React.ReactNode
}

const rightHeader = () => (
  <div className="flex flex-1 items-center space-x-4 sm:justify-end">
    <div className="hidden lg:flex lg:grow-0">
      <DocsSearch />
    </div>
    <div className="flex lg:hidden">
      <Icons.search className="size-6 text-muted-foreground" />
    </div>
  </div>
)

export default async function DocsLayout({ children }: DocsLayoutProps) {

  return (
    <ClerkProvider>
      <div className="flex min-h-screen flex-col">
        <NavBar items={docsConfig.mainNav} rightElements={rightHeader()}>
          <DocsSidebarNav items={docsConfig.sidebarNav} />
        </NavBar>
        <div className="container flex-1">{children}</div>
        <SiteFooter className="border-t" />
      </div>
    </ClerkProvider>
  )
}
