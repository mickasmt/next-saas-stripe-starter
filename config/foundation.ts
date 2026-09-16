// The services every module is built on. Providers are fixed for now: the
// `provider` field exists so modules depend on a capability ("payments"), not
// on a vendor ("stripe"), and a second provider can be added later.
//
// `requiredEnv` lists the variables the app needs at runtime to use the
// provider. A module that requires a foundation piece stays off until all of
// them are set.

type FoundationDefinition = {
  label: string
  provider: string
  providerLabel: string
  requiredEnv: readonly string[]
  // Where to get the missing values, shown in the dev panel.
  setupUrl: string
}

function defineFoundation<Key extends string>(
  foundation: Record<Key, FoundationDefinition>
) {
  return foundation
}

export const foundation = defineFoundation({
  database: {
    label: "Database",
    provider: "neon",
    providerLabel: "Neon",
    requiredEnv: ["DATABASE_URL"],
    setupUrl: "https://console.neon.tech",
  },
  auth: {
    label: "Auth",
    provider: "better-auth",
    providerLabel: "Better Auth",
    requiredEnv: ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL"],
    setupUrl: "https://www.better-auth.com/docs/installation",
  },
  payments: {
    label: "Payments",
    provider: "stripe",
    providerLabel: "Stripe",
    requiredEnv: [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "STRIPE_PRO_MONTHLY_PRICE_ID",
    ],
    setupUrl: "https://dashboard.stripe.com/test/apikeys",
  },
})

export type FoundationKey = keyof typeof foundation

export const foundationKeys = Object.keys(foundation) as FoundationKey[]
