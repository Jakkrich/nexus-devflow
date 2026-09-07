import { test, expect } from "@playwright/test";

test.describe("Nexus-DevFlow Enterprise Dashboard & Workflow Visualizer", () => {
  test("loads dashboard and renders Archify visualizer, recommended skills, and active workspaces", async ({ page }) => {
    await page.goto("/");

    // 1. Title & Header Checks
    await expect(page).toHaveTitle(/Nexus-DevFlow Enterprise Dashboard/);
    const projectName = page.locator("#project-name");
    await expect(projectName).toBeVisible();

    // 2. Archify Dynamic Workflow Visualizer Panel
    const visualizerPanel = page.locator("#workflow-visualizer-panel");
    await expect(visualizerPanel).toBeVisible();

    const visualizerContainer = page.locator("#visualizer-container");
    await expect(visualizerContainer).toBeVisible();

    // Verify SVG is rendered
    const svg = visualizerContainer.locator("svg");
    await expect(svg).toBeVisible();

    // Verify Macro button is active by default
    const btnMacro = page.locator("#viz-btn-macro");
    await expect(btnMacro).toHaveClass(/on/);

    // Verify active stage is highlighted with .is-active and contains Active badge
    const activeStageNode = visualizerContainer.locator(".viz-stage-node.is-active");
    await expect(activeStageNode).toBeVisible();
    await expect(activeStageNode).toContainText(/Active/);

    // 3. Test View Switch to Micro Tickets DAG
    const btnMicro = page.locator("#viz-btn-micro");
    await btnMicro.click();
    await expect(btnMicro).toHaveClass(/on/);
    await expect(btnMacro).not.toHaveClass(/on/);

    // In micro view, SVG should still be visible
    await expect(visualizerContainer.locator("svg")).toBeVisible();

    // 4. Test View Switch to Code Graph
    const btnGraph = page.locator("#viz-btn-graph");
    await btnGraph.click();
    await expect(btnGraph).toHaveClass(/on/);
    const graphContainer = page.locator("#visualizer-graph-container");
    await expect(graphContainer).toBeVisible();

    // 5. Recommended Skills & Vendors Ecosystem Hub
    const skillsPanel = page.locator("#recommended-skills-panel");
    await expect(skillsPanel).toBeVisible();

    const skillsList = page.locator("#recommended-skills-list");
    await expect(skillsList).toBeVisible();

    // Should have skills rendered
    const skillCards = skillsList.locator(".skill-card");
    const count = await skillCards.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // 6. De-cluttering checks: No Legacy Dual-Track and No Swarm Tab
    const dualTrack = page.locator("#dual-track");
    await expect(dualTrack).toHaveCount(0);

    const swarmTab = page.locator("#tab-swarm");
    await expect(swarmTab).toHaveCount(0);

    // 7. Doctor Health Check
    const doctorList = page.locator("#doctor-list");
    await expect(doctorList).toBeVisible();
  });
});
