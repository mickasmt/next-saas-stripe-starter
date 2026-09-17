import { toast } from "sonner"

import { siteConfig } from "@/config/site"

export function toastIncludedInPro(feature: string) {
  toast(`${feature} is included in Pro`, {
    description: "Pro ships the working code, storage setup included.",
    action: {
      label: "Get Pro",
      onClick: () => window.location.assign(siteConfig.links.pro),
    },
  })
}
