import { cn } from "@/lib/utils"

interface CalloutProps {
  icon?: string
  children?: React.ReactNode
  type?: "default" | "warning" | "danger" | "info"
}

// ✅💡⚠️🚫🚨
export function Callout({
  children,
  icon,
  type = "default",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn("mt-6 flex items-start rounded-md border px-4 py-3", {
        "text-blue-800 border-blue-200 bg-blue-100 dark:text-blue-200 dark:border-blue-200/40 dark:bg-blue-900/40":
          type === "info",
        "text-red-900 border-red-200 bg-red-100 dark:text-red-200 dark:border-red-200/30 dark:bg-red-900/40":
          type === "danger",
        "text-orange-800 border-orange-200 bg-orange-100 dark:text-orange-300 dark:border-orange-400/30 dark:bg-orange-400/20":
          type === "warning",
      })}
      {...props}
    >
      {icon && <span className="mr-3 text-xl">{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
