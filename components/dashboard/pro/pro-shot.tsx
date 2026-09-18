import Image from "next/image"

import { cn } from "@/lib/utils"

// A screenshot of the real Pro app, framed like a window.
// Locked pages ship these instead of mock components: nothing here is
// copy-pasteable, and the image cannot drift from a fake data shape.
export function ProShot({
  src,
  darkSrc,
  alt,
  width,
  height,
  caption,
  className,
}: {
  src: string
  darkSrc?: string
  alt: string
  width: number
  height: number
  caption?: React.ReactNode
  className?: string
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex h-9 items-center gap-1.5 border-b bg-background px-4">
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
        </div>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn("w-full", darkSrc && "dark:hidden")}
          unoptimized
        />
        {darkSrc && (
          <Image
            src={darkSrc}
            alt={alt}
            width={width}
            height={height}
            className="hidden w-full dark:block"
            unoptimized
          />
        )}
      </div>
      {caption && (
        <figcaption className="text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}
