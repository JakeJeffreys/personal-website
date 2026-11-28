import Link from "next/link";
import { Card, SectionHeading } from "@/components/ui";

const DESTINATIONS = [
  { href: "/lab", title: "Lab", blurb: "Experiments, small tools, and odd ideas." },
  { href: "/work", title: "Work", blurb: "Experience, tech stack, and GitHub activity." },
  { href: "/about", title: "About", blurb: "Bio, what I'm up to lately, and photos." },
];

export default function Explore() {
  return (
    <section id="explore" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Keep exploring" eyebrow="the rest of the site" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <li key={d.href}>
              <Card interactive className="h-full">
                <Link href={d.href} className="flex h-full flex-col gap-2 p-6">
                  <h3 className="text-lg font-semibold tracking-tight" style={{ color: "var(--color-text)" }}>
                    {d.title} <span aria-hidden="true">→</span>
                  </h3>
                  <p className="text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                    {d.blurb}
                  </p>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
