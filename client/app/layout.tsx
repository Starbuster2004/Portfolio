import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"

import { Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: '--font-inter' })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: '--font-geist-mono' })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"], variable: '--font-source-serif-4' })

export const metadata: Metadata = {
  title: "Govindraj Kotalwar | AI Engineer",
  description: "Portfolio of Govindraj Kotalwar - AI & Data Science Professional",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  // SEO enhancements
  keywords: ["AI Engineer", "Machine Learning", "Full Stack Developer", "Portfolio", "Govindraj Kotalwar"],
  authors: [{ name: "Govindraj Kotalwar" }],
  openGraph: {
    title: "Govindraj Kotalwar | AI Engineer",
    description: "Portfolio of Govindraj Kotalwar - AI & Data Science Professional",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Root Layout
 * 
 * Note: ProjectProvider has been removed as all data is now fetched
 * at build time via ISR in individual page components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_inter.variable} ${_geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
