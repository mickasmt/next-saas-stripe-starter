import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { GridSection } from "@/components/marketing/grid-section"
import { getMDXComponents } from "@/components/content/mdx-components"
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
    <GridSection lines innerClassName="py-12 sm:py-14">
      <div className="mx-auto max-w-screen-sm text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {post.data.categories.map((key) => (
            <Badge key={key} variant="secondary">
              {blogCategories[key as BlogCategory]?.title ?? key}
            </Badge>
          ))}
          <span className="text-sm text-muted-foreground">
            Last updated · {formatDate(post.data.date)}
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-medium text-balance sm:text-4xl">
          {post.data.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {post.data.description}
        </p>
      </div>

      <div className="relative mx-auto mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl border">
        <Image
          src={post.data.image}
          alt={post.data.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-10 lg:grid-cols-3">
        <article className="prose prose-neutral dark:prose-invert max-w-none lg:col-span-2">
          <MDX components={getMDXComponents()} />
        </article>

        <aside className="space-y-8 lg:col-span-1">
          {authors.length > 0 && (
            <div>
              <p className="text-sm font-medium">Written by</p>
              <div className="mt-3 space-y-3">
                {authors.map((author) => (
                  <div key={author.name} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={author.image} alt={author.name} />
                      <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {author.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.data.toc.length > 0 && (
            <div>
              <p className="text-sm font-medium">On this page</p>
              <ul className="mt-3 space-y-2 border-l pl-4 text-sm">
                {post.data.toc.map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={cta.href}
            {...(cta.external && { target: "_blank", rel: "noreferrer" })}
            className="block rounded-xl border bg-muted/40 p-4 transition-colors hover:bg-muted/60"
          >
            <p className="text-sm font-semibold">{cta.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Free and open source. Auth, billing and admin, ready to plug in.
            </p>
          </Link>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-4xl border-t pt-10">
          <p className="text-sm font-medium">Read more</p>
          <div className="mt-4 space-y-4">
            {related.map(
              (page) =>
                page && (
                  <Link
                    key={page.url}
                    href={page.url}
                    className="group flex items-center gap-4 rounded-xl border p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={page.data.image}
                        alt={page.data.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
                        {page.data.title}
                      </p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {page.data.description}
                      </p>
                    </div>
                  </Link>
                )
            )}
          </div>
        </div>
      )}
    </GridSection>
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
