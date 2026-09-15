import {
  CreditCard,
  LayoutGrid,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import type { NavIcon } from "@/config/nav"

export const navIcons: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutGrid,
  billing: CreditCard,
  settings: Settings,
  admin: ShieldCheck,
}
