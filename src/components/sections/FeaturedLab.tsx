import Link from "next/link";
import { Card, Label, SectionHeading } from "@/components/ui";
import { experiments } from "@/app/lab/experiments";

const FEATURED_COUNT = 3;

/** Newest experiments straight from the registry, so new ones appear with no homepage edit. */
export default function FeaturedLab() {
  const featured = [...experiments]
    .sort((a, b) => b.added.localeCompare(a.added))
    .slice(0, FEATURED_COUNT);

  return (
    <section id="lab" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Fresh from the lab" eyebrow="newest experiments" />

        {featured.length === 0 ? (
          <p className="font-mono text-sm" style={{ color: "var(--color-text-dim)" }}>
            Nothing here yet. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((exp) => (
              <li key={exp.slug}>
                <Card interactive className="h-full">
                  <Link href={`/lab/${exp.slug}`} className="flex h-full flex-col gap-3 p-6">
                    <h3 className="text-lg font-semibold tracking-tight" style={{ color: "var(--color-text)" }}>
                      {exp.title}
                    </h3>
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

        <p className="mt-10">
          <Link
            href="/lab"
            className="inline-flex min-h-11 items-center font-mono text-sm underline underline-offset-4"
            style={{ color: "var(--color-accent-ink)" }}
          >
            all experiments →
          </Link>
        </p>
      </div>
    </section>
  );
}
