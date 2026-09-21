import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPaletteProvider } from "@/components/CommandPaletteProvider";
import CommandPalette from "@/components/CommandPalette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display/annotation face. Never used for body copy — see the design spec.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jakejeffreys.dev"),
  title: "Jake Jeffreys — Senior Software Engineer",
  description:
    "Backend software engineer in Denver, Colorado. 8+ years building distributed systems, REST APIs, and event-driven services on AWS.",
  keywords: ["backend engineer", "software engineer", "AWS", "distributed systems", "event-driven", "TypeScript", "Terraform", "Denver", "Colorado"],
  authors: [{ name: "Jake Jeffreys" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Jake Jeffreys — Senior Software Engineer",
    description:
      "Backend software engineer in Denver, Colorado. 8+ years building distributed systems, REST APIs, and event-driven services on AWS.",
    url: "https://jakejeffreys.dev",
    siteName: "Jake Jeffreys",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jake Jeffreys — Senior Software Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Jeffreys — Senior Software Engineer",
    description:
      "Backend software engineer in Denver, Colorado. 8+ years building distributed systems, REST APIs, and event-driven services on AWS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}>
        <ThemeProvider>
          <CommandPaletteProvider>
            <CommandPalette />
            {children}
          </CommandPaletteProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
