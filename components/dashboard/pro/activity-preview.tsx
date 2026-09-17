import { SectionCard } from "@/components/dashboard/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const filters = ["All events", "Members", "Billing", "Security"]

const events = [
  {
    actor: "Dana Whitfield",
    action: "invited sam@acme.com as Member",
    type: "Members",
    at: "12 minutes ago",
  },
  {
    actor: "Alex Moreau",
    action: "changed the plan to Pro, 4 seats",
    type: "Billing",
    at: "3 hours ago",
  },
  {
    actor: "Sam Okafor",
    action: "signed in from a new device",
    type: "Security",
    at: "Yesterday, 18:24",
  },
  {
    actor: "Alex Moreau",
    action: "removed the role Admin from Lea Brandt",
    type: "Members",
    at: "Sep 14, 09:02",
  },
  {
    actor: "System",
    action: "payment succeeded for invoice INV-2026-009",
    type: "Billing",
    at: "Sep 1, 00:05",
  },
]

export function ActivityPreview() {
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
        title="Activity"
        description="Everything that happened in this organization."
        footer={
          <>
            <p>Events are kept for 90 days.</p>
            <Button variant="outline" size="sm" disabled>
              Export CSV
            </Button>
          </>
        }
      >
        <div className="divide-y rounded-md border bg-background">
          {events.map((event) => (
            <div
              key={`${event.actor}-${event.at}`}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate">
                  <span className="font-medium">{event.actor}</span>{" "}
                  <span className="text-muted-foreground">{event.action}</span>
                </p>
                <p className="text-muted-foreground">{event.at}</p>
              </div>
              <Badge variant="outline">{event.type}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
