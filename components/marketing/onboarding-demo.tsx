"use client"

import { ArrowRight, Check, Mail, Sparkles, Users } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

// The Pro section's centerpiece: the onboarding flow playing through its steps
// on its own, like the hero's module deck. Hovering pauses it, and each step
// in the rail can be clicked. Decorative mock, no form is submitted.

const steps = [
  { key: "workspace", label: "Create a workspace" },
  { key: "invite", label: "Invite your team" },
  { key: "plan", label: "Pick a plan" },
  { key: "done", label: "You're all set" },
] as const

const STEP_MS = 3200

export function OnboardingDemo() {
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP_MS)
    return () => clearTimeout(id)
  }, [step, paused])

  const current = steps[step].key

  return (
    <div
      className="mx-auto grid max-w-3xl overflow-hidden rounded-2xl border bg-background text-left shadow-2xl shadow-neutral-900/10 md:grid-cols-[220px_1fr] dark:shadow-black/50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ol className="flex gap-1 border-b bg-muted/40 p-3 max-md:overflow-x-auto md:flex-col md:border-r md:border-b-0 md:p-4">
        {steps.map((item, index) => (
          <li key={item.key} className="shrink-0">
            <button
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                index === step
                  ? "bg-background font-medium shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums transition-colors",
                  index < step &&
                    "border-transparent bg-emerald-500 text-white",
                  index === step && "border-foreground"
                )}
              >
                {index < step ? <Check className="size-3" /> : index + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap",
                  index !== step && "max-md:hidden"
                )}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
        <li className="mt-auto hidden pt-6 md:block">
          <div className="h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </li>
      </ol>

      {/* Fixed height, sized for the tallest step, so switching steps never
          resizes the card and shifts the page. */}
      <div className="flex h-[420px] items-center justify-center overflow-hidden p-6 sm:p-10">
        <div
          key={current}
          className="w-full max-w-sm animate-slide-up-fade [--offset:8px]"
        >
          {current === "workspace" && <WorkspaceStep />}
          {current === "invite" && <InviteStep />}
          {current === "plan" && <PlanStep />}
          {current === "done" && <DoneStep />}
        </div>
      </div>
    </div>
  )
}

function StepHeading({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-6 text-center">
      <span className="mx-auto mb-4 flex size-9 items-center justify-center rounded-lg bg-foreground text-sm font-semibold text-background">
        A
      </span>
      <h3 className="font-display text-xl font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium">{label}</p>
      <div className="flex h-9 items-center rounded-md border px-3 text-sm shadow-xs">
        {children}
      </div>
    </div>
  )
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-5 flex h-9 items-center justify-center gap-1.5 rounded-md bg-foreground text-sm font-medium text-background">
      {children}
    </span>
  )
}

function WorkspaceStep() {
  return (
    <>
      <StepHeading
        title="Create your workspace"
        text="A shared space for your team, projects and billing."
      />
      <div className="grid gap-3">
        <Field label="Workspace name">Acme Inc</Field>
        <Field label="Workspace slug">
          <span className="text-muted-foreground">app.acme.com/</span>acme
        </Field>
      </div>
      <PrimaryButton>
        Continue <ArrowRight className="size-3.5" />
      </PrimaryButton>
    </>
  )
}

function InviteStep() {
  const invites = [
    ["sarah@acme.com", "Admin"],
    ["tom@acme.com", "Member"],
  ]
  return (
    <>
      <StepHeading
        title="Invite your teammates"
        text="They get a branded email with a one-click join link."
      />
      <ul className="grid gap-2">
        {invites.map(([email, role]) => (
          <li
            key={email}
            className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm shadow-xs"
          >
            <Mail className="size-3.5 text-muted-foreground" />
            <span className="flex-1 truncate">{email}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {role}
            </span>
          </li>
        ))}
      </ul>
      <PrimaryButton>
        <Users className="size-3.5" /> Send 2 invites
      </PrimaryButton>
    </>
  )
}

function PlanStep() {
  const plans = [
    { name: "Starter", price: "$0", note: "For side projects" },
    { name: "Team", price: "$12", note: "Per seat, per month", selected: true },
  ]
  return (
    <>
      <StepHeading
        title="Choose your plan"
        text="Start free, upgrade when your team grows."
      />
      <div className="grid grid-cols-2 gap-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-lg border p-3",
              plan.selected && "border-foreground ring-1 ring-foreground"
            )}
          >
            <p className="text-sm font-medium">{plan.name}</p>
            <p className="mt-2 font-display text-2xl font-medium">
              {plan.price}
            </p>
            <p className="text-[11px] text-muted-foreground">{plan.note}</p>
          </div>
        ))}
      </div>
      <PrimaryButton>Start 14-day trial</PrimaryButton>
    </>
  )
}

function DoneStep() {
  return (
    <div className="text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Sparkles className="size-5" />
      </span>
      <h3 className="mt-4 font-display text-xl font-medium">Welcome to Acme</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Your workspace is ready. Here&apos;s a checklist to get going.
      </p>
      <ul className="mt-5 grid gap-2 text-left text-sm">
        {["Workspace created", "2 teammates invited", "Team plan trial"].map(
          (item) => (
            <li
              key={item}
              className="flex items-center gap-2 rounded-md border px-3 py-2"
            >
              <Check className="size-3.5 text-emerald-600" />
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  )
}
