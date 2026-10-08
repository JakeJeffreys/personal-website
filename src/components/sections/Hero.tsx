"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ColoradoMap from "@/components/ColoradoMap";
import { Tape, Scrawl } from "@/components/paper";

const TYPED_PHRASES = [
  "Senior Software Engineer",
  "Denver, Colorado",
  "Distributed systems on AWS",
];

const PHRASE_DURATION_MS = 2800;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % TYPED_PHRASES.length);
    }, PHRASE_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden py-20"
    >
      {/* Faint ruled lines, like a legal pad under the content */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 33px, var(--color-border) 33px, var(--color-border) 34px)",
          maskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-14 px-6 md:flex-row">
        {/* Text column */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -10, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -1.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          >
            <Tape rotate={0}>denver, colorado</Tape>
          </motion.div>

          <motion.h1
            className="mb-2 mt-6"
            style={{
              fontFamily: "var(--font-hand)",
              color: "var(--color-text)",
              fontSize: "clamp(3.5rem, 10vw, 6.5rem)",
              lineHeight: 0.88,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            hi, i&apos;m{" "}
            <span style={{ color: "var(--color-accent)" }}>jake</span>
          </motion.h1>

          {/* Cycling role, in the margin-note voice */}
          <motion.div
            className="mb-7 flex h-10 items-center justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={phraseIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Scrawl arrow="left" rotate={-1.5}>
                  {TYPED_PHRASES[phraseIndex]}
                </Scrawl>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.p
            className="mx-auto mb-9 max-w-xl text-base leading-relaxed sm:text-lg md:mx-0"
            style={{ color: "var(--color-text-muted)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          >
            I build the backend behind large partner integrations: event-driven
            services, REST APIs, and the AWS infrastructure holding them up.
            Currently doing that at Ibotta.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
          >
            <motion.button
              onClick={() => scrollToSection("#experience")}
              className={cn(
                "px-7 py-3 font-mono text-sm font-medium",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              )}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-surface)",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-paper)",
              }}
              whileHover={{ y: -3, boxShadow: "var(--shadow-paper-lift)" }}
              whileTap={{ y: 0, boxShadow: "var(--shadow-paper)" }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              see the work
            </motion.button>

            <motion.button
              onClick={() => scrollToSection("#contact")}
              className={cn(
                "px-7 py-3 font-mono text-sm font-medium",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              )}
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-paper)",
              }}
              whileHover={{ y: -3, boxShadow: "var(--shadow-paper-lift)" }}
              whileTap={{ y: 0, boxShadow: "var(--shadow-paper)" }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              say hi
            </motion.button>
          </motion.div>
        </div>

        {/* Ink map — hidden on mobile */}
        <motion.div
          className="hidden flex-shrink-0 items-center justify-center md:flex"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 1.1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        >
          <ColoradoMap />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollToSection("#about")}
        className="group absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 focus:outline-none"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span
          style={{
            fontFamily: "var(--font-hand)",
            color: "var(--color-text-dim)",
            fontSize: "1.1rem",
          }}
        >
          keep going
        </span>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M10 3v12M4.5 10.5l5.5 5.5 5.5-5.5"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>
    </section>
  );
}
