"use client"

import { Ellipsis, LogOut, Monitor, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import type { ShellUser } from "@/components/dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/client"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function UserMenu({ user }: { user: ShellUser }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  async function signOut() {
    await authClient.signOut()
    router.replace("/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex h-9 w-full items-center gap-2 rounded-full pr-1.5 pl-2.5 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-accent">
        <Avatar className="size-5">
          {user.image && <AvatarImage src={user.image} alt="" />}
          <AvatarFallback className="text-[9px]">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1 truncate">{user.name}</span>
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-card text-muted-foreground ring-1 ring-input transition-colors group-hover:text-foreground">
          <Ellipsis className="size-3.5" />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" sideOffset={6}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="max-w-60">
            <span className="block truncate text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="block truncate font-normal">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">
              <Sun />
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon />
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Monitor />
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
