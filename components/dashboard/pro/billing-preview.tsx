import { LockedCard } from "@/components/dashboard/pro/locked-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BillingPreview() {
  return (
    <div className="flex flex-col gap-6">
      <LockedCard
        title="Billing email"
        description="Invoices and receipts are sent to this address."
        hint="Can differ from your account email."
      >
        <div className="max-w-[300px]">
          <Label htmlFor="billing-email" className="sr-only">
            Billing email
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
