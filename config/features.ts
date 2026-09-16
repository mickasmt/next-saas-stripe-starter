// Single source of truth for feature flags. Layouts, navigation and the dev
// panel all read from here.
//
// Flags only show or hide UI (routes, nav links). They never touch the
// database schema: every table exists from the first migration.
//
// Override a default per environment with FEATURE_<SCREAMING_SNAKE_KEY>,
// e.g. FEATURE_BILLING=false. Static pages keep the value they were built
// with: rebuild after changing one.

import type { FoundationKey } from "@/config/foundation"

type FeatureDefinition<Key extends string> = {
  label: string
  description: string
  default: boolean
  // The flag is forced off while any of these flags is off.
  dependsOn?: readonly NoInfer<Key>[]
  // The flag is forced off while any of these services misses its env vars.
  requires?: readonly FoundationKey[]
  // What `pnpm modules:prune` deletes with the module. A path or package listed by
  // several modules is only deleted once all of them are pruned.
  files?: readonly string[]
  packages?: readonly string[]
  // Pathnames the module serves. After a prune, a link still pointing at one
  // of them is reported.
  routes?: readonly string[]
}

function defineFeatures<Key extends string>(
  features: Record<Key, FeatureDefinition<Key>>
) {
  return features
}

// module:docs,blog,changelog start
// MDX content (docs, blog, changelog) is built on Fumadocs.
const CONTENT_PACKAGES = [
  "fumadocs-core",
  "fumadocs-mdx",
  "fumadocs-ui",
  "@types/mdx",
]
// module:docs,blog,changelog end

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
  // module:docs start
  docs: {
    label: "Documentation",
    description: "MDX documentation powered by Fumadocs.",
    default: true,
    files: [
      "app/(docs)",
      "app/api/search",
      "lib/content/docs.ts",
      "content/docs",
      "components/content/mdx-components.tsx",
    ],
    packages: CONTENT_PACKAGES,
    routes: ["/docs"],
  },
  // module:docs end
  // module:blog start
  blog: {
    label: "Blog",
    description: "MDX articles with authors and categories.",
    default: true,
    files: [
      "app/(marketing)/blog",
      "lib/content/blog.ts",
      "content/blog",
      "public/_static/blog",
      "public/_static/avatars",
      "config/blog.ts",
      "components/marketing/category-tabs.tsx",
      "components/content/mdx-components.tsx",
    ],
    packages: CONTENT_PACKAGES,
    routes: ["/blog"],
  },
  // module:blog end
  // module:changelog start
  changelog: {
    label: "Changelog",
    description: "Product updates on a single page.",
    default: true,
    files: [
      "app/(marketing)/changelog",
      "lib/content/changelog.ts",
      "content/changelog",
      "public/_static/avatars",
      "config/blog.ts",
      "components/content/share-row.tsx",
      "components/content/mdx-components.tsx",
    ],
    packages: CONTENT_PACKAGES,
    routes: ["/changelog"],
  },
  // module:changelog end
})

export type FeatureKey = keyof typeof features

export const featureKeys = Object.keys(features) as FeatureKey[]

export function isFeatureKey(value: unknown): value is FeatureKey {
  return typeof value === "string" && Object.hasOwn(features, value)
}
