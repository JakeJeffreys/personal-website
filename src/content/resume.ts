export interface Job {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null; // null = present
  description: string[];
  technologies: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export const jobs: Job[] = [
  {
    title: "Senior Platform Engineer",
    company: "Ibotta",
    location: "Denver, CO",
    startDate: "Jan 2024",
    endDate: null,
    description: [
      "Led backend architecture and API development — Lambda handlers, messaging layers, and scalable database design — supporting a partner network with millions of daily customers.",
      "Designed and deployed extensible AWS infrastructure with Terraform, enabling seamless onboarding of new grocery partners including DoorDash and Instacart.",
      "Architected an image storage and delivery system using API Gateway, Lambda, S3, and CloudFront to serve thousands of low-latency, high-fidelity product images to partners per day.",
      "Enhanced reliability through Datadog monitoring, Runscope testing suites, and BlazeMeter performance tests; participated in 24/7 on-call rotations.",
      "Led the winning internal Hackathon project — an image resizing and compression solution that reduced data transfer costs by over $100,000 annually.",
      "Mentored multiple new engineers, accelerating ramp-up time and fostering adoption of best practices.",
    ],
    technologies: ["AWS", "Lambda", "DynamoDB", "S3", "CloudFront", "API Gateway", "Terraform", "Datadog", "Python", "Node.js"],
  },
  {
    title: "Platform Engineer",
    company: "Ibotta",
    location: "Denver, CO",
    startDate: "Jun 2021",
    endDate: "Dec 2023",
    description: [
      "Developed and launched the Ibotta Performance Network to power Walmart's digital promotion platform.",
      "Built out AWS serverless infrastructure including Lambda, DynamoDB, S3, SNS, SQS, and API Gateway.",
      "Led cross-team projects, managing risks and dependencies from inception through release.",
    ],
    technologies: ["AWS", "Lambda", "DynamoDB", "SNS", "SQS", "API Gateway", "S3", "Node.js", "Terraform"],
  },
  {
    title: "Software Engineer II",
    company: "Xactly",
    location: "Denver, CO",
    startDate: "Nov 2020",
    endDate: "May 2021",
    description: [
      "Developed new product features giving customers granular control of sales data.",
      "Integrated UI components into a React application and built supporting backend APIs.",
      "Implemented feature flagging, A/B testing, and beta testing pipelines using Split.io.",
      "Coached junior engineers in Git flow, code review, and API best practices.",
    ],
    technologies: ["React", "JavaScript", "Java", "REST APIs", "Split.io", "Git"],
  },
  {
    title: "Software Engineer I",
    company: "Xactly",
    location: "Denver, CO",
    startDate: "Nov 2018",
    endDate: "Oct 2020",
    description: [
      "Migrated backend from Node.js to Java Spring, aligning acquired products with core platform architecture.",
      "Created CI pipelines in Jenkins to run multi-environment test suites, improving release confidence.",
      "Delivered REST APIs and performed SQL data migrations to support new functionality and integrations.",
    ],
    technologies: ["Java", "Spring", "Node.js", "Jenkins", "SQL", "REST APIs"],
  },
  {
    title: "Software Engineer, Intern",
    company: "TrueCar",
    location: "Santa Monica, CA",
    startDate: "Jun 2017",
    endDate: "Dec 2017",
    description: [
      "Contributed to feature development on TrueCar's automotive marketplace platform.",
    ],
    technologies: ["JavaScript", "React", "REST APIs"],
  },
];

export const skills: Skill[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Java", "SQL", "Bash"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Java Spring", "REST APIs", "Docker", "Kubernetes"],
  },
  {
    category: "Infrastructure",
    items: ["AWS", "Lambda", "DynamoDB", "S3", "CloudFront", "API Gateway", "SNS", "SQS", "EventBridge", "Terraform"],
  },
  {
    category: "Observability",
    items: ["Datadog", "Runscope", "BlazeMeter"],
  },
  {
    category: "AI & Agents",
    items: ["Claude Code", "Claude API", "MCP", "Agent SDK", "Skills"],
  },
];
