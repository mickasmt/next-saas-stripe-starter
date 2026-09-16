import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import Image from "next/image"

// Shared by docs, blog and changelog. Pass page-specific overrides (e.g.
// relative links) as `components`.
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Image,
    ...components,
  } satisfies MDXComponents
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
