import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { RootProvider } from "fumadocs-ui/provider/next"

import { LogoMark } from "@/components/shared/logo"
import { docsSource } from "@/lib/content/docs"
import { requireFeature } from "@/lib/features/guard"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireFeature("docs")

  return (
    // The app's ThemeProvider already handles dark mode.
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout
        tree={docsSource.getPageTree()}
        nav={{ title: <LogoMark className="text-sm" /> }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
