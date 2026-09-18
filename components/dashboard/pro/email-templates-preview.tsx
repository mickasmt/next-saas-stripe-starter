import { SectionCard } from "@/components/dashboard/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Every email the app can send, grouped by what sets it off. The delivery log
// lives on its own page: a long list of sent emails used to bury this one.
const groups = [
  {
    title: "Account",
    templates: [
      {
        name: "Welcome",
        trigger: "After the first sign-in",
        file: "welcome.tsx",
      },
      {
        name: "Sign-in link",
        trigger: "Passwordless sign-in",
        file: "magic-link.tsx",
      },
      {
        name: "Reset password",
        trigger: "A member asks for a new password",
        file: "reset-password.tsx",
      },
      {
        name: "Email changed",
        trigger: "A member confirms a new address",
        file: "email-changed.tsx",
      },
    ],
  },
  {
    title: "Organization",
    templates: [
      {
        name: "Invitation",
        trigger: "A member is invited",
        file: "invitation.tsx",
      },
      {
        name: "Seat added",
        trigger: "An invitation is accepted",
        file: "seat-added.tsx",
      },
    ],
  },
  {
    title: "Billing",
    templates: [
      {
        name: "Receipt",
        trigger: "A payment succeeds",
        file: "receipt.tsx",
      },
      {
        name: "Payment failed",
        trigger: "Stripe can't charge the card",
        file: "payment-failed.tsx",
      },
    ],
  },
]

export function EmailTemplatesPreview() {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <SectionCard
          key={group.title}
          title={group.title}
          description="React Email templates, rendered with your branding."
          footer={
            <p>
              Templates live in <code>modules/emails/templates</code>.
            </p>
          }
        >
          <div className="divide-y rounded-md border bg-background">
            {group.templates.map((template) => (
              <div
                key={template.name}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{template.name}</p>
                  <p className="text-muted-foreground">{template.trigger}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {template.file}
                  </Badge>
                  <Button variant="outline" size="sm" disabled>
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  )
}
