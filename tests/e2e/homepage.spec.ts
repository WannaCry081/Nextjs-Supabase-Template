import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Check if page loaded with content
    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(0);
  });

  test("should display page content", async ({ page }) => {
    await page.goto("/");

    // Check if the body has content
    await expect(page.locator("body")).toBeVisible();
  });

  test("should have navigation", async ({ page }) => {
    await page.goto("/");

    // Check for nav element
    const nav = page.locator("nav");
    const navExists = await nav.count();
    expect(navExists).toBeGreaterThan(0);
  });

  test("should not have 404 status", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);
  });

  test("should be responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const body = page.locator("body");
    await expect(body).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(body).toBeVisible();
  });
});
