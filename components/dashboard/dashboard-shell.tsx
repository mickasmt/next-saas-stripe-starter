import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Sidebar, type SidebarProps } from "@/components/dashboard/sidebar"

export function DashboardShell({
  children,
  ...sidebar
}: Omit<SidebarProps, "onNavigate"> & { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-sidebar lg:grid lg:h-svh lg:grid-cols-[15rem_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="hidden lg:block">
        <Sidebar {...sidebar} />
      </aside>

      <MobileNav {...sidebar} />

      <div className="min-w-0 lg:pt-2 lg:pr-2">
        <main className="min-h-[calc(100svh-3.5rem)] bg-background lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-t-xl lg:border lg:border-b-0">
          {children}
        </main>
      </div>
    </div>
  )
}
