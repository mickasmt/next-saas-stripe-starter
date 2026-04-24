import { headers } from "next/headers";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return new Response(`Webhook Error: ${(error as Error).message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    const stripeData = {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(
        subscription.current_period_end * 1000,
      ),
    };

    // Check if this is a team checkout or user checkout
    if (session?.metadata?.teamId) {
      await prisma.team.update({
        where: { id: session.metadata.teamId },
        data: stripeData,
      });
    } else {
      await prisma.user.update({
        where: { id: session?.metadata?.userId },
        data: stripeData,
      });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;

    if (invoice.billing_reason != "subscription_create") {
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string,
      );

      const stripeData = {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      };

      // Try team first, then user
      const team = await prisma.team.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (team) {
        await prisma.team.update({
          where: { id: team.id },
          data: stripeData,
        });
      } else {
        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: stripeData,
        });
      }
    }
  }

  return new Response(null, { status: 200 });
}
