import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page"
import { createRelativeLink } from "fumadocs-ui/mdx"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/components/content/mdx-components"
import { siteConfig } from "@/config/site"
import { docsSource } from "@/lib/content/docs"

type Props = { params: Promise<{ slug?: string[] }> }

export default async function DocsSlugPage({ params }: Props) {
  const { slug } = await params
  const page = docsSource.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(docsSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return docsSource.generateParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = docsSource.getPage(slug)
  if (!page) notFound()

  return {
    title: `${page.data.title} | ${siteConfig.name}`,
    description: page.data.description,
  }
}
