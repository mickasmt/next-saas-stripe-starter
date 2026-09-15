export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 lg:px-10">
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-6 lg:py-8">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
