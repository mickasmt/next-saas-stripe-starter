"use client"

import { SectionCard } from "@/components/dashboard/section-card"
import { toastIncludedInPro } from "@/components/dashboard/settings/pro-toast"

// Uploading needs file storage, which ships with Pro.
export function AvatarCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
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
      <button
        type="button"
        aria-label="Upload avatar"
        onClick={() => toastIncludedInPro("Avatar upload")}
        className="absolute top-5 right-5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50 max-sm:size-14 sm:size-20 [&>*]:size-full"
      >
        {children}
      </button>
    </SectionCard>
  )
}
