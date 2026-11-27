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
    slug: "dice",
    title: "Dice",
    blurb: "Roll one to six paper dice and see the total.",
    added: "2026-11-27",
  },
];
