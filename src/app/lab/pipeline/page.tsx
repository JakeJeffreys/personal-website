import type { Metadata } from "next";
import Link from "next/link";
import { PaperCard, SectionHeading } from "@/components/paper";
import PipelineDiagram from "./PipelineDiagram";
import { example, loops, why, zones } from "./stages";

export const metadata: Metadata = {
  title: "Agent pipeline — Lab — Jake Jeffreys",
  description: "How an issue filed from a phone becomes a live page on this site, mostly without me.",
};

const muted = { color: "var(--color-text-muted)" };
const hand = { fontFamily: "var(--font-hand)", color: "var(--color-text)" };

export default function PipelinePage() {
  return (
    <main className="paper-page min-h-screen px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/lab"
          className="mb-10 inline-block font-mono text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline"
          style={{ color: "var(--color-accent-ink)" }}
        >
          ← the lab
        </Link>
        <SectionHeading title="the agent pipeline" eyebrow="experiment" variant="taped" />

        <p className="mb-12 text-base leading-7" style={muted}>
          I file an issue from my phone. A build agent writes the change, CI gates check it, a second agent reviews it, a
          merge policy decides whether it needs me, and a production check confirms it is live. This page was built by that
          same pipeline. Tap a stage to open it.
        </p>

        <PipelineDiagram />

        <section aria-labelledby="loops" className="mt-20">
          <h2 id="loops" className="mb-2 text-3xl" style={hand}>
            three loops
          </h2>
          <p className="mb-6 text-sm leading-6" style={muted}>
            Work can circle back, but never forever. Each loop has a limit, and running out of tries ends at the
            needs-jake label.
          </p>
          <ul className="grid gap-6">
            {loops.map((loop, i) => (
              <li key={loop.id}>
                <PaperCard tilt={i % 2 ? "b" : "a"} lift={false}>
                  <div className="p-5">
                    <h3 className="text-2xl" style={hand}>
                      {loop.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs" style={{ color: "var(--color-accent-ink)" }}>
                      ↻ {loop.path}
                    </p>
                    <p className="mt-1 font-mono text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {loop.limit}
                    </p>
                    <p className="mt-3 text-sm leading-6" style={muted}>
                      {loop.end}
                    </p>
                  </div>
                </PaperCard>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="zones" className="mt-20">
          <h2 id="zones" className="mb-2 text-3xl" style={hand}>
            what the merge gate checks
          </h2>
          <p className="mb-6 text-sm leading-6" style={muted}>
            A PR gets the strictest rules of every zone it touches.
          </p>
          <dl className="space-y-4 text-sm leading-6">
            {zones.map((z) => (
              <div key={z.name}>
                <dt className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-accent-ink)" }}>
                  {z.name}
                </dt>
                <dd style={muted}>{z.rule}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="why" className="mt-20">
          <h2 id="why" className="mb-4 text-3xl" style={hand}>
            why bother
          </h2>
          {why.map((p) => (
            <p key={p} className="mb-3 text-base leading-7" style={muted}>
              {p}
            </p>
          ))}
        </section>

        <section aria-labelledby="example" className="mt-20">
          <h2 id="example" className="mb-4 text-3xl" style={hand}>
            a real run: the dice roller
          </h2>
          <ol className="space-y-3">
            {example.map((e) => (
              <li key={e.label} className="text-sm leading-6" style={muted}>
                <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-accent-ink)" }}>
                  {e.label}
                </span>{" "}
                {e.text}
                {e.href && (
                  <>
                    {" "}
                    <Link href={e.href} className="underline underline-offset-4" style={{ color: "var(--color-accent-ink)" }}>
                      Open it
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
