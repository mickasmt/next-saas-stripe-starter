import { cn } from "@/lib/utils"

// Faint square grid with soft color glows, fading out towards the bottom.
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[60px_60px] bg-position-[-1px_-1px] opacity-60" />
      <div className="absolute -top-24 left-1/4 size-72 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-500/10" />
      <div className="absolute -top-16 right-1/4 size-64 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-500/10" />
      <div className="absolute -top-28 left-1/2 size-56 rounded-full bg-amber-100/50 blur-3xl dark:bg-amber-500/5" />
    </div>
  )
}
