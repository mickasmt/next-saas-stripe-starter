import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { blogSource } from "@/lib/content/blog" // module:blog
import { changelogSource } from "@/lib/content/changelog" // module:changelog
import { docsSource } from "@/lib/content/docs" // module:docs
import { legalSource } from "@/lib/content/legal"
import { getFeatures } from "@/lib/features/resolve"

const absolute = (path: string) => new URL(path, siteConfig.url).toString()

// Public pages only: a module that is switched off serves no route, so it
// contributes nothing here.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const features = await getFeatures()
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    {
      url: absolute("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absolute("/pro"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  // module:billing start
  if (features.billing) {
    entries.push({
      url: absolute("/pricing"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    })
  }
  // module:billing end

  // module:docs start
  if (features.docs) {
    for (const page of docsSource.getPages()) {
      entries.push({
        url: absolute(page.url),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }
  }
  // module:docs end

  // module:blog start
  if (features.blog) {
    entries.push({
      url: absolute("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
    for (const post of blogSource.getPages()) {
      entries.push({
        url: absolute(post.url),
        lastModified: post.data.date,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    }
  }
  // module:blog end

  // module:changelog start
  if (features.changelog) {
    entries.push({
      url: absolute("/changelog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
    for (const entry of changelogSource.getPages()) {
      entries.push({
        url: absolute(entry.url),
        lastModified: entry.data.date,
        changeFrequency: "yearly",
        priority: 0.5,
      })
    }
  }
  // module:changelog end

  for (const page of legalSource.getPages()) {
    entries.push({
      url: absolute(page.url),
      lastModified: page.data.updatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    })
  }

  return entries
}
