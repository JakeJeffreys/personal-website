"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { Scrawl } from "@/components/paper";

const socialLinks = [
  {
    label: "Email",
    href: "mailto:njjeffreys@gmail.com",
    Icon: Mail,
    description: "njjeffreys@gmail.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/jakejeffreys",
    Icon: Github,
    description: "See my work",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/jake-jeffreys",
    Icon: Linkedin,
    description: "Connect with me",
  },
];

/**
 * A postcard: divided back, stamp box in the corner, ruled address lines.
 * The section heading lives inside the card rather than above it, so the
 * postcard reads as one object.
 */
export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="paper-tilt relative"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-paper-lift)",
          }}
          initial={{ opacity: 0, y: -20, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
        >
          {/* Stamp */}
          <div
            className="absolute right-5 top-5 flex h-16 w-14 flex-col items-center justify-center"
            style={{
              border: "2px dashed var(--color-border)",
              borderRadius: "var(--radius-card)",
              color: "var(--color-text-dim)",
            }}
            aria-hidden="true"
          >
            <Mail className="h-5 w-5" />
            <span className="mt-1 font-mono text-[8px] uppercase tracking-wider">
              Denver
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 p-8 sm:p-10 md:grid-cols-[1.1fr_1fr]">
            {/* Left half — the message */}
            <div className="md:pr-8" style={{ borderColor: "var(--color-border)" }}>
              <p
                className="mb-1 font-mono text-xs uppercase tracking-[0.18em]"
                style={{ color: "var(--color-accent-ink)" }}
              >
                Contact
              </p>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "var(--font-hand)",
                  color: "var(--color-text)",
                  fontSize: "clamp(2.2rem, 5vw, 3rem)",
                  lineHeight: 0.95,
                }}
              >
                say hi
              </h2>
              <p
                className="max-w-sm text-base leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                I&apos;m always open to interesting conversations and new
                opportunities. Any of these will reach me.
              </p>
              <div className="mt-5">
                <Scrawl arrow="right" rotate={-1.4}>
                  no bad time to say hi
                </Scrawl>
              </div>
            </div>

            {/* Right half — the address block */}
            <div
              className="flex flex-col justify-end gap-3 pt-14 md:border-l md:pl-8 md:pt-0"
              style={{ borderColor: "var(--color-border)" }}
            >
              {socialLinks.map(({ label, href, Icon, description }) => (
                <motion.a
                  key={label}
                  href={href}
                  {...(href.startsWith("mailto:")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex items-center gap-3 border-b pb-2 last:border-b-0"
                  style={{ borderColor: "var(--color-border)" }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                >
                  <Icon
                    className="h-5 w-5 shrink-0"
                    style={{ color: "var(--color-accent)" }}
                    aria-hidden="true"
                  />
                  <span className="text-left">
                    <span
                      className="block text-sm font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {label}
                    </span>
                    <span className="block text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {description}
                    </span>
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
