import { SectionCard } from "@/components/dashboard/section-card"
import { Badge } from "@/components/ui/badge"

const rows = [
  {
    label: "Error tracking",
    description:
      "Unhandled errors from the server, the browser and the app shell.",
  },
  {
    label: "Performance monitoring",
    description: "Traces for slow pages and requests.",
  },
  {
    label: "Source maps",
    description: "Uploaded at build time, so stack traces point at your code.",
  },
]

export function SentryPreview() {
  return (
    <SectionCard
      title="Error tracking"
      description="Sentry is wired into the app as an optional module. It stays off until a DSN is set, so a fresh install is untouched."
      footer={<p>Set SENTRY_DSN to switch it on. No code changes needed.</p>}
    >
      <div className="divide-y rounded-md border bg-background">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium">{row.label}</p>
              <p className="text-muted-foreground">{row.description}</p>
            </div>
            <Badge variant="outline">Off</Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
