// The Pro sales page. Self-contained: deleting this folder leaves the rest of
// the site working, since only siteConfig.links.pro points here.
import type { Metadata } from "next"

import { ProCta } from "./_components/pro-cta"
import { ProHero } from "./_components/pro-hero"
import { proPurchaseHref } from "./_components/purchase"
import { ProShowcase } from "@/components/marketing/pro-showcase"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Pro | ${siteConfig.name}`,
  description:
    "Onboarding, emails, teams and seat billing on top of the free starter.",
}

export default function ProPage() {
  return (
    <>
      <ProHero />
      <ProShowcase intro={false} buyHref={proPurchaseHref} />
      <ProCta />
    </>
  )
}
