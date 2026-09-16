"use client"

import { FacebookIcon, LinkedInIcon, XIcon } from "@/components/shared/icons"

// Standard share-intent popups (no app credentials or tracking involved).
// Reads the current URL client-side to avoid needing a configured site origin.
export function ShareRow({ title }: { title: string }) {
  function share(build: (url: string, title: string) => string) {
    const url = window.location.href
    window.open(
      build(encodeURIComponent(url), encodeURIComponent(title)),
      "_blank",
      "noopener,noreferrer"
    )
  }

  const links = [
    {
      label: "Share on X",
      icon: XIcon,
      build: (url: string, text: string) =>
        `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    },
    {
      label: "Share on LinkedIn",
      icon: LinkedInIcon,
      build: (url: string) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    },
    {
      label: "Share on Facebook",
      icon: FacebookIcon,
      build: (url: string) =>
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
  ]

  return (
    <div className="flex items-center gap-1.5">
      {links.map(({ label, icon: Icon, build }) => (
        <button
          key={label}
          type="button"
          onClick={() => share(build)}
          aria-label={label}
          className="flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  )
}
