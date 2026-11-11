"use client"

import { SectionCard } from "@/components/dashboard/section-card"
import { toastIncludedInPro } from "@/components/dashboard/settings/pro-toast"
import { ImageUploadButton } from "@/components/uploads/image-upload-button" // module:uploads
import type { UploadTarget } from "@/modules/uploads/targets" // module:uploads

// Uploading needs file storage, which ships with Pro.
export function AvatarCard({
  title,
  description,
  uploadTarget, // module:uploads
  children,
}: {
  title: string
  description: string
  // Set once Neon Object Storage is configured: uploads replace the Pro toast.
  uploadTarget?: UploadTarget // module:uploads
  children: React.ReactNode
}) {
  const triggerClassName =
    "absolute top-5 right-5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50 max-sm:size-14 sm:size-20 [&>*]:size-full"

  let trigger = (
    <button
      type="button"
      aria-label="Upload avatar"
      onClick={() => toastIncludedInPro("Avatar upload")}
      className={triggerClassName}
    >
      {children}
    </button>
  )

  // module:uploads start
  if (uploadTarget) {
    trigger = (
      <ImageUploadButton target={uploadTarget} className={triggerClassName}>
        {children}
      </ImageUploadButton>
    )
  }
  // module:uploads end

  return (
    <SectionCard
      title={<span className="block pr-16 sm:pr-24">{title}</span>}
      description={
        <span className="block pr-16 sm:pr-24">
          {description}
          <br />
          Click on the avatar to upload a custom one from your files.
        </span>
      }
      footer={<p>An avatar is optional but strongly recommended.</p>}
    >
      {trigger}
    </SectionCard>
  )
}
