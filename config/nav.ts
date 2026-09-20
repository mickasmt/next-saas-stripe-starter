import type { FeatureKey } from "@/config/features"

export type NavIcon =
  | "dashboard"
  | "onboarding"
  | "billing"
  | "emails"
  | "emailTemplates"
  | "organization"
  | "settings"
  | "admin"

export type NavItem = {
  title: string
  href: string
  // Icon name, not a component: nav items are passed to client components.
  icon?: NavIcon
  // Pro badge. true: the free version only previews the page. "partial": a
  // section whose panel mixes free pages with Pro ones.
  pro?: boolean | "partial"
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

// A sub-nav that replaces dashboardNav while the route is under `prefix`.
export type NavPanel = {
  title: string
  prefix: string
  sections: NavSection[]
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
        title: "Organization",
        href: "/dashboard/organization/general",
        icon: "organization",
        pro: "partial",
      },
      {
        title: "Settings",
        href: "/dashboard/settings/profile",
        icon: "settings",
        pro: "partial",
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

// Longest prefix wins, so order here doesn't matter.
export const navPanels: NavPanel[] = [
  {
    title: "Organization",
    prefix: "/dashboard/organization",
    sections: [
      {
        items: [
          { title: "General", href: "/dashboard/organization/general" },
          {
            title: "Members",
            href: "/dashboard/organization/members",
            pro: true,
          },
          // module:billing start
          {
            title: "Billing",
            href: "/dashboard/organization/billing",
            pro: true,
            feature: "billing",
          },
          {
            title: "Invoices",
            href: "/dashboard/organization/invoices",
            pro: true,
            feature: "billing",
          },
          // module:billing end
        ],
      },
    ],
  },
  {
    title: "Settings",
    prefix: "/dashboard/settings",
    sections: [
      {
        items: [
          { title: "Profile", href: "/dashboard/settings/profile" },
          {
            title: "Security",
            href: "/dashboard/settings/security",
            pro: true,
          },
        ],
      },
    ],
  },
]
