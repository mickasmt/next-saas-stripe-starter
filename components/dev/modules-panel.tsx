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
  LayoutGrid,
  LoaderCircle,
  Newspaper,
  RotateCcw,
  ShieldCheck,
  Sparkles,
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
  toEnvLines,
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
  const [saving, startTransition] = useTransition()
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
  const changedCount = modules.filter((m) => own[m.key] !== m.inherited).length
  const envLines = toEnvLines(modules, own)

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
        className="w-[min(24rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl shadow-neutral-900/10 dark:shadow-black/50"
      >
        <header className="flex items-start justify-between gap-3 border-b px-4 pt-3.5 pb-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 font-medium">
              Modules
              <kbd className="hidden h-5 items-center rounded border bg-muted px-1.5 font-sans text-[10px] font-medium text-muted-foreground sm:inline-flex">
                ⌥M
              </kbd>
            </h2>
            <p
              aria-live="polite"
              className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              {saving ? (
                <>
                  <LoaderCircle className="size-3 animate-spin" />
                  Applying…
                </>
              ) : (
                <>
                  <span className="tabular-nums">
                    {enabledCount} of {modules.length} on
                  </span>
                  <span aria-hidden>·</span>
                  Development only
                </>
              )}
            </p>
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

        <div className="flex gap-1 border-b p-1.5">
          <TabButton active={tab === "free"} onClick={() => setTab("free")}>
            Free · {modules.length}
          </TabButton>
          <TabButton active={tab === "pro"} onClick={() => setTab("pro")}>
            Pro · {proModules.length}
          </TabButton>
        </div>

        <div className="max-h-[min(34rem,calc(100dvh-12rem))] overflow-y-auto overscroll-contain">
          {tab === "pro" ? (
            <ul className="grid gap-0.5 p-1.5">
              {proModules.map((module) => (
                <li
                  key={module.key}
                  className="flex items-start gap-2.5 rounded-lg px-2.5 py-2"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-violet-100 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300">
                    <Sparkles className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{module.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <ul className="grid gap-0.5 p-1.5">
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
                      changed={own[module.key] !== module.inherited}
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
                      labelOf={labelOf}
                      onToggle={(on) => toggle(module.key, on)}
                      onConfirm={() =>
                        confirming && commit(confirming.change.patch)
                      }
                      onCancel={() => setConfirming(null)}
                      onRestore={() => toggle(module.key, module.inherited)}
                    />
                  )
                })}
              </ul>

              <section className="border-t px-1.5 pt-2.5 pb-1.5">
                <h3 className="px-2.5 pb-1 text-[11px] font-medium text-muted-foreground">
                  Services
                </h3>
                <ul className="grid gap-0.5">
                  {services.map((service) => (
                    <ServiceRow key={service.key} service={service} />
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>

        {tab === "pro" ? (
          <footer className="flex items-center justify-between gap-2 border-t border-violet-500/20 bg-violet-500/8 px-3 py-2 dark:border-violet-400/20 dark:bg-violet-400/8">
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
        ) : (
          <footer className="flex items-center justify-between gap-2 border-t bg-muted/40 px-3 py-2">
            <p
              className={cn(
                "min-w-0 truncate pl-1 text-xs text-muted-foreground",
                error && "text-destructive"
              )}
            >
              {error
                ? "Couldn't apply the change. Try again."
                : changedCount > 0
                  ? `${changedCount} ${changedCount === 1 ? "change" : "changes"} in this browser`
                  : "Matches your environment"}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <CopyButton
                text={envLines.join("\n")}
                disabled={envLines.length === 0}
                title={
                  envLines.length === 0
                    ? "All modules match their defaults"
                    : `Copy ${envLines.join(", ")}`
                }
              >
                Copy env
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
        )}
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
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-7 flex-1 rounded-md text-xs font-medium tabular-nums transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/60"
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
  labelOf,
  onToggle,
  onConfirm,
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
  labelOf: (key: string) => string
  onToggle: (on: boolean) => void
  onConfirm: () => void
  onCancel: () => void
  onRestore: () => void
}) {
  const id = useId()
  const [showEnv, setShowEnv] = useState(false)
  const { icon: Icon, tint } = appearance[module.key] ?? fallbackAppearance
  const expanded = !!confirming || (showEnv && missingServices.length > 0)

  return (
    <li
      className={cn(
        "group/row rounded-xl transition-colors",
        expanded ? "bg-muted/60" : "hover:bg-muted/50"
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
                title={`Modified in this browser. Click to restore (${module.inherited ? "on" : "off"}).`}
                className="group/restore flex h-4 items-center gap-1 rounded-full bg-blue-500/10 px-1.5 text-[10px] font-medium text-blue-600 outline-none hover:bg-blue-500/15 focus-visible:ring-2 focus-visible:ring-ring/50 dark:text-blue-400"
              >
                <span className="size-1 rounded-full bg-current group-hover/restore:hidden group-focus-visible/restore:hidden" />
                <RotateCcw className="hidden size-2.5 group-hover/restore:block group-focus-visible/restore:block" />
                Modified
              </button>
            ) : (
              module.source === "env" && (
                <span
                  title={`Set by ${module.envName}`}
                  className="flex h-4 items-center rounded-full border px-1.5 font-mono text-[10px] text-muted-foreground"
                >
                  env
                </span>
              )
            )}
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
          {confirming ? (
            <ConfirmChange
              module={module}
              pending={confirming}
              labelOf={labelOf}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          ) : (
            <div className="grid gap-2">
              {missingServices.map((service) => (
                <EnvBlock key={service.key} service={service} />
              ))}
            </div>
          )}
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
    <div className="rounded-lg border bg-background p-3 shadow-xs">
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

function ServiceRow({ service }: { service: PanelService }) {
  const [open, setOpen] = useState(false)
  const configured = service.missingEnv.length === 0

  return (
    <li className={cn("rounded-xl", open && "bg-muted/60")}>
      <button
        type="button"
        disabled={configured}
        aria-expanded={configured ? undefined : open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-xl px-2.5 py-1.5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 enabled:hover:bg-muted/50"
      >
        <span
          aria-hidden
          className={cn(
            "mx-[0.8125rem] size-1.5 shrink-0 rounded-full",
            configured
              ? "bg-emerald-500"
              : "bg-amber-500 shadow-[0_0_0_3px] shadow-amber-500/20"
          )}
        />
        <span className="min-w-0 flex-1 truncate text-sm">
          {service.label}{" "}
          <span className="text-muted-foreground">
            · {service.providerLabel}
          </span>
        </span>
        <span
          className={cn(
            "flex items-center gap-1 text-xs",
            configured
              ? "text-muted-foreground"
              : "text-amber-600 dark:text-amber-400"
          )}
        >
          {configured ? (
            <>
              <Check className="size-3" />
              Configured
            </>
          ) : (
            <>
              {service.missingEnv.length} missing
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </>
          )}
        </span>
      </button>
      {!configured && (
        <Collapsible open={open}>
          <div className="px-2.5 pb-2.5 pl-[3.375rem]">
            <EnvBlock service={service} />
          </div>
        </Collapsible>
      )}
    </li>
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
