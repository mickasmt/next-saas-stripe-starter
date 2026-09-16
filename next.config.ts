import { createMDX } from "fumadocs-mdx/next" // module:docs,blog,changelog
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Keep the bottom-left corner free for the dashboard user menu.
  devIndicators: { position: "bottom-right" },
}

const plugins: ((config: NextConfig) => NextConfig)[] = [
  // module:docs,blog,changelog start
  // Content collections (docs, blog, changelog) are declared with the macro
  // API in lib/content, so no source.config.ts or generated files are needed.
  createMDX(),
  // module:docs,blog,changelog end
]

export default plugins.reduce((config, plugin) => plugin(config), nextConfig)
