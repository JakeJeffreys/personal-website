import type { Metadata } from "next";
import Experience from "@/components/sections/Experience";
import TechStack from "@/components/sections/TechStack";
import GitHubActivity from "@/components/sections/GitHubActivity";

export const metadata: Metadata = {
  title: "Work — Jake Jeffreys",
  description:
    "Experience, tech stack, and GitHub activity for Jake Jeffreys, a backend engineer building distributed systems on AWS.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main className="paper-page pt-16">
      <Experience />
      <TechStack />
      <GitHubActivity />
      <p className="px-6 pb-8 text-center">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center font-mono text-sm underline underline-offset-4"
          style={{ color: "var(--color-accent-ink)" }}
        >
          download the résumé (PDF) →
        </a>
      </p>
    </main>
  );
}
