"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

const subscribe = () => () => {}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  // The stored theme is only known on the client; highlight nothing until then.
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const current = mounted ? theme : undefined

  return (
    <fieldset
      className={cn(
        "flex w-fit items-center gap-1 rounded-lg border bg-background p-0.5",
        className
      )}
    >
      <legend className="sr-only">Select a display theme</legend>
      {themes.map(({ value, label, icon: Icon }) => (
        <label
          key={value}
          className={cn(
            "grid h-5 w-6 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring/50",
            current === value && "bg-muted text-foreground"
          )}
        >
          <input
            type="radio"
            name="theme"
            value={value}
            checked={current === value}
            onChange={() => setTheme(value)}
            className="sr-only"
          />
          <span className="sr-only">{label}</span>
          <Icon className="size-3.5" aria-hidden />
        </label>
      ))}
    </fieldset>
  )
}
