import { siteConfig } from "@/config/site"
import { isFeatureEnabled } from "@/lib/features/resolve"

// The starter is free: calls to action invite to try the demo or grab the
// code, never to sign up. With auth off there is no demo to log into.
export async function getStarterCta() {
  if (await isFeatureEnabled("auth")) {
    return { label: "Try the demo", href: "/login", external: false }
  }
  return {
    label: "Get the code",
    href: siteConfig.links.github,
    external: true,
  }
}
