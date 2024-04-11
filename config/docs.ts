import { DocsConfig } from "types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Guides",
      href: "/guides",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
      ],
    },
    {
      title: "Configuration",
      items: [
        {
          title: "Introduction",
          href: "/docs/configuration",
        },
        {
          title: "Database",
          href: "/docs/configuration/database",
        },
        {
          title: "Authentification",
          href: "/docs/configuration/authentification",
        },
        {
          title: "Email",
          href: "/docs/configuration/email",
        },
        {
          title: "Subscriptions",
          href: "/docs/configuration/subscriptions",
        },
        {
          title: "Config files",
          href: "/docs/configuration/config-files",
        },
        {
          title: "Markdown files",
          href: "/docs/configuration/markdown-files",
        },
        {
          title: "Components",
          href: "/docs/configuration/components",
        },
      ],
    },
  ],
};
