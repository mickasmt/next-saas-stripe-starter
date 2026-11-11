"use client"

import { useRouter } from "next/navigation"
import { useRef, useTransition } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  acceptedImageTypes,
  MAX_IMAGE_BYTES,
  type UploadTarget,
} from "@/modules/uploads/targets"

const labels: Record<UploadTarget, string> = {
  avatar: "avatar",
  logo: "organization avatar",
}

// Opens the file picker and uploads to Neon Object Storage through
// /api/uploads. Rendered by AvatarCard once the uploads module is on.
export function ImageUploadButton({
  target,
  className,
  children,
}: {
  target: UploadTarget
  className?: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [uploading, startUpload] = useTransition()

  function upload(file: File) {
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Images must be 2 MB or smaller.")
      return
    }

    startUpload(async () => {
      const body = new FormData()
      body.set("file", file)

      const response = await fetch(`/api/uploads/${target}`, {
        method: "POST",
        body,
      }).catch(() => null)

      if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        toast.error(data?.error ?? `Couldn't upload the ${labels[target]}.`)
        return
      }

      toast.success(
        `${labels[target][0].toUpperCase()}${labels[target].slice(1)} updated.`
      )
      router.refresh()
    })
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Upload ${labels[target]}`}
        disabled={uploading}
        onClick={() => input.current?.click()}
        className={cn(className, uploading && "animate-pulse cursor-wait")}
      >
        {children}
      </button>
      <input
        ref={input}
        type="file"
        accept={acceptedImageTypes}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          // Reset so picking the same file again still fires onChange.
          event.target.value = ""
          if (file) upload(file)
        }}
      />
    </>
  )
}
