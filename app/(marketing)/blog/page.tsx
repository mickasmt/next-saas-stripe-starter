import { CornerDownRight } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { CategoryMenu, CategoryTabs } from "@/components/marketing/category-tabs"
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
import { isFeatureEnabled } from "@/lib/features/resolve"
import { cn, formatDate } from "@/lib/utils"

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
    // Links out rather than filtering. Hidden when the changelog module is
    // off so it never points at a 404.
    ...((await isFeatureEnabled("changelog"))
      ? [{ key: "changelog", label: "Changelog", href: "/changelog" }]
      : []),
  ]

  return (
    <>
      <GridSection lines innerClassName="py-12">
        <h1 className="font-display text-4xl font-medium sm:text-5xl sm:leading-[1.15]">
          Blog
        </h1>
        <p className="mt-2 text-lg text-muted-foreground sm:text-lg">
          Guides and news about the starter.
        </p>
        <CategoryTabs
          tabs={tabs}
          active={category ?? "all"}
          className="mt-7 hidden w-fit justify-start sm:flex"
        />
        <CategoryMenu
          tabs={tabs}
          active={category ?? "all"}
          className="mt-8 sm:hidden"
        />
      </GridSection>

      {/* A short last row leaves empty cells rather than filled ones. Dividers
          are pseudo-elements, not borders, so a neighbouring image can't
          round over them on half-pixel grid lines. */}
      <GridSection innerClassName="px-0 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {posts.map((post) => {
            const authors = post.data.authors
              .map((key) => blogAuthors[key as BlogAuthor])
              .filter(Boolean)
            return (
              <Link
                key={post.url}
                href={post.url}
                className={cn(
                  "relative flex flex-col transition-colors hover:bg-muted/50",
                  // Top divider: every card but the first row.
                  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-grid-border max-md:first:before:hidden md:[&:nth-child(-n+3)]:before:hidden",
                  // Right divider: desktop only, not on the last column.
                  "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:hidden after:w-px after:bg-grid-border md:after:block md:[&:nth-child(3n)]:after:hidden"
                )}
              >
                {/* In flow rather than `fill`: an absolutely positioned image
                    lands on sub-pixel offsets and can cover the cell borders. */}
                <Image
                  src={post.data.image}
                  alt={post.data.title}
                  width={1200}
                  height={630}
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="aspect-[1200/630] w-full object-cover"
                />
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="line-clamp-2 font-display text-lg font-bold">
                      {post.data.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {post.data.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {authors.length > 0 && (
                      <AvatarGroup>
                        {authors.map((author) => (
                          <Avatar key={author.name}>
                            <AvatarImage src={author.image} alt={author.name} />
                            <AvatarFallback>
                              {author.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    )}
                    <time
                      dateTime={post.data.date.toISOString()}
                      className="text-sm text-muted-foreground"
                    >
                      {formatDate(post.data.date)}
                    </time>
                  </div>
                </div>
              </Link>
            )
          })}
          {posts.length === 0 && (
            <p className="col-span-full flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              <CornerDownRight className="size-4" />
              No posts in this category yet.
            </p>
          )}
          {/* Complete a short last row with empty cells so the dividers close
              off the grid instead of trailing into blank space. */}
          {posts.length > 0 &&
            Array.from({ length: (3 - (posts.length % 3)) % 3 }).map(
              (_, i) => (
                <div
                  key={`filler-${i}`}
                  aria-hidden
                  className={cn(
                    "relative hidden md:block",
                    "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-grid-border md:[&:nth-child(-n+3)]:before:hidden",
                    "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:hidden after:w-px after:bg-grid-border md:after:block md:[&:nth-child(3n)]:after:hidden"
                  )}
                />
              )
            )}
        </div>
      </GridSection>
    </>
  )
}
