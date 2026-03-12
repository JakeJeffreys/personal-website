"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md border-b"
          : "border-b border-transparent"
      )}
      style={{
        backgroundColor: scrolled ? "color-mix(in srgb, var(--color-background) 85%, transparent)" : "transparent",
        borderColor: scrolled ? "var(--color-border)" : "transparent",
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
        {/* Logo / Name */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-2 focus:outline-none"
          aria-label="Scroll to top"
        >
          <span
            className="font-mono text-lg font-bold tracking-tight transition-opacity duration-200 group-hover:opacity-80"
            style={{ color: "var(--color-accent)" }}
          >
            JJ
          </span>
          <span
            className="hidden sm:inline font-mono text-sm font-medium transition-opacity duration-200 group-hover:opacity-80"
            style={{ color: "var(--color-text-muted)" }}
          >
            /
          </span>
          <span
            className="hidden sm:inline font-mono text-sm font-medium transition-opacity duration-200 group-hover:opacity-80"
            style={{ color: "var(--color-text)" }}
          >
            Jake Jeffreys
          </span>
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <motion.button
                onClick={() => handleNavClick(link.href)}
                className="relative font-mono text-sm group focus:outline-none"
                style={{ color: "var(--color-text-muted)" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                whileHover={{ color: "var(--color-accent)" }}
              >
                <span
                  className="text-xs mr-1"
                  style={{ color: "var(--color-accent)" }}
                >
                  0{i + 1}.
                </span>
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              </motion.button>
            </li>
          ))}
        </ul>

        {/* Theme Toggle */}
        {mounted && (
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-8 h-8 rounded-md transition-colors focus:outline-none"
            style={{ color: "var(--color-text-muted)" }}
            whileHover={{ color: "var(--color-accent)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </motion.button>
        )}

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <motion.span
            className="block h-0.5 w-6 rounded-full origin-center"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block h-0.5 w-6 rounded-full"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-6 rounded-full origin-center"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t"
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-background) 97%, transparent)",
              borderColor: "var(--color-border)",
            }}
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="w-full text-left font-mono text-base py-2 focus:outline-none"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <span
                      className="text-sm mr-2"
                      style={{ color: "var(--color-accent)" }}
                    >
                      0{i + 1}.
                    </span>
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
