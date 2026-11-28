"use client";

import { motion } from "framer-motion";
import { companies, type Company } from "@/content/resume";
import { Label, SectionHeading } from "@/components/ui";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function CompanyItem({ company, index }: { company: Company; index: number }) {
  const isCurrent = company.roles[0].endDate === null;

  return (
    <motion.div
      className="relative flex gap-4 sm:gap-6"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.25, delay: Math.min(index, 3) * 0.04, ease: EASE }}
    >
      {/* Timeline marker */}
      <div className="relative flex flex-col items-center">
        <div className="relative z-10 mt-1.5 flex h-3 w-3 shrink-0 items-center justify-center">
          {isCurrent ? (
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
          ) : (
            <span
              className="h-2.5 w-2.5 rounded-full border-2"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-background)",
              }}
            />
          )}
        </div>
        <div
          className="mt-2 w-px flex-1"
          style={{ background: "var(--color-border)" }}
        />
      </div>

      {/* Entry */}
      <div
        className="mb-10 flex-1 border p-4 sm:p-6"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          borderRadius: "var(--radius-card)",
          borderLeftWidth: isCurrent ? "3px" : "1px",
          borderLeftColor: isCurrent ? "var(--color-accent)" : "var(--color-border)",
        }}
      >
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="text-lg font-semibold leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            {company.name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            {company.location}
          </p>
        </div>

        <div className="mb-5">
          {company.roles.map((role, i) => (
            <div key={i}>
              {i > 0 && (
                <div
                  className="my-4 h-px"
                  style={{ background: "var(--color-border)" }}
                />
              )}
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <h3
                    className="text-base font-semibold leading-tight"
                    style={{ color: "var(--color-text)" }}
                  >
                    {role.title}
                  </h3>
                  {role.endDate === null && (
                    <Label tone="accent" tag className="uppercase">
                      Current
                    </Label>
                  )}
                </div>
                <p
                  className="font-mono text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {role.startDate} — {role.endDate ?? "Present"}
                </p>
              </div>
              <ul className="space-y-2">
                {role.description.map((point, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm leading-6">
                    <span
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "var(--color-text-dim)" }}
                      aria-hidden="true"
                    />
                    <span style={{ color: "var(--color-text-muted)" }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {company.technologies.map((tech) => (
            <Label key={tech} tag>
              {tech}
            </Label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative px-6 py-24"
    >
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading title="Experience" eyebrow="résumé" />

        {/* Timeline rule */}
        <div className="relative">
          <div
            className="absolute bottom-0 left-[5px] top-0 w-px"
            style={{ background: "var(--color-border)" }}
            aria-hidden="true"
          />
          {companies.map((company, index) => (
            <CompanyItem key={company.name} company={company} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
