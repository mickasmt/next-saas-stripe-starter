"use client"

import {
  ArrowUpRight,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  Copy,
  CreditCard,
  History,
  KeyRound,
  Lock,
  Mail,
  Rocket,
  Armchair,
  Users,
  LayoutGrid,
  Newspaper,
  RotateCcw,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import {
  useEffect,
  useId,
  useOptimistic,
  useState,
  useTransition,
  type ReactNode,
} from "react"

import {
  applyPatch,
  planChange,
  resolveModules,
  toConfigLines,
  type Change,
  type OverridePatch,
  type OwnValues,
  type PanelModule,
  type PanelService,
} from "@/components/dev/modules-graph"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  resetFeatureOverrides,
  setFeatureOverrides,
} from "@/lib/features/dev-actions"
import { proModules } from "@/config/pro-modules"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

// The dev panel: switch modules on and off for this browser. Every change is
// previewed against the dependency graph first, and anything it would also
// turn on or pause is confirmed inline before it is applied.

// Same icons and tints as the hero's module deck.
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

const proAppearance: Record<string, { icon: LucideIcon }> = {
  onboarding: { icon: Rocket },
  emails: { icon: Mail },
  teams: { icon: Users },
  seats: { icon: Armchair },
  security: { icon: Lock },
  adminPro: { icon: ShieldCheck },
}

const fallbackAppearance = {
  icon: Box,
  tint: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300",
}

type Pending = { key: string; on: boolean; change: Change }

