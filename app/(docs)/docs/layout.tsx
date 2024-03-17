import { docsConfig } from "@/config/docs"
import { DocsSidebarNav } from "@/components/docs/sidebar-nav"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
      <aside
        className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block"
      >
        <ScrollArea className="h-full py-6 pr-6 lg:py-8">
          <DocsSidebarNav items={docsConfig.sidebarNav} />
        </ScrollArea>
      </aside>
      {children}
    </div>
  )
}
