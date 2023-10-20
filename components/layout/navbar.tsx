"use client";

import useScroll from "@/hooks/use-scroll";
import { MainNavItem } from "@/types";
import { MainNav } from "./main-nav";
import { UserAccountNav } from "./user-account-nav";

interface NavBarProps {
  items?: MainNavItem[]
  children?: React.ReactNode
  rightElements?: React.ReactNode
  scroll?: boolean
}

export default function NavBar({ items, children, rightElements, scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center transition-all ${scroll ? scrolled
        ? "border-b bg-background/60 backdrop-blur-xl"
        : "bg-background/0"
        : "border-b bg-background"}`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav items={items}>{children}</MainNav>

        <div className="flex items-center space-x-4">
          {rightElements}
          <UserAccountNav />
        </div>
      </div>
    </header>
  );
}