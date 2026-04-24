"use server";

import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";
import { getTeamSubscriptionPlan } from "@/lib/team-subscription";
import { getAuthContext } from "@/lib/session";
import { authorize } from "@/lib/auth/engine";
import { absoluteUrl } from "@/lib/utils";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
};

const billingUrl = absoluteUrl("/dashboard/team/billing");

export async function generateTeamStripe(
  teamId: string,
  priceId: string,
): Promise<responseAction> {
  let redirectUrl: string = "";

  try {
    const context = await getAuthContext();
    const decision = authorize(context, {
      scope: "team",
      permission: "team:billing:manage",
    });
    if (!decision.allowed) {
      throw new Error(decision.reason);
    }

    if (context!.team!.teamId !== teamId) {
      throw new Error("Team context mismatch");
    }

    const subscriptionPlan = await getTeamSubscriptionPlan(teamId);

    if (subscriptionPlan.isPaid && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      redirectUrl = stripeSession.url as string;
    } else {
      // Get team details for checkout
      const team = await (await import("@/lib/db")).prisma.team.findUnique({
        where: { id: teamId },
        select: { name: true },
      });

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          teamId,
        },
      });

      redirectUrl = stripeSession.url as string;
    }
  } catch (error) {
    throw new Error("Failed to generate team stripe session");
  }

  redirect(redirectUrl);
}
