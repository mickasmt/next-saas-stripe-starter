"use client"

import * as React from "react"
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <JotaiProvider>
        {children}
      </JotaiProvider>
    </NextThemesProvider>
  );
}
