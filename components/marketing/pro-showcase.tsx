import { Check, ImageUp, Lock, Minus, Sparkles } from "lucide-react"
import Link from "next/link"

import { GridSection } from "@/components/marketing/grid-section"
import { OnboardingDemo } from "@/components/marketing/onboarding-demo"
import { getStarterCta } from "@/components/marketing/starter-cta"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

// The sales section for the Pro version: the onboarding flow as the big
// picture, four cards for what Pro adds, then a Free vs Pro table with the
// price. Built on the same bands as the modules showcase above it.
//
// TODO: keep `proFeatures`, `comparison` and `pricing` in line with what the
// Pro repository actually ships before launch.

const pricing = {
  regular: "$199",
  earlyBird: "$99",
  earlyBirdNote: "Early-bird price for the first buyers",
}

type ProFeature = {
  title: string
  description: string
  visual: React.ReactNode
  // Taller than the card frame on purpose: fades out at the bottom.
  overflows?: boolean
}

const proFeatures: ProFeature[] = [
  {
    title: "Emails your users will actually open",
    description:
      "Welcome, magic link, team invite, receipt, trial ending: ready-made React Email templates, sent through Resend and themed with your logo and colors.",
    visual: <EmailPreview />,
    overflows: true,
  },
  {
    title: "Profiles with real avatars",
    description:
      "Avatar upload with crop and preview, name and email changes, account deletion. The settings page your users expect, designed and wired.",
    visual: <ProfileCard />,
  },
  {
    title: "Seat-based billing for teams",
    description:
      "Charge per member with Stripe. Seats follow invites and removals, prorations are handled, and owners see exactly what they pay for.",
    visual: <SeatBilling />,
  },
  {
    title: "Installs like any other module",
    description:
      "Pro modules show up in the same dev panel and prune with the same command. Take what you need, delete the rest.",
    visual: <ProPanelRows />,
  },
]

const comparison: { label: string; free: boolean; pro: boolean }[] = [
  { label: "Modules, dev panel and prune command", free: true, pro: true },
  { label: "Auth with organizations (Better Auth)", free: true, pro: true },
  { label: "Stripe subscriptions and customer portal", free: true, pro: true },
  { label: "Admin panel", free: true, pro: true },
  { label: "Docs, blog and changelog", free: true, pro: true },
  { label: "Guided onboarding flow", free: false, pro: true },
  { label: "Email templates with Resend", free: false, pro: true },
  { label: "Profile settings with avatar upload", free: false, pro: true },
  { label: "Seat-based team billing", free: false, pro: true },
  { label: "Private repository and lifetime updates", free: false, pro: true },
]

