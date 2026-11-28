import type { MetadataRoute } from "next";
import { experiments } from "./lab/experiments";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://jakejeffreys.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://jakejeffreys.dev/lab",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://jakejeffreys.dev/work",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://jakejeffreys.dev/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...experiments.map((exp) => ({
      url: `https://jakejeffreys.dev/lab/${exp.slug}`,
      lastModified: new Date(exp.added),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}
