const { expect, test } = require("@playwright/test");

test("home page renders the primary sections", async ({ page }) => {
  await page.goto("/fr");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main").first()).toBeVisible();
  await expect(page.locator('img[src*="/images/display-sample/"]').first()).toBeVisible();
  await expect(page.locator('img[src*="/images/curator-favorites/"]').first()).toBeVisible();
});

test("footer exposes legal links", async ({ page }) => {
  await page.goto("/fr");

  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.locator('footer a[href*="/terms"]')).toBeVisible();
  await expect(page.locator('footer a[href*="/refund-shipping-commission"]')).toBeVisible();
});
