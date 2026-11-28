"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Card, Label, SectionHeading } from "@/components/ui";

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

export default function About() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="about" className="relative px-6 py-24">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading title="About me" eyebrow="who's this" as="h1" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            {BIO.map((para, i) => (
              <motion.p
                key={i}
                className="text-base leading-7"
                style={{ color: "var(--color-text-muted)" }}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <Label tone="accent" className="mb-5 block uppercase tracking-widest">
                Quick stats
              </Label>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4"
                    style={{ background: "var(--color-surface-2)", borderRadius: "var(--radius-card)" }}
                  >
                    <dt className="mb-1 text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {stat.label}
                    </dt>
                    <dd className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between gap-3 border-b pb-4">
                <h2 className="text-lg font-semibold tracking-tight">Currently</h2>
                <time dateTime="2026-10-07">
                  <Label tone="dim">Oct 2026</Label>
                </time>
              </div>
              <ul className="space-y-4">
                {currently.map((item) => (
                  <li
                    key={item.label}
                    className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <Label tone="accent" className="uppercase">
                      {item.label}
                    </Label>
                    <span className="leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="mb-5 text-lg font-semibold tracking-tight">Off the clock</h2>
          <ul className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <li key={interest}>
                <Label tag className="px-3 py-1.5">
                  {interest}
                </Label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
