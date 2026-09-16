"use client"

import {
  BookOpen,
  Check,
  CreditCard,
  History,
  KeyRound,
  Newspaper,
  RotateCcw,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react"
import { useState, type ReactNode } from "react"

import {
  applyPatch,
  planChange,
  resolveModules,
  toEnvLines,
  type Change,
  type OwnValues,
  type PanelModule,
  type PanelService,
} from "@/components/dev/modules-graph"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// A playable copy of the dev panel for the landing page. It runs on the real
// dependency graph (components/dev/modules-graph.ts) with made-up data, and
// keeps everything in local state: nothing is saved, no cookie is set.
// Next to it, a mock of the app shows the routes each module serves, so a
// switch visibly adds or removes pages.

const demoModules: PanelModule[] = [
  demoModule("auth", "Authentication", "Sign-in, sign-up and the dashboard."),
  demoModule("billing", "Billing", "Subscriptions and customer portal.", [
    "auth",
  ]),
  demoModule("admin", "Admin panel", "User management for platform admins.", [
    "auth",
  ]),
  demoModule("docs", "Documentation", "MDX documentation powered by Fumadocs."),
  demoModule("blog", "Blog", "MDX articles with authors and categories."),
  demoModule("changelog", "Changelog", "Product updates on a single page."),
]

const demoServices: PanelService[] = [
  demoService("database", "Database", "Neon"),
  demoService("auth", "Auth", "Better Auth"),
  demoService("payments", "Payments", "Stripe"),
]

const appearance: Record<string, { icon: LucideIcon; tint: string }> = {
  auth: {
    icon: KeyRound,
    tint: "bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300",
  },
  billing: {
    icon: CreditCard,
    tint: "bg-violet-100 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300",
  },
  admin: {
    icon: ShieldCheck,
    tint: "bg-rose-100 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300",
  },
  docs: {
    icon: BookOpen,
    tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  blog: {
    icon: Newspaper,
    tint: "bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300",
  },
  changelog: {
    icon: History,
    tint: "bg-indigo-100 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300",
  },
}

// What the mock app serves, and which module each route belongs to.
const routes: { path: string; module: string | null }[] = [
  { path: "/", module: null },
  { path: "/pricing", module: "billing" },
  { path: "/login", module: "auth" },
  { path: "/dashboard", module: "auth" },
  { path: "/dashboard/billing", module: "billing" },
  { path: "/admin", module: "admin" },
  { path: "/docs", module: "docs" },
  { path: "/blog", module: "blog" },
  { path: "/changelog", module: "changelog" },
]

const initial: OwnValues = Object.fromEntries(
  demoModules.map((m) => [m.key, m.inherited])
)

type Pending = { key: string; on: boolean; change: Change }

export function PanelDemo() {
  const [own, setOwn] = useState(initial)
  const [confirming, setConfirming] = useState<Pending | null>(null)

  const resolved = resolveModules(demoModules, demoServices, own)
  const isOn = (key: string) => resolved.get(key)!.enabled
  const labelOf = (key: string) =>
    demoModules.find((m) => m.key === key)?.label ?? key
  const enabledCount = demoModules.filter((m) => isOn(m.key)).length
  const changedCount = demoModules.filter(
    (m) => own[m.key] !== m.inherited
  ).length
  const envLines = toEnvLines(demoModules, own)

  function commit(patch: Change["patch"] | "reset") {
    setConfirming(null)
    setOwn((current) => applyPatch(demoModules, current, patch))
  }

  function toggle(key: string, on: boolean) {
    const change = planChange(demoModules, demoServices, own, key, on)
    if (!change.possible) return
    const addsDependencies = Object.keys(change.patch).some((k) => k !== key)
    if (change.turnsOff.length > 0 || addsDependencies) {
      setConfirming({ key, on, change })
      return
    }
    commit(change.patch)
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
      <AppPreview isOn={isOn} />

      <div className="w-full max-w-sm shrink-0">
        <div className="overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-2xl ring-1 shadow-neutral-900/10 ring-foreground/5 dark:shadow-black/50">
          <header className="flex items-start justify-between gap-3 border-b px-4 pt-3.5 pb-3">
            <div className="min-w-0 text-left">
              <p className="flex items-center gap-2 font-medium">
                Modules
                <kbd className="inline-flex h-5 items-center rounded border bg-muted px-1.5 font-sans text-[10px] font-medium text-muted-foreground">
                  ⌥M
                </kbd>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <span className="tabular-nums">
                  {enabledCount} of {demoModules.length} on
                </span>{" "}
                · Development only
              </p>
            </div>
            <span
              aria-hidden
              className="-mr-1 flex size-6 items-center justify-center rounded-md text-muted-foreground"
            >
              <X className="size-3.5" />
            </span>
          </header>

          <ul className="grid grid-cols-[minmax(0,1fr)] gap-0.5 p-1.5">
            {demoModules.map((module) => (
              <DemoRow
                key={module.key}
                module={module}
                enabled={isOn(module.key)}
                changed={own[module.key] !== module.inherited}
                paused={resolved.get(module.key)!.blockedBy}
                labelOf={labelOf}
                confirming={confirming?.key === module.key ? confirming : null}
                onToggle={(on) => toggle(module.key, on)}
                onConfirm={() => confirming && commit(confirming.change.patch)}
                onCancel={() => setConfirming(null)}
              />
            ))}
          </ul>

          <section className="border-t px-1.5 pt-2.5 pb-1.5 text-left">
            <h3 className="px-2.5 pb-1 text-[11px] font-medium text-muted-foreground">
              Services
            </h3>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-0.5">
              {demoServices.map((service) => (
                <li
                  key={service.key}
                  className="flex items-center gap-3 px-2.5 py-1.5"
                >
                  <span
                    aria-hidden
                    className="mx-[0.8125rem] size-1.5 shrink-0 rounded-full bg-emerald-500"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {service.label}{" "}
                    <span className="text-muted-foreground">
                      · {service.providerLabel}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="size-3" />
                    Configured
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <footer className="flex items-center justify-between gap-2 border-t bg-muted/40 px-3 py-2">
            <p
              aria-live="polite"
              className="min-w-0 truncate pl-1 text-left font-mono text-[11px] text-muted-foreground"
              title={envLines.join("\n")}
            >
              {envLines.length > 0
                ? envLines.join(" ")
                : "Matches your environment"}
            </p>
            <Button
              size="xs"
              variant="ghost"
              disabled={changedCount === 0}
              onClick={() => commit("reset")}
            >
              <RotateCcw />
              Reset
            </Button>
          </footer>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Try it: flip a switch. The real panel lives in the corner of your dev
          server.
        </p>
      </div>
    </div>
  )
}

function DemoRow({
  module,
  enabled,
  changed,
  paused,
  labelOf,
  confirming,
  onToggle,
  onConfirm,
  onCancel,
}: {
  module: PanelModule
  enabled: boolean
  changed: boolean
  paused: string[]
  labelOf: (key: string) => string
  confirming: Pending | null
  onToggle: (on: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const { icon: Icon, tint } = appearance[module.key]
  const id = `panel-demo-${module.key}`

  return (
    <li
      className={cn(
        "rounded-xl text-left transition-colors",
        confirming ? "bg-muted/60" : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3 px-2.5 py-2">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
            enabled
              ? tint
              : "bg-neutral-100 text-neutral-400 dark:bg-white/5 dark:text-neutral-500"
          )}
        >
          <Icon className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <label
              htmlFor={id}
              className={cn(
                "truncate text-sm font-medium transition-colors",
                !enabled && "text-foreground/70"
              )}
            >
              {module.label}
            </label>
            {changed && (
              <span className="flex h-4 items-center gap-1 rounded-full bg-blue-500/10 px-1.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                <span className="size-1 rounded-full bg-current" />
                Modified
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {paused.length > 0 && module.dependsOn.length > 0 && !enabled ? (
              <span className="text-amber-600 dark:text-amber-400">
                Paused · needs {listOf(paused.map(labelOf))}
              </span>
            ) : (
              module.description
            )}
          </p>
        </div>

        <Switch
          id={id}
          checked={confirming ? confirming.on : enabled}
          onCheckedChange={(on) => (confirming ? onCancel() : onToggle(on))}
        />
      </div>

      <div
        inert={!confirming}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
          confirming
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {confirming && (
            <div className="px-2.5 pb-2.5 pl-[3.375rem]">
              <ConfirmChange
                module={module}
                pending={confirming}
                labelOf={labelOf}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

function ConfirmChange({
  module,
  pending: { on, change },
  labelOf,
  onConfirm,
  onCancel,
}: {
  module: PanelModule
  pending: Pending
  labelOf: (key: string) => string
  onConfirm: () => void
  onCancel: () => void
}) {
  const dependencies = Object.keys(change.patch).filter(
    (key) => key !== module.key && change.patch[key] !== false
  )

  return (
    <div className="rounded-lg border bg-background p-3 shadow-xs">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {on ? (
          <>
            <Strong>{module.label}</Strong> needs{" "}
            <Strong>{listOf(dependencies.map(labelOf))}</Strong>, which is off.
          </>
        ) : (
          <>
            Turning off <Strong>{module.label}</Strong> also pauses{" "}
            <Strong>{listOf(change.turnsOff.map(labelOf))}</Strong>.
          </>
        )}
      </p>
      <div className="mt-3 flex justify-end gap-1.5">
        <Button size="xs" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="xs"
          variant={on ? "default" : "destructive"}
          onClick={onConfirm}
        >
          {on
            ? `Turn on ${dependencies.length === 1 ? "both" : `all ${dependencies.length + 1}`}`
            : `Turn off ${change.turnsOff.length + 1} modules`}
        </Button>
      </div>
    </div>
  )
}

// The app the panel drives: its header links and its route table follow the
// modules that are on.
function AppPreview({ isOn }: { isOn: (key: string) => boolean }) {
  const nav = [
    { label: "Docs", module: "docs" },
    { label: "Blog", module: "blog" },
    { label: "Changelog", module: "changelog" },
    { label: "Pricing", module: "billing" },
  ].filter((link) => isOn(link.module))

  return (
    <div
      aria-hidden
      className="w-full max-w-xl min-w-0 overflow-hidden rounded-2xl border bg-background text-left shadow-xl shadow-neutral-900/5 max-lg:hidden dark:shadow-black/40"
    >
      <div className="flex h-10 items-center gap-3 border-b bg-muted/40 px-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2.5 rounded-full border border-foreground/15"
            />
          ))}
        </div>
        <div className="mx-auto flex h-6 w-56 items-center justify-center rounded-md border bg-background text-[11px] text-muted-foreground">
          localhost:3000
        </div>
        <span className="w-[42px]" />
      </div>

      <div className="flex h-12 items-center justify-between gap-4 border-b px-5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="size-4 rounded-[5px] bg-foreground" />
          Acme
        </span>
        <nav className="flex min-w-0 flex-1 items-center justify-center gap-4 text-xs text-muted-foreground">
          {nav.map((link) => (
            <span
              key={link.label}
              className="animate-slide-up-fade [--offset:4px]"
            >
              {link.label}
            </span>
          ))}
        </nav>
        <span
          className={cn(
            "rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background transition-opacity duration-300",
            !isOn("auth") && "opacity-0"
          )}
        >
          Sign in
        </span>
      </div>

      <div className="px-5 pt-6 pb-5">
        <div className="h-3 w-40 rounded-full bg-foreground/80" />
        <div className="mt-2.5 h-2 w-64 rounded-full bg-muted" />
        <div className="mt-1.5 h-2 w-52 rounded-full bg-muted" />

        <div className="mt-6 overflow-hidden rounded-xl border">
          <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
            <span>Route</span>
            <span>Status</span>
          </div>
          <ul className="divide-y font-mono text-xs">
            {routes.map((route) => {
              const live = route.module === null || isOn(route.module)
              return (
                <li
                  key={route.path}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <span
                    className={cn(
                      "transition-colors duration-300",
                      !live && "text-muted-foreground/60 line-through"
                    )}
                  >
                    {route.path}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] leading-none transition-colors duration-300",
                      live
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-neutral-500/10 text-muted-foreground"
                    )}
                  >
                    {live ? "200" : "404"}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>
}

function listOf(items: string[]) {
  return new Intl.ListFormat("en", { type: "conjunction" }).format(items)
}

function demoModule(
  key: string,
  label: string,
  description: string,
  dependsOn: string[] = []
): PanelModule {
  return {
    key,
    label,
    description,
    default: true,
    inherited: true,
    source: "default",
    envName: `FEATURE_${key.toUpperCase()}`,
    dependsOn,
    requires: [],
  }
}

function demoService(
  key: string,
  label: string,
  providerLabel: string
): PanelService {
  return { key, label, providerLabel, setupUrl: "#", missingEnv: [] }
}
