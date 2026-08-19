import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { notFound } from "next/navigation";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="flex flex-col">
      <NavMobile />
      <NavBar />
      <MaxWidthWrapper className="min-h-screen" large>
        {children}
      </MaxWidthWrapper>
      <SiteFooter className="border-t" />
    </div>
  );
}
