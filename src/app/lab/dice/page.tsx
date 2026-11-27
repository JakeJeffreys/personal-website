import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/paper";
import DiceRoller from "./DiceRoller";

export const metadata: Metadata = {
  title: "Dice — Lab — Jake Jeffreys",
  description: "Roll one to six paper dice.",
};

export default function DicePage() {
  return (
    <main className="paper-page min-h-screen px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/lab"
          className="mb-10 inline-block font-mono text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline"
          style={{ color: "var(--color-accent-ink)" }}
        >
          ← the lab
        </Link>
        <SectionHeading title="dice" eyebrow="experiment" variant="taped" />
        <DiceRoller />
      </div>
    </main>
  );
}
