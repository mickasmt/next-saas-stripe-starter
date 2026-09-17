import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"

// A settings field with a hint and a Save button in the footer.
export function SaveCard({
  title,
  description,
  hint,
  dirty,
  pending,
  onSave,
  children,
}: {
  title: string
  description: string
  hint: string
  dirty: boolean
  pending: boolean
  onSave: () => void
  children: React.ReactNode
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
            disabled={!dirty || pending}
            onClick={onSave}
            className="px-2.5 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:ring-1 disabled:ring-border"
          >
            {pending ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      {children}
    </SectionCard>
  )
}
