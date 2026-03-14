"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const interests = [
  "Skiing",
  "Backpacking",
  "Live Music",
  "Rafting",
  "Real Estate",
  "Coffee",
  "Barbecue",
  "Travel",
  "Interior Design"
];

const stats = [
  { label: "Years of Experience", value: "8+" },
  { label: "Current Location", value: "Denver, CO" },
  { label: "Current Role", value: "Sr. Platform Engineer" },
  { label: "Current Company", value: "Ibotta" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="relative py-24 px-4">
      {/* subtle background gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, var(--color-accent-glow), transparent)",
        }}
      />

      <div className="relative max-w-4xl">
        {/* Section heading */}
        <motion.div
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-14"
        >
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            About Me
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — bio text */}
          <div className="flex flex-col gap-5">
            {[
              "I'm a Senior Platform Engineer based in Denver, Colorado with 8+ years of experience designing and scaling cloud-native backend systems. Currently at Ibotta, I lead backend architecture and AWS infrastructure projects that support a partner network serving millions of daily customers — including integrations with DoorDash, Instacart, and Walmart.",
              "I specialize in AWS serverless architecture, Terraform-based infrastructure, and building systems that are fast, reliable, and easy to operate. I care about the details — whether that's shaving latency off a hot path, building observability into a service from day one, or mentoring engineers to level up their craft. I thrive in environments where engineering quality and product velocity reinforce each other.",
              "Originally from Portland, Oregon, I moved to Denver in 2018 and haven't looked back. The mountains are a big part of my life — skiing in winter, backpacking and rafting in summer. I'm also into live music, barbecue, and in my free time I enjoy exploring real estate and personal finance, including managing my own Airbnb property.",
            ].map((para, i) => (
              <motion.p
                key={i}
                custom={i + 1}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeUp}
                className="text-base leading-7"
                style={{ color: "var(--color-text-muted)" }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Right — stats card */}
          <motion.div
            custom={4}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="flex flex-col gap-6"
          >
            {/* Stats card */}
            <div
              className={cn(
                "rounded-2xl border p-6",
                "backdrop-blur-sm"
              )}
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow: "0 0 0 1px var(--color-border), 0 8px 40px rgba(0,0,0,0.4)",
              }}
            >
              <p
                className="mb-5 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-accent)" }}
              >
                Quick Stats
              </p>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-4"
                    style={{ background: "var(--color-surface-2)" }}
                  >
                    <dt
                      className="mb-1 text-xs"
                      style={{ color: "var(--color-text-dim)" }}
                    >
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
            </div>

            {/* Currently section */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-accent)" }}
              >
                Currently
              </p>
              <ul className="space-y-2">
                {[
                  "Planning a wedding",
                  "Leading platform engineering at Ibotta",
                  "Trying to keep up with the rate of change in AI tooling",
                  "Exploring the Colorado 14ers"
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "var(--color-accent)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Interest badges */}
        <motion.div
          custom={5}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mt-12"
        >
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-text-dim)" }}
          >
            Interests & Passions
          </p>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium",
                  "transition-colors duration-200 hover:border-sky-400/50 hover:text-sky-400"
                )}
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
