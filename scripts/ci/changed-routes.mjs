// Prints the routes a diff touches, comma-separated. Usage: node changed-routes.mjs <base-ref>
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const base = process.argv[2] ?? "origin/main";
const files = execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const routes = new Set();
for (const file of files) {
  const lab = file.match(/^src\/app\/lab\/([^/]+)\//);
  if (lab) {
    if (existsSync(`src/app/lab/${lab[1]}/page.tsx`)) routes.add(`/lab/${lab[1]}`);
  } else if (file.startsWith("src/app/lab/")) {
    routes.add("/lab");
  } else if (/^src\/(app\/(layout\.tsx|globals\.css)|components\/paper\/)/.test(file)) {
    // Shared by every page
    routes.add("/");
    routes.add("/lab");
  } else if (file.startsWith("src/") || file.startsWith("public/")) {
    routes.add("/");
  }
}

process.stdout.write([...routes].join(","));
