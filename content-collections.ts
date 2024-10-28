import {
  defineCollection,
  defineConfig,
  Context,
  Document,
} from "@content-collections/core";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { compileMDX } from "@content-collections/mdx";

type Transformed = {
  _id: string
  body: string;
  slug: string;
  images: string[];
  slugAsParams: string;
}

const transform = async <T extends Document & { content: string }>(
  doc: T,
  context: Context
): Promise<T & Transformed> => {
  const body = await compileMDX(context, doc, {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code") return;
            node.rawString = codeEl.children?.[0].value;
          }
        });
      },
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
        },
      ],
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "figure") {
            if (!("data-rehype-pretty-code-figure" in node.properties)) {
              return;
            }
            const preElement = node.children.at(-1);
            if (preElement.tagName !== "pre") {
              return;
            }
            preElement.properties["rawString"] = node.rawString;
          }
        });
      },
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  });

  const imageMatches =
    doc.content.match(/(?<=<Image[^>]\bsrc=")[^"]+(?="[^>]\/>)/g) || [];

  const rootPath = context.collection.directory.split("/").slice(1).join("/")

  const transformedDoc: T & Transformed = {
    ...doc,
    body,
    images: imageMatches,
    _id: doc._meta.filePath,
    slugAsParams: doc._meta.path,
    slug: `/${rootPath}/${doc._meta.path}`
  };

  return transformedDoc;
};

const Page = defineCollection({
  name: "Page",
  directory: "content/pages",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
  }),
  transform,
});

const Doc = defineCollection({
  name: "Doc",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
    published: z.boolean().default(true),
  }),
  transform,
});

const Guide = defineCollection({
  name: "Guide",
  directory: "content/guides",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    published: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
  transform,
});

const Post = defineCollection({
  name: "Post",
  directory: "content/blog",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    published: z.boolean().default(true),
    image: z.string(),
    authors: z.array(z.string()),
    categories: z.array(z.enum(["news", "education"])).default(["news"]),
    related: z.array(z.string()).optional(),
  }),
  transform,
});

export default defineConfig({
  collections: [Page, Doc, Guide, Post],
});
