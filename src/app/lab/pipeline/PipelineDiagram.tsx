"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { stages } from "./stages";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Which loops pass through a stage, shown as a small tag on the flowchart.
const LOOP_TAGS: Record<string, string> = {
  build: "loops: /revise, review rounds, CI fix-up",
  ci: "loop: CI fix-up (max 2)",
  review: "loop: review rounds (max 2)",
};

function Arrow() {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" aria-hidden="true" className="mx-auto block">
      <path
        d="M10 2V24M10 24L5 19M10 24L15 19"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PipelineDiagram() {
  const [openId, setOpenId] = useState<string | null>("build");
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <p className="sr-only">
        The pipeline has {stages.length} stages in order: {stages.map((s) => s.title).join(", then ")}. Each stage is a
        button that opens its trigger, what runs it, and its guardrails.
      </p>
      <ol className="mx-auto max-w-2xl">
        {stages.map((stage, i) => {
          const open = openId === stage.id;
          const panelId = `stage-${stage.id}`;
          return (
            <li key={stage.id}>
              <div
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-card)",
                }}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={open ? panelId : undefined}
                    onClick={() => setOpenId(open ? null : stage.id)}
                    className="flex w-full items-start gap-4 p-4 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs"
                      style={{ color: "var(--color-accent-ink)", paddingTop: "0.45rem" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span
                        className="block text-base font-semibold tracking-tight"
                        style={{ color: "var(--color-text)" }}
                      >
                        {stage.title}
                      </span>
                      <span className="block text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                        {stage.short}
                      </span>
                      {LOOP_TAGS[stage.id] && (
                        <span className="mt-1 block font-mono text-xs" style={{ color: "var(--color-accent-ink)" }}>
                          ↻ {LOOP_TAGS[stage.id]}
                        </span>
                      )}
                    </span>
                    <span aria-hidden="true" className="font-mono text-sm" style={{ color: "var(--color-text-dim)" }}>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <dl
                        className="space-y-3 px-4 pb-4 text-sm leading-6"
                        style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem" }}
                      >
                        <Row term="Triggered by" body={stage.trigger} />
                        <Row term="Run by" body={stage.runner} />
                        <div>
                          <dt className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-accent-ink)" }}>
                            Guardrails
                          </dt>
                          <dd>
                            <ul className="mt-1 list-disc space-y-1 pl-5" style={{ color: "var(--color-text-muted)" }}>
                              {stage.guardrails.map((g) => (
                                <li key={g}>{g}</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                        {stage.extra && (
                          <div>
                            <dt className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-accent-ink)" }}>
                              {stage.extra.heading}
                            </dt>
                            <dd>
                              <ul className="mt-1 list-disc space-y-1 pl-5" style={{ color: "var(--color-text-muted)" }}>
                                {stage.extra.items.map((g) => (
                                  <li key={g}>{g}</li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {i < stages.length - 1 && <Arrow />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Row({ term, body }: { term: string; body: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-accent-ink)" }}>
        {term}
      </dt>
      <dd style={{ color: "var(--color-text-muted)" }}>{body}</dd>
    </div>
  );
}
