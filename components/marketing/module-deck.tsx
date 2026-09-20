"use client"

import {
  BookOpen,
  CreditCard,
  KeyRound,
  Newspaper,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

// The hero's picture of the module system: a fanned hand of cards, one per
// module. The deck plays through a few real-world setups on its own, switching
// modules on and off (greying the cards that are off) while respecting module
// dependencies, so visitors see that any combination stands on its own.

type ModuleKey = "auth" | "billing" | "admin" | "blog" | "docs"

type Module = {
  key: ModuleKey
  title: string
  description: string
  icon: LucideIcon
  // Tint of the icon badge while the module is on.
  tint: string
  // Static fan pose, applied on the wrapper so the deal-in animation (which
  // moves the card itself) does not fight it.
  pose: string
  // Mirrors dependsOn in config/features.ts.
  dependsOn?: ModuleKey[]
}

const modules: Module[] = [
  {
    key: "auth",
    title: "Auth",
    description: "Sign-in, sessions and organizations.",
    icon: KeyRound,
    tint: "bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300",
    pose: "-rotate-[10deg] translate-y-2",
  },
  {
    key: "billing",
    title: "Billing",
    description: "Stripe subscriptions and customer portal.",
    icon: CreditCard,
    tint: "bg-violet-100 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300",
    pose: "rotate-[7deg] -translate-y-3",
    dependsOn: ["auth"],
  },
  {
    key: "admin",
    title: "Admin",
    description: "Manage users, roles and bans.",
    icon: ShieldCheck,
    tint: "bg-rose-100 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300",
    pose: "-rotate-[12deg] translate-y-6",
    dependsOn: ["auth"],
  },
  {
    key: "blog",
    title: "Blog",
    description: "MDX articles with authors and categories.",
    icon: Newspaper,
    tint: "bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300",
    pose: "rotate-[5deg] -translate-y-2",
  },
  {
    key: "docs",
    title: "Docs",
    description: "Searchable documentation, powered by Fumadocs.",
    icon: BookOpen,
    tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300",
    pose: "-rotate-[9deg] translate-y-3",
  },
]

const setups: { label: string; on: ModuleKey[] }[] = [
  { label: "Full SaaS", on: ["auth", "billing", "admin", "blog", "docs"] },
  { label: "Content site", on: ["blog", "docs"] },
  { label: "Paid newsletter", on: ["auth", "billing", "blog"] },
  { label: "Product docs", on: ["docs"] },
  { label: "Internal tool", on: ["auth", "admin", "docs"] },
  { label: "SaaS with a blog", on: ["auth", "billing", "admin", "blog"] },
]

// A module is only on when every module it depends on is on too, so a setup
// can never show Billing or Admin without Auth.
function resolve(on: ModuleKey[]) {
  const set = new Set(on)
  return new Set(
    modules
      .filter(
        (m) =>
          set.has(m.key) && (m.dependsOn ?? []).every((dep) => set.has(dep))
      )
      .map((m) => m.key)
  )
}

const DEAL_IN_STAGGER_MS = 90
// Leaves the whole hand dealt in before the first switch flips.
const FIRST_STEP_MS = 2600
const STEP_MS = 2800

export function ModuleDeck() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setTimeout(
      () => setStep((s) => s + 1),
      step === 0 ? FIRST_STEP_MS : STEP_MS
    )
    return () => clearTimeout(id)
  }, [step])

  const setup = setups[step % setups.length]
  const enabled = resolve(setup.on)

  return (
    <div className="flex flex-col items-center">
      <ul className="flex flex-wrap justify-center gap-y-5 pt-4 pb-12 select-none sm:flex-nowrap sm:gap-y-0">
        {modules.map((module, index) => (
          <li
            key={module.key}
            className={cn(
              "relative -mx-0.5 w-[100px] transition-[scale] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.04] motion-reduce:hover:scale-100 sm:-mx-2 sm:w-36 lg:-mx-2 lg:w-52",
              module.pose
            )}
            style={{ zIndex: index + 1 }}
          >
            <ModuleCard
              module={module}
              on={enabled.has(module.key)}
              index={index}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ModuleCard({
  module,
  on,
  index,
}: {
  module: Module
  on: boolean
  index: number
}) {
  const Icon = module.icon
  // Switches flip one after another rather than all at once.
  const flipDelay = { transitionDelay: `${index * 70}ms` }

  return (
    <div
      className={cn(
        "flex w-full animate-deal-in flex-col rounded-2xl border p-3 transition-[background-color,border-color,box-shadow] duration-500 motion-reduce:animate-none sm:p-3.5 lg:p-4",
        on
          ? "border-neutral-900/10 bg-background shadow-lg shadow-neutral-900/5 dark:border-white/10 dark:shadow-black/40"
          : "border-neutral-900/5 bg-neutral-50 shadow-sm shadow-transparent dark:border-white/5 dark:bg-neutral-900"
      )}
      style={{
        animationDelay: `${450 + index * DEAL_IN_STAGGER_MS}ms`,
        ...flipDelay,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-500 lg:size-10",
            on
              ? module.tint
              : "bg-neutral-200/70 text-neutral-400 dark:bg-white/5 dark:text-neutral-600"
          )}
          style={flipDelay}
        >
          <Icon className="size-4 lg:size-5" />
        </span>
        <DeckSwitch on={on} style={flipDelay} />
      </div>

      <div
        className={cn(
          "mt-3 text-left transition-opacity duration-500 lg:mt-4",
          !on && "opacity-45"
        )}
        style={flipDelay}
      >
        <h3 className="font-display text-sm font-medium lg:text-base">
          {module.title}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[2lh] text-[11px] leading-snug text-muted-foreground max-sm:hidden lg:text-[13px]">
          {module.description}
        </p>
      </div>
    </div>
  )
}

// Display-only: the deck plays by itself, so this is not a form control.
function DeckSwitch({
  on,
  style,
}: {
  on: boolean
  style: React.CSSProperties
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full transition-colors duration-300",
        on ? "bg-primary" : "bg-input dark:bg-input/80"
      )}
      style={style}
    >
      <span
        className={cn(
          "block size-3 rounded-full shadow-sm transition-transform duration-300",
          on
            ? "translate-x-[11px] bg-background dark:bg-primary-foreground"
            : "translate-x-px bg-background dark:bg-neutral-500"
        )}
        style={style}
      />
    </span>
  )
}
