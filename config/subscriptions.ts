import { SubscriptionPlan } from "types"
import { env } from "@/env.mjs"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan is limited to 3 posts. Upgrade to the PRO plan for unlimited posts.",
  stripePriceId: "",
}

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "The PRO plan has unlimited posts.",
  stripePriceId: "",
  // stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
}

export const pricingData = [
  {
    title: 'Starter',
    description: 'For Beginners',
    benefits: [
      'Up to 100 monthly posts',
      'Basic analytics and reporting',
      'Access to standard templates',
      'Priority access to new features.',
    ],
    limitations: [
      'Limited customer support',
      'No custom branding',
      'Limited access to premium resources.',
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
  },
  {
    title: 'Pro',
    description: 'Unlock Advanced Features',
    benefits: [
      'Up to 500 monthly posts',
      'Advanced analytics and reporting',
      'Access to premium templates',
      'Priority customer support',
      'Exclusive webinars and training.',
    ],
    limitations: [
      'No custom branding',
      'Limited access to premium resources.',
    ],
    prices: {
      monthly: 15,
      yearly: 144,
    },
  },
  {
    title: 'Premium',
    description: 'For Power Users',
    benefits: [
      'Unlimited posts',
      'Real-time analytics and reporting',
      'Access to all templates, including custom branding',
      '24/7 premium customer support',
      'Personalized onboarding and account management.',
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
  },
] as const;
