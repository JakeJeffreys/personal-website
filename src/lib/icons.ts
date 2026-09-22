import {
  siAnthropic,
  siBlazemeter,
  siDatadog,
  siDocker,
  siGit,
  siGnubash,
  siJavascript,
  siJenkins,
  siKubernetes,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siTerraform,
  siTypescript,
} from "simple-icons";

/**
 * Named imports, not `import * as si`.
 *
 * The wildcard pulled all ~3,000 simple-icons into the client bundle: lookups
 * were done dynamically by string key, so the bundler could not prove which
 * icons were unused and had to keep every one. Importing only what's actually
 * referenced lets the rest be dropped.
 */
type SimpleIcon = { svg: string; hex: string };

const SI: Record<string, SimpleIcon> = {
  siAnthropic,
  siBlazemeter,
  siDatadog,
  siDocker,
  siGit,
  siGnubash,
  siJavascript,
  siJenkins,
  siKubernetes,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siTerraform,
  siTypescript,
};

// Map display name → simple-icons key (siXxx)
const ICON_MAP: Record<string, string> = {
  TypeScript: "siTypescript",
  JavaScript: "siJavascript",
  SQL: "siPostgresql",
  PostgreSQL: "siPostgresql",
  Bash: "siGnubash",
  Python: "siPython",
  "Node.js": "siNodedotjs",
  Docker: "siDocker",
  Kubernetes: "siKubernetes",
  Terraform: "siTerraform",
  Datadog: "siDatadog",
  BlazeMeter: "siBlazemeter",
  React: "siReact",
  "Claude Code": "siAnthropic",
  "Claude API": "siAnthropic",
  Git: "siGit",
  Jenkins: "siJenkins",
};

