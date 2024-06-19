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
          title: "Authentification",
          href: "/docs/configuration/authentification",
        },
        {
          title: "Blog",
          href: "/docs/configuration/blog",
        },
        {
          title: "Components",
          href: "/docs/configuration/components",
        },
        {
          title: "Config files",
          href: "/docs/configuration/config-files",
        },
        {
          title: "Database",
          href: "/docs/configuration/database",
        },
        {
          title: "Email",
          href: "/docs/configuration/email",
        },
        {
          title: "Markdown files",
          href: "/docs/configuration/markdown-files",
        },
        {
          title: "Subscriptions",
          href: "/docs/configuration/subscriptions",
        },
      ],
    },
  ],
};
