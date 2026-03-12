import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jakejeffreys.dev"),
  title: "Jake Jeffreys — Senior Platform Engineer",
  description:
    "Senior Platform Engineer based in Denver, Colorado. Designing and scaling cloud-native backend systems on AWS.",
  keywords: ["platform engineer", "software engineer", "AWS", "cloud-native", "Denver", "Colorado"],
  authors: [{ name: "Jake Jeffreys" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Jake Jeffreys — Senior Platform Engineer",
    description:
      "Senior Platform Engineer based in Denver, Colorado. Designing and scaling cloud-native backend systems on AWS.",
    url: "https://jakejeffreys.dev",
    siteName: "Jake Jeffreys",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jake Jeffreys — Senior Platform Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Jeffreys — Senior Platform Engineer",
    description:
      "Senior Platform Engineer based in Denver, Colorado. Designing and scaling cloud-native backend systems on AWS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
