// Decides whether a PR may merge without Jake.
// Usage: node merge-policy.mjs <policy.json> <context.json> <comment.md>
// Prints {"decision": "merge" | "needs-jake", "observe": bool, "blockers": [...]} and writes the PR comment.
import { readFileSync, writeFileSync } from "node:fs";

const [policyFile, contextFile, commentFile] = process.argv.slice(2);
const policy = JSON.parse(readFileSync(policyFile, "utf8"));
const ctx = JSON.parse(readFileSync(contextFile, "utf8"));

const globToRegex = (glob) =>
  new RegExp(
    "^" +
      glob
        .split("**")
        .map((part) =>
          part
            .split("*")
            .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
            .join("[^/]*")
        )
        .join(".*") +
      "$"
  );
const matches = (globs, file) => globs.some((g) => globToRegex(g).test(file));

const blockers = [];

if (ctx.state !== "OPEN") blockers.push(`PR is ${ctx.state.toLowerCase()}`);
if (ctx.base !== "main") blockers.push(`PR targets ${ctx.base}, not main`);
if (ctx.draft) blockers.push("PR is a draft");
if (ctx.checks !== "success") blockers.push(`CI \`checks\` is ${ctx.checks} on this commit`);

if (!ctx.review) blockers.push("No review agent verdict yet");
else if (!ctx.sha.startsWith(ctx.review.sha)) blockers.push("The review agent's verdict is for an older commit");
else if (ctx.review.verdict !== "approve") blockers.push("The review agent requested changes");

const protectedFiles = ctx.files.map((f) => f.filename).filter((f) => matches(policy.never_auto_merge, f));
if (protectedFiles.length) {
  blockers.push(`Touches files that never auto-merge: ${protectedFiles.map((f) => `\`${f}\``).join(", ")}`);
}

const zoneFor = (file) =>
  policy.zones.find((z) => matches(z.paths, file)) ?? { name: "default", ...policy.default };
const touched = new Map();
for (const f of ctx.files) {
  if (protectedFiles.includes(f.filename)) continue;
  const zone = zoneFor(f.filename);
  touched.set(zone.name, { zone, count: (touched.get(zone.name)?.count ?? 0) + 1 });
}
// A PR of only protected files still needs limits to report against.
const zones = touched.size ? [...touched.values()].map((t) => t.zone) : [{ name: "default", ...policy.default }];

const noAuto = zones.filter((z) => z.auto_merge === false);
if (noAuto.length) blockers.push(`Touches the ${noAuto.map((z) => z.name).join(", ")} zone, which never auto-merges`);

// Zones may leave a limit unset; fall back to the default for that zone, not for the whole PR.
const maxLines = Math.min(...zones.map((z) => z.max_lines ?? policy.default.max_lines));
const tolerance = Math.min(...zones.map((z) => z.lighthouse_tolerance ?? policy.default.lighthouse_tolerance));
const lines = ctx.files.reduce((n, f) => n + f.additions + f.deletions, 0);
if (lines > maxLines) blockers.push(`${lines} lines changed; the limit for this PR is ${maxLines}`);

const deltas = [];
const newPages = [];
const { pr: prScores, base: baseScores } = ctx.lighthouse;
if (!prScores) blockers.push("No Lighthouse scores for this commit");
else if (!baseScores) blockers.push("No Lighthouse baseline from main to compare against");
else {
  for (const [route, scores] of Object.entries(prScores)) {
    const base = baseScores[route];
    if (!base) newPages.push(route);
    for (const cat of policy.lighthouse_categories) {
      if (!base || base[cat] == null || scores[cat] == null) continue;
      const delta = scores[cat] - base[cat];
      deltas.push({ route, cat, base: base[cat], now: scores[cat], delta });
      if (-delta > tolerance) blockers.push(`Lighthouse ${cat} on \`${route}\` dropped ${-delta} (${base[cat]} → ${scores[cat]}); tolerance is ${tolerance}`);
    }
  }
}

const decision = blockers.length ? "needs-jake" : "merge";
const observe = policy.observe !== false;

const heading =
  decision === "needs-jake"
    ? "### 🙋 Merge policy: needs Jake"
    : observe
      ? "### 🟢 Merge policy: would merge (observe mode, so merge it yourself)"
      : "### ✅ Merge policy: auto-merging";
const out = ["<!-- merge-policy -->", heading, ""];
if (blockers.length) out.push(...blockers.map((b) => `- ${b}`), "");
out.push("<details><summary>How this was decided</summary>", "");
out.push(`- Commit: \`${ctx.sha.slice(0, 7)}\`, CI \`${ctx.checks}\`, review ${ctx.review ? `${ctx.review.verdict} @ \`${ctx.review.sha.slice(0, 7)}\`` : "none"}`);
out.push(`- Zones: ${[...touched.entries()].map(([name, t]) => `${name} (${t.count} file${t.count === 1 ? "" : "s"})`).join(", ") || "none"}${protectedFiles.length ? `, plus ${protectedFiles.length} protected` : ""}`);
out.push(`- Size: ${lines} lines (limit ${maxLines})`, `- Lighthouse tolerance: ${tolerance} points`);
const changed = deltas.filter((d) => d.delta !== 0);
if (deltas.length) {
  out.push(changed.length ? "" : "- Lighthouse: no change from main on shared pages");
  if (changed.length) {
    out.push("| Page | Category | main | PR | Δ |", "|---|---|---|---|---|");
    for (const d of changed) out.push(`| \`${d.route}\` | ${d.cat} | ${d.base} | ${d.now} | ${d.delta > 0 ? "+" : ""}${d.delta} |`);
  }
}
if (newPages.length) out.push(`- New pages (CI's absolute thresholds only): ${newPages.map((r) => `\`${r}\``).join(", ")}`);
out.push("", "</details>", "", "<sub>Rules live in `merge-policy.yml` on main.</sub>");
writeFileSync(commentFile, out.join("\n") + "\n");

console.log(JSON.stringify({ decision, observe, blockers }));
