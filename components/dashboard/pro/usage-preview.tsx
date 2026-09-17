import { ChevronDown } from "lucide-react"

import { SectionCard } from "@/components/dashboard/section-card"

type Metric = {
  label: string
  description: string
  used: number
  included: number
  unit?: string
}

const groups: {
  title: string
  description: string
  hint: string
  metrics: Metric[]
}[] = [
  {
    title: "Plan",
    description: "What your subscription includes this period.",
    hint: "Seats above the included count are billed monthly.",
    metrics: [
      {
        label: "Seats",
        description: "Members with access to the organization.",
        used: 4,
        included: 10,
      },
      {
        label: "Projects",
        description: "Projects owned by the organization.",
        used: 7,
        included: 20,
      },
      {
        label: "File storage",
        description: "Uploads stored across all projects.",
        used: 2.4,
        included: 20,
        unit: "GB",
      },
    ],
  },
  {
    title: "API",
    description: "Requests made with your organization's keys.",
    hint: "Counters reset on the first day of the period.",
    metrics: [
      {
        label: "API requests",
        description: "Successful requests to the public API.",
        used: 128_400,
        included: 500_000,
      },
      {
        label: "Webhook deliveries",
        description: "Events delivered to your endpoints.",
        used: 9_120,
        included: 50_000,
      },
      {
        label: "Background jobs",
        description: "Queued jobs processed for you.",
        used: 1_840,
        included: 10_000,
      },
    ],
  },
  {
    title: "Email",
    description: "Transactional emails sent on your behalf.",
    hint: "Bounced emails don't count towards the limit.",
    metrics: [
      {
        label: "Emails sent",
        description: "Sign-in links, receipts and notifications.",
        used: 6_430,
        included: 25_000,
      },
      {
        label: "Email domains",
        description: "Domains verified for sending.",
        used: 1,
        included: 3,
      },
    ],
  },
]

function format(value: number, unit?: string) {
  const number = value.toLocaleString("en-US")
  return unit ? `${number} ${unit}` : number
}

export function UsagePreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit items-center gap-2 rounded-md border bg-card px-2.5 py-1 font-medium text-muted-foreground">
        Aug 18 — Sep 17, 2026
        <ChevronDown className="size-3.5" />
      </div>

      {groups.map((group) => (
        <SectionCard
          key={group.title}
          title={group.title}
          description={group.description}
          footer={<p>{group.hint}</p>}
        >
          <div className="flex flex-col gap-4">
            {group.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-medium">{metric.label}</p>
                  <p className="text-muted-foreground tabular-nums">
                    {format(metric.used, metric.unit)} of{" "}
                    {format(metric.included, metric.unit)}
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min((metric.used / metric.included) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  )
}
