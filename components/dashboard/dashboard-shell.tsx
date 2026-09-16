import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Sidebar, type SidebarProps } from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"

export function DashboardShell({
  children,
  className,
  ...sidebar
}: Omit<SidebarProps, "onNavigate"> & {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-dashboard
      className={cn(
        "min-h-svh bg-background font-sans text-sm text-foreground",
        className
      )}
    >
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-divider bg-sidebar md:block">
        <Sidebar {...sidebar} />
      </aside>

      <div className="flex min-h-svh flex-col md:pl-64">
        <DashboardHeader {...sidebar} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
