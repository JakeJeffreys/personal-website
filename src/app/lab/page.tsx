import type { Metadata } from "next";
import Link from "next/link";
import { Card, Label, SectionHeading } from "@/components/ui";
import { experiments } from "./experiments";

export const metadata: Metadata = {
  title: "Lab — Jake Jeffreys",
  description: "Experiments, small tools, and odd ideas.",
};

export default function LabIndex() {
  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-10 inline-block font-mono text-xs uppercase tracking-[0.14em] underline-offset-4 hover:underline"
          style={{ color: "var(--color-accent-ink)" }}
        >
          ← jakejeffreys.dev
        </Link>

        <SectionHeading title="The lab" eyebrow="experiments" as="h1" />

        <p className="mb-12 max-w-2xl text-base leading-7" style={{ color: "var(--color-text-muted)" }}>
          Small tools, half-baked ideas, and things built to see what happens. Some of these are
          built by AI agents from an issue filed on my phone.
        </p>

        {experiments.length === 0 ? (
          <p className="font-mono text-sm" style={{ color: "var(--color-text-dim)" }}>
            Nothing here yet. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experiments.map((exp) => (
              <li key={exp.slug}>
                <Card interactive className="h-full">
                  <Link href={`/lab/${exp.slug}`} className="flex h-full flex-col gap-3 p-6">
                    <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--color-text)" }}>
                      {exp.title}
                    </h2>
                    <p className="flex-1 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                      {exp.blurb}
                    </p>
                    <time dateTime={exp.added}>
                      <Label tone="dim">{exp.added}</Label>
                    </time>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
