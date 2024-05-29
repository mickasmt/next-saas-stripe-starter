import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

import { BlogPosts } from "@/components/blog-posts";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Blog – SaaS Starter",
  description: "Manage billing and your subscription plan.",
});

export default async function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return (
    <main>
      <BlogPosts posts={posts} />
    </main>
  );
}
