import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui";
import DiceRoller from "./DiceRoller";

export const metadata: Metadata = {
  title: "Dice — Lab — Jake Jeffreys",
  description: "Roll one to six dice.",
};

export default function DicePage() {
  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/lab"
          className="mb-10 inline-block font-mono text-xs uppercase tracking-[0.14em] underline-offset-4 hover:underline"
          style={{ color: "var(--color-accent-ink)" }}
        >
          ← the lab
        </Link>
        <SectionHeading title="Dice" eyebrow="experiment" as="h1" />
        <DiceRoller />
      </div>
    </main>
  );
}
