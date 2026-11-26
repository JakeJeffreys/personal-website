import { test } from "@playwright/test";
import { ROUTES } from "./routes";

// CI passes the routes a PR touched; locally, shoot everything.
const routes = process.env.SCREENSHOT_ROUTES
  ? process.env.SCREENSHOT_ROUTES.split(",").filter(Boolean)
  : ROUTES;

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1280, height: 800 },
};

const fileName = (route: string) => (route === "/" ? "home" : route.slice(1).replaceAll("/", "-"));

for (const route of routes) {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`${name} ${route}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // Cards fade in on scroll, so walk the page once before the full-page capture.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);

      await page.screenshot({ path: `screenshots/${name}-${fileName(route)}.png`, fullPage: true });
    });
  }
}
