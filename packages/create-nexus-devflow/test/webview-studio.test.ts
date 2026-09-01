import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { renderStudioHtml } from "../lib/webview-studio.js";
import { handleToolCall } from "../lib/mcp.js";

async function setupTestProject(dir: string): Promise<void> {
  await fs.mkdir(path.join(dir, "devflow", "context"), { recursive: true });
  await fs.mkdir(path.join(dir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow\n", "utf8");

  await fs.writeFile(
    path.join(dir, "devflow", "context", "current-feature.md"),
    `# 📐 [047-studio] Studio Feature

## 3. Implementation Checklist
- [x] Task 1: Webview HTML
- [ ] Task 2: Unit tests
`,
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "devflow", "context", "current-stage.md"),
    "# Current Stage\n\n- Active Running ID: `047-studio`\n- Track: `fast`\n- Current Stage: `implement`\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "devflow", "ideas.md"),
    `# Ideas Inbox

### [IDEA-001] AI Assistant
- Feasibility: High, Value: High
`,
    "utf8"
  );
}

test("renderStudioHtml renders self-contained 3-Pillars Webview Studio HTML", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-studio-"));

  try {
    await setupTestProject(tempDir);

    const html = await renderStudioHtml(tempDir);
    assert.ok(html.includes("<!DOCTYPE html>"));
    assert.ok(html.includes("Nexus-DevFlow Studio"));
    assert.ok(html.includes("🔮 Future (Ideas Inbox)"));
    assert.ok(html.includes("⚡ Present (Active Living Spec)"));
    assert.ok(html.includes("📦 Past (History Archives)"));
    assert.ok(html.includes("/feature"));
    assert.ok(html.includes("/implement"));
    assert.ok(html.includes("/check"));
    assert.ok(html.includes("/complete"));
    assert.ok(html.includes("dispatchCommand"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("MCP devflow_get_studio_html returns full studio HTML payload", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-studio-mcp-"));

  try {
    await setupTestProject(tempDir);

    const res = await handleToolCall(tempDir, "devflow_get_studio_html", { theme: "dark" });
    assert.equal(res.isError, undefined);
    assert.ok(res.content.length > 0);
    assert.ok(res.content[0].text.includes("<!DOCTYPE html>"));
    assert.ok(res.content[0].text.includes("data-theme=\"dark\""));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("renderStudioHtml renders all active runs when multi-task context directories exist", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-studio-multitask-"));

  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context", "001-auth"), { recursive: true });
    await fs.mkdir(path.join(tempDir, "devflow", "context", "002-billing"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow\n", "utf8");

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "001-auth", "spec.md"),
      `# 📐 [001-auth] Authentication Module\n\n## 3. Implementation Checklist\n- [x] Task 1: JWT\n- [ ] Task 2: Login UI\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "001-auth", "stage.md"),
      "# Current Stage\n\n- Active Running ID: `001-auth`\n- Status: `implementing`\n",
      "utf8"
    );

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "002-billing", "spec.md"),
      `# 📐 [002-billing] Stripe Invoicing\n\n## 3. Implementation Checklist\n- [ ] Task 1: Webhook\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "002-billing", "stage.md"),
      "# Current Stage\n\n- Active Running ID: `002-billing`\n- Status: `spec_ready`\n",
      "utf8"
    );

    const html = await renderStudioHtml(tempDir);
    assert.ok(html.includes("001-auth"));
    assert.ok(html.includes("Authentication Module"));
    assert.ok(html.includes("002-billing"));
    assert.ok(html.includes("Stripe Invoicing"));
    assert.ok(html.includes("/implement 001-auth"));
    assert.ok(html.includes("/implement 002-billing"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

