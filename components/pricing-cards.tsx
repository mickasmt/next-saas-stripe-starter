"use client";

import Link from "next/link";
import { useState } from 'react';

import { BillingFormButton } from "@/components/forms/billing-form-button";
import { Icons } from "@/components/shared/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from '@/components/ui/switch';
import { pricingData } from "@/config/subscriptions";

import { UserSubscriptionPlan } from "@/types";
import { getUserAuth } from "@/lib/auth"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function PricingCards({ subscriptionPlan }: PricingCardsProps) {
  const user = useUser();
  const isYearlyDefault = (!subscriptionPlan?.interval || subscriptionPlan.interval === "year") ? true : false;
  const [isYearly, setIsYearly] = useState<boolean>(!!isYearlyDefault);

  console.log({user})

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  return (
    <section className="container flex flex-col items-center text-center">
      <div className="mx-auto mb-10 flex w-full flex-col gap-5">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Pricing</p>
        <h2 className="font-heading text-3xl leading-[1.1] md:text-5xl">
          Start at full speed !
        </h2>
      </div>

      <div className="mb-4 flex items-center gap-5">
        <span>Monthly Billing</span>
        <Switch
          checked={isYearly}
          onCheckedChange={toggleBilling}
          role="switch"
          aria-label="switch-year"
        />
        <span>Annual Billing</span>
      </div>

      <div className="mx-auto grid max-w-screen-lg gap-5 bg-inherit py-5 md:grid-cols-3 lg:grid-cols-3">
        {pricingData.map((plan) => (
          <Card
            key={plan.name}
            className={
              subscriptionPlan && plan.name === subscriptionPlan.name ? "border-primary" : ""
            }
          > 
            {subscriptionPlan && plan.name === subscriptionPlan.name ? (
              <div className="w-full relative">
                <div className="text-center px-3 py-1 bg-secondary-foreground text-secondary text-xs  w-fit rounded-l-lg rounded-t-none absolute right-0 font-semibold">
                  Current Plan
                </div>
              </div>
            ) : null}
            <CardHeader className="items-start space-y-4 bg-secondary/70">
              <CardTitle
                className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
              >
                {plan.name}
              </CardTitle>
              <div className="flex flex-row">
                <div className="flex items-end">
                  <div className="flex text-left text-3xl font-semibold leading-6">
                    {isYearly && plan.prices.monthly > 0 ? (
                      <>
                        <span className="mr-2 text-muted-foreground line-through">${plan.prices.monthly}</span>
                        <span>${plan.prices.yearly / 12}</span>
                      </>
                    ) : `$${plan.prices.monthly}`}
                  </div>
                  <div className="-mb-1 ml-2 text-left text-sm font-medium">
                    <div>/mo</div>
                  </div>
                </div>
              </div>
              <CardDescription>{plan.description}</CardDescription>
              {plan.prices.monthly > 0 ? (
                <div className="text-left text-sm text-muted-foreground">
                  {isYearly ? `$${plan.prices.yearly} will be charged when annual` : "when charged monthly"}
                </div>
              ) : null}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left text-sm font-medium leading-normal">
                {plan.benefits.map((feature) => (
                  <li className="flex items-start" key={feature}>
                    <Icons.check className="mr-3 size-5 shrink-0" />
                    <p>{feature}</p>
                  </li>
                ))}

                {plan.limitations.length > 0 && plan.limitations.map((feature) => (
                  <li className="flex items-start text-muted-foreground" key={feature}>
                    <Icons.close className="mr-3 size-5 shrink-0" />
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {subscriptionPlan && user ? (
                plan.id === 'free' ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      className: 'w-full',
                      variant: 'default',
                    })}
                  >
                    Go to dashboard
                  </Link>
                ) : (
                  <BillingFormButton year={isYearly} plan={plan} subscriptionPlan={subscriptionPlan} />
                )
              ) : (
                <Button>Sign in</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="mt-3 text-balance text-center text-base text-muted-foreground">
        Email <a className="font-medium text-primary hover:underline" href="mailto:support@saas-starter.com">support@saas-starter.com</a> for to contact our support team.
        <br />
        <strong>You can test the subscriptions and won&apos;t be charged.</strong>
      </p>
    </section>
  )
}
