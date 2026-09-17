import { SectionCard } from "@/components/dashboard/section-card"
import { Switch } from "@/components/ui/switch"

const groups = [
  {
    title: "Account",
    description: "Emails about your account and its security.",
    hint: "Security alerts can't be switched off.",
    rows: [
      {
        label: "Security alerts",
        description: "New sign-ins and password changes.",
        on: true,
        locked: true,
      },
      {
        label: "Product updates",
        description: "New features and changelog entries.",
        on: true,
      },
      {
        label: "Weekly digest",
        description: "A summary of your organization's activity.",
        on: false,
      },
    ],
  },
  {
    title: "Organization",
    description: "Emails sent to the whole organization.",
    hint: "Owners and admins receive billing emails.",
    rows: [
      {
        label: "Invoices and receipts",
        description: "Every charge, sent to the billing email.",
        on: true,
      },
      {
        label: "Member invitations",
        description: "When someone joins or leaves.",
        on: true,
      },
      {
        label: "Usage warnings",
        description: "When a plan limit is close.",
        on: false,
      },
    ],
  },
]

export function NotificationsPreview() {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <SectionCard
          key={group.title}
          title={group.title}
          description={group.description}
          footer={<p>{group.hint}</p>}
        >
          <div className="divide-y rounded-md border bg-background">
            {group.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{row.label}</p>
                  <p className="text-muted-foreground">{row.description}</p>
                </div>
                <Switch checked={row.on} disabled aria-label={row.label} />
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  )
}
