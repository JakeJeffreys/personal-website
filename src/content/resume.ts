export interface Role {
  title: string;
  startDate: string;
  endDate: string | null; // null = present
  description: string[];
}

export interface Company {
  name: string;
  location: string;
  roles: Role[]; // ordered newest-first
  technologies: string[]; // merged & deduplicated across all roles
}

export interface Skill {
  category: string;
  items: string[];
}

export const companies: Company[] = [
  {
    name: "Ibotta",
    location: "Denver, CO",
    roles: [
      {
        title: "Senior Software Engineer",
        startDate: "Jan 2024",
        endDate: null,
        description: [
          "Owned architecture and development of event-driven backend services and RESTful APIs supporting a partner network spanning Walmart, 7-Eleven, DoorDash, and Instacart.",
          "Designed extensible, Terraform-managed AWS infrastructure enabling rapid onboarding of high-traffic enterprise partners with zero-downtime deployments.",
          "Architected a CDN-backed image delivery pipeline (API Gateway, S3, CloudFront) serving tens of millions of low-latency product images per day.",
          "Drove observability improvements through Datadog dashboards, Runscope API test suites, and BlazeMeter load testing — reducing mean time to detection on production incidents.",
          "Led 24/7 on-call rotations, owning incident response, root cause analysis, and stakeholder communication for a high-traffic production platform.",
          "Won an internal hackathon building an image resizing and compression service that reduced annual data transfer costs by $100,000+.",
        ],
      },
      {
        title: "Software Engineer",
        startDate: "Jun 2021",
        endDate: "Dec 2023",
        description: [
          "Designed and launched the Ibotta Performance Network — an event-driven promotion platform powering Walmart's digital offers, sustaining peak loads of ~150 events/sec through queue-based asynchronous processing.",
          "Built the platform's backend services and data layer from scratch on AWS — DynamoDB, SQS/SNS messaging, S3, and API Gateway — to support high-throughput event processing and real-time partner integrations.",
          "Authored Terraform modules to provision and version-control all infrastructure, enabling repeatable, auditable, and environment-parity deployments.",
          "Led cross-functional delivery across 3+ engineering teams, owning risk management, dependency mapping, and milestone tracking from design through production release.",
        ],
      },
    ],
    technologies: [
      "TypeScript",
      "Node.js",
      "AWS",
      "Lambda",
      "EC2",
      "API Gateway",
      "SQS",
      "SNS",
      "EventBridge",
      "CloudFront",
      "S3",
      "DynamoDB",
      "Terraform",
      "Datadog",
    ],
  },
  {
    name: "Xactly",
    location: "Denver, CO",
    roles: [
      {
        title: "Software Engineer",
        startDate: "Nov 2020",
        endDate: "May 2021",
        description: [
          "Built Node.js backend APIs and React UI components giving enterprise customers granular control over sales compensation data.",
          "Implemented feature flagging and A/B testing pipelines using Split.io, enabling safe, incremental rollouts of customer-facing features.",
        ],
      },
      {
        title: "Associate Software Engineer",
        startDate: "Nov 2018",
        endDate: "Oct 2020",
        description: [
          "Delivered REST APIs and SQL data migrations to support new product integrations across a multi-tenant SaaS platform.",
          "Built CI/CD pipelines in Jenkins to run multi-environment test suites, improving release reliability.",
        ],
      },
    ],
    technologies: ["Node.js", "React", "REST APIs", "SQL", "Split.io", "Jenkins"],
  },
  {
    name: "TrueCar",
    location: "Santa Monica, CA",
    roles: [
      {
        title: "Software Engineer, Intern",
        startDate: "Jun 2017",
        endDate: "Dec 2017",
        description: [
          "Contributed to feature development on TrueCar's automotive marketplace platform.",
        ],
      },
    ],
    technologies: [],
  },
];

/**
 * Mirrors the résumé's skill taxonomy.
 *
 * Items stay short and product-shaped on purpose: TechStack renders each one as
 * an icon chip and falls back to a two-letter badge when no icon matches, so
 * long descriptive phrases would render as a row of identical generic badges.
 */
export const skills: Skill[] = [
  {
    category: "Languages",
    items: ["TypeScript", "Node.js", "Python", "SQL", "Bash", "Terraform"],
  },
  {
    category: "Backend",
    items: [
      "REST APIs",
      "Event-Driven",
      "Message Queues",
      "Distributed Systems",
      "Service Integrations",
    ],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "DynamoDB", "S3", "Schema Migrations"],
  },
  {
    category: "Cloud & Infrastructure",
    items: [
      "AWS",
      "Lambda",
      "EC2",
      "API Gateway",
      "SQS",
      "SNS",
      "EventBridge",
      "CloudFront",
      "Docker",
      "Kubernetes",
      "CI/CD",
    ],
  },
  {
    category: "Reliability",
    items: ["Datadog", "Runscope", "BlazeMeter", "Load Testing", "On-Call"],
  },
  {
    category: "AI & Agents",
    items: ["Claude Code", "Claude API", "MCP", "Agents", "Skills", "Agentic Workflows"],
  },
];
