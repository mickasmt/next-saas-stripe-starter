import Link from "next/link";

import { BLOG_AUTHORS } from "@/config/blog";
import { getBlurDataURL } from "@/lib/utils";
import BlurImage from "@/components/shared/blur-image";

export default async function Author({
  username,
  imageOnly,
}: {
  username: string;
  imageOnly?: boolean;
}) {
  const authors = BLOG_AUTHORS;

  return imageOnly ? (
    <BlurImage
      src={authors[username].image}
      alt={authors[username].name}
      width={32}
      height={32}
      priority
      placeholder="blur"
      blurDataURL={await getBlurDataURL(authors[username].image!)}
      className="size-8 rounded-full transition-all group-hover:brightness-90"
    />
  ) : (
    <Link
      href={`https://twitter.com/${authors[username].twitter}`}
      className="group flex w-max items-center space-x-2.5"
      target="_blank"
      rel="noopener noreferrer"
    >
      <BlurImage
        src={authors[username].image}
        alt={authors[username].name}
        width={40}
        height={40}
        priority
        placeholder="blur"
        blurDataURL={await getBlurDataURL(authors[username].image!)}
        className="size-8 rounded-full transition-all group-hover:brightness-90 md:size-10"
      />
      <div className="flex flex-col -space-y-0.5">
        <p className="font-semibold text-foreground max-md:text-sm">
          {authors[username].name}
        </p>
        <p className="text-sm text-muted-foreground">
          @{authors[username].twitter}
        </p>
      </div>
    </Link>
  );
}
