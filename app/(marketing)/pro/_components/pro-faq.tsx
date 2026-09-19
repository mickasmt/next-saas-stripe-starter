import { ChevronDown } from "lucide-react"

import { GridSection } from "@/components/marketing/grid-section"
import { proPricing } from "@/components/marketing/pro-showcase"

// The shared `name` on the <details> makes the browser keep only one open.

// TODO: keep these answers in line with the real license, refund policy and
// support terms before launch.
const faqs: { question: string; answer: string }[] = [
  {
    question: "How much does Pro cost?",
    answer: `One payment of ${proPricing.earlyBird}, no subscription and no per-seat fee. Taxes may apply depending on your country.`,
  },
  {
    question: "Is it really a one-time payment?",
    answer:
      "Yes. You pay once and keep access to the private repository, every Pro module and all future updates. There is nothing to renew.",
  },
  {
    question: "What do I get exactly?",
    answer:
      "Access to the private repository with every Pro module: onboarding, teams and roles, seat billing, emails, account security and the admin panel. It is built on top of the free starter, so you keep the same stack.",
  },
  {
    question: "Do I need the free starter first?",
    answer:
      "No. The Pro repository is a complete project, so you can start from it directly. If you already began with the free starter, the Pro modules install like any other module.",
  },
  {
    question: "What license do I get?",
    answer:
      "You can build unlimited commercial projects for yourself or your clients. You can't resell or redistribute the source code, on its own or as another starter or template.",
  },
  {
    question: "Can I use it for client work?",
    answer:
      "Yes. Ship it in as many client projects as you like, as long as the code ends up inside the product and isn't handed over as a starter kit.",
  },
  {
    question: "Do I get future updates?",
    answer:
      "Yes, all of them, for as long as the product is maintained. You pull new versions from the repository whenever you want.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "If Pro isn't right for you, email us within 14 days of your purchase and we'll refund it in full. Since the source code can't be returned, please reach out before you start shipping it.",
  },
  {
    question: "Is there a team or agency license?",
    answer:
      "One purchase covers one developer. Contact us if several people on your team need repository access and we'll sort out a fair price.",
  },
  {
    question: "How do I get support?",
    answer:
      "Reach out by email and you'll get a reply from the author, usually within a couple of business days. Bug reports and questions about the modules are always welcome.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "Major credit and debit cards. You receive an invoice by email right after checkout.",
  },
  {
    question: "How fast do I get access?",
    answer:
      "Right after the payment. You'll receive an invitation to the private repository by email, and you can clone it immediately.",
  },
]

export function ProFaq() {
  return (
    <GridSection innerClassName="px-0 sm:px-0">
      <div className="grid grid-cols-1 gap-8 px-4 py-20 sm:px-12 md:grid-cols-3">
        <div>
          <h2 className="font-display text-3xl font-medium text-balance sm:text-4xl">
            Questions before you buy
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Price, license, refunds and support.
          </p>
        </div>

        <div className="divide-y divide-grid-border md:col-span-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              name="pro-faq"
              className="group faq-details py-2 first:pt-0"
            >
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
    </GridSection>
  )
}
