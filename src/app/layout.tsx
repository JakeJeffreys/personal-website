import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPaletteProvider } from "@/components/CommandPaletteProvider";
import CommandPalette from "@/components/CommandPalette";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import ConsoleGreeting from "@/components/ConsoleGreeting";
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
    icon: "/favicon.svg?v=paper-jj-small",
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
    // Font variables go on <html>, not <body>: Tailwind's @theme declares
    // --font-hand: var(--font-caveat) etc. on :root, and a var() there can only
    // resolve against variables defined on :root itself.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable}`}
    >
      <body className="antialiased">
        {/*
          Framer Motion server-renders its `initial` state, so ~90 elements ship
          with inline opacity:0 and only fade in once JS hydrates. Without this,
          the whole page reads as blank to anyone with JS disabled or blocked,
          and to crawlers that don't execute scripts.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ThemeProvider>
          <CommandPaletteProvider>
            <CommandPalette />
            <Nav />
            {children}
            <SiteFooter />
          </CommandPaletteProvider>
        </ThemeProvider>
        <Analytics />
        <ConsoleGreeting />
      </body>
    </html>
  );
}
