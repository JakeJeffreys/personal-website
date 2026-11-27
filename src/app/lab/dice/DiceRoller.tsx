"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PaperCard } from "@/components/paper";

const COUNTS = [1, 2, 3, 4, 5, 6];
const ROLL_MS = 600;

// Pip positions on a 3x3 grid (0-8) for each face.
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const rand = () => Math.floor(Math.random() * 6) + 1;

function Die({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <motion.div
      role="img"
      aria-label={`Die showing ${value}`}
      className="grid h-16 w-16 grid-cols-3 grid-rows-3 p-2 sm:h-20 sm:w-20"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "2px solid var(--color-text)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-paper)",
      }}
      animate={rolling ? { rotate: [0, -12, 10, -6, 0], y: [0, -8, 0] } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.3, repeat: rolling ? Infinity : 0 }}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="flex items-center justify-center" aria-hidden="true">
          {PIPS[value].includes(i) && (
            <span
              className="block h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
              style={{ backgroundColor: "var(--color-text)" }}
            />
          )}
        </span>
      ))}
    </motion.div>
  );
}

export default function DiceRoller() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(2);
  const [values, setValues] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState("");
  const timers = useRef<{ tick?: ReturnType<typeof setInterval>; end?: ReturnType<typeof setTimeout>; say?: ReturnType<typeof setTimeout> }>({});

  useEffect(() => {
    const t = timers.current;
    return () => {
      clearInterval(t.tick);
      clearTimeout(t.end);
      clearTimeout(t.say);
    };
  }, []);

  function roll() {
    if (rolling) return;
    const final = Array.from({ length: count }, rand);
    const finish = () => {
      setValues(final);
      setRolling(false);
      const sum = final.reduce((a, b) => a + b, 0);
      // Set after a beat so an identical result still changes the live region and is re-announced.
      timers.current.say = setTimeout(
        () => setMessage(`Rolled ${count} ${count === 1 ? "die" : "dice"}: ${final.join(", ")}. Total ${sum}.`),
        100,
      );
    };
    clearTimeout(timers.current.say);
    setMessage("");
    if (reduce) {
      finish();
      return;
    }
    setRolling(true);
    timers.current.tick = setInterval(() => setValues(Array.from({ length: count }, rand)), 90);
    timers.current.end = setTimeout(() => {
      clearInterval(timers.current.tick);
      finish();
    }, ROLL_MS);
  }

  const total = values.reduce((a, b) => a + b, 0);

  return (
    <PaperCard lift={false} tilt="none" className="p-6">
      <fieldset className="mb-6">
        <legend className="mb-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
          How many dice?
        </legend>
        <div className="flex flex-wrap gap-2">
          {COUNTS.map((n) => (
            <label key={n} className="relative">
              <input
                type="radio"
                name="dice-count"
                value={n}
                checked={count === n}
                onChange={() => setCount(n)}
                className="peer sr-only"
              />
              <span
                className="flex h-11 w-11 cursor-pointer items-center justify-center font-mono peer-checked:font-bold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-card)",
                  backgroundColor: count === n ? "var(--color-text)" : "var(--color-surface)",
                  color: count === n ? "var(--color-surface)" : "var(--color-text)",
                  outlineColor: "var(--color-accent-ink)",
                }}
              >
                {n}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={roll}
        disabled={rolling}
        className="min-h-11 px-6 font-mono text-sm uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
        style={{
          backgroundColor: "var(--color-text)",
          color: "var(--color-surface)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-paper)",
          outlineColor: "var(--color-accent-ink)",
        }}
      >
        Roll
      </button>

      <div className="mt-8 flex min-h-20 flex-wrap gap-4">
        {values.map((v, i) => (
          <Die key={i} value={v} rolling={rolling} />
        ))}
      </div>

      <p
        className="mt-6 min-h-10"
        style={{ fontFamily: "var(--font-hand)", fontSize: "2rem", color: "var(--color-text)" }}
      >
        {values.length > 0 && !rolling ? `Total: ${total}` : ""}
      </p>

      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
    </PaperCard>
  );
}
