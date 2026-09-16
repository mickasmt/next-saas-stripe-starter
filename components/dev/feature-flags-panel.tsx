"use client"

import { Flag, RotateCcw } from "lucide-react"
import { useOptimistic, useTransition } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  resetFeatureOverrides,
  setFeatureOverride,
} from "@/lib/features/dev-actions"
import type { FeatureState } from "@/lib/features/resolve"
import { cn } from "@/lib/utils"

type Flag = Omit<FeatureState, "blockedBy"> & {
  label: string
  description: string
  blockedBy: string[]
}

export function FeatureFlagsPanel({ flags }: { flags: Flag[] }) {
  const [pending, startTransition] = useTransition()
  const [optimisticFlags, toggleOptimistic] = useOptimistic(
    flags,
    (current, { key, enabled }: { key: string; enabled: boolean }) =>
      current.map((flag) =>
        flag.key === key
          ? { ...flag, enabled, source: "override" as const }
          : flag
      )
  )
  const overrideCount = flags.filter(
    (flag) => flag.source === "override"
  ).length

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            size="icon-lg"
            variant="outline"
            aria-label="Feature flags"
            className="fixed right-5 bottom-16 z-50 bg-background shadow-lg"
          />
        }
      >
        <Flag />
        {overrideCount > 0 && (
          <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {overrideCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={8}
        className="w-80 gap-3 p-3"
      >
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="font-semibold">Feature flags</p>
            <p className="text-xs text-muted-foreground">
              Development only · stored in a cookie
            </p>
          </div>
          <Button
            size="xs"
            variant="ghost"
            disabled={pending || overrideCount === 0}
            onClick={() => startTransition(() => resetFeatureOverrides())}
          >
            Reset all
          </Button>
        </div>

        <ul className="grid gap-1">
          {optimisticFlags.map((flag) => {
            const blocked = flag.blockedBy.length > 0
            const unconfigured = !blocked && flag.missingEnv.length > 0

            return (
              <li
                key={flag.key}
                className="flex items-start gap-3 rounded-xl p-2 hover:bg-muted/60"
              >
                <div className="grid flex-1 gap-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`flag-${flag.key}`}
                      className="text-sm font-medium"
                    >
                      {flag.label}
                    </label>
                    <Badge
                      variant={
                        flag.source === "override" ? "default" : "outline"
                      }
                      className="h-4 px-1.5 text-[10px]"
                    >
                      {flag.source}
                    </Badge>
                    {flag.source === "override" && (
                      <button
                        type="button"
                        aria-label={`Reset ${flag.label}`}
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          startTransition(() =>
                            setFeatureOverride(flag.key, null)
                          )
                        }
                      >
                        <RotateCcw className="size-3" />
                      </button>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs text-muted-foreground",
                      (blocked || unconfigured) && "text-destructive"
                    )}
                  >
                    {blocked
                      ? `Requires ${flag.blockedBy.join(", ")}`
                      : unconfigured
                        ? `Missing ${flag.missingEnv.join(", ")}`
                        : flag.description}
                  </p>
                </div>
                <Switch
                  id={`flag-${flag.key}`}
                  checked={flag.enabled}
                  disabled={blocked || unconfigured}
                  onCheckedChange={(enabled) =>
                    startTransition(async () => {
                      toggleOptimistic({ key: flag.key, enabled })
                      await setFeatureOverride(flag.key, enabled)
                    })
                  }
                  className="mt-0.5"
                />
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
