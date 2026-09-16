import { Check, Minus } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

import {
  comparison,
  enterprise,
  plans,
  type ComparisonColumn,
  type ComparisonValue,
} from "@/components/marketing/pricing/data"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Every plan side by side. The header row sticks under the site header while
// the rows scroll past; on small screens the table scrolls sideways with the
// feature names pinned to the left.

const columns: {
  key: ComparisonColumn
  name: string
  cta: { label: string; href: string }
  highlighted?: boolean
}[] = [
  ...plans.map((plan) => ({
    key: plan.key,
    name: plan.name,
    cta: {
      label: plan.price.monthly === 0 ? "Start free" : "Get started",
      href: plan.cta.href,
    },
    highlighted: plan.highlighted,
  })),
  { key: "enterprise", name: enterprise.name, cta: enterprise.cta },
]

export function PricingComparison() {
  return (
    <>
      <div className="px-4 pt-20 pb-12 text-center sm:px-12">
        <h2 className="font-display text-3xl font-medium text-balance sm:text-4xl">
          Compare plans and features
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-pretty text-muted-foreground sm:text-lg">
          Every limit and feature in one place, so you only pay for what you
          need.
        </p>
      </div>

      {/* Scrolls sideways below md only: an overflow container would break
          the sticky header on wider screens. */}
      <div className="border-t border-grid-border max-md:overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-40 border-b border-l border-grid-border bg-background md:top-14 md:w-1/4" />
              {columns.map((column, i) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "z-10 border-b border-l border-grid-border bg-background p-3 text-left font-normal sm:p-4 md:sticky md:top-14",
                    i === columns.length - 1 && "border-r"
                  )}
                >
                  <p className="mb-3 truncate font-display text-base font-medium">
                    {column.name}
                  </p>
                  <Link
                    href={column.cta.href}
                    className={cn(
                      buttonVariants({
                        variant: column.highlighted ? "default" : "outline",
                        size: "sm",
                      }),
                      "w-full"
                    )}
                  >
                    {column.cta.label}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          {/* The section border closes the table: drop the last row's own. */}
          <tbody className="[&>tr:last-child>*]:border-b-0">
            {comparison.map((group) => (
              <Fragment key={group.category}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={columns.length + 1}
                    className="border-b border-grid-border bg-muted/50 p-0 text-left font-medium"
                  >
                    <span className="sticky left-0 inline-block px-4 py-2.5 sm:px-6">
                      {group.category}
                    </span>
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-b border-grid-border bg-background px-4 py-3 text-left font-normal shadow-[4px_0_8px_-4px_rgb(0_0_0/0.08)] sm:px-6 md:static md:shadow-none"
                    >
                      {row.label}
                    </th>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "border-b border-l border-grid-border px-3 py-3 text-center sm:px-4",
                          column.highlighted &&
                            "bg-violet-500/[0.04] dark:bg-violet-500/[0.07]"
                        )}
                      >
                        <Value
                          value={row.values[column.key]}
                          highlighted={column.highlighted}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Value({
  value,
  highlighted,
}: {
  value: ComparisonValue
  highlighted?: boolean
}) {
  if (typeof value === "string") {
    return <span className="text-muted-foreground">{value}</span>
  }
  if (value) {
    return (
      <Check
        aria-label="Included"
        className={cn(
          "mx-auto size-4",
          highlighted
            ? "text-violet-600 dark:text-violet-400"
            : "text-foreground"
        )}
      />
    )
  }
  return (
    <Minus
      aria-label="Not included"
      className="mx-auto size-4 text-muted-foreground/50"
    />
  )
}
