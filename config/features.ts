// Single source of truth for feature flags. Layouts, navigation and the dev
// panel all read from here.
//
// Flags only show or hide UI (routes, nav links). They never touch the
// database schema: every table exists from the first migration.
//
// Override a default per environment with FEATURE_<SCREAMING_SNAKE_KEY>,
// e.g. FEATURE_BILLING=false.

type FeatureDefinition<Key extends string> = {
  label: string
  description: string
  default: boolean
  // The flag is forced off while any of these flags is off.
  dependsOn?: readonly NoInfer<Key>[]
}

function defineFeatures<Key extends string>(
  features: Record<Key, FeatureDefinition<Key>>
) {
  return features
}

export const features = defineFeatures({
  billing: {
    label: "Billing",
    description: "Stripe subscriptions and customer portal.",
    default: true,
  },
  admin: {
    label: "Admin panel",
    description: "User management for platform admins.",
    default: true,
  },
})

export type FeatureKey = keyof typeof features

export const featureKeys = Object.keys(features) as FeatureKey[]

export function isFeatureKey(value: unknown): value is FeatureKey {
  return typeof value === "string" && Object.hasOwn(features, value)
}
