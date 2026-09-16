import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { GridSection } from "@/components/marketing/grid-section"
import { getMDXComponents } from "@/components/content/mdx-components"
import { TableOfContents } from "@/components/content/table-of-contents"
import { getStarterCta } from "@/components/marketing/starter-cta"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  blogAuthors,
  blogCategories,
  type BlogAuthor,
  type BlogCategory,
} from "@/config/blog"
import { siteConfig } from "@/config/site"
import { blogSource } from "@/lib/content/blog"
import { requireFeature } from "@/lib/features/guard"
import { formatDate } from "@/lib/utils"

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Props) {
  await requireFeature("blog")
  const { slug } = await params
  const post = blogSource.getPage([slug])
  if (!post) notFound()

  const MDX = post.data.body
  const cta = await getStarterCta()
  const authors = post.data.authors
    .map((key) => blogAuthors[key as BlogAuthor])
    .filter(Boolean)
  const related = post.data.related
    .map((relatedSlug) => blogSource.getPage([relatedSlug]))
    .filter((page) => page !== undefined)
    .slice(0, 3)

  return (
    <>
      {/* Header band: badge/date, title, description. Left-aligned inside the
          rails, like dub.co's blog post header, not centered. */}
      <GridSection lines innerClassName="pb-12 pt-16 sm:px-12">
        <div className="max-w-screen-sm">
          <div className="flex flex-wrap items-center gap-4">
            {post.data.categories.map((key) => (
              <Badge key={key} variant="secondary" className="rounded-lg">
                {blogCategories[key as BlogCategory]?.title ?? key}
              </Badge>
            ))}
            <span className="text-sm text-muted-foreground">
              Last updated · {formatDate(post.data.date)}
            </span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-medium text-balance sm:text-4xl sm:leading-[1.25]">
            {post.data.title}
          </h1>
          <p className="mt-5 text-muted-foreground sm:text-lg">
            {post.data.description}
          </p>
        </div>
      </GridSection>

      {/* Content band: a 3-column grid that runs edge-to-edge inside the
          rails, no gap. Left 2/3 holds the flush hero image + article. Right
          1/3 is a distinct grey column (border-l + bg-muted) that runs the
          full height, holding "Written by", the TOC and the CTA card. */}
      <GridSection innerClassName="px-0 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="relative aspect-[1200/630] w-full overflow-hidden">
              <Image
                src={post.data.image}
                alt={post.data.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <article className="prose-neutral dark:prose-invert prose max-w-none px-5 py-10 sm:px-12 lg:prose-lg prose-headings:scroll-mt-24 prose-headings:font-display prose-a:font-medium prose-a:text-foreground prose-a:underline-offset-4 prose-img:rounded-xl prose-img:border">
              <MDX components={getMDXComponents()} />
            </article>

            {related.length > 0 && (
              <div className="border-t border-grid-border p-10">
                <p className="font-display text-xl font-medium">Read more</p>
                <div className="mt-4 flex flex-col gap-4">
                  {related.map(
                    (page) =>
                      page && (
                        <Link
                          key={page.url}
                          href={page.url}
                          className="group flex flex-col items-center gap-4 sm:flex-row"
                        >
                          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border sm:w-[200px]">
                            <Image
                              src={page.data.image}
                              alt={page.data.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-display font-medium group-hover:underline group-hover:underline-offset-4">
                              {page.data.title}
                            </p>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {page.data.description}
                            </p>
                          </div>
                        </Link>
                      )
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="hidden border-l border-grid-border bg-muted/40 p-10 md:block">
            <div className="sticky top-20">
              {authors.length > 0 && (
                <div className="pb-5">
                  <p className="text-sm text-muted-foreground">Written by</p>
                  <div className="mt-3 space-y-3">
                    {authors.map((author) => (
                      <div
                        key={author.name}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="size-9 border">
                          <AvatarImage src={author.image} alt={author.name} />
                          <AvatarFallback>
                            {author.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold leading-none">
                            {author.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {author.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <TableOfContents className="pt-4" items={post.data.toc} />

              <Link
                href={cta.href}
                {...(cta.external && { target: "_blank", rel: "noreferrer" })}
                className="group relative mt-8 block overflow-hidden rounded-xl border bg-background p-4 transition-colors hover:bg-background/60"
              >
                <ArrowUpRight className="absolute right-4 top-4 size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <p className="pr-6 text-sm font-semibold">{cta.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Free and open source. Auth, billing and admin, ready to plug
                  in.
                </p>
              </Link>
            </div>
          </aside>
        </div>
      </GridSection>
    </>
  )
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({ slug: page.slugs[0] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogSource.getPage([slug])
  if (!post) notFound()

  return {
    title: `${post.data.title} | ${siteConfig.name}`,
    description: post.data.description,
  }
}
