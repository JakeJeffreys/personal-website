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
        title: "Senior Platform Engineer",
        startDate: "Jan 2024",
        endDate: null,
        description: [
          "Led backend architecture, API development, and scalable database design for a partner network with millions of daily customers.",
          "Deployed extensible AWS infrastructure with Terraform, onboarding partners including DoorDash and Instacart.",
          "Architected an image delivery system via API Gateway, Lambda, S3, and CloudFront serving thousands of partners daily.",
          "Improved reliability with Datadog, Runscope, and BlazeMeter; participated in 24/7 on-call rotations.",
          "Won internal Hackathon with an image compression solution that cut data transfer costs by $100,000+ annually.",
          "Mentored new engineers, accelerating ramp-up and driving adoption of best practices.",
        ],
      },
      {
        title: "Platform Engineer",
        startDate: "Jun 2021",
        endDate: "Dec 2023",
        description: [
          "Developed and launched the Ibotta Performance Network to power Walmart's digital promotion platform.",
          "Built out AWS serverless infrastructure including Lambda, DynamoDB, S3, SNS, SQS, and API Gateway.",
          "Led cross-team projects, managing risks and dependencies from inception through release.",
        ],
      },
    ],
    technologies: ["AWS", "Lambda", "DynamoDB", "S3", "CloudFront", "API Gateway", "SNS", "SQS", "Terraform", "Python", "Node.js", "Datadog"],
  },
  {
    name: "Xactly",
    location: "Denver, CO",
    roles: [
      {
        title: "Software Engineer II",
        startDate: "Nov 2020",
        endDate: "May 2021",
        description: [
          "Developed new product features giving customers granular control of sales data.",
          "Integrated UI components into a React application and built supporting backend APIs.",
          "Implemented feature flagging, A/B testing, and beta testing pipelines using Split.io.",
          "Coached junior engineers in Git flow, code review, and API best practices.",
        ],
      },
      {
        title: "Software Engineer I",
        startDate: "Nov 2018",
        endDate: "Oct 2020",
        description: [
          "Migrated backend from Node.js to Java Spring, aligning acquired products with core platform architecture.",
          "Created CI pipelines in Jenkins to run multi-environment test suites, improving release confidence.",
          "Delivered REST APIs and performed SQL data migrations to support new functionality and integrations.",
        ],
      },
    ],
    technologies: ["React", "JavaScript", "Java", "Spring", "REST APIs", "Split.io", "Git", "Jenkins", "SQL"],
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
    technologies: ["JavaScript", "React", "REST APIs"],
  },
];

export const skills: Skill[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Java", "SQL", "Bash", "Python"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Java Spring", "REST APIs", "Docker", "Kubernetes"],
  },
  {
    category: "Infrastructure",
    items: ["AWS", "Lambda", "DynamoDB", "S3", "CloudFront", "API Gateway", "SNS", "SQS", "Terraform"],
  },
  {
    category: "Observability",
    items: ["Datadog", "Runscope", "BlazeMeter"],
  },
  {
    category: "AI & Agents",
    items: ["Claude Code", "Claude API", "Context Management", "MCP", "Agents", "Skills"],
  },
];