export function ModulesPanel({
  modules,
  services,
  own: serverOwn,
}: {
  modules: PanelModule[]
  services: PanelService[]
  own: OwnValues
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"free" | "pro">("free")
  const [, startTransition] = useTransition()
  const [error, setError] = useState(false)
  const [confirming, setConfirming] = useState<Pending | null>(null)
  const [own, applyOptimistic] = useOptimistic(
    serverOwn,
    (current, patch: OverridePatch | "reset") =>
      applyPatch(modules, current, patch)
  )

  const resolved = resolveModules(modules, services, own)
  const labelOf = (key: string) =>
    modules.find((module) => module.key === key)?.label ?? key
  const serviceOf = (key: string) =>
    services.find((service) => service.key === key)
  const enabledCount = modules.filter(
    (m) => resolved.get(m.key)!.enabled
  ).length
  const changedCount = modules.filter((m) => own[m.key] !== m.default).length
  const configLines = toConfigLines(modules, own)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== "KeyM" || !event.altKey) return
      if (event.metaKey || event.ctrlKey || event.shiftKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, select, [contenteditable]")) return
      event.preventDefault()
      setOpen((value) => !value)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function commit(patch: OverridePatch | "reset") {
    setConfirming(null)
    setError(false)
    startTransition(async () => {
      applyOptimistic(patch)
      try {
        if (patch === "reset") await resetFeatureOverrides()
        else await setFeatureOverrides(patch)
      } catch {
        // The optimistic state rolls back on its own once the transition ends.
        setError(true)
      }
    })
  }

  function toggle(key: string, on: boolean) {
    const change = planChange(modules, services, own, key, on)
    if (!change.possible) return
    const addsDependencies = Object.keys(change.patch).some((k) => k !== key)
    if (change.turnsOff.length > 0 || addsDependencies) {
      setConfirming({ key, on, change })
      return
    }
    commit(change.patch)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) setConfirming(null)
      }}
    >
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label={`Modules, ${enabledCount} of ${modules.length} on`}
            className="fixed right-5 bottom-16 z-50 flex h-9 items-center gap-2 rounded-full border border-neutral-900/10 bg-background/85 pr-3.5 pl-3 text-xs font-medium shadow-lg shadow-neutral-900/10 backdrop-blur-md transition-[transform,background-color] outline-none hover:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.97] aria-expanded:bg-background dark:border-white/10 dark:shadow-black/40"
          />
        }
      >
        <LayoutGrid className="size-3.5 text-muted-foreground" />
        <span className="tabular-nums">
          {enabledCount}
          <span className="text-muted-foreground">/{modules.length}</span>
        </span>
        {changedCount > 0 && (
          <span
            aria-hidden
            className="-mr-1 size-1.5 rounded-full bg-blue-500"
          />
        )}
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="w-[min(26rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl shadow-neutral-900/10 dark:shadow-black/50"
      >
        <header className="flex items-start justify-between gap-3 border-b px-4 pt-3.5 pb-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 font-medium">
              Modules
              <kbd className="hidden h-5 items-center rounded border bg-muted px-1.5 font-sans text-[10px] font-medium text-muted-foreground sm:inline-flex">
                ⌥M
              </kbd>
              <span className="inline-flex h-5 items-center rounded-sm bg-blue-500/10 px-1.5 font-sans text-[10px] font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
                Dev only
              </span>
            </h2>
          </div>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Close"
            className="-mr-1.5 text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </header>

        <div role="tablist" className="relative grid grid-cols-2 border-b">
          <TabButton active={tab === "free"} onClick={() => setTab("free")}>
            Free
          </TabButton>
          <TabButton active={tab === "pro"} onClick={() => setTab("pro")}>
            Pro
          </TabButton>
          <span
            aria-hidden
            className={cn(
              "absolute bottom-0 left-0 h-0.5 w-1/2 bg-foreground transition-transform duration-250 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none",
              tab === "pro" && "translate-x-full"
            )}
          />
        </div>

        <div className="relative">
          <div className="max-h-[min(34rem,calc(100dvh-12rem))] overflow-x-hidden overflow-y-auto overscroll-contain">
            {/* Both lists share one cell, so the panel keeps the taller height. */}
            <div className="grid">
              <ul
                inert={tab !== "pro"}
                className={cn(
                  "col-start-1 row-start-1 grid grid-cols-1 gap-0.5 p-1.5 transition-[opacity,translate,filter,visibility] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-150",
                  tab !== "pro" &&
                    "invisible translate-x-5 opacity-0 blur-[2px] motion-reduce:translate-x-0"
                )}
              >
                {proModules.map((module) => {
                  const { icon: Icon } =
                    proAppearance[module.key] ?? fallbackAppearance
                  return (
                    <li
                      key={module.key}
                      className="flex items-center gap-3 rounded-xl px-2.5 py-2"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {module.label}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                      <Switch
                        checked={false}
                        disabled
                        aria-label={`${module.label} (Pro)`}
                      />
                    </li>
                  )
                })}
              </ul>
              <ul
                inert={tab !== "free"}
                className={cn(
                  "col-start-1 row-start-1 grid grid-cols-1 gap-0.5 p-1.5 transition-[opacity,translate,filter,visibility] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-150",
                  tab !== "free" &&
                    "invisible -translate-x-5 opacity-0 blur-[2px] motion-reduce:translate-x-0"
                )}
              >
                {modules.map((module) => {
                  const state = resolved.get(module.key)!
                  const plan = state.enabled
                    ? null
                    : planChange(modules, services, own, module.key, true)

                  return (
                    <ModuleRow
                      key={module.key}
                      module={module}
                      enabled={state.enabled}
                      changed={own[module.key] !== module.default}
                      // A module that can't be switched on says why.
                      hint={
                        state.unconfigured.length > 0 && own[module.key] ? (
                          <Warning>
                            {listOf(
                              state.unconfigured.map(
                                (s) => serviceOf(s)?.providerLabel ?? s
                              )
                            )}{" "}
                            isn&apos;t configured
                          </Warning>
                        ) : state.status === "blocked" ? (
                          <Warning>
                            Paused · needs{" "}
                            {listOf(state.blockedBy.map(labelOf))}
                          </Warning>
                        ) : plan && !plan.possible ? (
                          <span>
                            Needs{" "}
                            {listOf(
                              blockingServices(module, modules, services).map(
                                (s) => s.providerLabel
                              )
                            )}{" "}
                            to be configured
                          </span>
                        ) : null
                      }
                      locked={!!plan && !plan.possible}
                      missingServices={
                        plan && !plan.possible
                          ? blockingServices(module, modules, services)
                          : []
                      }
                      confirming={
                        confirming?.key === module.key ? confirming : null
                      }
                      onToggle={(on) => toggle(module.key, on)}
                      onCancel={() => setConfirming(null)}
                      onRestore={() => toggle(module.key, module.default)}
                    />
                  )
                })}
              </ul>
            </div>
          </div>

          <div className="grid">
            <footer
              inert={tab !== "pro"}
              className={cn(
                "col-start-1 row-start-1 flex items-center justify-between gap-2 border-t border-violet-500/20 bg-violet-500/8 px-3 py-2 transition-[opacity,visibility] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] dark:border-violet-400/20 dark:bg-violet-400/8",
                tab !== "pro" && "invisible opacity-0"
              )}
            >
              <p className="min-w-0 truncate pl-1 text-xs text-violet-900/70 dark:text-violet-100/70">
                Installed like any other module.
              </p>
              <Button
                size="xs"
                nativeButton={false}
                render={<Link href={siteConfig.links.pro} />}
                className="shrink-0 border-violet-500/40 bg-violet-500/10 text-violet-700 hover:bg-violet-500/15 hover:text-violet-800 dark:border-violet-400/50 dark:bg-violet-400/15 dark:text-violet-100 dark:hover:bg-violet-400/25"
              >
                Get Pro
              </Button>
            </footer>
            <footer
              inert={tab !== "free"}
              className={cn(
                "col-start-1 row-start-1 flex items-center justify-between gap-2 border-t bg-muted/40 px-3 py-2 transition-[opacity,visibility] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                tab !== "free" && "invisible opacity-0"
              )}
            >
              <p
                className={cn(
                  "min-w-0 truncate pl-1 text-xs text-muted-foreground",
                  error && "text-destructive"
                )}
              >
                {error
                  ? "Couldn't apply the change. Try again."
                  : "For config/features.ts"}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                <CopyButton
                  text={configLines.join("\n")}
                  disabled={configLines.length === 0}
                  title={
                    configLines.length === 0
                      ? "All modules match their defaults"
                      : "Copy the defaults to set in config/features.ts"
                  }
                >
                  Copy config
                </CopyButton>
                <Button
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
          </div>

          {/* Drawer: blurs the list and floats over it, panel height stays fixed. */}
          {tab === "free" && confirming && (
            <>
              <div
                aria-hidden
                onClick={() => setConfirming(null)}
                className="absolute inset-0 animate-in bg-popover/50 backdrop-blur-[3px] duration-200 fade-in"
              />
              <div className="absolute inset-x-1.5 bottom-1.5 animate-slide-up-fade [--offset:6px]">
                <ConfirmChange
                  module={modules.find((m) => m.key === confirming.key)!}
                  pending={confirming}
                  labelOf={labelOf}
                  onConfirm={() => commit(confirming.change.patch)}
                  onCancel={() => setConfirming(null)}
                />
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      onClick={onClick}
      aria-selected={active}
      className={cn(
        "h-10 text-sm font-medium transition-colors outline-none focus-visible:bg-accent/60",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function ModuleRow({
  module,
  enabled,
  changed,
  hint,
  locked,
  missingServices,
  confirming,
  onToggle,
  onCancel,
  onRestore,
}: {
  module: PanelModule
  enabled: boolean
  changed: boolean
  hint: ReactNode
  locked: boolean
  missingServices: PanelService[]
  confirming: Pending | null
  onToggle: (on: boolean) => void
  onCancel: () => void
  onRestore: () => void
}) {
  const id = useId()
  const [showEnv, setShowEnv] = useState(false)
  const { icon: Icon, tint } = appearance[module.key] ?? fallbackAppearance
  const expanded = showEnv && missingServices.length > 0

  return (
    <li
      className={cn(
        "group/row rounded-xl transition-colors",
        expanded || confirming ? "bg-muted/60" : "hover:bg-muted/50"
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
            {changed ? (
              <button
                type="button"
                onClick={onRestore}
                title={`${module.default ? "Disabled" : "Enabled"} in this browser. Click to restore (${module.default ? "on" : "off"}).`}
                className={cn(
                  "group/restore flex h-4 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  module.default
                    ? "bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400"
                    : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 dark:text-blue-400"
                )}
              >
                <span className="size-1 rounded-full bg-current group-hover/restore:hidden group-focus-visible/restore:hidden" />
                <RotateCcw className="hidden size-2.5 group-hover/restore:block group-focus-visible/restore:block" />
                {module.default ? "Disabled" : "Enabled"}
              </button>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {hint ?? module.description}
          </p>
        </div>

        {locked && missingServices.length > 0 && (
          <Button
            size="icon-xs"
            variant="ghost"
            aria-expanded={showEnv}
            aria-label={`Show what ${module.label} needs`}
            className="text-muted-foreground"
            onClick={() => setShowEnv((value) => !value)}
          >
            <ChevronDown
              className={cn(
                "transition-transform duration-200",
                showEnv && "rotate-180"
              )}
            />
          </Button>
        )}

        <Switch
          id={id}
          checked={confirming ? confirming.on : enabled}
          disabled={locked}
          onCheckedChange={(on) => (confirming ? onCancel() : onToggle(on))}
        />
      </div>

      <Collapsible open={expanded}>
        <div className="px-2.5 pb-2.5 pl-[3.375rem]">
          <div className="grid gap-2">
            {missingServices.map((service) => (
              <EnvBlock key={service.key} service={service} />
            ))}
          </div>
        </div>
      </Collapsible>
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
            <Strong>{listOf(dependencies.map(labelOf))}</Strong>, which{" "}
            {dependencies.length === 1 ? "is" : "are"} off.
            {change.turnsOn.length > dependencies.length && (
              <>
                {" "}
                This also brings back{" "}
                {listOf(
                  change.turnsOn
                    .filter((key) => !dependencies.includes(key))
                    .map(labelOf)
                )}
                .
              </>
            )}
          </>
        ) : (
          <>
            Turning off <Strong>{module.label}</Strong> also pauses{" "}
            <Strong>{listOf(change.turnsOff.map(labelOf))}</Strong>.{" "}
            {change.turnsOff.length === 1 ? "It comes" : "They come"} back when
            you turn {module.label} on again.
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
          autoFocus
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

// The variables a service misses, ready to paste into .env.local.
function EnvBlock({ service }: { service: PanelService }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b py-1 pr-1 pl-3">
        <span className="truncate text-xs font-medium">
          {service.providerLabel}{" "}
          <span className="font-normal text-muted-foreground">
            · .env.local
          </span>
        </span>
        <div className="flex shrink-0 items-center">
          <CopyButton
            text={service.missingEnv.map((name) => `${name}=`).join("\n")}
            title="Copy variable names"
          >
            Copy
          </CopyButton>
          <Button
            size="xs"
            variant="ghost"
            render={
              <a href={service.setupUrl} target="_blank" rel="noreferrer" />
            }
            nativeButton={false}
          >
            Get keys
            <ArrowUpRight />
          </Button>
        </div>
      </div>
      <ul className="grid gap-0.5 px-3 py-2 font-mono text-[11px] text-muted-foreground">
        {service.missingEnv.map((name) => (
          <li key={name} className="truncate">
            {name}
            <span className="text-muted-foreground/50">=</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CopyButton({
  text,
  title,
  disabled,
  children,
}: {
  text: string
  title: string
  disabled?: boolean
  children: ReactNode
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <Button
      size="xs"
      variant="ghost"
      title={title}
      disabled={disabled}
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
      }}
    >
      {copied ? <Check className="text-emerald-600" /> : <Copy />}
      <span aria-live="polite">{copied ? "Copied" : children}</span>
    </Button>
  )
}

// Animates height without measuring: the grid row goes from 0fr to 1fr.
function Collapsible({
  open,
  children,
}: {
  open: boolean
  children: ReactNode
}) {
  return (
    <div
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

function Warning({ children }: { children: ReactNode }) {
  return <span className="text-amber-600 dark:text-amber-400">{children}</span>
}

function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>
}

// Services, on the module or its dependencies, that keep it from turning on.
function blockingServices(
  module: PanelModule,
  modules: PanelModule[],
  services: PanelService[]
) {
  const keys = new Set<string>()
  const visit = (m: PanelModule | undefined) => {
    if (!m) return
    m.requires.forEach((key) => keys.add(key))
    m.dependsOn.forEach((dep) => visit(modules.find((x) => x.key === dep)))
  }
  visit(module)
  return services.filter(
    (service) => keys.has(service.key) && service.missingEnv.length > 0
  )
}

function listOf(items: string[]) {
  return new Intl.ListFormat("en", { type: "conjunction" }).format(items)
}
