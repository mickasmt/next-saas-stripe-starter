import { cn } from "@/lib/utils"

// Titled card with an optional footer bar for hints and actions.
export function SectionCard({
  title,
  description,
  footer,
  className,
  children,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section className={cn("overflow-hidden rounded-lg border", className)}>
      <div className="flex flex-col gap-3 bg-card p-5">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em]">{title}</h2>
          {description && (
            <p className="mt-3 text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
      {footer && (
        <footer className="flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t bg-background py-3 pr-3 pl-5 text-muted-foreground">
          {footer}
        </footer>
      )}
    </section>
  )
}
