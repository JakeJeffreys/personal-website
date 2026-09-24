"use client";

import { useEffect } from "react";

// Module-level so StrictMode's double effect run in dev doesn't print it twice.
let greeted = false;

const POSTCARD = String.raw`
 ┌──────────────────────────────┬────────┐
 │  Greetings from the          │ ┌────┐ │
 │  devtools!                   │ │ JJ │ │
 │                              │ └────┘ │
 │  Nothing broken in here,     ├────────┤
 │  I hope — but if you find    │        │
 │  something, tell me.         │ to:    │
 │                  — Jake      │  you   │
 └──────────────────────────────┴────────┘`;

/**
 * A postcard for anyone curious enough to open the console. Renders nothing.
 * Colors are fixed rather than tokens: devtools has its own theme and can't
 * read the page's CSS variables.
 */
export default function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;

    console.log(
      `%c${POSTCARD}`,
      "font-family: monospace; color: #e8552b; line-height: 1.2;"
    );
    console.log(
      "%cTry ⌘K on the page, or ↑ ↑ ↓ ↓ ← → ← → B A.",
      "color: #94897a; font-style: italic;"
    );
  }, []);

  return null;
}
