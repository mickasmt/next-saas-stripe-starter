import type { ComponentType, ReactNode } from "react"
import { CircleCheck, CircleX, Info, Lightbulb, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

// Tinted callout: background, border, icon and text all follow the type.
const STYLES = {
  info: {
    Icon: Info,
    box: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-600/20",
    text: "text-blue-800 dark:text-blue-300",
  },
  warning: {
    Icon: TriangleAlert,
    box: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-600/20",
    text: "text-amber-800 dark:text-amber-300",
  },
  error: {
    Icon: CircleX,
    box: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-600/20",
    text: "text-red-800 dark:text-red-300",
  },
  success: {
    Icon: CircleCheck,
    box: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-600/20",
    text: "text-green-800 dark:text-green-300",
  },
  tip: {
    Icon: Lightbulb,
    box: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-600/20",
    text: "text-emerald-800 dark:text-emerald-300",
  },
} satisfies Record<
  string,
  { Icon: ComponentType<{ className?: string }>; box: string; text: string }
>

const ALIASES: Record<string, keyof typeof STYLES> = {
  warn: "warning",
  idea: "tip",
}

export function Callout({
  type = "info",
  title,
  icon,
  className,
  children,
}: {
  type?: string
  title?: ReactNode
  icon?: ReactNode
  className?: string
  children?: ReactNode
}) {
  const key = ALIASES[type] ?? type
  const { Icon, box, text } = STYLES[key as keyof typeof STYLES] ?? STYLES.info

  return (
    <div
      className={cn(
        "my-4 flex gap-3 overflow-hidden rounded-xl border px-4 py-3 text-sm",
        box,
        text,
        className,
      )}
    >
      <span className="mt-0.5 flex-none">
        {icon ?? <Icon className="size-4.5" />}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 leading-6 [&_code]:px-1.5 [&_code]:py-0 [&_a]:text-current [&_a]:underline [&_code]:border-current/20 [&_code]:bg-current/10 [&_code]:text-current [&_p]:my-0 [&_strong]:text-current">
        {title && <p className="my-0 font-medium">{title}</p>}
        {children}
      </div>
    </div>
  )
}
