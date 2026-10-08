"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  { label: "Building", text: "Backend services at Ibotta" },
  { label: "Learning", text: "Keeping up with the rate of change in AI tooling" },
  { label: "Planning", text: "A wedding" },
  { label: "Exploring", text: "The Colorado 14ers" },
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
  const reduceMotion = useReducedMotion();
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
              <div className="mb-5 border-b pb-4">
                <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest">
                  <span style={{ color: "var(--color-accent-ink)" }}>Currently</span>
                  <time dateTime="2026-10-07" style={{ color: "var(--color-text-dim)" }}>Oct 2026</time>
                </div>
                <h3 className="text-3xl leading-none" style={{ fontFamily: "var(--font-hand)" }}>
                  release notes, life edition
                </h3>
              </div>
              <ul className="space-y-4">
                {currently.map((item) => (
                  <li
                    key={item.label}
                    className="grid grid-cols-[5rem_1fr] items-baseline gap-3 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <span
                      className="font-mono text-[10px] uppercase tracking-wide"
                      style={{ color: "var(--color-accent-ink)" }}
                    >
                      {item.label}
                    </span>
                    <span className="leading-relaxed">{item.text}</span>
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
                  initial={reduceMotion ? false : { opacity: 0, y: -14, scale: 1.08, rotate: rot * -2 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotate: reduceMotion ? 0 : rot }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 16,
                    delay: reduceMotion ? 0 : i * 0.045,
                    ...(reduceMotion ? { duration: 0 } : {}),
                  }}
                  whileHover={reduceMotion ? undefined : {
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
