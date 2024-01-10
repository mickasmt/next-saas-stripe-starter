"use client";

import useScroll from "@/hooks/use-scroll";
import { MainNavItem } from "@/types";
import { MainNav } from "./main-nav";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs"

interface NavBarProps {
  items?: MainNavItem[]
  children?: React.ReactNode
  rightElements?: React.ReactNode
  scroll?: boolean
}

export function NavBar({ items, children, rightElements, scroll = false }: NavBarProps) {
  const { user } = useUser();
  const scrolled = useScroll(50);

console.log(user);

  return (
      <header
        className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${scroll ? scrolled
          ? "border-b"
          : "bg-background/0"
          : "border-b"}`}
      >
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={items}>{children}</MainNav>

          <div className="flex items-center space-x-3">
            {rightElements}

            {!user ? (
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                Sign in
              </Link>
            ) : (
              <UserButton
                afterSignOutUrl='/'
              />
            )}
          </div>
        </div>
      </header>
  );
}