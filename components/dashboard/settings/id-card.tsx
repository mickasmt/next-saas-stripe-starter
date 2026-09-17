"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { SectionCard } from "@/components/dashboard/section-card"

export function IdCard({
  title,
  description,
  value,
}: {
  title: string
  description: string
  value: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <SectionCard
      title={title}
      description={description}
      footer={<p>Used when interacting with the API.</p>}
    >
      <div className="relative w-fit max-w-full rounded-md border bg-background py-2.5 pr-12 pl-3">
        <pre className="overflow-x-auto font-mono text-[13px] leading-5">
          {value}
        </pre>
        <button
          type="button"
          aria-label="Copy to clipboard"
          onClick={copy}
          className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-md bg-background ring-1 ring-border transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </SectionCard>
  )
}
