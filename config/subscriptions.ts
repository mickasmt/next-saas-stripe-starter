import { SubscriptionPlan } from "types"
import { env } from "@/env.mjs"

// export const freePlan: SubscriptionPlan = {
//   name: "Free",
//   description:
//     "The free plan is limited to 3 posts. Upgrade to the PRO plan for unlimited posts.",
//   stripePriceId: "",
// }

// export const proPlan: SubscriptionPlan = {
//   name: "PRO",
//   description: "The PRO plan has unlimited posts.",
//   stripePriceId: "",
//   stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
// }

export const pricingData: SubscriptionPlan[] = [
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
      'Limited access to business resources.',
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: 'Pro',
    description: 'Unlock Advanced Features',
    benefits: [
      'Up to 500 monthly posts',
      'Advanced analytics and reporting',
      'Access to business templates',
      'Priority customer support',
      'Exclusive webinars and training.',
    ],
    limitations: [
      'No custom branding',
      'Limited access to business resources.',
    ],
    prices: {
      monthly: 15,
      yearly: 144,
    },
    stripeIds: {
      monthly: env.STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: 'Business',
    description: 'For Power Users',
    benefits: [
      'Unlimited posts',
      'Real-time analytics and reporting',
      'Access to all templates, including custom branding',
      '24/7 business customer support',
      'Personalized onboarding and account management.',
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    stripeIds: {
      monthly: env.STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

