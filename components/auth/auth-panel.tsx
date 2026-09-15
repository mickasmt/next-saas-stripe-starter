import { Check, CreditCard, Users } from "lucide-react"

const members = [
  { initials: "JD", name: "Jane Doe", role: "Owner", color: "bg-sky-500" },
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
    <div className="relative hidden overflow-hidden rounded-3xl border bg-muted/40 lg:flex lg:flex-col">
      {/* Dot grid + soft glow */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_80%)] bg-size-[18px_18px]" />
      <div className="absolute -top-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/10" />
      <div className="absolute -right-24 -bottom-32 size-[380px] rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/10" />

      <div className="relative flex flex-1 items-center justify-center p-12">
        <div className="relative w-full max-w-sm">
          {/* Organization card */}
          <div className="rounded-3xl border bg-background p-5 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-foreground text-sm font-semibold text-background">
                  A
                </span>
                <div>
                  <p className="text-sm font-semibold">Acme Inc</p>
                  <p className="text-xs text-muted-foreground">3 members</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                <Users className="size-3" />
                Invite
              </span>
            </div>

            <ul className="mt-5 grid gap-3">
              {members.map((member) => (
                <li key={member.name} className="flex items-center gap-3">
                  <span
                    className={`grid size-8 place-items-center rounded-full text-xs font-medium text-white ${member.color}`}
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

          {/* Billing card, overlapping */}
          <div className="absolute -right-10 -bottom-16 w-60 rotate-3 rounded-3xl border bg-background p-4 shadow-xl shadow-black/5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="size-3.5" />
              Subscription
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-semibold">Pro plan</p>
              <p className="text-sm">
                $29<span className="text-muted-foreground">/mo</span>
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3" />
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="relative p-10 pt-0">
        <p className="max-w-sm text-2xl font-semibold tracking-tight text-balance">
          Auth, organizations and billing, wired from day one.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
