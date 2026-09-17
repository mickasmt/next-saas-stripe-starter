import { ImageResponse } from "next/og"

import { siteConfig } from "@/config/site"

// Site-wide social card, inherited by every route that doesn't set its own
// Open Graph image.
export const alt = siteConfig.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#09090b",
        backgroundImage:
          "radial-gradient(circle at 20% 0%, #27272a 0%, #09090b 55%)",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#a1a1aa",
        }}
      >
        {new URL(siteConfig.url).host}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 84,
          fontWeight: 700,
          color: "#fafafa",
        }}
      >
        {siteConfig.name}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          maxWidth: 900,
          fontSize: 38,
          lineHeight: 1.3,
          color: "#a1a1aa",
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    size
  )
}
