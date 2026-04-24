import { pricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { UserSubscriptionPlan } from "types";

export async function getTeamSubscriptionPlan(
  teamId: string,
): Promise<UserSubscriptionPlan> {
  if (!teamId) throw new Error("Missing parameters");

  const team = await prisma.team.findFirst({
    where: { id: teamId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  const isPaid =
    team.stripePriceId &&
    (team.stripeCurrentPeriodEnd?.getTime() ?? 0) + 86_400_000 > Date.now();

  const teamPlan =
    pricingData.find(
      (plan) => plan.stripeIds.monthly === team.stripePriceId,
    ) ||
    pricingData.find(
      (plan) => plan.stripeIds.yearly === team.stripePriceId,
    );

  const plan = isPaid && teamPlan ? teamPlan : pricingData[0];

  const interval = isPaid
    ? teamPlan?.stripeIds.monthly === team.stripePriceId
      ? "month"
      : teamPlan?.stripeIds.yearly === team.stripePriceId
        ? "year"
        : null
    : null;

  let isCanceled = false;
  if (isPaid && team.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      team.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    ...team,
    stripeCurrentPeriodEnd: team.stripeCurrentPeriodEnd?.getTime() ?? 0,
    isPaid: !!isPaid,
    interval,
    isCanceled,
  };
}
