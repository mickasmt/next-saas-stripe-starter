import Image from "next/image";
import Link from "next/link";

import { BLOG_AUTHORS } from "@/config/blog";

export default async function Author({
  username,
  imageOnly,
}: {
  username: string;
  imageOnly?: boolean;
}) {
  const authors = BLOG_AUTHORS;

  return imageOnly ? (
    <Image
      src={authors[username].image}
      alt={authors[username].name}
      width={32}
      height={32}
      className="size-8 rounded-full transition-all group-hover:brightness-90"
    />
  ) : (
    <Link
      href={`https://twitter.com/${username}`}
      className="group flex w-max items-center space-x-2.5"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src={authors[username].image}
        alt={authors[username].name}
        width={40}
        height={40}
        className="size-8 rounded-full transition-all group-hover:brightness-90 md:size-10"
      />
      <div className="flex flex-col -space-y-0.5">
        <p className="font-semibold text-foreground max-md:text-sm">
          {authors[username].name}
        </p>
        <p className="text-sm text-muted-foreground">@{username}</p>
      </div>
    </Link>
  );
}
