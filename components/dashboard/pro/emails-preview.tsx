import { SectionCard } from "@/components/dashboard/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const emails = [
  {
    to: "sam@acme.com",
    template: "Invitation",
    status: "Delivered",
    at: "12 minutes ago",
  },
  {
    to: "dana@acme.com",
    template: "Sign-in link",
    status: "Opened",
    at: "1 hour ago",
  },
  {
    to: "billing@acme.com",
    template: "Receipt",
    status: "Delivered",
    at: "Sep 1, 00:06",
  },
  {
    to: "chris@acme.co",
    template: "Invitation",
    status: "Bounced",
    at: "Aug 29, 15:41",
  },
  {
    to: "lea@acme.com",
    template: "Welcome",
    status: "Opened",
    at: "Aug 12, 10:20",
  },
]

const templates = [
  { name: "Welcome", trigger: "After the first sign-in" },
  { name: "Sign-in link", trigger: "Passwordless sign-in" },
  { name: "Invitation", trigger: "A member is invited" },
  { name: "Receipt", trigger: "A payment succeeds" },
]

function statusVariant(status: string) {
  if (status === "Bounced") return "destructive" as const
  if (status === "Opened") return "default" as const
  return "outline" as const
}

export function EmailsPreview() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Sent emails"
        description="Transactional emails sent on behalf of this organization."
        footer={<p>Delivery events come from your email provider.</p>}
      >
        <div className="divide-y rounded-md border bg-background">
          {emails.map((email) => (
            <div
              key={`${email.to}-${email.at}`}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{email.to}</p>
                <p className="text-muted-foreground">
                  {email.template} · {email.at}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant(email.status)}>
                  {email.status}
                </Badge>
                <Button variant="outline" size="sm" disabled>
                  Resend
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Templates"
        description="The emails your app sends, and what triggers them."
        footer={<p>Templates are React components you can edit.</p>}
      >
        <div className="divide-y rounded-md border bg-background">
          {templates.map((template) => (
            <div
              key={template.name}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{template.name}</p>
                <p className="text-muted-foreground">{template.trigger}</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Preview
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
