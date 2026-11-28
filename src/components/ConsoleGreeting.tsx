"use client";

import { useEffect } from "react";

// Module-level so StrictMode's double effect run in dev doesn't print it twice.
let greeted = false;

/**
 * A short hello for anyone who opens the console. Renders nothing.
 * Colors are fixed rather than tokens: devtools has its own theme and can't
 * read the page's CSS variables.
 */
export default function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;

    console.log("%cHello from the devtools.", "font-family: monospace; color: #60a5fa;");
    console.log("%cTry ⌘K on the page.", "font-family: monospace; color: #9a9aa4;");
  }, []);

  return null;
}
