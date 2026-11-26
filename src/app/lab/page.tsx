import type { Metadata } from "next";
import Link from "next/link";
import { PaperCard, SectionHeading } from "@/components/paper";
import { experiments } from "./experiments";

export const metadata: Metadata = {
  title: "Lab — Jake Jeffreys",
  description: "Experiments, small tools, and odd ideas.",
};

const TILTS = ["a", "b", "c"] as const;

export default function LabIndex() {
  return (
    <main className="paper-page min-h-screen px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-10 inline-block font-mono text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline"
          style={{ color: "var(--color-accent-ink)" }}
        >
          ← jakejeffreys.dev
        </Link>

        <SectionHeading title="the lab" eyebrow="experiments" variant="taped" />

        <p className="mb-12 max-w-2xl text-base leading-7" style={{ color: "var(--color-text-muted)" }}>
          Small tools, half-baked ideas, and things built to see what happens. Some of these are
          built by AI agents from an issue filed on my phone.
        </p>

        {experiments.length === 0 ? (
          <p style={{ fontFamily: "var(--font-hand)", fontSize: "1.6rem", color: "var(--color-text-dim)" }}>
            Nothing pinned up yet. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {experiments.map((exp, i) => (
              <li key={exp.slug}>
                <PaperCard tilt={TILTS[i % TILTS.length]} delay={i * 0.05} className="h-full">
                  <Link href={`/lab/${exp.slug}`} className="flex h-full flex-col gap-3 p-6">
                    <h2 style={{ fontFamily: "var(--font-hand)", fontSize: "1.8rem", lineHeight: 1, color: "var(--color-text)" }}>
                      {exp.title}
                    </h2>
                    <p className="flex-1 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                      {exp.blurb}
                    </p>
                    <time dateTime={exp.added} className="font-mono text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {exp.added}
                    </time>
                  </Link>
                </PaperCard>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
