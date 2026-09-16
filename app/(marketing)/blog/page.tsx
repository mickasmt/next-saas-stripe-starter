import { CornerDownRight } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { CategoryTabs } from "@/components/marketing/category-tabs"
import { GridSection } from "@/components/marketing/grid-section"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import { blogAuthors, blogCategories, type BlogAuthor } from "@/config/blog"
import { siteConfig } from "@/config/site"
import { blogSource } from "@/lib/content/blog"
import { requireFeature } from "@/lib/features/guard"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description: "Guides, news and updates about the starter.",
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  await requireFeature("blog")
  const { category } = await searchParams

  const posts = blogSource
    .getPages()
    .filter((post) => !category || post.data.categories.includes(category))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const tabs = [
    { key: "all", label: "All", href: "/blog" },
    ...Object.entries(blogCategories).map(([key, value]) => ({
      key,
      label: value.title,
      href: `/blog?category=${key}`,
    })),
  ]

  return (
    <GridSection lines innerClassName="py-12 sm:py-14">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-medium text-balance sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 text-muted-foreground">
          Guides and news about the starter.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <CategoryTabs tabs={tabs} active={category ?? "all"} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-px border-t border-b border-grid-border bg-grid-border sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const authors = post.data.authors
            .map((key) => blogAuthors[key as BlogAuthor])
            .filter(Boolean)
          return (
            <Link
              key={post.url}
              href={post.url}
              className="group flex flex-col bg-background transition-colors hover:bg-muted/40"
            >
              <div className="relative aspect-[40/21] w-full overflow-hidden">
                <Image
                  src={post.data.image}
                  alt={post.data.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="line-clamp-2 text-base font-semibold group-hover:underline group-hover:underline-offset-4">
                  {post.data.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {post.data.description}
                </p>
                {authors.length > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <AvatarGroup>
                      {authors.map((author) => (
                        <Avatar key={author.name} size="sm">
                          <AvatarImage src={author.image} alt={author.name} />
                          <AvatarFallback>
                            {author.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(post.data.date)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
        {posts.length === 0 && (
          <p className="col-span-full flex items-center justify-center gap-2 bg-background p-10 text-sm text-muted-foreground">
            <CornerDownRight className="size-4" />
            No posts in this category yet.
          </p>
        )}
      </div>
    </GridSection>
  )
}
