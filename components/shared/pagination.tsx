import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  page: number
  pageCount: number
  // Server lists link to `?page=n` (crawlable); client lists use `onPageChange`.
  href?: (page: number) => string
  onPageChange?: (page: number) => void
  // Client lists only: adds a "Rows per page" select.
  pageSize?: number
  pageSizes?: number[]
  onPageSizeChange?: (size: number) => void
  className?: string
}

export function Pagination({
  page,
  pageCount,
  href,
  onPageChange,
  pageSize,
  pageSizes = [10, 25, 50, 100],
  onPageSizeChange,
  className,
}: Props) {
  // Keep the size select visible on a single page so it can be changed back.
  if (pageCount <= 1 && !onPageSizeChange) return null

  const control = (target: number, label: string, next = false) => {
    const disabled = target < 1 || target > pageCount
    const classes = buttonVariants({ variant: "outline", size: "sm" })
    const Icon = next ? ChevronRight : ChevronLeft
    const content = (
      <>
        {!next && <Icon />}
        {label}
        {next && <Icon />}
      </>
    )
    if (disabled) {
      return (
        <span
          aria-disabled
          className={cn(classes, "pointer-events-none opacity-50")}
        >
          {content}
        </span>
      )
    }
    return href ? (
      <Link href={href(target)} scroll className={classes}>
        {content}
      </Link>
    ) : (
      <button
        type="button"
        className={classes}
        onClick={() => onPageChange?.(target)}
      >
        {content}
      </button>
    )
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-3", className)}
    >
      {onPageSizeChange ? (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Rows per page</span>
          <select
            value={pageSize}
            aria-label="Rows per page"
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-8 rounded-lg border border-input bg-card px-2 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      ) : (
        control(page - 1, "Previous")
      )}
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-2">
        {onPageSizeChange && control(page - 1, "Previous")}
        {control(page + 1, "Next", true)}
      </div>
    </nav>
  )
}
