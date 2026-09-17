import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page"
import { createRelativeLink } from "fumadocs-ui/mdx"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/components/content/mdx-components"
import { docsSource } from "@/lib/content/docs"
import { buildMetadata } from "@/lib/metadata"

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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = docsSource.getPage(slug)
  if (!page) notFound()

  return buildMetadata({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
  })
}
