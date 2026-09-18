import { ArrowRight, Check } from "lucide-react"

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
    <div className="flex flex-col gap-6">
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

      <SectionCard
        title="Or as a modal"
        description="The same steps, over the dashboard, for members who land on a workspace that already exists."
        footer={<p>Both variants ship: pick one, delete the other.</p>}
      >
        <div className="rounded-md border bg-muted/40 p-6">
          <div className="mx-auto max-w-sm rounded-xl border bg-background p-5 shadow-lg">
            <div className="flex items-center gap-1.5 pb-4">
              {steps.map((step, index) => (
                <span
                  key={step.title}
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    index <= done ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <p className="font-medium">{steps[done].title}</p>
            <p className="pt-1 text-muted-foreground">
              {steps[done].description}
            </p>
            <div className="flex items-center justify-between pt-5">
              <Button variant="ghost" size="sm" disabled>
                Skip
              </Button>
              <Button size="sm" disabled>
                Continue
                <ArrowRight />
              </Button>
            </div>
            <p className="pt-3 text-center text-muted-foreground">
              Step {done + 1} of {steps.length}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
