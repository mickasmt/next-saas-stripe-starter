import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Keep the bottom-left corner free for the dashboard user menu.
  devIndicators: { position: "bottom-right" },
}

export default nextConfig
