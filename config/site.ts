import { env } from "@/env.mjs";
import { SiteConfig } from "types"

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
