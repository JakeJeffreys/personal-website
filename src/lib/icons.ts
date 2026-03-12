import * as si from "simple-icons";

// Map display name → simple-icons key (siXxx)
const ICON_MAP: Record<string, string> = {
  TypeScript: "siTypescript",
  JavaScript: "siJavascript",
  Java: "siJava",
  SQL: "siPostgresql",
  Bash: "siGnubash",
  "Node.js": "siNodedotjs",
  "Java Spring": "siSpring",
  Docker: "siDocker",
  Kubernetes: "siKubernetes",
  AWS: "siAmazonwebservices",
  Lambda: "siAwslambda",
  DynamoDB: "siAmazondynamodb",
  S3: "siAmazons3",
  CloudFront: "siAmazoncloudfront",
  "API Gateway": "siAmazonapigateway",
  SNS: "siAmazonsns",
  SQS: "siAmazonsqs",
  EventBridge: "siAmazoneventbridge",
  Terraform: "siTerraform",
  Datadog: "siDatadog",
  BlazeMeter: "siBlazemeter",
};

export interface IconInfo {
  svg: string;
  color: string;
}

export function getIconInfo(name: string): IconInfo | null {
  const key = ICON_MAP[name];
  if (!key) return null;
  const icon = (si as Record<string, { svg: string; hex: string } | undefined>)[key];
  if (!icon) return null;
  return { svg: icon.svg, color: `#${icon.hex}` };
}
