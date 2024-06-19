import { Post } from "contentlayer/generated";
import Image from "next/image";
import Link from "next/link";

import { cn, formatDate } from "@/lib/utils";

import Author from "./author";

export function BlogCard({
  data,
  priority,
  horizontale = false,
}: {
  data: Post;
  priority?: boolean;
  horizontale?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative",
        horizontale
          ? "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6"
          : "flex flex-col space-y-2",
      )}
    >
      {data.image && (
        <Image
          alt={data.title}
          src={data.image}
          width={804}
          height={452}
          className={cn(
            "w-full rounded-xl border object-cover object-center",
            horizontale ? "lg:h-72" : null,
          )}
          priority={priority}
        />
      )}
      <div
        className={cn(
          "flex flex-1 flex-col",
          horizontale ? "justify-center" : "justify-between",
        )}
      >
        <div className="w-full">
          <h2 className="my-1.5 line-clamp-2 font-heading text-2xl">
            {data.title}
          </h2>
          {data.description && (
            <p className="line-clamp-2 text-muted-foreground">
              {data.description}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-3">
          {/* <Author username={data.authors[0]} imageOnly /> */}

          <div className="flex items-center -space-x-2">
            {data.authors.map((author) => (
              <Author username={author} key={data._id+author} imageOnly />
            ))}
          </div>

          {data.date && (
            <p className="text-sm text-muted-foreground">
              {formatDate(data.date)}
            </p>
          )}
        </div>
      </div>
      <Link href={data.slug} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
}
