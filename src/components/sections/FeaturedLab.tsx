import Link from "next/link";
import { PaperCard, SectionHeading } from "@/components/paper";
import { experiments } from "@/app/lab/experiments";

const TILTS = ["a", "b", "c"] as const;
const FEATURED_COUNT = 3;

/** Newest experiments straight from the registry, so new ones appear with no homepage edit. */
export default function FeaturedLab() {
  const featured = [...experiments]
    .sort((a, b) => b.added.localeCompare(a.added))
    .slice(0, FEATURED_COUNT);

  return (
    <section id="lab" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="fresh from the lab" eyebrow="newest experiments" variant="taped" />

        {featured.length === 0 ? (
          <p style={{ fontFamily: "var(--font-hand)", fontSize: "1.6rem", color: "var(--color-text-dim)" }}>
            Nothing pinned up yet. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((exp, i) => (
              <li key={exp.slug}>
                <PaperCard tilt={TILTS[i % TILTS.length]} delay={i * 0.05} className="h-full">
                  <Link href={`/lab/${exp.slug}`} className="flex h-full flex-col gap-3 p-6">
                    <h3 style={{ fontFamily: "var(--font-hand)", fontSize: "1.8rem", lineHeight: 1, color: "var(--color-text)" }}>
                      {exp.title}
                    </h3>
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
