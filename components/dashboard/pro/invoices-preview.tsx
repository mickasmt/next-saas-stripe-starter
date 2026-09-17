import { Download } from "lucide-react"

import { SectionCard } from "@/components/dashboard/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const filters = ["All invoices", "Paid", "Open"]

const invoices = [
  {
    period: "September 2026",
    items: "Pro plan · 4 seats",
    total: "$96.00",
    status: "Open",
    invoiced: "Invoiced Sep 1, 2026",
  },
  {
    period: "August 2026",
    items: "Pro plan · 4 seats",
    total: "$96.00",
    status: "Paid",
    invoiced: "Invoiced Aug 1, 2026",
  },
  {
    period: "July 2026",
    items: "Pro plan · 3 seats",
    total: "$72.00",
    status: "Paid",
    invoiced: "Invoiced Jul 1, 2026",
  },
  {
    period: "June 2026",
    items: "Pro plan · 3 seats, usage",
    total: "$78.40",
    status: "Paid",
    invoiced: "Invoiced Jun 1, 2026",
  },
]

export function InvoicesPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {filters.map((filter, index) => (
          <span
            key={filter}
            aria-disabled
            className={cn(
              "rounded-md border px-2.5 py-1 font-medium",
              index === 0
                ? "bg-accent text-foreground"
                : "bg-card text-muted-foreground"
            )}
          >
            {filter}
          </span>
        ))}
      </div>

      <SectionCard
        title="Invoices"
        description="Every invoice issued for this organization."
        footer={<p>Invoices are also emailed to your invoice recipient.</p>}
      >
        <div className="divide-y rounded-md border bg-background">
          {invoices.map((invoice) => (
            <div
              key={invoice.period}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{invoice.period}</p>
                  <Badge
                    variant={
                      invoice.status === "Paid" ? "outline" : "secondary"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {invoice.items} · {invoice.invoiced}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium tabular-nums">{invoice.total}</p>
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled
                  aria-label={`Download the ${invoice.period} invoice`}
                >
                  <Download />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
