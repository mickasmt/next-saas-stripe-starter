// Pro modules shown as locked in the dev panel. This is a showcase only: the
// code of a Pro module never lives in this repository, since anything here
// can be switched on by editing a flag. Once installed, a Pro module is
// declared in config/features.ts like any other module.

export type ProModule = {
  key: string
  label: string
  description: string
  url: string
}

export const proModules: ProModule[] = [
  {
    key: "onboarding",
    label: "Onboarding",
    description: "Guided first steps, saved and resumed per member.",
    url: "/pro",
  },
  {
    key: "emails",
    label: "Transactional emails",
    description: "React Email templates, provider setup and a delivery log.",
    url: "/pro",
  },
  {
    key: "teams",
    label: "Teams",
    description: "Invitations, roles, switching and leaving an organization.",
    url: "/pro",
  },
  {
    key: "seats",
    label: "Seat billing",
    description: "Per-seat pricing, proration, invoices and billing details.",
    url: "/pro",
  },
  {
    key: "security",
    label: "Account security",
    description: "Two-factor authentication and session revocation.",
    url: "/pro",
  },
  {
    key: "adminPro",
    label: "Admin panel",
    description: "Real user management: roles, bans and logging in as a user.",
    url: "/pro",
  },
  {
    key: "sentry",
    label: "Error tracking",
    description:
      "Sentry error and performance monitoring, off until a DSN is set.",
    url: "/pro",
  },
]