export async function ProShowcase() {
  const cta = await getStarterCta()

  return (
    <GridSection
      lines
      innerClassName="px-0 sm:px-0"
      background={
        <div className="absolute inset-x-0 top-0 h-[520px] opacity-15 dark:opacity-20">
          <div className="size-full bg-[linear-gradient(90deg,#8b5cf6,#d946ef)] mask-[linear-gradient(black,transparent)]" />
        </div>
      }
    >
      <div id="pro" className="scroll-mt-20 px-4 pt-20 text-center sm:px-12">
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-700 dark:text-violet-300">
            <Sparkles className="size-4" />
            SaaS Starter Pro
          </span>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-medium text-balance sm:text-4xl md:text-5xl">
            The weeks of polish, already done
          </h2>
          <p className="mt-3 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            The free starter gives you the foundation. Pro adds the parts
            customers notice first: onboarding, emails, profiles and team
            billing, designed and ready to ship.
          </p>
        </div>
      </div>

      <div className="px-4 py-12 sm:px-12">
        <OnboardingDemo />
        <p className="mt-4 text-center text-xs text-muted-foreground">
          The onboarding flow included in Pro. Hover to pause, click a step to
          jump.
        </p>
      </div>

      <div className="grid grid-cols-1 border-t border-grid-border bg-background md:grid-cols-2">
        {proFeatures.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              "flex flex-col gap-10 border-grid-border px-4 py-6 sm:px-10 sm:py-14",
              index > 0 && "max-md:border-t",
              index > 1 && "md:border-t",
              index % 2 === 1 && "md:border-l"
            )}
          >
            <div
              aria-hidden
              className={cn(
                "relative h-80 overflow-hidden select-none",
                // Only visuals taller than the frame fade out; the others fit whole.
                feature.overflows &&
                  "mask-[linear-gradient(black_80%,transparent)]"
              )}
            >
              {feature.visual}
            </div>
            <div className="text-left text-base">
              <h3 className="flex items-center gap-2 font-medium">
                {feature.title}
                <ProBadge />
              </h3>
              <p className="mt-1 text-pretty text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-grid-border bg-muted/40 px-4 py-16 sm:px-12">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-center font-display text-2xl font-medium sm:text-3xl">
            Free to start. One payment for Pro.
          </h3>
          <p className="mt-2 text-center text-muted-foreground">
            No subscription. Pay once, keep the code.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border bg-background shadow-sm">
            <div className="grid grid-cols-[1fr_88px_88px] items-end border-b sm:grid-cols-[1fr_180px_180px]">
              <div className="p-4 sm:p-6" />
              <PlanHeader
                name="Free"
                price="$0"
                note="MIT, forever"
                action={
                  <Link
                    href={cta.href}
                    {...(cta.external && {
                      target: "_blank",
                      rel: "noreferrer",
                    })}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full"
                    )}
                  >
                    {cta.label}
                  </Link>
                }
              />
              <PlanHeader
                name="Pro"
                price={pricing.earlyBird}
                strike={pricing.regular}
                note="One-time payment"
                highlighted
                action={
                  <Link
                    href={siteConfig.links.pro}
                    className={cn(buttonVariants({ size: "sm" }), "w-full")}
                  >
                    Get Pro
                  </Link>
                }
              />
            </div>
            <ul className="divide-y text-sm">
              {comparison.map((row) => (
                <li
                  key={row.label}
                  className="grid grid-cols-[1fr_88px_88px] items-center sm:grid-cols-[1fr_180px_180px]"
                >
                  <span className="px-4 py-3 text-left sm:px-6">
                    {row.label}
                  </span>
                  <Mark on={row.free} />
                  <Mark on={row.pro} highlighted />
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {pricing.earlyBirdNote}, then {pricing.regular}.
          </p>
        </div>
      </div>
    </GridSection>
  )
}

function ProBadge() {
  return (
    <span className="rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[10px] leading-none font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
      Pro
    </span>
  )
}

function PlanHeader({
  name,
  price,
  strike,
  note,
  action,
  highlighted,
}: {
  name: string
  price: string
  strike?: string
  note: string
  action: React.ReactNode
  highlighted?: boolean
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-1 border-l p-2 text-center sm:p-5",
        highlighted && "bg-violet-500/[0.06]"
      )}
    >
      <p className="flex items-center justify-center gap-1.5 text-sm font-medium">
        {highlighted && (
          <Sparkles className="size-3.5 text-violet-500 max-sm:hidden" />
        )}
        {name}
      </p>
      <p className="font-display text-2xl font-medium sm:text-3xl">
        {strike && (
          <span className="mr-1.5 text-base text-muted-foreground line-through max-sm:hidden">
            {strike}
          </span>
        )}
        {price}
      </p>
      <p className="text-[11px] text-muted-foreground">{note}</p>
      <div className="mt-2 max-sm:hidden">{action}</div>
    </div>
  )
}

function Mark({ on, highlighted }: { on: boolean; highlighted?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-full items-center justify-center border-l py-3",
        highlighted && "bg-violet-500/[0.06]"
      )}
    >
      {on ? (
        <Check
          aria-label="Included"
          className={cn(
            "size-4",
            highlighted
              ? "text-violet-600 dark:text-violet-400"
              : "text-foreground"
          )}
        />
      ) : (
        <Minus
          aria-label="Not included"
          className="size-4 text-muted-foreground/50"
        />
      )}
    </span>
  )
}

// Card visuals. Decorative mocks.

function EmailPreview() {
  const templates = ["Welcome", "Magic link", "Team invite", "Receipt"]

  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <div className="flex gap-1.5 overflow-hidden">
        {templates.map((name, index) => (
          <span
            key={name}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-xs",
              index === 0
                ? "border-foreground bg-foreground text-background"
                : "bg-background text-muted-foreground"
            )}
          >
            {name}
          </span>
        ))}
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border bg-neutral-50 p-4 shadow-lg shadow-neutral-900/5 dark:bg-neutral-900 dark:shadow-black/30">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            From <span className="text-foreground">Acme</span>
          </span>
          <span>via Resend</span>
        </div>
        <div className="mt-3 rounded-lg border bg-background p-5 text-left">
          <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background">
            A
          </span>
          <p className="mt-4 font-display text-lg font-medium">
            Welcome to Acme, Sarah
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Your workspace is ready. Invite your team and create your first
            project in under a minute.
          </p>
          <span className="mt-4 inline-flex h-8 items-center rounded-md bg-foreground px-3 text-xs font-medium text-background">
            Open your dashboard
          </span>
          <div className="mt-5 h-px bg-border" />
          <p className="mt-3 text-[10px] text-muted-foreground">
            Acme Inc · Unsubscribe
          </p>
        </div>
      </div>
    </div>
  )
}

