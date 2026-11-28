import Link from "next/link";
import { PaperCard, SectionHeading } from "@/components/paper";

const DESTINATIONS = [
  { href: "/lab", title: "lab", blurb: "Experiments, small tools, and odd ideas.", tilt: "a" },
  { href: "/work", title: "work", blurb: "Experience, tech stack, and GitHub activity.", tilt: "b" },
  { href: "/about", title: "about", blurb: "Bio, what I'm up to lately, and photos.", tilt: "c" },
] as const;

export default function Explore() {
  return (
    <section id="explore" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="keep exploring" eyebrow="the rest of the site" variant="dashed" />
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {DESTINATIONS.map((d, i) => (
            <li key={d.href}>
              <PaperCard tilt={d.tilt} delay={i * 0.05} className="h-full">
                <Link href={d.href} className="flex h-full flex-col gap-3 p-6">
                  <h3 style={{ fontFamily: "var(--font-hand)", fontSize: "1.8rem", lineHeight: 1, color: "var(--color-text)" }}>
                    {d.title} →
                  </h3>
                  <p className="text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                    {d.blurb}
                  </p>
                </Link>
              </PaperCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
