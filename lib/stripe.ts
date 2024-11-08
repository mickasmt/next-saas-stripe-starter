import Stripe from "stripe"
import { env } from "@/env.mjs"

export let stripe: Stripe | null = null;

if (env.STRIPE_API_KEY) {
  stripe = new Stripe(env.STRIPE_API_KEY, {
    apiVersion: "2024-04-10",
    typescript: true,
  });
}
