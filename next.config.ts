import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Keep the bottom-left corner free for the dashboard user menu.
  devIndicators: { position: "bottom-right" },
}

// Content collections (docs, blog, changelog) are declared with the macro
// API in lib/content, so no source.config.ts or generated files are needed.
const withMDX = createMDX()

export default withMDX(nextConfig)
