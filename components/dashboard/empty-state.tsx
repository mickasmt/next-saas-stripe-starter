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
    <div className="relative flex flex-col items-center overflow-hidden rounded-xl border px-6 py-16 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)] bg-size-[14px_14px] opacity-70" />
      <span className="relative grid size-12 place-items-center rounded-xl border bg-background shadow-xs">
        <Icon className="size-5" />
      </span>
      <h2 className="relative mt-5 font-semibold">{title}</h2>
      <p className="relative mt-1.5 max-w-sm text-sm text-balance text-muted-foreground">
        {description}
      </p>
      {children && <div className="relative mt-6">{children}</div>}
    </div>
  )
}
