"use client"

import {
  Ban,
  Ellipsis,
  LogIn,
  Search,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  type LucideIcon,
} from "lucide-react"
import { Fragment, useState } from "react"

import { sampleUsers, type SampleUser } from "@/components/admin/sample-users"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function actionsFor(user: SampleUser) {
  const actions: { label: string; icon: LucideIcon; destructive?: boolean }[] =
    []
  if (user.role === "user" && !user.banned) {
    actions.push({ label: "Log in as user", icon: LogIn })
  }
  actions.push(
    user.role === "admin"
      ? { label: "Remove admin role", icon: ShieldOff }
      : { label: "Make admin", icon: ShieldCheck },
    user.banned
      ? { label: "Unban user", icon: UserCheck }
      : { label: "Ban user", icon: Ban, destructive: true }
  )
  return actions
}

// Sample data with inert actions: each one points to Pro instead of running.
export function UsersPreview() {
  const [query, setQuery] = useState("")
  const [lockedAction, setLockedAction] = useState<string | null>(null)

  const users = sampleUsers.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())
  )

  function lock(label: string) {
    setLockedAction(label)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-4">
      <ProBanner
        title={
          lockedAction
            ? `"${lockedAction}" is included in Pro`
            : "User management is included in Pro"
        }
        description="This page shows sample data. Pro ships the working code: real users, roles, bans and logging in as a user."
      />

      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          placeholder="Search users"
          aria-label="Search users"
          className="bg-card pl-8 dark:bg-card"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-left">
          <thead className="border-b bg-background text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                Joined
              </th>
              <th className="w-12 px-4 py-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="truncate text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={user.role === "admin" ? "default" : "outline"}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                    {user.banned && <Badge variant="destructive">Banned</Badge>}
                  </div>
                </td>
                <td className="hidden px-4 py-3 whitespace-nowrap text-muted-foreground sm:table-cell">
                  {user.joined}
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${user.name}`}
                        />
                      }
                    >
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      {actionsFor(user).map((action) => (
                        <Fragment key={action.label}>
                          <DropdownMenuItem
                            variant={
                              action.destructive ? "destructive" : "default"
                            }
                            onClick={() => lock(action.label)}
                          >
                            <action.icon />
                            {action.label}
                          </DropdownMenuItem>
                          {action.icon === LogIn && <DropdownMenuSeparator />}
                        </Fragment>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No users match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
