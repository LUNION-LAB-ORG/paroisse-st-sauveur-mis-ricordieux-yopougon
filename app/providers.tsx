"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider as JotaiProvider } from "jotai";
import { Toast } from "@heroui/react";
import QueryProvider from "@/providers/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <QueryProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
        >
          <NuqsAdapter>
            {children}
            <Toast.Provider placement="top end" />
          </NuqsAdapter>
        </NextThemesProvider>
      </QueryProvider>
    </JotaiProvider>
  );
}
