---
title: Markdown Files
description: How works blog and docs.
---

The project includes a blog and documentation built using [Contentlayer](https://contentlayer.dev/) and [MDX](https://mdxjs.com/).

## Contentlayer

Contentlayer is a Markdown-based CMS that's flexible and extensible. It lets you organize content using Markdown files and offers a straightforward API for accessing data in your app.

You can create reusable data models for various content types like blog posts, docs, and pages with Contentlayer.

Frontmatter in Markdown files allows you to define metadata such as title, description, authors, and images, simplifying content management.

### contentlayer.config.js

Here's an example of a `contentlayer.config.js` file to configure Contentlayer in your project:

```typescript title="contentlayer.config.js"
import { defineDocumentType, makeSource } from "contentlayer/source-files";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    published: {
      type: "boolean",
      default: true,
    },
  },
  computedFields,
}));

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  filePathPattern: `guides/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    date: {
      type: "date",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    featured: {
      type: "boolean",
      default: false,
    },
  },
  computedFields,
}));

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    date: {
      type: "date",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    image: {
      type: "string",
      required: true,
    },
    authors: {
      type: "list",
      of: { type: "string" },
      required: true,
    },
  },
  computedFields,
}));

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Page, Doc, Guide, Post],
  mdx: {},
});
```

This file configures Contentlayer to look for Markdown files in the specified directories (`content/blog`, `content/authors`, `content/docs`, `content/guides`, `content/pages`). It also defines the different document types you use in your project along with the fields associated with each document type.

You can customize this file according to your project's needs by adding new document types or adjusting existing fields as per your specific requirements.

## Frontmatters

Here's the list of all frontmatters available for each parts:

<Steps>

### Authors

```md
---
title: mickasmt
avatar: /_static/avatars/mickasmt.jpg
twitter: mickasmt
---
```

### Blog

```md
---
title: Deploying Next.js Apps
description: How to deploy your Next.js apps on Vercel.
image: /_static/blog/blog-post-3.jpg
date: "2023-01-02"
authors:
  - mickasmt
---
```

### Docs

```md
---
title: Database
description: How to config your Neon database.
---
```

### Guides

```md
---
title: Build a blog using ContentLayer and MDX.
description: Learn how to use ContentLayer to build a blog with Next.js
date: 2022-11-18
---
```

### Pages

```md
---
title: Privacy
description: The Privacy Policy for your app.
---
```

</Steps>
