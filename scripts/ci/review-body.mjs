// Turns the review agent's structured output into a PR review body.
// Usage: node review-body.mjs <result.json> <sha>   Prints the body; writes the final verdict to stderr's last line.
import { readFileSync } from "node:fs";

const [file, sha] = process.argv.slice(2);
const result = JSON.parse(readFileSync(file, "utf8"));

const unmet = result.criteria.filter((c) => !c.met);
const blocking = result.findings.filter((f) => f.severity === "blocking");
// The model's verdict can't approve past its own evidence.
const verdict = result.verdict === "approve" && !unmet.length && !blocking.length ? "approve" : "request_changes";

const out = [`<!-- review-agent verdict=${verdict} sha=${sha} -->`];
out.push(verdict === "approve" ? "### ✅ Review agent: approve" : "### 🔁 Review agent: changes requested");
if (verdict !== result.verdict) out.push("", "_The agent said approve, but its own checklist has unmet criteria or blocking findings._");
out.push("", result.summary, "", "#### Acceptance criteria", "");
for (const c of result.criteria) out.push(`- ${c.met ? "✅" : "❌"} **${c.criterion}**: ${c.evidence}`);

if (result.findings.length) {
  out.push("", "#### Findings", "");
  for (const f of result.findings) out.push(`- ${f.severity === "blocking" ? "🛑" : "💬"} \`${f.where}\`: ${f.comment}`);
}
out.push("", `<sub>Reviewed ${sha.slice(0, 7)}. Comment \`/revise <instructions>\` to send changes back to the build agent.</sub>`);

process.stdout.write(out.join("\n") + "\n");
console.error(verdict);
