"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { companies, type Company } from "@/content/resume";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ---------- Company Item ----------
function CompanyItem({ company, index }: { company: Company; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isCurrent = company.roles[0].endDate === null;

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      className="relative flex gap-4 sm:gap-6"
    >
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div className="relative z-10 mt-1 flex h-3 w-3 shrink-0 items-center justify-center">
          {isCurrent ? (
            <>
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ background: "var(--color-accent)" }}
              />
              <span
                className="relative h-3 w-3 rounded-full"
                style={{
                  background: "var(--color-accent)",
                  boxShadow: "0 0 8px 2px var(--color-accent)",
                }}
              />
            </>
          ) : (
            <span
              className="h-2.5 w-2.5 rounded-full border-2"
              style={{
                borderColor: "var(--color-accent)",
                background: "var(--color-background)",
              }}
            />
          )}
        </div>
        {/* Vertical line */}
        <div
          className="mt-2 w-px flex-1"
          style={{ background: "var(--color-border)" }}
        />
      </div>

      {/* Card content */}
      <div
        className="mb-10 flex-1 rounded-2xl border p-4 sm:p-6"
        style={{
          background: "var(--color-surface)",
          borderColor: isCurrent ? "rgba(56,189,248,0.25)" : "var(--color-border)",
          boxShadow: isCurrent
            ? "0 0 0 1px rgba(56,189,248,0.15), 0 4px 24px rgba(0,0,0,0.3)"
            : "0 4px 24px rgba(0,0,0,0.25)",
        }}
      >
        {/* Company header row */}
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="text-lg font-semibold leading-tight"
            style={{ color: "var(--color-accent)" }}
          >
            {company.name}
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-dim)" }}
          >
            {company.location}
          </p>
        </div>

        {/* Roles list */}
        <div className="mb-5 space-y-0">
          {company.roles.map((role, i) => (
            <div key={i}>
              {i > 0 && (
                <div
                  className="my-4 h-px"
                  style={{ background: "var(--color-border)" }}
                />
              )}
              {/* Role header */}
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <h3
                    className="text-base font-semibold leading-tight"
                    style={{ color: "var(--color-text)" }}
                  >
                    {role.title}
                  </h3>
                  {role.endDate === null && (
                    <span
                      className="rounded-full px-6 py-0.5 text-xs font-medium"
                      style={{
                        background: "rgba(56,189,248,0.12)",
                        color: "var(--color-accent)",
                        border: "1px solid rgba(56,189,248,0.25)",
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>
                <p
                  className="text-sm font-mono"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {role.startDate} — {role.endDate ?? "Present"}
                </p>
              </div>
              {/* Bullet points */}
              <ul className="space-y-2">
                {role.description.map((point, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm leading-6">
                    <span
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "var(--color-accent)" }}
                    />
                    <span style={{ color: "var(--color-text-muted)" }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Technology chips */}
        <div className="flex flex-wrap gap-1.5">
          {company.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md px-6.5 py-1 text-xs font-mono font-medium"
              style={{
                background: "var(--color-surface-2)",
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Section ----------
export default function Experience() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section
      id="experience"
      className="relative py-24 px-6"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Subtle top gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--color-border)" }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Section heading */}
        <motion.div
          ref={headingRef}
          initial="hidden"
          animate={headingInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="mb-14"
        >
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            Experience
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <div
              className="h-px w-12 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: "var(--color-border)" }}
            />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div
            className="absolute bottom-0 left-[5px] top-0 w-px"
            style={{ background: "var(--color-border)" }}
          />

          {companies.map((company, index) => (
            <CompanyItem key={company.name} company={company} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
