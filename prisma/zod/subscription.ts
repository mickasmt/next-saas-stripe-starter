import * as z from "zod"

export const subscriptionSchema = z.object({
  userId: z.string(),
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string().nullish(),
  stripePriceId: z.string().nullish(),
  stripeCurrentPeriodEnd: z.date().nullish(),
})
