"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

// next/image drops the blur placeholder the instant the file lands; this
// eases the real image out of it instead of cutting to it. The clip keeps the
// blur inside the image box, whatever the parent does with overflow.
export function BlurImage({ alt, className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      {...props}
      alt={alt}
      className={cn(
        className,
        "transition-[filter] duration-700 ease-out [clip-path:inset(0)]",
        loaded ? "blur-0" : "blur-sm"
      )}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
    />
  )
}
