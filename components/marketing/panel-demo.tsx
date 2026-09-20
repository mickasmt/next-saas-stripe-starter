"use client"

import {
  BookOpen,
  Check,
  Copy,
  CreditCard,
  History,
  KeyRound,
  Newspaper,
  RotateCcw,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import {
  applyPatch,
  planChange,
  resolveModules,
  toConfigLines,
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
// switch visibly adds or removes pages. It loops a short scene on its own:
// turn Auth off, see Billing and Admin pause, then bring it back. A click
// pauses it until the visitor goes idle.

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
// No leading slash: these are mock labels, not links for the prune check.
const routes: { path: string; module: string | null }[] = [
  { path: "", module: null },
  { path: "pricing", module: "billing" },
  { path: "login", module: "auth" },
  { path: "dashboard", module: "auth" },
  { path: "dashboard/billing", module: "billing" },
  { path: "admin", module: "admin" },
  { path: "docs", module: "docs" },
  { path: "blog", module: "blog" },
  { path: "changelog", module: "changelog" },
]

const initial: OwnValues = Object.fromEntries(
  demoModules.map((m) => [m.key, m.default])
)

type Pending = { key: string; on: boolean; change: Change }

// One step of the scene: how long to wait, then what to do.
type SceneStep = { ms: number; run: () => void }
// How long the demo stays still after the last touch before it plays again.
const IDLE_RESUME_MS = 4000

export function PanelDemo() {
  const [own, setOwn] = useState(initial)
  const [confirming, setConfirming] = useState<Pending | null>(null)
  // `leaving` keeps the drawer on screen until its exit animation ends.
  const [leaving, setLeaving] = useState<Pending | null>(null)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(0)
  const [inView, setInView] = useState(false)
  const [touched, setTouched] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [pressed, setPressed] = useState(false)
  // True while the cursor is being placed: it jumps there instead of gliding.
  const [snap, setSnap] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting)
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => clearTimeout(idleTimer.current), [])

  const playing = inView && !touched && !reducedMotion

  useEffect(() => {
    if (!playing) return
    const flip = (key: string, on: boolean) =>
      setOwn((current) =>
        applyPatch(
          demoModules,
          current,
          planChange(demoModules, demoServices, current, key, on).patch
        )
      )
    const authOff = planChange(
      demoModules,
      demoServices,
      initial,
      "auth",
      false
    )
    // The fake cursor: glide to a control, then click it. A click step waits
    // long enough for the glide (500ms) to land first.
    const pointAt = (selector: string) => {
      const panel = panelRef.current
      const el = panel?.querySelector(selector)
      if (!panel || !el) return
      const p = panel.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      setCursor({
        x: r.left - p.left + r.width / 2,
        y: r.top - p.top + r.height / 2,
      })
    }
    const press = () => {
      setPressed(true)
      setTimeout(() => setPressed(false), 180)
    }
    const park = () => {
      const panel = panelRef.current
      if (panel) setCursor({ x: panel.clientWidth - 40, y: panel.clientHeight })
    }
    const authPending: Pending = { key: "auth", on: false, change: authOff }
    // Start from the parked spot with no glide, so it never flies in from a corner.
    if (step === 0) {
      setSnap(true)
      park()
    }
    const scene: SceneStep[] = [
      {
        ms: 500,
        run: () => {
          setSnap(false)
          pointAt("li:has(#panel-demo-auth) [role=switch]")
        },
      },
      // Auth pauses Billing and Admin, so it asks first.
      {
        ms: 600,
        run: () => {
          press()
          setConfirming(authPending)
        },
      },
      { ms: 1000, run: () => pointAt("[data-demo=confirm]") },
      {
        ms: 600,
        run: () => {
          press()
          // `dismiss()` inlined: a render-scoped dep would restart the timer.
          setLeaving(authPending)
          setConfirming(null)
          flip("auth", false)
        },
      },
      // Click Authentication again to bring everything back.
      {
        ms: 1600,
        run: () => pointAt("li:has(#panel-demo-auth) [role=switch]"),
      },
      {
        ms: 600,
        run: () => {
          press()
          flip("auth", true)
        },
      },
      // Independent modules just switch.
      {
        ms: 1100,
        run: () => pointAt("li:has(#panel-demo-billing) [role=switch]"),
      },
      {
        ms: 600,
        run: () => {
          press()
          flip("billing", false)
        },
      },
      {
        ms: 300,
        run: () => pointAt("li:has(#panel-demo-docs) [role=switch]"),
      },
      {
        ms: 600,
        run: () => {
          press()
          flip("docs", false)
        },
      },
      {
        ms: 300,
        run: () => pointAt("li:has(#panel-demo-changelog) [role=switch]"),
      },
      {
        ms: 600,
        run: () => {
          press()
          flip("changelog", false)
        },
      },
      { ms: 1100, run: () => pointAt("[data-demo=reset]") },
      {
        ms: 600,
        run: () => {
          press()
          setOwn(initial)
        },
      },
      { ms: 1000, run: park },
      { ms: 2000, run: () => {} },
    ]
    const id = setTimeout(() => {
      scene[step].run()
      setStep((step + 1) % scene.length)
    }, scene[step].ms)
    return () => clearTimeout(id)
  }, [playing, step])

  // Any touch hands the demo over; it starts again from scratch once idle.
  function handOver() {
    setTouched(true)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      setConfirming(null)
      setLeaving(null)
      setOwn(initial)
      setStep(0)
      setTouched(false)
    }, IDLE_RESUME_MS)
  }

  const drawer = confirming ?? leaving

  function dismiss() {
    setLeaving(confirming)
    setConfirming(null)
  }

  const resolved = resolveModules(demoModules, demoServices, own)
  const isOn = (key: string) => resolved.get(key)!.enabled
  const labelOf = (key: string) =>
    demoModules.find((m) => m.key === key)?.label ?? key
  const changedCount = demoModules.filter(
    (m) => own[m.key] !== m.default
  ).length
  const configLines = toConfigLines(demoModules, own)

  function copyConfig() {
    navigator.clipboard?.writeText(configLines.join("\n")).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function commit(patch: Change["patch"] | "reset") {
    dismiss()
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
    <div
      ref={rootRef}
      className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8"
    >
      <AppPreview isOn={isOn} />

      <div ref={panelRef} className="relative w-full max-w-sm shrink-0">
        <div
          onPointerDown={handOver}
          onFocusCapture={handOver}
          className="overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-2xl ring-1 shadow-neutral-900/10 ring-foreground/5 dark:shadow-black/50"
        >
          <header className="flex items-start justify-between gap-3 border-b px-4 pt-3.5 pb-3">
            <div className="min-w-0 text-left">
              <p className="flex items-center gap-2 font-medium">
                Modules
                <kbd className="inline-flex h-5 items-center rounded border bg-muted px-1.5 font-sans text-[10px] font-medium text-muted-foreground">
                  ⌥M
                </kbd>
                <span className="inline-flex h-5 items-center rounded-sm bg-blue-500/10 px-1.5 font-sans text-[10px] font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
                  Dev only
                </span>
              </p>
            </div>
            <span
              aria-hidden
              className="-mr-1 flex size-6 items-center justify-center rounded-md text-muted-foreground"
            >
              <X className="size-3.5" />
            </span>
          </header>

          <div className="relative">
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-0.5 p-1.5">
              {demoModules.map((module) => (
                <DemoRow
                  key={module.key}
                  module={module}
                  enabled={isOn(module.key)}
                  changed={own[module.key] !== module.default}
                  paused={resolved.get(module.key)!.blockedBy}
                  labelOf={labelOf}
                  confirming={
                    confirming?.key === module.key ? confirming : null
                  }
                  onToggle={(on) => toggle(module.key, on)}
                  onCancel={dismiss}
                />
              ))}
            </ul>

            <footer className="flex items-center justify-between gap-2 border-t bg-muted/40 px-3 py-2">
              <p
                aria-live="polite"
                className="min-w-0 truncate pl-1 text-left text-xs text-muted-foreground"
              >
                For config/features.ts
              </p>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  className="rounded-sm"
                  size="xs"
                  variant="ghost"
                  disabled={changedCount === 0}
                  onClick={copyConfig}
                >
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied" : "Copy config"}
                </Button>
                <Button
                  data-demo="reset"
                  className="rounded-sm"
                  size="xs"
                  variant="ghost"
                  disabled={changedCount === 0}
                  onClick={() => commit("reset")}
                >
                  <RotateCcw />
                  Reset
                </Button>
              </div>
            </footer>

            {/* Drawer: blurs the list and floats over it, panel height stays fixed. */}
            {drawer && (
              <>
                <div
                  aria-hidden
                  onClick={dismiss}
                  className={cn(
                    "absolute inset-0 bg-popover/50 backdrop-blur-[3px]",
                    confirming
                      ? "animate-in duration-200 fade-in"
                      : "pointer-events-none animate-out duration-[180ms] fill-mode-forwards fade-out"
                  )}
                />
                <div
                  inert={!confirming}
                  // Unmount after the exit animation.
                  onAnimationEnd={(event) => {
                    if (event.target !== event.currentTarget) return
                    if (!confirming) setLeaving(null)
                  }}
                  className={cn(
                    "absolute inset-x-1.5 bottom-1.5 [--offset:6px]",
                    confirming ? "animate-drawer-in" : "animate-drawer-out"
                  )}
                >
                  <ConfirmChange
                    module={demoModules.find((m) => m.key === drawer.key)!}
                    pending={drawer}
                    labelOf={labelOf}
                    onConfirm={() => commit(drawer.change.patch)}
                    onCancel={dismiss}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <FakeCursor
          x={cursor.x}
          y={cursor.y}
          visible={playing}
          pressed={pressed}
          snap={snap}
        />

        <p className="mt-3 text-center text-xs text-muted-foreground">
          The real panel sits in the bottom corner of your dev server.
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
  onCancel,
}: {
  module: PanelModule
  enabled: boolean
  changed: boolean
  paused: string[]
  labelOf: (key: string) => string
  confirming: Pending | null
  onToggle: (on: boolean) => void
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
              <span className="flex h-4 items-center gap-1 rounded-full bg-red-500/10 px-1.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                <span className="size-1 rounded-full bg-current" />
                Disabled
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
    <div className="rounded-lg border bg-background p-3 shadow-lg">
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
        <Button
          className="rounded-sm"
          size="xs"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          data-demo="confirm"
          className="rounded-sm"
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
                  key={route.path || "/"}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <span
                    className={cn(
                      "transition-colors duration-300",
                      !live && "text-muted-foreground/60 line-through"
                    )}
                  >
                    /{route.path}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] leading-none transition-colors duration-300",
                      live
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
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

function FakeCursor({
  x,
  y,
  visible,
  pressed,
  snap,
}: {
  x: number
  y: number
  visible: boolean
  pressed: boolean
  snap: boolean
}) {
  return (
    <div
      aria-hidden
      style={{ transform: `translate(${x}px, ${y}px)` }}
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-20",
        snap
          ? "transition-opacity duration-300"
          : "transition-[transform,opacity] duration-500 ease-in-out",
        visible ? "opacity-100" : "opacity-0 duration-200"
      )}
    >
      <span
        className={cn(
          "absolute -top-3 -left-3 size-6 rounded-full bg-foreground/20 transition-all duration-200",
          pressed ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )}
      />
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "relative size-5 origin-top-left drop-shadow-md transition-transform duration-150",
          pressed && "scale-90"
        )}
      >
        <path
          d="M4 2.5v17l4.6-4.3 3 6.8 3-1.3-3-6.7h6.2z"
          className="fill-foreground stroke-background"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
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
