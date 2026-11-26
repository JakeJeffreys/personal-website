import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "./routes";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    // Vercel Analytics only exists on Vercel; under `next start` its script 404s.
    if (msg.type() === "error" && !msg.location().url.includes("/_vercel/")) {
      errors.push(msg.text());
    }
  });
  return errors;
}

for (const route of ROUTES) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors = collectErrors(page);

    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main :is(h1, h2)").first()).toBeAttached();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, "page scrolls horizontally").toBeLessThanOrEqual(0);

    expect(errors).toEqual([]);
  });
}

test("unknown routes get the 404 page", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Address unknown")).toBeVisible();
});
