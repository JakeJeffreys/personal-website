import * as si from "simple-icons";

// Map display name → simple-icons key (siXxx)
const ICON_MAP: Record<string, string> = {
  TypeScript: "siTypescript",
  JavaScript: "siJavascript",
  SQL: "siPostgresql",
  Bash: "siGnubash",
  Python: "siPython",
  "Node.js": "siNodedotjs",
  "Java Spring": "siSpring",
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
  const icon = (si as Record<string, { svg: string; hex: string } | undefined>)[key];
  if (!icon) return null;
  return { svg: icon.svg, color: `#${icon.hex}` };
}
