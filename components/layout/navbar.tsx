"use client";

import useScroll from "@/hooks/use-scroll";
import { MainNavItem } from "@/types";
import { User } from "next-auth";
import { MainNav } from "./main-nav";
import { UserAccountNav } from "./user-account-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSigninModal } from "@/hooks/use-signin-modal";


interface NavBarProps {
  user: Pick<User, "name" | "image" | "email"> | undefined
  items?: MainNavItem[]
  children?: React.ReactNode
  rightElements?: React.ReactNode
  scroll?: boolean
}

export function NavBar({ user, items, children, rightElements, scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const signInModal = useSigninModal();

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
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                Login Page
              </Link>
            ) : null}

            {user ? (
              <UserAccountNav user={user} />
            ) : (
              <Button className="px-3" variant="default" size="sm" onClick={signInModal.onOpen}>Sign In</Button>
            )}
          </div>
        </div>
      </header>
  );
}