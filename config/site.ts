import { SiteConfig } from "types"
import { env } from "@/lib/env.mjs"

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "snack",
  description:
    "Internet Shareables.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  links: {
    twitter: "https://twitter.com/snack_xyz",
    ratlabs: "https://ratlabs.xyz",
  },
  mailSupport: "support@saas-starter.com"
}
