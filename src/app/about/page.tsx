import type { Metadata } from "next";
import About from "@/components/sections/About";
import Instagram from "@/components/sections/Instagram";
import { getPhotos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "About — Jake Jeffreys",
  description:
    "Backend software engineer in Denver, Colorado: bio, what I'm up to lately, interests, and photos.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  // Read at build time so adding or removing a file in public/instagram/
  // is the whole operation — no list to keep in sync.
  const photos = getPhotos();

  return (
    <main className="paper-page pt-16">
      <About />
      <Instagram photos={photos} />
    </main>
  );
}
