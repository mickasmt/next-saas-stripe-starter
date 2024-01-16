"use client"

import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn, formatDate } from "@/lib/utils"
import Link from "next/link"
import { UserSubscriptionPlan } from "types"
import { format } from "date-fns"

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  subscriptionPlan: UserSubscriptionPlan;
}

export function BillingInfo({
  subscriptionPlan
}: BillingInfoProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
          plan.
        </CardDescription>
      </CardHeader>
      <CardContent>{subscriptionPlan.description}</CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
        <Link
          href="/pricing"
          className={cn(buttonVariants())}
        >
          {subscriptionPlan.isPaid ? "Manage Subscription" : "Upgrade now"}
        </Link>

        {subscriptionPlan.isPaid ? (
          <p className="rounded-full text-xs font-medium">
            {subscriptionPlan.isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
            {subscriptionPlan.stripeCurrentPeriodEnd &&format(new Date(subscriptionPlan.stripeCurrentPeriodEnd), "MMMM d, yyyy")}.
          </p>
        ) : null}
      </CardFooter>
    </Card>
  )
}


