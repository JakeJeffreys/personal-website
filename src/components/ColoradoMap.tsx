"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Colorado outline with a pin on Denver. Inline SVG, themed via CSS custom properties. */
export default function ColoradoMap({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const fade = { duration: reduceMotion ? 0 : 0.25 };
  return (
    <motion.svg
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      viewBox="0 0 300 220"
      className={cn("h-[220px] w-[300px] lg:h-[264px] lg:w-[360px]", className)}
      role="img"
      aria-label="Map of Colorado with Denver marked"
    >
      <motion.rect
        x="22"
        y="34"
        width="256"
        height="156"
        rx="4"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={fade}
      />

      {/* Faint crosshair grid */}
      <g stroke="var(--color-border)" strokeWidth="1" aria-hidden="true">
        <path d="M22 112 H 278" strokeDasharray="2 4" />
        <path d="M150 34 V 190" strokeDasharray="2 4" />
      </g>

      {/* Denver pin */}
      <motion.g
        variants={{ hidden: { opacity: 0, y: -6 }, visible: { opacity: 1, y: 0 } }}
        transition={{ ...fade, delay: reduceMotion ? 0 : 0.1 }}
      >
        <circle cx="182" cy="106" r="12" fill="var(--color-accent-glow)" />
        <circle cx="182" cy="106" r="5" fill="var(--color-accent)" stroke="var(--color-surface)" strokeWidth="1.5" />
        <path d="M182 106 L 210 78" stroke="var(--color-accent)" strokeWidth="1" strokeLinecap="round" />
        <text
          x="214"
          y="76"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
          fill="var(--color-accent-ink)"
        >
          Denver
        </text>
      </motion.g>

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
