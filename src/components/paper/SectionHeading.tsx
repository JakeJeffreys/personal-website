"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import Tape from "./Tape";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Section heading with three distinct rules.
 *
 * This exists to break a specific problem in the old design: all seven sections
 * used an identical `h-px w-12` accent bar plus `h-px flex-1` rule, so the page
 * had one rhythm repeated seven times. Callers pass a DIFFERENT variant per
 * section — that variation is the whole point of the component.
 *
 * The title uses Caveat, which runs small for its nominal size, hence the
 * generous clamp floor.
 */
export default function SectionHeading({
  title,
  eyebrow,
  variant,
  className,
}: {
  title: string;
  eyebrow?: string;
  variant: "dashed" | "torn" | "taped";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={cn("mb-12", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
    >
      {variant === "taped" && eyebrow && (
        <div className="mb-4">
          <Tape>{eyebrow}</Tape>
        </div>
      )}

      {variant !== "taped" && eyebrow && (
        <p
          className="mb-2 font-mono text-xs uppercase tracking-[0.18em]"
          style={{ color: "var(--color-accent-ink)" }}
        >
          {eyebrow}
        </p>
      )}

      <h2
        style={{
          fontFamily: "var(--font-hand)",
          color: "var(--color-text)",
          fontSize: "clamp(2.4rem, 5.5vw, 3.4rem)",
          lineHeight: 0.95,
        }}
      >
        {title}
      </h2>

      {variant === "dashed" && (
        <motion.div
          className="mt-4 h-0"
          style={{ borderTop: "1.5px dashed var(--color-border)", transformOrigin: "left" }}
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : 0.15, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}

      {variant === "torn" && (
        <svg
          className="mt-4 block w-full"
          height="7"
          viewBox="0 0 400 7"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            initial={reduceMotion ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : 0.15, ease: "easeInOut" }}
            d="M0 4 Q 12 1, 24 4 T 48 4 T 72 3 T 96 5 T 120 4 T 144 2 T 168 4 T 192 5 T 216 3 T 240 4 T 264 4 T 288 2 T 312 5 T 336 4 T 360 3 T 384 4 T 400 4"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {variant === "taped" && (
        <svg className="mt-4 block w-full" height="5" viewBox="0 0 400 5" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <motion.path
            d="M1 3 Q100 1 200 2.5 T399 2"
            stroke="var(--color-border)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : 0.15, ease: "easeInOut" }}
          />
        </svg>
      )}
    </motion.div>
  );
}
