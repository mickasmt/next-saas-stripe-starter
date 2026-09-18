import type { FeatureKey } from "@/config/features"

export type NavIcon =
  | "dashboard"
  | "onboarding"
  | "billing"
  | "emails"
  | "emailTemplates"
  | "settings"
  | "admin"

export type NavItem = {
  title: string
  href: string
  // Icon name, not a component: nav items are passed to client components.
  icon?: NavIcon
  // Shown with a Pro badge: the free version only previews the page.
  pro?: boolean
  // Platform role (user.role) required to see the item.
  authorizeOnly?: "admin"
  // Hidden while this flag is off. Must match the flag checked by the
  // route's layout so nav and routes never disagree.
  feature?: FeatureKey
}

export type NavSection = {
  title?: string
  items: NavItem[]
}

export const dashboardNav: NavSection[] = [
  {
    items: [
      { title: "Overview", href: "/dashboard", icon: "dashboard" },
      {
        title: "Onboarding",
        href: "/dashboard/onboarding",
        icon: "onboarding",
        pro: true,
      },
      {
        title: "Billing",
        href: "/dashboard/billing",
        icon: "billing",
        feature: "billing",
      },
      {
        title: "Settings",
        href: "/dashboard/settings/general",
        icon: "settings",
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
      {
        title: "Emails",
        href: "/dashboard/emails",
        icon: "emails",
        pro: true,
      },
      {
        title: "Email templates",
        href: "/dashboard/email-templates",
        icon: "emailTemplates",
        pro: true,
      },
    ],
  },
  // module:admin start
  {
    title: "Admin",
    items: [
      {
        title: "Admin panel",
        href: "/admin",
        icon: "admin",
        authorizeOnly: "admin",
        feature: "admin",
      },
    ],
  },
  // module:admin end
]

// Shown instead of dashboardNav while inside /dashboard/settings.
export const settingsNav: NavSection[] = [
  {
    title: "Organization",
    items: [
      { title: "General", href: "/dashboard/settings/general" },
      { title: "Members", href: "/dashboard/settings/members", pro: true },
      // module:billing start
      {
        title: "Billing",
        href: "/dashboard/settings/billing",
        pro: true,
        feature: "billing",
      },
      {
        title: "Invoices",
        href: "/dashboard/settings/invoices",
        pro: true,
        feature: "billing",
      },
      // module:billing end
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", href: "/dashboard/settings/profile" },
      {
        title: "Notifications",
        href: "/dashboard/settings/notifications",
        pro: true,
      },
      { title: "Security", href: "/dashboard/settings/security", pro: true },
    ],
  },
]
