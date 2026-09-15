import { Check, CreditCard, UserPlus } from "lucide-react"

const members = [
  { initials: "JD", name: "Jane Doe", role: "Owner", color: "bg-blue-500" },
  {
    initials: "AM",
    name: "Alex Martin",
    role: "Admin",
    color: "bg-violet-500",
  },
  { initials: "SK", name: "Sam Kim", role: "Member", color: "bg-emerald-500" },
]

const stack = [
  "Next.js 16",
  "Better Auth",
  "Drizzle",
  "Neon",
  "Stripe",
  "shadcn/ui",
]

export function AuthPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden border-l bg-muted/40 px-12 py-16 lg:flex">
      <div className="absolute -bottom-40 left-1/2 h-72 w-[140%] -translate-x-1/2 rounded-full bg-linear-to-r from-blue-200/40 via-violet-200/40 to-rose-200/40 blur-3xl dark:from-blue-500/10 dark:via-violet-500/10 dark:to-rose-500/10" />

      <div className="relative mt-8 max-w-md">
        {/* Product preview */}
        <div className="relative rounded-xl border bg-background p-2 shadow-sm">
          <div className="rounded-lg border bg-muted/40 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-foreground text-sm font-semibold text-background">
                  A
                </span>
                <div>
                  <p className="text-sm font-semibold">Acme Inc</p>
                  <p className="text-xs text-muted-foreground">3 members</p>
                </div>
              </div>
              <span className="inline-flex h-7 items-center gap-1.5 rounded-md border bg-background px-2.5 text-xs font-medium shadow-xs">
                <UserPlus className="size-3.5" />
                Invite
              </span>
            </div>

            <ul className="mt-4 divide-y rounded-lg border bg-background">
              {members.map((member) => (
                <li
                  key={member.name}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full text-[11px] font-medium text-white ${member.color}`}
                  >
                    {member.initials}
                  </span>
                  <span className="flex-1 text-sm">{member.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute -right-8 -bottom-16 w-56 rounded-xl border bg-background p-4 shadow-lg shadow-black/5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="size-3.5" />
              Subscription
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <p className="text-sm font-semibold">Pro plan</p>
              <p className="text-sm">
                $29<span className="text-muted-foreground">/mo</span>
              </p>
            </div>
            <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <Check className="size-3" />
              Active
            </span>
          </div>
        </div>

        <p className="mt-24 text-xl font-medium tracking-tight text-balance">
          Auth, organizations and billing, wired from day one.
        </p>
      </div>

      <div className="relative grid grid-cols-3 gap-x-6 gap-y-4">
        {stack.map((tech) => (
          <span
            key={tech}
            className="text-center text-sm font-semibold text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </aside>
  )
}
