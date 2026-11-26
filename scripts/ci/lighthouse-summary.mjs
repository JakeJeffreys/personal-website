// Reduces the LHCI filesystem manifest to { "<path>": { performance, accessibility, ... } } (0-100).
import { readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("lighthouse/manifest.json", "utf8"));
const scores = {};
for (const run of manifest.filter((r) => r.isRepresentativeRun)) {
  const path = new URL(run.url).pathname;
  scores[path] = Object.fromEntries(
    Object.entries(run.summary).map(([category, score]) => [category, Math.round(score * 100)])
  );
}

writeFileSync("lighthouse/scores.json", JSON.stringify(scores, null, 2) + "\n");
console.log(JSON.stringify(scores, null, 2));