// Custom SVG icons for AWS services (removed from simple-icons v16)
const CUSTOM_ICONS: Record<string, { svg: string; color: string }> = {
  AWS: {
    color: "#FF9900",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`,
  },
  Lambda: {
    color: "#FF9900",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L5 21h4l3-7 3 7h4L12 3z"/></svg>`,
  },
  DynamoDB: {
    color: "#4053D6",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="12" cy="5" rx="8" ry="2.5"/><path d="M4 5v5c0 1.38 3.58 2.5 8 2.5S20 11.38 20 10V5M4 10v5c0 1.38 3.58 2.5 8 2.5S20 16.38 20 15v-5M4 15v4c0 1.38 3.58 2.5 8 2.5S20 20.38 20 19v-4"/></svg>`,
  },
  S3: {
    color: "#7AA116",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/></svg>`,
  },
  CloudFront: {
    color: "#8C4FFF",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="3.5" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="5.6" y1="6.5" x2="18.4" y2="6.5"/><line x1="5.6" y1="17.5" x2="18.4" y2="17.5"/></svg>`,
  },
  "API Gateway": {
    color: "#FF4F8B",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="5" height="8" rx="1"/><rect x="17" y="8" width="5" height="8" rx="1"/><line x1="7" y1="12" x2="17" y2="12"/><polyline points="14 9 17 12 14 15"/></svg>`,
  },
  SNS: {
    color: "#FF4F8B",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`,
  },
  SQS: {
    color: "#FF9900",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="7" height="5" rx="1"/><rect x="2" y="13" width="7" height="5" rx="1"/><rect x="15" y="8" width="7" height="5" rx="1"/><line x1="9" y1="6.5" x2="15" y2="10.5"/><line x1="9" y1="15.5" x2="15" y2="11.5"/></svg>`,
  },
  Java: {
    color: "#ED8B00",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5q1-2 0-3M12 5q1-2 0-3M16 5q1-2 0-3"/><path d="M5 8h14v9a2 2 0 01-2 2H7a2 2 0 01-2-2V8z"/><path d="M19 11h2a2 2 0 010 4h-2"/></svg>`,
  },
  EC2: {
    color: "#FF9900",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg>`,
  },
  EventBridge: {
    color: "#FF4F8B",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.2 10.8 16.8 7.2M7.2 13.2l9.6 3.6"/></svg>`,
  },
  "CI/CD": {
    color: "#22A06B",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><polyline points="20 3 20 8 15 8"/><polyline points="9 12 11 14 15 10"/></svg>`,
  },
  "Event-Driven": {
    color: "#E8552B",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 4 14 11 14 10 22 20 10 13 10 13 2"/></svg>`,
  },
  "Message Queues": {
    color: "#8C4FFF",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="4" height="10" rx="1"/><rect x="8" y="7" width="4" height="10" rx="1"/><rect x="14" y="7" width="4" height="10" rx="1"/><polyline points="20 9 22 12 20 15"/></svg>`,
  },
  "Distributed Systems": {
    color: "#4053D6",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><circle cx="12" cy="12" r="2.5"/><path d="M12 6v3.5M10 13.8 5.6 16.6M14 13.8l4.4 2.8"/></svg>`,
  },
  "Service Integrations": {
    color: "#2DA2BB",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7 6 10a4.2 4.2 0 0 0 6 6l3-3"/><path d="M15 17l3-3a4.2 4.2 0 0 0-6-6L9 11"/></svg>`,
  },
  "Schema Migrations": {
    color: "#7AA116",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="6" cy="5" rx="4" ry="2"/><path d="M2 5v6c0 1.1 1.8 2 4 2s4-.9 4-2V5"/><ellipse cx="18" cy="13" rx="4" ry="2"/><path d="M14 13v6c0 1.1 1.8 2 4 2s4-.9 4-2v-6"/><path d="M11 8h5"/><polyline points="14 6 16 8 14 10"/></svg>`,
  },
  "Load Testing": {
    color: "#D45A28",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18a9 9 0 0 1 18 0"/><line x1="12" y1="18" x2="16.5" y2="10.5"/><circle cx="12" cy="18" r="1.2" fill="currentColor"/></svg>`,
  },
  "On-Call": {
    color: "#C2431F",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>`,
  },
  Runscope: {
    color: "#2DA2BB",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16" y1="16" x2="21" y2="21"/><polyline points="8 11 10.5 13.5 14 9"/></svg>`,
  },
  MCP: {
    color: "#C2431F",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18V9l8 6 8-6v9"/><path d="M4 9l8-3 8 3"/></svg>`,
  },
  Agents: {
    color: "#8C4FFF",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 5V8M9 13h.01M15 13h.01M9.5 16h5"/><circle cx="12" cy="4" r="1.2"/></svg>`,
  },
  Skills: {
    color: "#22A06B",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h11a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5z"/><path d="M17 7h3v12H8"/><path d="M7 9h6M7 12h6"/></svg>`,
  },
  "Agentic Workflows": {
    color: "#E8552B",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="5" rx="1"/><rect x="15" y="9" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><path d="M9 5.5h3a2 2 0 0 1 2 2v2M15 11.5h-3a2 2 0 0 0-2 2v3"/></svg>`,
  },
  "Split.io": {
    color: "#4053D6",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h4l4 10h8"/><path d="M4 17h4l2-5"/><polyline points="17 4 20 7 17 10"/><polyline points="17 14 20 17 17 20"/></svg>`,
  },
  "REST APIs": {
    color: "#4A90E2",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h7"/><polyline points="17 15 20 12 17 9"/></svg>`,
  },
};

export interface IconInfo {
  svg: string;
  color: string;
}

export function getIconInfo(name: string): IconInfo | null {
  // Check custom icons first
  if (CUSTOM_ICONS[name]) {
    return CUSTOM_ICONS[name];
  }
  // Fall back to simple-icons
  const key = ICON_MAP[name];
  if (!key) return null;
  const icon = SI[key];
  if (!icon) return null;
  return { svg: icon.svg, color: `#${icon.hex}` };
}
