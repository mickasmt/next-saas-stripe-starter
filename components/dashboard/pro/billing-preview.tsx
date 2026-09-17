import { CreditCard } from "lucide-react"

import { SectionCard } from "@/components/dashboard/section-card"
import { LockedCard } from "@/components/dashboard/pro/locked-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const cards = [
  { label: "Card ending in 4242", expires: "Expires 04/2029", default: true },
  { label: "Card ending in 8710", expires: "Expires 11/2027" },
]

export function BillingPreview() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Payment method"
        description="Subscriptions, seats and add-ons are charged to the default card."
        footer={
          <>
            <p>
              Three cards at most. Cards are stored by the payment provider.
            </p>
            <Button
              size="sm"
              disabled
              className="px-2.5 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:ring-1 disabled:ring-border"
            >
              Add card
            </Button>
          </>
        }
      >
        <div className="divide-y rounded-md border bg-background">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <CreditCard className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{card.label}</p>
                  <p className="text-muted-foreground">{card.expires}</p>
                </div>
              </div>
              {card.default ? (
                <Badge variant="outline">Default</Badge>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Make default
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <LockedCard
        title="Invoice email recipient"
        description="Invoices and receipts are sent to this address."
        hint="Can differ from your account email."
      >
        <div className="max-w-[300px]">
          <Label htmlFor="billing-email" className="sr-only">
            Invoice email recipient
          </Label>
          <Input
            id="billing-email"
            disabled
            defaultValue="billing@acme.com"
            className="bg-background"
          />
        </div>
      </LockedCard>

      <LockedCard
        title="Company name"
        description="Printed at the top of every invoice."
        hint="Please use 64 characters at maximum."
      >
        <div className="max-w-[300px]">
          <Input disabled defaultValue="Acme Inc." className="bg-background" />
        </div>
      </LockedCard>

      <LockedCard
        title="Billing address"
        description="Used on every invoice, and to compute tax."
        hint="Changing the country may change the tax rate."
      >
        <div className="grid max-w-[520px] gap-3 sm:grid-cols-2">
          <Input
            disabled
            defaultValue="1100 Congress Ave"
            className="bg-background sm:col-span-2"
          />
          <Input disabled defaultValue="Austin" className="bg-background" />
          <Input disabled defaultValue="TX 78701" className="bg-background" />
          <Input
            disabled
            defaultValue="United States"
            className="bg-background sm:col-span-2"
          />
        </div>
      </LockedCard>

      <LockedCard
        title="Purchase order number"
        description="Added to your invoices when your finance team needs it."
        hint="Appears next to the invoice number."
      >
        <div className="max-w-[300px]">
          <Input disabled defaultValue="PO-4821" className="bg-background" />
        </div>
      </LockedCard>

      <LockedCard
        title="Tax ID"
        description="Rendered on your invoices when your country requires it."
        hint="Countries without tax IDs aren't listed."
      >
        <div className="max-w-[300px]">
          <Input
            disabled
            defaultValue="US EIN · 47-1234567"
            className="bg-background"
          />
        </div>
      </LockedCard>
    </div>
  )
}
