"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const RIDGES = [
  "M62 118 l14 -22 14 22",
  "M86 128 l16 -28 16 28",
  "M114 112 l13 -20 13 20",
  "M74 150 l12 -18 12 18",
  "M104 158 l14 -21 14 21",
  "M136 140 l12 -18 12 18",
];

const DRAW = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

/**
 * Hand-drawn Colorado with a pin on Denver.
 *
 * Replaces the React Three Fiber globe, which cost six dependencies and a large
 * client bundle to render one decorative element that fought the paper
 * direction. This is inline SVG: no dependencies, no WebGL context, themes for
 * free via CSS custom properties.
 *
 * The state outline is deliberately not a perfect rectangle — the wobble is the
 * point.
 */
export default function ColoradoMap({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.svg
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      viewBox="0 0 300 220"
      className={cn("w-[300px] h-[220px] lg:w-[360px] lg:h-[264px]", className)}
      role="img"
      aria-label="Hand-drawn map of Colorado with Denver marked"
    >
      {/* State outline — drawn with a slightly unsteady hand */}
      <motion.path
        d="M22 34 Q 80 30, 148 31 T 278 35 Q 280 90, 279 140 T 276 190 Q 210 193, 148 191 T 24 188 Q 21 130, 22 82 Z"
        fill="var(--color-surface)"
        stroke="var(--color-text)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: reduceMotion ? 0 : 2.1, delay: reduceMotion ? 0 : 0.3, ease: "easeInOut" }}
      />

      {/* Rockies — hatched ridgeline running down the western half */}
      <g stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        {RIDGES.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            variants={DRAW}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : 0.8 + index * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>

      {/* Pencil grid, very faint */}
      <g stroke="var(--color-border)" strokeWidth="0.5" opacity="0.4" aria-hidden="true">
        <path d="M22 111 H 278" />
        <path d="M150 31 V 191" />
      </g>

      {/* Denver pin */}
      <motion.g
        variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 20, delay: 2.4 }}
      >
        <circle cx="182" cy="106" r="12" fill="var(--color-accent-glow)" />
        <circle
          cx="182"
          cy="106"
          r="5"
          fill="var(--color-accent)"
          stroke="var(--color-surface)"
          strokeWidth="1.5"
        />
        <path
          d="M182 106 L 214 76"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <text
          x="218"
          y="72"
          style={{ fontFamily: "var(--font-hand)", fontSize: "20px" }}
          fill="var(--color-accent)"
        >
          denver
        </text>
      </motion.g>

      {/* Scale note, in the vernacular of an actual map */}
      <text
        x="24"
        y="208"
        style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.1em" }}
        fill="var(--color-text-dim)"
      >
        5,280 FT · 39.74°N 104.99°W
      </text>
    </motion.svg>
  );
}
