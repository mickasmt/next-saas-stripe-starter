import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"

// Settings card with an inert action: the same shape as SaveCard, disabled.
export function LockedCard({
  title,
  description,
  hint,
  action = "Save",
  children,
}: {
  title: string
  description: string
  hint: string
  action?: string
  children?: React.ReactNode
}) {
  return (
    <SectionCard
      title={title}
      description={description}
      footer={
        <>
          <p>{hint}</p>
          <Button
            size="sm"
            disabled
            className="px-2.5 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:ring-1 disabled:ring-border"
          >
            {action}
          </Button>
        </>
      }
    >
      {children}
    </SectionCard>
  )
}
