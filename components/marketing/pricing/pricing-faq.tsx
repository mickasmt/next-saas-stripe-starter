import { ChevronDown } from "lucide-react"

import { faqs } from "@/components/marketing/pricing/data"

// Heading on the left, questions on the right. Native <details>, so the
// answers open without JavaScript and stay findable with the browser search.

export function PricingFaq() {
  return (
    <div className="grid grid-cols-1 gap-8 px-4 py-20 sm:px-12 md:grid-cols-3">
      <div>
        <h2 className="font-display text-3xl font-medium text-balance sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Everything about plans, billing and limits.
        </p>
      </div>

      <div className="divide-y divide-grid-border md:col-span-2">
        {faqs.map((faq) => (
          <details key={faq.question} className="group faq-details py-2 first:pt-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left font-medium sm:text-lg [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <p className="pb-3 text-sm text-pretty text-muted-foreground sm:text-base">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  )
}
