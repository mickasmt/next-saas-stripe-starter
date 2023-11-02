import { env } from "@/env.mjs";
import { SiteConfig } from "types"

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "SaaS Starter",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 14.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  links: {
    twitter: "https://twitter.com/miickasmt",
    github: "https://github.com/mickasmt/next-saas-stripe-starter",
  },
  mailSupport: "support@saas-starter.com"
}
