import { SiteConfig } from "types"

const site_url = process.env.NODE_ENV === "development" 
  ? "http://localhost:3000" 
  : "https://next-saas-stripe-starter.vercel.app";

export const siteConfig: SiteConfig = {
  name: "SaaS Starter",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 13.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  links: {
    twitter: "https://twitter.com/mickasmt",
    github: "https://github.com/mickasmt/next-saas-stripe-starter",
  },
  mailSupport: "support@saas-starter.com"
}
