"use client"

import { useState } from "react"

import { SectionCard } from "@/components/dashboard/section-card"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import { paginate } from "@/lib/pagination"

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
  {
    to: "max@acme.com",
    template: "Sign-in link",
    status: "Delivered",
    at: "Aug 9, 18:02",
  },
  {
    to: "billing@acme.com",
    template: "Receipt",
    status: "Delivered",
    at: "Aug 1, 00:05",
  },
  {
    to: "jo@acme.com",
    template: "Invitation",
    status: "Opened",
    at: "Jul 28, 09:37",
  },
]

const PAGE_SIZE = 5

function statusVariant(status: string) {
  if (status === "Bounced") return "destructive" as const
  if (status === "Opened") return "default" as const
  return "outline" as const
}

export function EmailsPreview() {
  const [page, setPage] = useState(1)
  const { items, page: current, pageCount } = paginate(emails, page, PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Sent emails"
        description="Transactional emails sent on behalf of this organization."
        footer={<p>Delivery events come from your email provider.</p>}
      >
        <div className="divide-y rounded-md border bg-background">
          {items.map((email) => (
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
        <Pagination
          page={current}
          pageCount={pageCount}
          onPageChange={setPage}
          className="mt-4"
        />
      </SectionCard>
    </div>
  )
}
