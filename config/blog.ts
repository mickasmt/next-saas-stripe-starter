export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "education";
  description: string;
}[] = [
  {
    title: "News",
    slug: "news",
    description: "Updates and announcements from Next SaaS Starter.",
  },
  {
    title: "Education",
    slug: "education",
    description: "Educational content about SaaS management.",
  },
];

export const BLOG_AUTHORS = {
  mickasmt: {
    name: "mickasmt",
    image: "/images/avatars/mickasmt.png",
    twitter: "miickasmt",
  },
  shadcn: {
    name: "shadcn",
    image: "/images/avatars/shadcn.jpeg",
    twitter: "shadcn",
  },
};
