// Authors and categories referenced by key in the blog posts' frontmatter.

export const blogCategories = {
  news: {
    title: "News",
    description: "Updates and announcements.",
  },
  education: {
    title: "Education",
    description: "Guides and deep dives.",
  },
} satisfies Record<string, { title: string; description: string }>

export const blogAuthors = {
  mickasmt: {
    name: "mickasmt",
    role: "Maintainer",
    image: "/_static/avatars/mickasmt.png",
    twitter: "miickasmt",
  },
  shadcn: {
    name: "shadcn",
    role: "Contributor",
    image: "/_static/avatars/shadcn.jpeg",
    twitter: "shadcn",
  },
} satisfies Record<
  string,
  { name: string; role: string; image: string; twitter: string }
>

export type BlogCategory = keyof typeof blogCategories
export type BlogAuthor = keyof typeof blogAuthors
