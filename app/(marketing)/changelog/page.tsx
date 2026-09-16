import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { getMDXComponents } from "@/components/content/mdx-components"
import { GridSection } from "@/components/marketing/grid-section"
import { siteConfig } from "@/config/site"
import { changelogSource } from "@/lib/content/changelog"
import { requireFeature } from "@/lib/features/guard"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: `Changelog | ${siteConfig.name}`,
  description: "New features, fixes and improvements.",
}

export default async function ChangelogPage() {
  await requireFeature("changelog")

  const entries = changelogSource
    .getPages()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return (
    <GridSection lines innerClassName="py-12 sm:py-14">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-medium text-balance sm:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 text-muted-foreground">
          New features, fixes and improvements.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl divide-y">
        {entries.map((entry) => {
          const MDX = entry.data.body
          return (
            <article
              key={entry.url}
              className="grid grid-cols-1 gap-4 py-10 first:pt-0 sm:grid-cols-[120px_1fr] sm:gap-8"
            >
              <time
                dateTime={entry.data.date.toISOString()}
                className="text-sm text-muted-foreground sm:pt-1"
              >
                {formatDate(entry.data.date)}
              </time>

              <div>
                <Link href={entry.url} className="group">
                  <h2 className="text-xl font-semibold group-hover:underline group-hover:underline-offset-4">
                    {entry.data.title}
                  </h2>
                </Link>

                {entry.data.image && (
                  <Link href={entry.url}>
                    <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg border">
                      <Image
                        src={entry.data.image}
                        alt={entry.data.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                )}

                <div className="prose prose-neutral dark:prose-invert mt-4 max-w-none prose-sm">
                  <MDX components={getMDXComponents()} />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </GridSection>
  )
}
