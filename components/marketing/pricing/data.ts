// Everything the pricing page shows: plans, the comparison table and the FAQ.
//
// TODO: after cloning, replace these placeholders with your product's real
// plans and limits. Paid plan keys come from `modules/billing/plans.ts`, so the
// checkout resolves the same names. Prices are never set here: they are read
// from Stripe (see `modules/billing/prices.ts`).

import type { PlanName } from "@/modules/billing/plans"

export type PlanKey = "free" | PlanName

export type Plan = {
  key: PlanKey
  name: string
  description: string
  featuresTitle: string
  features: string[]
  // Shown to signed-out visitors; signed-in ones get a label for their plan.
  cta: { label: string }
  highlighted?: boolean
}

export const contactHref = "mailto:sales@example.com"

export const plans: Plan[] = [
  {
    key: "free",
    name: "Free",
    description: "For side projects and trying things out.",
    featuresTitle: "What's included:",
    features: [
      "1 project",
      "1 team member",
      "1,000 API requests/mo",
      "7-day activity history",
      "Community support",
    ],
    cta: { label: "Start for free" },
  },
  {
    key: "pro",
    name: "Pro",
    description: "For makers with paying customers.",
    featuresTitle: "Everything in Free, plus:",
    features: [
      "10 projects",
      "5 team members",
      "50,000 API requests/mo",
      "1-year activity history",
      "Custom domain",
      "Email support",
    ],
    cta: { label: "Get started with Pro" },
    highlighted: true,
  },
  {
    key: "business",
    name: "Business",
    description: "For teams that need more control.",
    featuresTitle: "Everything in Pro, plus:",
    features: [
      "Unlimited projects",
      "20 team members",
      "500,000 API requests/mo",
      "3-year activity history",
      "Roles and permissions",
      "Webhooks",
      "Priority support",
    ],
    cta: { label: "Get started with Business" },
  },
]

export const enterprise = {
  name: "Enterprise",
  description:
    "Custom limits, security reviews and a contract that fits how your company buys software. Talk to us and we'll put a plan together.",
  features: [
    "Custom usage limits",
    "Volume discounts",
    "SSO / SAML",
    "Audit logs",
    "Custom contract and SLA",
    "Dedicated success manager",
  ],
  cta: { label: "Contact sales", href: contactHref },
}

// Comparison table. `true` shows a check, `false` a dash, a string as is.
export type ComparisonValue = boolean | string

export type ComparisonColumn = PlanKey | "enterprise"

export const comparison: {
  category: string
  rows: { label: string; values: Record<ComparisonColumn, ComparisonValue> }[]
}[] = [
  {
    category: "Usage",
    rows: [
      {
        label: "Projects",
        values: {
          free: "1",
          pro: "10",
          business: "Unlimited",
          enterprise: "Unlimited",
        },
      },
      {
        label: "Team members",
        values: { free: "1", pro: "5", business: "20", enterprise: "Custom" },
      },
      {
        label: "API requests",
        values: {
          free: "1K/mo",
          pro: "50K/mo",
          business: "500K/mo",
          enterprise: "Custom",
        },
      },
      {
        label: "Activity history",
        values: {
          free: "7 days",
          pro: "1 year",
          business: "3 years",
          enterprise: "Unlimited",
        },
      },
    ],
  },
  {
    category: "Features",
    rows: [
      {
        label: "Dashboard and analytics",
        values: { free: true, pro: true, business: true, enterprise: true },
      },
      {
        label: "API access",
        values: { free: true, pro: true, business: true, enterprise: true },
      },
      {
        label: "Custom domain",
        values: { free: false, pro: true, business: true, enterprise: true },
      },
      {
        label: "Remove branding",
        values: { free: false, pro: true, business: true, enterprise: true },
      },
      {
        label: "Webhooks",
        values: { free: false, pro: false, business: true, enterprise: true },
      },
      {
        label: "Roles and permissions",
        values: { free: false, pro: false, business: true, enterprise: true },
      },
    ],
  },
  {
    category: "Security and support",
    rows: [
      {
        label: "SSO / SAML",
        values: { free: false, pro: false, business: false, enterprise: true },
      },
      {
        label: "Audit logs",
        values: { free: false, pro: false, business: false, enterprise: true },
      },
      {
        label: "Support",
        values: {
          free: "Community",
          pro: "Email",
          business: "Priority",
          enterprise: "Dedicated",
        },
      },
      {
        label: "Custom SLA",
        values: { free: false, pro: false, business: false, enterprise: true },
      },
    ],
  },
]

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Which plan should I pick?",
    answer:
      "Start on Free while you explore. Move to Pro once you ship to paying customers, and to Business when your team needs roles, webhooks or higher limits. Enterprise is for companies that need custom terms.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "The Free plan has no time limit, so you can use it for as long as you like before upgrading. When you do upgrade, you get every paid feature right away.",
  },
  {
    question: "How does yearly billing work?",
    answer:
      "Pay for the year upfront and save compared to monthly billing. You can switch between monthly and yearly billing at any time from your billing settings.",
  },
  {
    question: "What happens when I reach a limit?",
    answer:
      "Nothing breaks. You'll get a notice in the dashboard and by email, and new usage pauses until the next billing period or until you upgrade.",
  },
  {
    question: "Can I change or cancel my plan later?",
    answer:
      "Yes. Upgrades apply immediately with a prorated charge. Downgrades and cancellations take effect at the end of the current billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "If the product isn't right for you, contact us within 14 days of a payment and we'll refund it in full.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "All major credit and debit cards, plus local payment methods supported by Stripe in your country. Invoices are available for yearly plans.",
  },
  {
    question: "I have another question. How do I reach you?",
    answer:
      "Send us an email and we'll get back to you within one business day.",
  },
]
