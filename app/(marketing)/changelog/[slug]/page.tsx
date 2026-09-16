import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { GridSection } from "@/components/marketing/grid-section"
import { getMDXComponents } from "@/components/content/mdx-components"
import { ProCtaCard } from "@/components/content/pro-cta-card"
import { ShareRow } from "@/components/content/share-row"
import { TableOfContents } from "@/components/content/table-of-contents"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { blogAuthors, type BlogAuthor } from "@/config/blog"
import { siteConfig } from "@/config/site"
import { changelogSource } from "@/lib/content/changelog"
import { requireFeature } from "@/lib/features/guard"
import { formatDate } from "@/lib/utils"

type Props = { params: Promise<{ slug: string }> }

export default async function ChangelogEntryPage({ params }: Props) {
  await requireFeature("changelog")
  const { slug } = await params
  const entry = changelogSource.getPage([slug])
  if (!entry) notFound()

  const MDX = entry.data.body
  const author = entry.data.author
    ? blogAuthors[entry.data.author as BlogAuthor]
    : undefined

  return (
    <>
      {/* Header band: badge/date, title, description, left-aligned. */}
      <GridSection lines innerClassName="pb-12 pt-16 sm:px-12">
        <div className="max-w-screen-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="secondary" className="rounded-lg">
              Changelog
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last updated · {formatDate(entry.data.date)}
            </span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-medium text-balance sm:text-4xl sm:leading-[1.25]">
            {entry.data.title}
          </h1>
          {entry.data.description && (
            <p className="mt-5 text-muted-foreground sm:text-lg">
              {entry.data.description}
            </p>
          )}
        </div>
      </GridSection>

      {/* Gapless 3-column grid: flush image + article in the left 2/3, a
          full-height bg-muted sidebar in the right 1/3. */}
      <GridSection innerClassName="px-0 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            {entry.data.image && (
              <div className="relative aspect-[1200/630] w-full overflow-hidden">
                <Image
                  src={entry.data.image}
                  alt={entry.data.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <article className="prose-neutral dark:prose-invert prose max-w-none px-5 py-10 sm:px-12 lg:prose-lg prose-headings:scroll-mt-24 prose-headings:font-display prose-a:font-medium prose-a:text-foreground prose-a:underline-offset-4 prose-img:rounded-xl prose-img:border">
              <MDX components={getMDXComponents()} />
            </article>
          </div>

          <aside className="hidden border-l border-grid-border bg-muted/40 p-10 md:block">
            <div className="sticky top-20">
              {author && (
                <div className="pb-5">
                  <p className="text-sm text-muted-foreground">Written by</p>
                  <div className="mt-3 flex items-center gap-3">
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
                </div>
              )}

              <ShareRow title={entry.data.title} className="pb-5" />

              <TableOfContents className="pt-4" items={entry.data.toc} />

              <ProCtaCard className="mt-8" />
            </div>
          </aside>
        </div>
      </GridSection>
    </>
  )
}

export function generateStaticParams() {
  return changelogSource.getPages().map((page) => ({ slug: page.slugs[0] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = changelogSource.getPage([slug])
  if (!entry) notFound()

  return {
    title: `${entry.data.title} | ${siteConfig.name}`,
    description: entry.data.description,
  }
}
