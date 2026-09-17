// Absolute URL of the deployment, used by metadata, sitemap and robots.
// Set NEXT_PUBLIC_APP_URL in production; Vercel previews fall back to their
// own URL.
const url =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

export const siteConfig = {
  name: "SaaS Starter",
  // Full title of the home page, also used on social cards.
  title: "SaaS Starter — the modular Next.js SaaS starter",
  description:
    "Open-source SaaS starter built with Next.js 16, Better Auth, Drizzle, Neon and Stripe.",
  url,
  links: {
    github: "https://github.com/mickasmt/next-saas-stripe-starter",
    pricing: "/pricing",
    pro: "/pro",
    terms: "/terms",
    privacy: "/privacy",
  },
}
