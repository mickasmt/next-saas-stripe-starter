"use client";

import { Check, List } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { BLOG_CATEGORIES } from "@/config/blog";
import { cn } from "@/lib/utils";

export function BlogHeaderLayout() {
  const [open, setOpen] = useState(false);
  const { slug } = useParams() as { slug?: string };
  const data = BLOG_CATEGORIES.find((category) => category.slug === slug);

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <MaxWidthWrapper className="py-6 md:pb-8 md:pt-10">
        <div className="max-w-screen-sm">
          <h1 className="font-heading text-3xl md:text-4xl">
            {data?.title || "Blog"}
          </h1>
          <p className="mt-3.5 text-base text-muted-foreground md:text-lg">
            {data?.description ||
              "Latest news and updates from Next SaaS Starter."}
          </p>
        </div>

        <nav className="mt-8 hidden w-full md:flex">
          <ul
            role="list"
            className="flex w-full flex-1 gap-x-2 border-b text-[15px] text-muted-foreground"
          >
            <CategoryLink title="All" href="/blog" active={!slug} />
            {BLOG_CATEGORIES.map((category) => (
              <CategoryLink
                key={category.slug}
                title={category.title}
                href={`/blog/category/${category.slug}`}
                active={category.slug === slug}
              />
            ))}
            <CategoryLink title="Guides" href="/guides" active={false} />
          </ul>
        </nav>
      </MaxWidthWrapper>

      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="mb-8 flex w-full items-center border-y p-3 text-foreground/90 md:hidden"
        >
          <List className="size-[18px]" />
          <p className="ml-2.5 text-sm font-medium">Categories</p>
        </Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={closeDrawer} />
        <Drawer.Portal>
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>
            <ul role="list" className="mb-14 w-full p-3 text-muted-foreground">
              <CategoryLink
                title="All"
                href="/blog"
                active={!slug}
                clickAction={closeDrawer}
                mobile
              />
              {BLOG_CATEGORIES.map((category) => (
                <CategoryLink
                  key={category.slug}
                  title={category.title}
                  href={`/blog/category/${category.slug}`}
                  active={category.slug === slug}
                  clickAction={closeDrawer}
                  mobile
                />
              ))}
              <CategoryLink
                title="Guides"
                href="/guides"
                active={false}
                mobile
              />
            </ul>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

const CategoryLink = ({
  title,
  href,
  active,
  mobile = false,
  clickAction,
}: {
  title: string;
  href: string;
  active: boolean;
  mobile?: boolean;
  clickAction?: () => void;
}) => {
  return (
    <Link href={href} onClick={clickAction}>
      {mobile ? (
        <li className="rounded-lg text-foreground hover:bg-muted">
          <div className="flex items-center justify-between px-3 py-2 text-sm">
            <span>{title}</span>
            {active && <Check className="size-4" />}
          </div>
        </li>
      ) : (
        <li
          className={cn(
            "-mb-px border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground",
            {
              "border-purple-600 text-foreground dark:border-purple-400/80":
                active,
            },
          )}
        >
          <div className="px-3 pb-3">{title}</div>
        </li>
      )}
    </Link>
  );
};
