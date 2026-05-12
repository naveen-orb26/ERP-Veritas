import type { Metadata } from "next"

import "./globals.css"

import { ThemeProvider } from "@/providers/theme-provider"
import { UIProvider } from "@/providers/ui-provider"

export const metadata: Metadata = {
  title: "ERP-Veritas",
  description: "Industrial ERP Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>

        <ThemeProvider>

          <UIProvider>

            {children}

          </UIProvider>

        </ThemeProvider>

      </body>
    </html>
  )
}