import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/components/content/mdx-components"
import { GridSection } from "@/components/marketing/grid-section"
import { ShareRow } from "@/components/content/share-row"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    <GridSection lines innerClassName="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/changelog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All posts
        </Link>

        <p className="mt-6 text-sm text-muted-foreground">
          {formatDate(entry.data.date)}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-balance sm:text-4xl">
          {entry.data.title}
        </h1>

        {entry.data.image && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl border">
            <Image
              src={entry.data.image}
              alt={entry.data.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-4 border-b pb-6">
          {author ? (
            <div className="flex items-center gap-3">
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
          ) : (
            <div />
          )}
          <ShareRow title={entry.data.title} />
        </div>

        <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
          <MDX components={getMDXComponents()} />
        </div>
      </div>
    </GridSection>
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
