import { marketingConfig } from "@/config/marketing";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar items={marketingConfig.mainNav} scroll={true} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
