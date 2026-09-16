import { test, expect } from "@playwright/test";
import path from "path";
import { pathToFileURL } from "url";

test.describe("Nexus-DevFlow Static Documentation & Landing Website", () => {
  const docsIndexPath = pathToFileURL(path.resolve("./docs/index.html")).href;
  const docsGettingStartedPath = pathToFileURL(path.resolve("./docs/getting-started/index.html")).href;
  const docsUpdatesPath = pathToFileURL(path.resolve("./docs/updates/index.html")).href;

  test("1. Landing Page UI: renders Hero, 4-Stage Loop, 3D Tilted Cards, and Command Suite", async ({ page }) => {
    await page.goto(docsIndexPath);

    // Title & Meta
    await expect(page).toHaveTitle(/Nexus-DevFlow - Build with AI, stay in control/);

    // Hero Section
    const heroTitle = page.locator("h1");
    await expect(heroTitle).toContainText("Build with AI");
    await expect(heroTitle).toContainText("Stay in control");

    // Copy CLI button
    const copyButton = page.locator("[data-copy-command]").first();
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toContainText("npx -y nexus-devflow -y");

    // Workflow Loop Window
    const codeWindow = page.locator(".code-window");
    await expect(codeWindow).toBeVisible();
    await expect(codeWindow).toContainText("/feature");
    await expect(codeWindow).toContainText("/implement");
    await expect(codeWindow).toContainText("/check");
    await expect(codeWindow).toContainText("/complete");

    // Works with ribbon
    const ribbon = page.locator("section:has-text('WORKS WITH')");
    await expect(ribbon).toBeVisible();
    await expect(ribbon).toContainText("ANTIGRAVITY");
    await expect(ribbon).toContainText("CLAUDE CODE");
    await expect(ribbon).toContainText("CODEX");

    // 3-Pillars file stack cards
    const fileCards = page.locator(".file-card");
    const count = await fileCards.count();
    expect(count).toBeGreaterThanOrEqual(4);

    // Dashboard Tilter
    const tilter = page.locator("[data-dashboard-tilter]");
    await expect(tilter).toBeVisible();

    // FAQ Accordion
    const faq = page.locator("#faq details");
    await expect(faq.first()).toBeVisible();
    await expect(faq.first()).toHaveAttribute("open", "");
  });

  test("2. Documentation Page: renders 3-column layout, Sidebar Navigation, and TOC", async ({ page }) => {
    await page.goto(docsGettingStartedPath);

    await expect(page).toHaveTitle(/Getting Started - Nexus-DevFlow Documentation/);

    // 3-column Shell elements
    const sidebar = page.locator(".docs-sidebar");
    await expect(sidebar).toBeVisible();
    await expect(sidebar).toContainText("The 3-Pillars Model");
    await expect(sidebar).toContainText("The 4-Stage Lifecycle");

    const mainContent = page.locator(".docs-main");
    await expect(mainContent).toBeVisible();
    await expect(mainContent.locator("h1")).toContainText("Getting Started");

    const toc = page.locator(".docs-toc");
    await expect(toc).toBeVisible();
    await expect(toc).toContainText("On this page");
  });

  test("3. Updates & Changelog Page: renders release history timeline", async ({ page }) => {
    await page.goto(docsUpdatesPath);

    await expect(page).toHaveTitle(/Updates & Changelog - Nexus-DevFlow/);
    const updatesHeading = page.locator("h1");
    await expect(updatesHeading).toContainText("Release Updates");

    const releaseBadges = page.locator("article span");
    await expect(releaseBadges.first()).toContainText("v2.18.0");
  });
});
