// Single source of truth for feature flags. Layouts, navigation and the dev
// panel all read from here.
//
// Flags only show or hide UI (routes, nav links). They never touch the
// database schema: every table exists from the first migration.
//
// Override a default per environment with FEATURE_<SCREAMING_SNAKE_KEY>,
// e.g. FEATURE_BILLING=false.

import type { FoundationKey } from "@/config/foundation"

type FeatureDefinition<Key extends string> = {
  label: string
  description: string
  default: boolean
  // The flag is forced off while any of these flags is off.
  dependsOn?: readonly NoInfer<Key>[]
  // The flag is forced off while any of these services misses its env vars.
  requires?: readonly FoundationKey[]
}

function defineFeatures<Key extends string>(
  features: Record<Key, FeatureDefinition<Key>>
) {
  return features
}

export const features = defineFeatures({
  // Accounts, sessions and the dashboard. Every other module that needs a
  // signed-in user depends on it. Off: no database is needed at all.
  auth: {
    label: "Authentication",
    description: "Sign-in, sign-up and the dashboard.",
    default: true,
    requires: ["database", "auth"],
  },
  billing: {
    label: "Billing",
    description: "Subscriptions and customer portal.",
    default: true,
    dependsOn: ["auth"],
    requires: ["payments"],
  },
  admin: {
    label: "Admin panel",
    description: "User management for platform admins.",
    default: true,
    dependsOn: ["auth"],
  },
  docs: {
    label: "Documentation",
    description: "MDX documentation powered by Fumadocs.",
    default: true,
  },
  blog: {
    label: "Blog",
    description: "MDX articles with authors and categories.",
    default: true,
  },
  changelog: {
    label: "Changelog",
    description: "Product updates on a single page.",
    default: true,
  },
})

export type FeatureKey = keyof typeof features

export const featureKeys = Object.keys(features) as FeatureKey[]

export function isFeatureKey(value: unknown): value is FeatureKey {
  return typeof value === "string" && Object.hasOwn(features, value)
}
