import { loader } from "fumadocs-core/source"
import { defineDocs } from "fumadocs-mdx/macro"

const docs = defineDocs({
  dir: "content/docs",
})

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
})
