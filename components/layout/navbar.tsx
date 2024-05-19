"use client";

import { MainNavItem } from "@/types";
import { useSession } from "next-auth/react";

import useScroll from "@/hooks/use-scroll";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { Button } from "@/components/ui/button";

import { Icons } from "../shared/icons";
import { MainNav } from "./main-nav";
import { UserAccountNav } from "./user-account-nav";

interface NavBarProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
}

export function NavBar({
  items,
  children,
  rightElements,
  scroll = false,
}: NavBarProps) {
  const scrolled = useScroll(50);
  const signInModal = useSigninModal();
  const { data: session, status } = useSession();

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-background/0") : "border-b"
      }`}
    >
      <div className="container flex h-[60px] items-center justify-between py-4">
        <MainNav items={items}>{children}</MainNav>

        <div className="flex items-center space-x-3">
          {rightElements}

          {/* {!user ? (
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  rounded: "full",
                }),
                "px-4",
              )}
            >
              Login Page
            </Link>
          ) : null} */}

          {session ? (
            <UserAccountNav user={session.user} />
          ) : status === "unauthenticated" ? (
            <Button
              className="animate-fade-in gap-2 px-4 transition-colors ease-out"
              variant="default"
              size="sm"
              rounded="full"
              onClick={signInModal.onOpen}
            >
              <span>Sign In</span>
              <Icons.arrowRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
