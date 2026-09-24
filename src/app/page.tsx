import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import GitHubActivity from "@/components/sections/GitHubActivity";
import Instagram from "@/components/sections/Instagram";
import Contact from "@/components/sections/Contact";
import TechStack from "@/components/sections/TechStack";
import { getPhotos } from "@/lib/photos";

export default function Home() {
  // Read at build time so adding or removing a file in public/instagram/
  // is the whole operation — no list to keep in sync.
  const photos = getPhotos();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <TechStack />
        <GitHubActivity />
        <Instagram photos={photos} />
        <Contact />
      </main>

      <footer className="relative pt-10">
        {/* Torn top edge, as if the page were pulled from a pad */}
        <svg
          className="absolute left-0 top-0 block w-full"
          height="10"
          viewBox="0 0 400 10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 6 Q 10 2, 20 5 T 40 5 T 60 3 T 80 7 T 100 5 T 120 2 T 140 6 T 160 7 T 180 3 T 200 5 T 220 6 T 240 2 T 260 7 T 280 5 T 300 3 T 320 6 T 340 4 T 360 6 T 380 3 T 400 5 L 400 10 L 0 10 Z"
            fill="var(--color-surface-2)"
          />
          <path
            d="M0 6 Q 10 2, 20 5 T 40 5 T 60 3 T 80 7 T 100 5 T 120 2 T 140 6 T 160 7 T 180 3 T 200 5 T 220 6 T 240 2 T 260 7 T 280 5 T 300 3 T 320 6 T 340 4 T 360 6 T 380 3 T 400 5"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        </svg>

        <div
          className="px-6 py-10 text-center text-sm"
          style={{ background: "var(--color-surface-2)", color: "var(--color-text-dim)" }}
        >
          <p>
            Drawn &amp; built by{" "}
            <span
              style={{
                fontFamily: "var(--font-hand)",
                color: "var(--color-accent)",
                fontSize: "1.3rem",
              }}
            >
              Jake Jeffreys
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}
