import type { Metadata } from "next";
import Link from "next/link";
import { Card, Label } from "@/components/ui";
import NotFoundActions from "./NotFoundActions";

export const metadata: Metadata = {
  title: "Address unknown — Jake Jeffreys",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <Card className="w-full max-w-lg p-8">
        <Label tone="accent" className="uppercase tracking-[0.14em]">
          Error 404
        </Label>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Address unknown</h1>
        <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
          This page may have moved, or it never existed.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-[var(--radius-card)] px-4 py-2 font-mono text-sm"
            style={{ background: "var(--color-accent-ink)", color: "var(--color-surface)" }}
          >
            ← Back home
          </Link>
          <NotFoundActions />
        </div>
      </Card>
    </main>
  );
}
