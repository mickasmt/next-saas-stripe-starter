import { Link2 } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/components/content/mdx-components"
import { TableOfContents } from "@/components/content/table-of-contents"
import { GridSection } from "@/components/marketing/grid-section"
import { siteConfig } from "@/config/site"
import { legalSource } from "@/lib/content/legal"
import { formatDate } from "@/lib/utils"

// Renders a page of content/legal: title band, numbered sections with a
// sticky table of contents, then the last update date. Adapted from dub.co's
// legal pages.
export function LegalPage({ slug }: { slug: string }) {
  const page = legalSource.getPage([slug])
  if (!page) notFound()

  const MDX = page.data.body
  const sections = page.data.toc.filter((item) => item.depth === 2)

  return (
    <>
      <GridSection innerClassName="py-16">
        <h1 className="mx-auto max-w-md text-center font-display text-4xl font-medium text-balance sm:text-5xl sm:leading-[1.15]">
          {page.data.title}
        </h1>
      </GridSection>

      <GridSection innerClassName="py-8 sm:py-12">
        <div className="grid grid-cols-4 gap-10 lg:gap-20">
          <article className="prose-neutral dark:prose-invert col-span-4 prose max-w-none [counter-reset:legal] md:col-span-3">
            <MDX
              components={getMDXComponents({
                h2: LegalHeading,
                Section: LegalSection,
              })}
            />
          </article>

          <aside className="hidden md:block">
            <TableOfContents items={sections} className="sticky top-20" />
          </aside>
        </div>
      </GridSection>

      <GridSection innerClassName="py-10">
        <p className="text-center text-sm text-muted-foreground">
          Last updated: {formatDate(page.data.updatedAt)}
        </p>
      </GridSection>
    </>
  )
}

export function getLegalMetadata(slug: string): Metadata {
  const page = legalSource.getPage([slug])
  if (!page) notFound()

  return {
    title: `${page.data.title} | ${siteConfig.name}`,
    description: page.data.description,
  }
}

// A `<Section>` wraps one `## heading` and its content in the MDX file. The
// rail joins the numbered circles and stops at the last section.
function LegalSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative pb-6 before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-border last:pb-0 last:before:hidden [&>:last-child]:mb-0 [&>:not(:first-child)]:ml-12">
      {children}
    </section>
  )
}

function LegalHeading({
  id,
  children,
}: {
  id?: string
  children?: React.ReactNode
}) {
  return (
    <a
      href={`#${id}`}
      className="not-prose group relative flex items-center gap-4 pt-2 no-underline"
    >
      <span className="flex size-8 flex-none items-center justify-center rounded-full border bg-background font-display text-sm font-bold text-muted-foreground [counter-increment:legal] before:content-[counter(legal)] group-hover:before:content-none">
        <Link2
          aria-label="Link to section"
          className="hidden size-4 group-hover:block"
        />
      </span>
      <h2
        id={id}
        className="m-0 scroll-mt-20 font-display text-xl font-medium text-foreground"
      >
        {children}
      </h2>
    </a>
  )
}
