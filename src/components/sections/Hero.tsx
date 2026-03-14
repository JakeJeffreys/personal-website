"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Globe from "@/components/Globe";

const TYPED_PHRASES = [
  "Senior Platform Engineer",
  "Denver, Colorado",
  "Cloud-native systems at scale",
];

const PHRASE_DURATION_MS = 2800;

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isLight = mounted && resolvedTheme === "light";

  useEffect(() => setMounted(true), []);

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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Dot/grid pattern overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(30, 42, 69, 0.7) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blob 1 — sky blue */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "520px",
            height: "520px",
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)",
            filter: "blur(72px)",
            top: "5%",
            left: "-10%",
          }}
          animate={{
            x: [0, 60, 20, 0],
            y: [0, 40, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Blob 2 — purple */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "480px",
            height: "480px",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "20%",
            right: "-8%",
          }}
          animate={{
            x: [0, -50, -20, 0],
            y: [0, 60, 10, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        {/* Blob 3 — deep blue */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)",
            filter: "blur(64px)",
            bottom: "10%",
            left: "30%",
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        />
      </div>

      {/* Main content — two column on desktop */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 px-6 max-w-5xl mx-auto w-full">
        {/* Text column */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          {/* Pre-title label */}
          <motion.p
            className="font-mono text-sm mb-4 tracking-widest uppercase"
            style={{ color: "var(--color-accent)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hello, world. I&apos;m
          </motion.p>

          {/* Name */}
          <motion.h1
            className="font-sans font-bold leading-tight tracking-tight mb-4"
            style={{
              color: "var(--color-text)",
              fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          >
            Jake{" "}
            <span style={{ color: "var(--color-accent)" }}>Jeffreys</span>
          </motion.h1>

          {/* Cycling typed text */}
          <motion.div
            className="h-10 flex items-center justify-center md:justify-start mb-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                className="font-mono text-xl sm:text-2xl"
                style={{ color: "var(--color-text-muted)" }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                {TYPED_PHRASES[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-base sm:text-lg max-w-xl mx-auto md:mx-0 mb-10 leading-relaxed"
            style={{ color: "var(--color-text-dim)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            Designing and scaling cloud-native backend systems. Currently building platform infrastructure at Ibotta.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Primary CTA */}
            <motion.button
              onClick={() => scrollToSection("#experience")}
              className={cn(
                "relative px-7 py-3 rounded-lg font-mono font-medium text-sm",
                "overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              )}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-background)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="relative z-10">View My Work</span>
              <motion.span
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #fff 0%, transparent 60%)" }}
              />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              onClick={() => scrollToSection("#contact")}
              className={cn(
                "px-7 py-3 rounded-lg font-mono font-medium text-sm border",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200"
              )}
              style={{
                borderColor: "var(--color-accent)",
                color: isLight ? "var(--color-accent)" : "var(--color-accent)",
                backgroundColor: isLight ? "#ffffff" : "#0c2a4a",
              }}
              whileHover={{
                opacity: 0.88,
                scale: 1.04,
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </div>

        {/* Globe — hidden on mobile */}
        <motion.div
          className="hidden md:flex flex-shrink-0 items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <Globe />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollToSection("#about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 focus:outline-none group"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: "var(--color-text-dim)" }}
        >
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="group-hover:opacity-80 transition-opacity duration-200"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 3v12M4.5 10.5l5.5 5.5 5.5-5.5"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
