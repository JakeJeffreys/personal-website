"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useCommandPalette } from "./CommandPaletteProvider";

const NAV_LINKS = [
  { label: "home", href: "/" },
  { label: "lab", href: "/lab" },
  { label: "work", href: "/work" },
  { label: "about", href: "/about" },
];

const MotionLink = motion.create(Link);

/** Shared paper-button styling for the ⌘K and theme controls. */
const paperButton: React.CSSProperties = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border)",
  color: "var(--color-text-muted)",
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-paper)",
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { setOpen } = useCommandPalette();

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

  const pathname = usePathname();
  // /lab stays current on /lab/<slug>
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.header
      /* No backdrop blur — paper is opaque. The ink rule fades in on scroll. */
      className="fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-300"
      style={{
        backgroundColor: scrolled ? "var(--color-background)" : "transparent",
        borderColor: scrolled ? "var(--color-border)" : "transparent",
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Signature */}
        <Link
          href="/"
          className="group flex items-baseline gap-2 focus-visible:outline-2 focus-visible:outline-offset-4"
          aria-label="Jake Jeffreys, home"
        >
          <span
            className="transition-opacity duration-200 group-hover:opacity-70"
            style={{
              fontFamily: "var(--font-hand)",
              color: "var(--color-accent)",
              fontSize: "1.75rem",
              lineHeight: 1,
            }}
          >
            jake jeffreys
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <MotionLink
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className="group relative focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  fontFamily: "var(--font-hand)",
                  color: isCurrent(link.href) ? "var(--color-accent-ink)" : "var(--color-text-muted)",
                  fontSize: "1.35rem",
                  lineHeight: 1.1,
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                whileHover={{ color: "var(--color-accent)" }}
              >
                {link.label}
                {/* Hand-drawn underline, drawn on hover */}
                <svg
                  className={`absolute -bottom-1 left-0 w-full transition-opacity duration-200 group-hover:opacity-100 ${isCurrent(link.href) ? "opacity-100" : "opacity-0"}`}
                  height="4"
                  viewBox="0 0 60 4"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 2.5 Q 15 0.8, 30 2.4 T 59 2"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </MotionLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {/* ⌘K */}
          <motion.button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-semibold focus:outline-none"
            style={paperButton}
            whileHover={{ y: -2, boxShadow: "var(--shadow-paper-lift)" }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Open command palette"
            title="Open command palette"
          >
            <span style={{ color: "var(--color-accent-ink)" }}>⌘K</span>
            <span className="opacity-70">command</span>
          </motion.button>

          {/* Theme toggle */}
          {mounted && (
            <motion.button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-semibold focus:outline-none"
              style={paperButton}
              whileHover={{ y: -2, boxShadow: "var(--shadow-paper-lift)" }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
              <span>{theme === "dark" ? "day" : "night"}</span>
            </motion.button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 focus:outline-none md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <motion.span
            className="block h-0.5 w-6 origin-center"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block h-0.5 w-6"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-6 origin-center"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t md:hidden"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-border)",
            }}
          >
            <ul className="flex flex-col gap-3 px-6 py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    className="block w-full py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{
                      fontFamily: "var(--font-hand)",
                      color: isCurrent(link.href) ? "var(--color-accent-ink)" : "var(--color-text-muted)",
                      fontSize: "1.5rem",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            {/* The header's theme toggle is desktop-only, so it lives here on mobile */}
            {mounted && (
              <div className="px-6 pb-5">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="border px-4 py-2.5 font-mono text-xs font-semibold focus:outline-none"
                  style={paperButton}
                >
                  {theme === "dark" ? "switch to day" : "switch to night"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
