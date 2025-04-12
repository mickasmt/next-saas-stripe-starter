import "@/styles/globals.css";

import { fontGeist, fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { usePathname, useSearchParams } from "next/navigation";

import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLanguage = (lang: string) => {
    const currentParams = new URLSearchParams(searchParams as any);
    currentParams.set("lang", lang);
    const newPath = `${pathname}?${currentParams.toString()}`;
    window.location.href = newPath; // Client-side navigation
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable,
          fontGeist.variable,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Language Selector */}
            <div className="language-switcher" style={{ position: "absolute", top: 10, right: 10 }}>
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                className="p-2 bg-white border border-gray-300 rounded"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <ModalProvider>{children}</ModalProvider>
            <Analytics />
            <Toaster richColors closeButton />
            <TailwindIndicator />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
