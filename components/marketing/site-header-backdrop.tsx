"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

// The header sits flush on the hero at rest and turns into a solid bar with a
// bottom rule once the page scrolls under it.
export function SiteHeaderBackdrop() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 border-b transition-all",
        scrolled ? "border-grid-border bg-background" : "border-transparent"
      )}
    />
  )
}
