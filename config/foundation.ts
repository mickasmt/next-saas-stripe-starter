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
  // module:uploads start
  // Optional. Variables written by `neon deploy` (see neon.ts) or created by
  // hand: https://neon.com/docs/storage/get-started
  storage: {
    label: "File storage",
    provider: "neon",
    providerLabel: "Neon Object Storage",
    requiredEnv: [
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_ENDPOINT_URL_S3",
      "AWS_REGION",
    ],
    setupUrl: "https://neon.com/docs/storage/get-started",
  },
  // module:uploads end
  // module:assistant start
  // Optional. Variables written by `neon deploy` (see neon.ts) or copied from
  // the Console: https://neon.com/docs/ai-gateway/get-started
  ai: {
    label: "AI",
    provider: "neon",
    providerLabel: "Neon AI Gateway",
    requiredEnv: ["NEON_AI_GATEWAY_BASE_URL", "NEON_AI_GATEWAY_TOKEN"],
    setupUrl: "https://neon.com/docs/ai-gateway/get-started",
  },
  // module:assistant end
})

export type FoundationKey = keyof typeof foundation

export const foundationKeys = Object.keys(foundation) as FoundationKey[]
