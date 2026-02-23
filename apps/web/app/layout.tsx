import { Geist, Geist_Mono } from "next/font/google"

import { ClerkProvider } from "@clerk/nextjs";

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

/**
 * Renders the application's root HTML document, applies global fonts and layout classes, and wraps `children` with Clerk and app providers.
 *
 * @param children - The page content to render inside the root layout
 * @returns The root HTML structure containing the provided `children` wrapped by `ClerkProvider` and `Providers`
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
