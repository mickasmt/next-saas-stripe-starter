import Link from "next/link"

import { Logo } from "@/components/shared/logo"

export function AuthHeader({
  prompt,
  href,
  action,
}: {
  prompt: string
  href: string
  action: string
}) {
  return (
    <header className="flex items-center justify-between gap-4">
      <Logo />
      <p className="text-sm text-muted-foreground">
        <span className="hidden sm:inline">{prompt} </span>
        <Link
          href={href}
          className="font-medium text-foreground underline underline-offset-4"
        >
          {action}
        </Link>
      </p>
    </header>
  )
}
