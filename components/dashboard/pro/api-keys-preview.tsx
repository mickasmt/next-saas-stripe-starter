import { KeyRound } from "lucide-react"

import { SectionCard } from "@/components/dashboard/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const keys = [
  {
    name: "Production",
    prefix: "sk_live_7f3c…",
    scope: "Read and write",
    lastUsed: "4 minutes ago",
  },
  {
    name: "Staging",
    prefix: "sk_test_91ab…",
    scope: "Read and write",
    lastUsed: "2 days ago",
  },
  {
    name: "Analytics job",
    prefix: "sk_live_2d10…",
    scope: "Read only",
    lastUsed: "Never",
  },
]

export function ApiKeysPreview() {
  return (
    <SectionCard
      title="API keys"
      description="Keys authenticate requests made on behalf of this organization."
      footer={
        <>
          <p>A key is shown once, at creation. Rotate it if it leaks.</p>
          <Button
            size="sm"
            disabled
            className="px-2.5 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:ring-1 disabled:ring-border"
          >
            Create key
          </Button>
        </>
      }
    >
      <div className="divide-y rounded-md border bg-background">
        {keys.map((key) => (
          <div
            key={key.name}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <KeyRound className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate font-medium">{key.name}</p>
                <p className="truncate font-mono text-muted-foreground">
                  {key.prefix}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{key.scope}</Badge>
              <p className="hidden text-muted-foreground sm:block">
                Used {key.lastUsed.toLowerCase()}
              </p>
              <Button variant="outline" size="sm" disabled>
                Revoke
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
