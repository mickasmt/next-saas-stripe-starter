import Image from "next/image"
import Link from "next/link"

import { getMDXComponents } from "@/components/content/mdx-components"
import { GridSection } from "@/components/marketing/grid-section"
import { changelogSource } from "@/lib/content/changelog"
import { requireFeature } from "@/lib/features/guard"
import { buildMetadata } from "@/lib/metadata"
import { formatDate } from "@/lib/utils"

export const metadata = buildMetadata({
  title: "Changelog",
  description: "New features, fixes and improvements.",
  path: "/changelog",
})

export default async function ChangelogPage() {
  await requireFeature("changelog")

  const entries = changelogSource
    .getPages()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return (
    <>
      <GridSection lines innerClassName="py-12">
        <h1 className="font-display text-4xl font-medium sm:text-5xl sm:leading-[1.15]">
          Changelog
        </h1>
        <p className="mt-2 text-lg text-muted-foreground sm:text-lg">
          New features, fixes and improvements.
        </p>
      </GridSection>

      {/* Each date sticks under the site header while its entry scrolls past. */}
      <GridSection>
        {entries.map((entry) => {
          const MDX = entry.data.body
          return (
            <article
              key={entry.url}
              className="grid grid-cols-1 gap-4 py-10 sm:py-14 md:grid-cols-[200px_1fr] md:gap-12"
            >
              <div>
                <time
                  dateTime={entry.data.date.toISOString()}
                  className="block text-sm font-medium text-muted-foreground md:sticky md:top-24 md:mt-1.5 md:text-foreground"
                >
                  {formatDate(entry.data.date)}
                </time>
              </div>

              <div>
                <Link href={entry.url} className="group">
                  <h2 className="font-display text-2xl font-medium group-hover:underline group-hover:underline-offset-4 sm:text-3xl">
                    {entry.data.title}
                  </h2>
                </Link>

                {entry.data.image && (
                  <Link href={entry.url} className="mt-6 block">
                    <Image
                      src={entry.data.image}
                      alt={entry.data.title}
                      width={1200}
                      height={675}
                      sizes="(min-width: 768px) 740px, 100vw"
                      className="aspect-video w-full rounded-xl border object-cover"
                    />
                  </Link>
                )}

                <div className="prose-neutral dark:prose-invert prose mt-6 max-w-none">
                  <MDX components={getMDXComponents()} />
                </div>
              </div>
            </article>
          )
        })}
      </GridSection>
    </>
  )
}
