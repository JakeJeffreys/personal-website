// Builds the sticky CI comment. Usage: node pr-comment.mjs <ci-dir> <image-base-url> <checks-result> <run-url>
import { existsSync, readdirSync, readFileSync } from "node:fs";

const [dir, imageBase, result, runUrl] = process.argv.slice(2);
const MARKER = "<!-- ci-report -->";
const out = [MARKER];

out.push(result === "success" ? "### ✅ CI passed" : `### ❌ CI ${result}`);
out.push(`[Run logs and artifacts](${runUrl})`);

const scoresPath = `${dir}/lighthouse/scores.json`;
if (existsSync(scoresPath)) {
  const scores = JSON.parse(readFileSync(scoresPath, "utf8"));
  out.push("", "#### Lighthouse (median of 3)", "", "| Page | Perf | A11y | SEO | Best practices |", "|---|---|---|---|---|");
  for (const [path, s] of Object.entries(scores)) {
    out.push(`| \`${path}\` | ${s.performance} | ${s.accessibility} | ${s.seo} | ${s["best-practices"]} |`);
  }
}

const shotsDir = `${dir}/screenshots`;
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => f.endsWith(".png")).sort() : [];
if (shots.length) {
  out.push("", "#### Screenshots of changed pages");
  const pages = [...new Set(shots.map((f) => f.replace(/^(mobile|desktop)-/, "")))];
  for (const page of pages) {
    out.push("", `**${page.replace(/\.png$/, "")}**`, "", "| Mobile (390px) | Desktop (1280px) |", "|---|---|");
    const img = (name) => (shots.includes(name) ? `<img src="${imageBase}/${name}" width="300">` : "n/a");
    out.push(`| ${img(`mobile-${page}`)} | ${img(`desktop-${page}`)} |`);
  }
} else {
  out.push("", "_No page changes detected, so no screenshots._");
}

process.stdout.write(out.join("\n") + "\n");
