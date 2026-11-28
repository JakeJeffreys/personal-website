export type Experiment = {
  slug: string;
  title: string;
  blurb: string;
  // ISO date (YYYY-MM-DD) the experiment was added
  added: string;
};

// Newest first. Each slug has a page at src/app/lab/<slug>/page.tsx.
export const experiments: Experiment[] = [
  {
    slug: "pipeline",
    title: "Agent pipeline",
    blurb: "How an issue from my phone becomes a live page, step by step.",
    added: "2026-11-28",
  },
  {
    slug: "dice",
    title: "Dice",
    blurb: "Roll one to six dice and see the total.",
    added: "2026-11-27",
  },
];
