import { test, expect } from "@playwright/test";

test.describe("Chart Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("TC-05: Legend Visibility Toggle", async ({ page }) => {
    // Ensure we are on the first view (Bar & Donut)
    await page.getByRole("button", { name: "Bar & Donut" }).click();

    // Target "Top Coffee Brands (Bar)" chart card
    const card = page
      .locator(".bg-card")
      .filter({ hasText: "Top Coffee Brands (Bar)" });
    await expect(card).toBeVisible();

    // Find the legend item "Popularity" within this card
    const legendItem = card.getByText("Popularity");
    await expect(legendItem).toBeVisible();

    // Check if Bar is visible initially
    const bars = card.locator(".recharts-bar-rectangle path");
    await expect(bars.first()).toBeVisible();
    const initialCount = await bars.count();
    expect(initialCount).toBeGreaterThan(0);

    // Click legend item to toggle visibility
    await legendItem.click();

    // Verify legend item indicates hidden state (line-through)
    await expect(legendItem).toHaveClass(/line-through/);

    // Verify bars are hidden
    await expect(bars).toHaveCount(0);

    // Click again to show
    await legendItem.click();
    await expect(legendItem).not.toHaveClass(/line-through/);
    await expect(bars).toHaveCount(initialCount);
  });

  test("TC-06: Legend Color Change", async ({ page }) => {
    // Ensure we are on the first view
    await page.getByRole("button", { name: "Bar & Donut" }).click();

    // Target "Top Coffee Brands (Bar)" chart card
    const card = page
      .locator(".bg-card")
      .filter({ hasText: "Top Coffee Brands (Bar)" });

    // Target "Popularity" legend item container
    const legendContainer = card
      .locator("div.flex.items-center.gap-2")
      .filter({ hasText: "Popularity" })
      .first();

    // The button is the one with a rounded-full div inside
    const colorButton = legendContainer.locator("button");
    await colorButton.click();

    // The color input appears
    const colorInput = legendContainer.locator('input[type="color"]');
    await expect(colorInput).toBeVisible();

    // Change color to Red #FF0000
    await colorInput.fill("#ff0000");

    // Verify the bar color changes
    const firstBar = card.locator(".recharts-bar-rectangle path").first();
    await expect(firstBar).toHaveAttribute("fill", "#ff0000");
  });

  test("TC-07: Dual Axis Tooltip", async ({ page }) => {
    // Switch to Dual Axis view
    await page.getByRole("button", { name: "Dual Axis" }).click();

    // Target the "Coffee Consumption vs Bugs & Productivity" chart
    const card = page
      .locator(".bg-card")
      .filter({ hasText: "Coffee Consumption" });
    await expect(card).toBeVisible();

    const chartArea = card.locator(".recharts-wrapper");
    await expect(chartArea).toBeVisible();

    // Hover over the chart area
    // We try to hover over the center of the chart
    const box = await chartArea.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }

    // Verify tooltip appears
    const tooltip = page.locator(".recharts-tooltip-wrapper");
    await expect(tooltip).toBeVisible();

    // Verify tooltip content
    await expect(tooltip).toContainText("Bugs");
    await expect(tooltip).toContainText("Productivity");
  });
});
