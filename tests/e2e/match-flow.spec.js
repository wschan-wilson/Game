import { test, expect } from "@playwright/test";

test("completes a full match flow", async ({ page }) => {
  await page.goto("/?roundSeconds=1");

  await page.locator("#username-input").fill("Player One");
  await page.locator("#confirm-username").click();
  await page.locator("#proceed-setup").click();

  for (let round = 1; round <= 25; round += 1) {
    if (await page.locator("#final-message").count() > 0) {
      break;
    }

    await expect(page.locator("#round-input")).toBeVisible();
    await expect(page.getByRole("heading", { name: new RegExp(`Round ${round} results`) })).toBeVisible({ timeout: 35_000 });
    await page.locator("#proceed-next-round").click();
  }

  await expect(page.locator("#final-message")).toBeVisible();
  await expect(page.locator("#final-message")).toContainText(/Congratulations|Well played/);
  await expect(page.locator("canvas.chart")).toBeVisible();
});
