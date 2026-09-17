import { Check } from "lucide-react"

import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Create your organization",
    description: "Name it and pick a slug.",
    done: true,
  },
  {
    title: "Complete your profile",
    description: "Name and avatar, so your team recognizes you.",
    done: true,
  },
  {
    title: "Invite your team",
    description: "Members get their own seat and role.",
    done: false,
  },
  {
    title: "Connect payments",
    description: "Pick a plan and add a payment method.",
    done: false,
  },
  {
    title: "Create your first project",
    description: "The rest of the product unlocks from there.",
    done: false,
  },
]

export function OnboardingPreview() {
  const done = steps.filter((step) => step.done).length

  return (
    <SectionCard
      title="Getting started"
      description="A guided setup, resumed wherever the member left it."
      footer={
        <>
          <p>
            {done} of {steps.length} steps done.
          </p>
          <Button variant="outline" size="sm" disabled>
            Skip for now
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${(done / steps.length) * 100}%` }}
          />
        </div>

        <div className="divide-y rounded-md border bg-background">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-medium",
                    step.done
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.done ? <Check className="size-3.5" /> : index + 1}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate font-medium",
                      step.done && "text-muted-foreground line-through"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {!step.done && (
                <Button variant="outline" size="sm" disabled>
                  Start
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}