function ProfileCard() {
  return (
    <div className="mx-auto flex h-full max-w-sm flex-col justify-center">
      <div className="rounded-xl border bg-background p-5 text-left shadow-lg shadow-neutral-900/5 dark:shadow-black/30">
        <p className="text-sm font-medium">Profile</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="relative size-16 shrink-0 rounded-full bg-[conic-gradient(from_200deg,#6366f1,#8b5cf6,#d946ef,#6366f1)] ring-4 ring-violet-500/20">
            <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border bg-background shadow-sm">
              <ImageUp className="size-3" />
            </span>
          </span>
          <div className="min-w-0 flex-1 rounded-lg border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
            Drop an image or <span className="text-foreground">browse</span>
            <p className="mt-0.5 text-[10px]">PNG or JPG, cropped to square</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {[
            ["Name", "Sarah Chen"],
            ["Email", "sarah@acme.com"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="mb-1 text-xs font-medium">{label}</p>
              <div className="flex h-8 items-center rounded-md border px-3 text-sm">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <span className="flex h-8 items-center rounded-md bg-foreground px-3 text-xs font-medium text-background">
            Save changes
          </span>
        </div>
      </div>
    </div>
  )
}

function SeatBilling() {
  const members = [
    ["SC", "Sarah Chen", "Owner", "bg-fuchsia-500"],
    ["TM", "Tom Martin", "Admin", "bg-sky-500"],
    ["LN", "Lina Nguyen", "Member", "bg-violet-500"],
  ]

  return (
    <div className="mx-auto flex h-full max-w-sm flex-col justify-center gap-3">
      <div className="rounded-xl border bg-background p-2 text-left shadow-lg shadow-neutral-900/5 dark:shadow-black/30">
        <p className="px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
          Members · 3 seats
        </p>
        {members.map(([initials, name, role, color]) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5"
          >
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                color
              )}
            >
              {initials}
            </span>
            <span className="flex-1 text-sm">{name}</span>
            <span className="text-xs text-muted-foreground">{role}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-background p-4 text-left shadow-lg shadow-neutral-900/5 dark:shadow-black/30">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Team plan</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-400">
            Active
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between text-xs text-muted-foreground">
          <span>3 seats × $12</span>
          <span className="font-display text-xl font-medium text-foreground">
            $36<span className="text-xs text-muted-foreground">/mo</span>
          </span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Next seat is prorated: +$8.40 today
        </p>
      </div>
    </div>
  )
}

function ProPanelRows() {
  const rows: { label: string; description: string; pro: boolean }[] = [
    {
      label: "Authentication",
      description: "Sign-in, sign-up and the dashboard.",
      pro: false,
    },
    { label: "Onboarding", description: "Guided first-run flow.", pro: true },
    {
      label: "Email templates",
      description: "React Email, sent with Resend.",
      pro: true,
    },
    {
      label: "Team billing",
      description: "Per-seat Stripe subscriptions.",
      pro: true,
    },
  ]

  return (
    <div className="mx-auto flex h-full max-w-sm flex-col justify-center">
      <div className="rounded-2xl border bg-popover p-1.5 text-left shadow-xl shadow-neutral-900/10 dark:shadow-black/40">
        <p className="px-2.5 pt-1.5 pb-1 text-sm font-medium">Modules</p>
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2"
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                row.pro
                  ? "bg-violet-100 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300"
                  : "bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300"
              )}
            >
              {row.pro ? (
                <Sparkles className="size-4" />
              ) : (
                <Check className="size-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-medium">
                {row.label}
                {row.pro && <ProBadge />}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {row.description}
              </p>
            </div>
            <SwitchMock on />
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        Pro code lives in a private repository
      </p>
    </div>
  )
}

function SwitchMock({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full",
        on ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "block size-4 rounded-full bg-background dark:bg-primary-foreground",
          on ? "translate-x-[14px]" : "translate-x-px"
        )}
      />
    </span>
  )
}
