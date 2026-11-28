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

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const controlClass =
  "flex items-center gap-1.5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-ink)] hover:text-[var(--color-text)]";

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

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-200"
      style={{
        backgroundColor: scrolled ? "var(--color-background)" : "transparent",
        borderColor: scrolled ? "var(--color-border)" : "transparent",
      }}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent-ink)]"
          aria-label="Jake Jeffreys, home"
        >
          jake<span className="text-[var(--color-accent-ink)]">.</span>jeffreys
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={`font-mono text-sm transition-colors hover:text-[var(--color-text)] ${
                  isCurrent(link.href)
                    ? "text-[var(--color-accent-ink)] underline decoration-1 underline-offset-8"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => setOpen(true)}
            className={controlClass}
            aria-label="Open command palette"
            title="Open command palette"
          >
            <span className="text-[var(--color-accent-ink)]">⌘K</span>
            <span>command</span>
          </button>

          {mounted && (
            <button onClick={toggleTheme} className={controlClass} aria-label="Toggle theme">
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
              <span>{theme === "dark" ? "light" : "dark"}</span>
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <motion.span
            className="block h-0.5 w-6 origin-center"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-6"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block h-0.5 w-6 origin-center"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t md:hidden"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-border)",
            }}
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    className={`block w-full py-2 text-left font-mono text-base ${
                      isCurrent(link.href)
                        ? "text-[var(--color-accent-ink)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* The header's theme toggle is desktop-only, so it lives here on mobile */}
            {mounted && (
              <div className="px-6 pb-5">
                <button onClick={toggleTheme} className={`${controlClass} px-4 py-2.5`}>
                  {theme === "dark" ? "switch to light" : "switch to dark"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
