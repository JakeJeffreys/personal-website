import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);
// Set BASE_URL to test a deployed site (the production smoke test) instead of a local `next start`.
const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL ?? `http://localhost:${PORT}`,
    // Ubuntu runners ship Google Chrome, so CI skips the Playwright browser download.
    channel: "chrome",
  },
  webServer: BASE_URL
    ? undefined
    : {
        command: `bun run start --port ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
        timeout: 60_000,
      },
  projects: [
    {
      name: "mobile",
      testMatch: "smoke.spec.ts",
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    {
      name: "desktop",
      testMatch: "smoke.spec.ts",
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: "screenshots",
      testMatch: "screenshots.spec.ts",
    },
  ],
});
