"use client";

import { motion, useReducedMotion } from "framer-motion";
import { skills } from "@/content/resume";
import { getIconInfo } from "@/lib/icons";
import { SectionHeading } from "@/components/ui";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function SkillChip({ name }: { name: string }) {
  const icon = getIconInfo(name);

  return (
    <div
      className="flex items-center gap-2 border px-3 py-2"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        borderRadius: "var(--radius-card)",
      }}
    >
      {icon ? (
        <span
          className="h-4 w-4 flex-shrink-0"
          style={{ color: icon.color }}
          dangerouslySetInnerHTML={{
            __html: icon.svg.replace("<svg", `<svg width="16" height="16" fill="currentColor"`),
          }}
        />
      ) : (
        <span
          className="flex h-4 w-4 flex-shrink-0 items-center justify-center font-mono text-[8px] font-bold"
          style={{
            backgroundColor: "var(--color-accent-ink)",
            color: "var(--color-surface)",
            borderRadius: "var(--radius-card)",
          }}
        >
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="font-mono text-sm" style={{ color: "var(--color-text-muted)" }}>
        {name}
      </span>
    </div>
  );
}

export default function TechStack() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="tech-stack" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Tech stack" eyebrow="what I reach for" />

        <div className="space-y-10">
          {skills.map((category) => (
            <motion.div
              key={category.category}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <h3
                className="mb-4 border-b pb-2 text-base font-semibold tracking-tight"
                style={{ color: "var(--color-text)" }}
              >
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <SkillChip key={item} name={item} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
