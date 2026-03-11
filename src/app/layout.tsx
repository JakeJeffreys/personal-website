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
  title: "Jake Jeffreys — Senior Platform Engineer",
  description:
    "Senior Platform Engineer based in Denver, Colorado. Designing and scaling cloud-native backend systems on AWS.",
  keywords: ["platform engineer", "software engineer", "AWS", "cloud-native", "Denver", "Colorado"],
  authors: [{ name: "Jake Jeffreys" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Jake Jeffreys — Senior Platform Engineer",
    description:
      "Senior Platform Engineer based in Denver, Colorado. Designing and scaling cloud-native backend systems on AWS.",
    url: "https://jakejeffreys.dev",
    siteName: "Jake Jeffreys",
    locale: "en_US",
    type: "website",
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
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
