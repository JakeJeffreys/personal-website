"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * A margin annotation in the author's hand.
 *
 * The arrow draws itself in via stroke-dashoffset. Caveat runs ~20% small for
 * its nominal size, so callers get a bumped size by default rather than having
 * to remember the correction.
 */
export default function Scrawl({
  arrow = "none",
  rotate = -2,
  className,
  children,
}: {
  arrow?: "left" | "right" | "none";
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const Arrow = (
    <motion.svg
      width="46"
      height="14"
      viewBox="0 0 46 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      style={{ transform: arrow === "right" ? "scaleX(-1)" : undefined }}
    >
      <motion.path
        d="M45 7C33 7 18 5 3 7.5M3 7.5L11 2.5M3 7.5L11 12"
        stroke="var(--color-accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: EASE }}
      />
    </motion.svg>
  );

  return (
    <span
      className={cn("paper-tilt inline-flex items-center gap-2", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {arrow === "left" && Arrow}
      <span
        style={{
          fontFamily: "var(--font-hand)",
          color: "var(--color-accent)",
          fontSize: "1.35rem",
          lineHeight: 1.15,
        }}
      >
        {children}
      </span>
      {arrow === "right" && Arrow}
    </span>
  );
}
