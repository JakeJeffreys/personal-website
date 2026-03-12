"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "@/content/resume";
import { getIconInfo } from "@/lib/icons";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function SkillPill({ name, index, isAI }: { name: string; index: number; isAI: boolean }) {
  const icon = getIconInfo(name);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group flex items-center gap-2 rounded-lg px-3 py-2 border transition-all duration-200 cursor-default"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: isAI ? "var(--color-accent)" : "var(--color-border)",
        boxShadow: isAI ? "0 0 10px rgba(56,189,248,0.08)" : "none",
      }}
      whileHover={{
        borderColor: "var(--color-accent)",
        boxShadow: "0 0 14px rgba(56,189,248,0.15)",
      }}
    >
      {icon ? (
        <span
          className="w-4 h-4 flex-shrink-0"
          style={{ color: icon.color }}
          dangerouslySetInnerHTML={{
            __html: icon.svg.replace("<svg", `<svg width="16" height="16" fill="currentColor"`),
          }}
        />
      ) : (
        <span
          className="w-4 h-4 flex-shrink-0 rounded text-[8px] font-bold font-mono flex items-center justify-center"
          style={{ backgroundColor: "var(--color-accent)", color: "var(--color-background)" }}
        >
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="text-sm font-mono" style={{ color: "var(--color-text-muted)" }}>
        {name}
      </span>
    </motion.div>
  );
}

export default function TechStack() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="tech-stack"
      ref={ref}
      className="py-24 px-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
        >
          <p
            className="font-mono text-sm tracking-widest uppercase mb-2"
            style={{ color: "var(--color-accent)" }}
          >
            What I work with
          </p>
          <h2
            className="text-3xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Tech Stack
          </h2>
        </motion.div>

        {/* Categories */}
        <motion.div
          className="space-y-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skills.map((category, catIndex) => {
            const isAI = category.category === "AI & Agents";
            return (
              <div key={category.category}>
                {/* Category label */}
                <motion.div
                  custom={catIndex * 3}
                  variants={fadeUp}
                  className="mb-4 pb-2 border-b"
                  style={{ borderColor: isAI ? "rgba(56,189,248,0.3)" : "var(--color-border)" }}
                >
                  <span
                    className="text-xs font-mono font-semibold tracking-widest uppercase"
                    style={{ color: isAI ? "var(--color-accent)" : "var(--color-text-dim)" }}
                  >
                    {category.category}
                  </span>
                </motion.div>

                {/* Pills */}
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, itemIndex) => (
                    <SkillPill
                      key={item}
                      name={item}
                      index={catIndex * 3 + itemIndex + 1}
                      isAI={isAI}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
