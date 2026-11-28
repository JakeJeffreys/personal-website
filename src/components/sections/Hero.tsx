"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import ColoradoMap from "@/components/ColoradoMap";
import { Label } from "@/components/ui";

const TYPED_PHRASES = [
  "Senior Software Engineer",
  "Denver, Colorado",
  "Distributed systems on AWS",
];

const PHRASE_DURATION_MS = 2800;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const linkButton =
  "inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-card)] px-5 py-2.5 font-mono text-sm font-medium";

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Skip the cycling role for reduced motion; the first phrase stays put.
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % TYPED_PHRASES.length);
    }, PHRASE_DURATION_MS);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <section id="hero" className="relative overflow-hidden px-6 pb-16 pt-32">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-14 md:flex-row">
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Label tone="accent" tag>
              denver, colorado
            </Label>
          </motion.div>

          <motion.h1
            className="mb-3 mt-6 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
            style={{ color: "var(--color-text)", lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05, ease: EASE }}
          >
            Hi, I&apos;m{" "}
            <span style={{ color: "var(--color-accent-ink)" }}>Jake</span>
          </motion.h1>

          {/* Cycling role */}
          <div className="mb-7 flex h-8 items-center justify-center md:justify-start">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                className="font-mono text-base"
                style={{ color: "var(--color-text-muted)" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                {TYPED_PHRASES[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            className="mx-auto mb-9 max-w-xl text-base leading-relaxed sm:text-lg md:mx-0"
            style={{ color: "var(--color-text-muted)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1, ease: EASE }}
          >
            I build the backend behind large partner integrations: event-driven
            services, REST APIs, and the AWS infrastructure holding them up.
            Currently doing that at Ibotta.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 md:justify-start"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15, ease: EASE }}
          >
            {[
              { label: "GitHub", href: "https://github.com/jakejeffreys", Icon: Github },
              { label: "LinkedIn", href: "https://linkedin.com/in/jake-jeffreys", Icon: Linkedin },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkButton} border transition-colors hover:border-[var(--color-accent-ink)]`}
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                <Icon className="h-4 w-4" style={{ color: "var(--color-accent-ink)" }} aria-hidden="true" />
                {label}
              </a>
            ))}
            <Link
              href="/lab"
              className={linkButton}
              style={{ backgroundColor: "var(--color-accent-ink)", color: "var(--color-surface)" }}
            >
              see the lab
            </Link>
          </motion.div>
        </div>

        {/* Map — hidden on mobile */}
        <motion.div
          className="hidden flex-shrink-0 items-center justify-center md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <ColoradoMap />
        </motion.div>
      </div>
    </section>
  );
}
