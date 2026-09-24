"use client";

import { motion } from "framer-motion";
import { PaperCard, SectionHeading } from "@/components/paper";

const interests = [
  "Skiing",
  "Backpacking",
  "Live Music",
  "Soccer",
  "Rafting",
  "Real Estate",
  "Coffee",
  "Barbecue",
  "Travel",
  "Biking",
  "Interior Design",
  "Photography",
  "Running",
  "Personal Finance",
  "Board Games",
];

const stats = [
  { label: "Years of Experience", value: "8+" },
  { label: "Current Location", value: "Denver, CO" },
  { label: "Current Role", value: "Sr. Software Engineer" },
  { label: "Current Company", value: "Ibotta" },
];

const currently = [
  "Planning a wedding",
  "Building backend services at Ibotta",
  "Trying to keep up with the rate of change in AI tooling",
  "Exploring the Colorado 14ers",
];

const BIO = [
  "I'm a backend software engineer in Denver with 8+ years building and running distributed systems on AWS. At Ibotta I own the architecture of the event-driven services and REST APIs behind our partner network, which includes publishers like Walmart, 7-Eleven, DoorDash, and Instacart.",
  "A lot of my time goes into the parts that keep things running: queue processing that keeps going when a partner's API doesn't, observability set up before there's an incident rather than after, infrastructure you can rebuild from source. Enough years of on-call will do that to you.",
  "Originally from Portland, Oregon, I moved to Denver in 2018 and haven't looked back. The mountains are a big part of my life — skiing in winter, backpacking and rafting in summer. I'm also into live music, barbecue, and in my free time I enjoy exploring real estate and personal finance, including managing my own Airbnb property.",
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Rotations for the sticker tags — irregular on purpose, cycled by index. */
const STICKER_ROTATIONS = [-2.2, 1.4, -0.8, 2.1, -1.6, 0.9, -2.6, 1.8];

export default function About() {
  return (
    <section id="about" className="relative px-6 py-24">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading title="about me" eyebrow="who's this" variant="taped" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Bio */}
          <div className="flex flex-col gap-5">
            {BIO.map((para, i) => (
              <motion.p
                key={i}
                className="text-base leading-7"
                style={{ color: "var(--color-text-muted)" }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Index cards */}
          <div className="flex flex-col gap-6">
            <PaperCard tilt="a" delay={0.05} className="p-6">
              <p
                className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-accent-ink)" }}
              >
                Quick Stats
              </p>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4"
                    style={{
                      background: "var(--color-surface-2)",
                      borderRadius: "var(--radius-card)",
                    }}
                  >
                    <dt className="mb-1 text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {stat.label}
                    </dt>
                    <dd
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </PaperCard>

            <PaperCard tilt="b" delay={0.15} className="p-6">
              <p
                className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-accent-ink)" }}
              >
                Currently
              </p>
              <ul className="space-y-2">
                {currently.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {/* Hand-drawn dash rather than a perfect dot */}
                    <span
                      className="mt-2.5 block h-px w-2.5 shrink-0"
                      style={{ background: "var(--color-accent)" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </PaperCard>
          </div>
        </div>

        {/* Sticker tags */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p
            className="mb-5"
            style={{
              fontFamily: "var(--font-hand)",
              color: "var(--color-text-dim)",
              fontSize: "1.4rem",
            }}
          >
            off the clock
          </p>
          <div className="flex flex-wrap gap-2.5">
            {interests.map((interest, i) => {
              const rot = STICKER_ROTATIONS[i % STICKER_ROTATIONS.length];
              const highlighted = i % 4 === 1;
              return (
                <motion.span
                  key={interest}
                  className="paper-tilt inline-block px-3.5 py-1.5 font-mono text-xs"
                  style={{
                    backgroundColor: highlighted
                      ? "var(--color-accent)"
                      : "var(--color-surface)",
                    color: highlighted ? "var(--color-surface)" : "var(--color-text-muted)",
                    border: `1px solid ${
                      highlighted ? "var(--color-accent)" : "var(--color-border)"
                    }`,
                    borderRadius: "999px",
                    boxShadow: "var(--shadow-paper)",
                  }}
                  initial={{ opacity: 0, y: -10, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: rot }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 16,
                    delay: i * 0.03,
                  }}
                  whileHover={{
                    y: -4,
                    rotate: rot * -1.4,
                    boxShadow: "var(--shadow-paper-lift)",
                  }}
                >
                  {interest}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
