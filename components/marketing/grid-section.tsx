import { cn } from "@/lib/utils"

// Full-bleed band with two vertical rails and optional graph paper (`lines`)
// or a color wash (`background`) fenced between them.
export function GridSection({
  lines = false,
  background,
  className,
  innerClassName,
  children,
}: {
  lines?: boolean
  background?: React.ReactNode
  className?: string
  innerClassName?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "relative overflow-clip border-b border-grid-border px-4",
        className
      )}
    >
      <div
        className={cn(
          "relative z-0 mx-auto max-w-grid-width px-4 sm:px-12",
          innerClassName
        )}
      >
        {/* Rails. Kept off the border box so they can fade independently, and
            stacked above the content so full-bleed children (e.g. card
            images) can't paint over them. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-10 border-x border-grid-border",
            lines && "mask-[linear-gradient(transparent,black)]"
          )}
        />

        {lines && (
          <>
            {/* Outside the rails, fading away from them. The 1800px box is the
                1080px grid width plus 360px of run-off on each side. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 mask-[linear-gradient(transparent,black)] opacity-80"
            >
              <div className="absolute inset-x-[360px] inset-y-0">
                <div className="absolute right-full bottom-0 h-[600px] w-[360px] grid-lines mask-[linear-gradient(90deg,transparent,black)] text-grid-border/60" />
                <div className="absolute bottom-0 left-full h-[600px] w-[360px] grid-lines mask-[linear-gradient(270deg,transparent,black)] text-grid-border/60" />
              </div>
            </div>

            {/* Between the rails. inset-x-px keeps it off the rails themselves. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden mask-[linear-gradient(transparent,black)] opacity-80"
            >
              <div className="absolute bottom-0 left-1/2 h-[600px] w-grid-width -translate-x-1/2 grid-lines text-grid-border/60" />
            </div>
          </>
        )}

        {background && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {background}
          </div>
        )}

        <div className="relative">{children}</div>
      </div>
    </section>
  )
}
