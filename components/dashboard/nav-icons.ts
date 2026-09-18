import {
  Building2,
  CreditCard,
  LayoutGrid,
  Mail,
  MailOpen,
  Rocket,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import type { NavIcon } from "@/config/nav"

export const navIcons: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutGrid,
  onboarding: Rocket,
  billing: CreditCard,
  emails: Mail,
  emailTemplates: MailOpen,
  organization: Building2,
  settings: Settings,
  admin: ShieldCheck,
}
