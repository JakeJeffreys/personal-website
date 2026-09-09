"use client";

import { motion } from "framer-motion";
import { skills } from "@/content/resume";
import { getIconInfo } from "@/lib/icons";
import { SectionHeading } from "@/components/paper";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Irregular rotations so the chips look pinned up rather than laid out. */
const CHIP_ROTATIONS = [-1.5, 0.9, -0.6, 1.4, -1.1, 0.5];

function SkillChip({ name, index }: { name: string; index: number }) {
  const icon = getIconInfo(name);
  const rot = CHIP_ROTATIONS[index % CHIP_ROTATIONS.length];

  return (
    <motion.div
      className="paper-tilt flex items-center gap-2 border px-3 py-2"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-paper)",
      }}
      initial={{ opacity: 0, y: -8, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: rot }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 300, damping: 17, delay: index * 0.02 }}
      whileHover={{ y: -3, rotate: 0, boxShadow: "var(--shadow-paper-lift)" }}
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
            backgroundColor: "var(--color-accent)",
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
    </motion.div>
  );
}

export default function TechStack() {
  let running = 0;

  return (
    <section
      id="tech-stack"
      className="px-6 py-24"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="the toolbox" eyebrow="what I reach for" variant="dashed" />

        <div className="space-y-10">
          {skills.map((category) => (
            <div key={category.category}>
              <motion.div
                className="mb-4 pb-2"
                style={{ borderBottom: "1.5px dashed var(--color-border)" }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-hand)",
                    color: "var(--color-text)",
                    fontSize: "1.55rem",
                    lineHeight: 1.1,
                  }}
                >
                  {category.category}
                </span>
              </motion.div>

              <div className="flex flex-wrap gap-2.5">
                {category.items.map((item) => (
                  <SkillChip key={item} name={item} index={running++} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
