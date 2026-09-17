import {
  ChartNoAxesColumn,
  CreditCard,
  KeyRound,
  LayoutGrid,
  Mail,
  Rocket,
  ScrollText,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import type { NavIcon } from "@/config/nav"

export const navIcons: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutGrid,
  onboarding: Rocket,
  billing: CreditCard,
  usage: ChartNoAxesColumn,
  activity: ScrollText,
  emails: Mail,
  apiKeys: KeyRound,
  settings: Settings,
  admin: ShieldCheck,
}
