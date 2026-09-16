import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Keep the bottom-left corner free for the dashboard user menu.
  devIndicators: { position: "bottom-right" },
  images: {
    // Blog cover images are self-authored SVGs (no user-supplied content),
    // so allow next/image to serve them with scripts disabled.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

const plugins: ((config: NextConfig) => NextConfig)[] = [
  // Content collections (legal pages, docs, blog, changelog) are declared with
  // the macro API in lib/content, so no source.config.ts or generated files
  // are needed.
  createMDX(),
]

export default plugins.reduce((config, plugin) => plugin(config), nextConfig)
