import { pricingData } from "@/config/subscriptions";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { UserSubscriptionPlan } from "types";
import { getUserAuth } from "@/lib/auth"

export async function getUserSubscriptionPlan(): Promise<UserSubscriptionPlan> {
  const { session } = await getUserAuth();

  if (!session || !session.user) {
    throw new Error("User not found.");
  }

  const subscription = await db.subscription.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  
  if (!subscription)
    return {
      ...pricingData[0],
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
      isPaid: false,
      interval: null,
      isCanceled: false,
    };

  // Check if user is on a paid plan.
  const isPaid = !!(
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd &&
    subscription.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  // Find the pricing data corresponding to the user's plan
  const userPlan =
    pricingData.find((plan) => plan.stripeIds.monthly === subscription.stripePriceId) ||
    pricingData.find((plan) => plan.stripeIds.yearly === subscription.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : pricingData[0]

  const interval = isPaid
    ? userPlan?.stripeIds.monthly === subscription.stripePriceId
      ? "month"
      : userPlan?.stripeIds.yearly === subscription.stripePriceId
      ? "year"
      : null
    : null;

  let isCanceled = false;
  if (isPaid && subscription.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...plan,
    ...subscription,
    stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd || null,
    isPaid,
    interval,
    isCanceled
  }
}
