import Stripe from "stripe"

// Stripe throws on an empty key at construction time. The placeholder lets the
// app and the Better Auth CLI boot without Stripe configured; billing calls
// fail until a real key is set.
export const stripeClient = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_not_configured"
)
