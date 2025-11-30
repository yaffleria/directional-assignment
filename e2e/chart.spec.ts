import { test, expect } from "@playwright/test";

test.describe("Chart Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
  });

  test("TC-05: Legend Color Change Works", async ({ page }) => {
    // Go to Bar & Donut view
    await page.getByRole("button", { name: "Bar & Donut" }).click();
    await page.waitForTimeout(500);

    // Find the chart card
    const card = page
      .locator(".bg-card")
      .filter({ hasText: "Top Coffee Brands (Bar)" });
    await expect(card).toBeVisible();

    // Verify bars are initially visible
    const bars = card.locator(".recharts-bar-rectangle path");
    const initialCount = await bars.count();
    expect(initialCount).toBeGreaterThan(0);

    // Find the color change button (small colored circle in legend)
    const colorButtons = card.locator("button").locator("div.rounded-full");
    const firstColorButton = colorButtons.first();

    // Click to open color picker
    await firstColorButton.click();
    await page.waitForTimeout(300);

    // Find color input
    const colorInput = page.locator('input[type="color"]').first();
    await expect(colorInput).toBeVisible();

    // Change to red
    await colorInput.fill("#ff0000");
    await page.waitForTimeout(500);

    // Verify color changed
    const firstBar = bars.first();
    const fillColor = await firstBar.getAttribute("fill");
    expect(fillColor?.toLowerCase()).toBe("#ff0000");
  });

  test("TC-06: Charts Render Correctly", async ({ page }) => {
    // Test all three views render
    const views = ["Bar & Donut", "Stacked", "Dual Axis"];

    for (const viewName of views) {
      await page.getByRole("button", { name: viewName }).click();
      await page.waitForTimeout(800);

      // Verify at least one chart is visible
      const charts = page.locator(".recharts-wrapper");
      const chartCount = await charts.count();
      expect(chartCount).toBeGreaterThan(0);
    }
  });

  test("TC-07: Dual Axis Charts Display", async ({ page }) => {
    // Switch to Dual Axis
    await page.getByRole("button", { name: "Dual Axis" }).click();
    await page.waitForTimeout(1000);

    // Verify both dual-axis charts are present
    const coffeeChart = page
      .locator(".bg-card")
      .filter({ hasText: "Coffee Consumption" });
    const snackChart = page
      .locator(".bg-card")
      .filter({ hasText: "Snack Impact" });

    await expect(coffeeChart).toBeVisible();
    await expect(snackChart).toBeVisible();

    // Verify charts have rendered lines
    const lines = coffeeChart.locator(".recharts-line");
    const lineCount = await lines.count();
    expect(lineCount).toBeGreaterThan(0);
  });
});
