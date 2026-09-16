import type { LucideIcon } from "lucide-react"

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-card px-6 py-16 text-center">
      <span className="grid size-10 place-items-center rounded-lg border bg-background text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 max-w-sm text-balance text-muted-foreground">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
