"use client"

import { SectionCard } from "@/components/dashboard/section-card"
import { toastIncludedInPro } from "@/components/dashboard/settings/pro-toast"
import { Button } from "@/components/ui/button"

// Deleting an organization needs several per account, which ships with Pro.
export function DeleteOrganizationCard({
  organizationName,
}: {
  organizationName: string
}) {
  return (
    <SectionCard
      tone="danger"
      title="Delete Organization"
      description={`Permanently remove ${organizationName}, its members and its invitations. This action is not reversible, so please continue with caution.`}
      footer={
        <Button
          size="sm"
          className="ml-auto bg-destructive px-2.5 text-white hover:bg-destructive/90"
          onClick={() => toastIncludedInPro("Deleting an organization")}
        >
          Delete Organization
        </Button>
      }
    />
  )
}
