import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import Image from "next/image"

import { Callout } from "@/components/content/callout"

// Shared by docs, blog and changelog. Pass page-specific overrides (e.g.
// relative links) as `components`.
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Image,
    Callout,
    ...components,
  } satisfies MDXComponents
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
