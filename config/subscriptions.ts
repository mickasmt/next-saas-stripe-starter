import type { PlansRow, SubscriptionPlan } from "types";

export const pricingData: SubscriptionPlan[] = [
  { title: "Self-paced track", description: "Permanent access with flexible pacing", benefits: ["Complete software development track", "Quizzes and projects", "Certificate eligibility"], limitations: ["No managed cohort schedule", "No live facilitator sessions"], prices: { monthly: 0, yearly: 0 }, stripeIds: { monthly: null, yearly: null } },
  { title: "Managed cohort", description: "Permanent access plus a facilitated cohort", benefits: ["Complete software development track", "Scheduled releases and deadlines", "Live sessions and reminders"], limitations: [], prices: { monthly: 0, yearly: 0 }, stripeIds: { monthly: null, yearly: null } },
];
export const plansColumns = ["starter", "pro", "business", "enterprise"] as const;
export const comparePlans: PlansRow[] = [];
