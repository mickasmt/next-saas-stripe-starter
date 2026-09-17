import type { FeatureKey } from "@/config/features"

export type NavIcon = "dashboard" | "billing" | "settings" | "admin"

export type NavItem = {
  title: string
  href: string
  // Icon name, not a component: nav items are passed to client components.
  icon?: NavIcon
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
    items: [{ title: "General", href: "/dashboard/settings/general" }],
  },
  {
    title: "Account",
    items: [{ title: "Profile", href: "/dashboard/settings/profile" }],
  },
]
