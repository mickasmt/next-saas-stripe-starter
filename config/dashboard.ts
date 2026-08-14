import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
      },
      { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      {
        href: "#/dashboard/posts",
        icon: "post",
        title: "User Posts",
        disabled: true,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        disabled: true,
      },
    ],
  },
];
