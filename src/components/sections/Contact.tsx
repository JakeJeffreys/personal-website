"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  };
}

const socialLinks = [
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

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div className="mb-12" {...fadeUpProps(0)}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "var(--color-accent)" }} />
            <span className="text-sm font-mono tracking-widest uppercase" style={{ color: "var(--color-accent)" }}>
              Contact
            </span>
            <div className="h-px w-8" style={{ background: "var(--color-accent)" }} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg max-w-md mx-auto leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            I&apos;m always open to interesting conversations and new opportunities.
          </p>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" {...fadeUpProps(0.15)}>
          {socialLinks.map(({ label, href, Icon, description }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-xl border w-full sm:w-auto",
                "transition-all duration-200 group"
              )}
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
              }}
            >
              <Icon className="w-5 h-5 shrink-0 transition-colors duration-200" style={{ color: "var(--color-accent)" }} />
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{label}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{description}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
