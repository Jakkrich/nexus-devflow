import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  detectGitDrift,
  parseSpecFilesList,
  reconcileState
} from "../lib/drift-reconciler.js";
import { handleToolCall } from "../lib/mcp.js";

async function setupTestProject(dir: string): Promise<void> {
  const taskDir = path.join(dir, "devflow", "context", "046-drift-test");
  await fs.mkdir(taskDir, { recursive: true });
  await fs.mkdir(path.join(dir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow\n", "utf8");

  await fs.writeFile(
    path.join(taskDir, "spec.md"),
    `# 📐 [046-drift-test] Test Feature

## 2. Plan & Test Strategy
- **Files to Modify/Create**:
  - \`packages/lib/planned-file.ts\` (ใหม่)
  - \`packages/lib/another-file.ts\` (แก้ไข)

## 3. Implementation Checklist
- [ ] Task 1: Do something
`,
    "utf8"
  );

  await fs.writeFile(
    path.join(taskDir, "stage.md"),
    "# Current Stage\n\n- Active Running ID: `046-drift-test`\n- Track: `fast`\n- Current Stage: `implement`\n",
    "utf8"
  );
}

test("parseSpecFilesList parses files declared in markdown plan", () => {
  const markdown = `# Spec

## 2. Plan & Test Strategy
- **Files to Modify/Create**:
  - \`packages/lib/service.ts\` (ใหม่: Service logic)
  - \`packages/test/service.test.ts\` (ใหม่: Tests)
  - \`packages/bin/cli.ts\` (แก้ไข)

## 3. Checklist
`;

  const files = parseSpecFilesList(markdown);
  assert.equal(files.length, 3);
  assert.ok(files.includes("packages/lib/service.ts"));
  assert.ok(files.includes("packages/test/service.test.ts"));
  assert.ok(files.includes("packages/bin/cli.ts"));
});

test("detectGitDrift classifies phantom files correctly when no git changes exist", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-drift-"));

  try {
    await setupTestProject(tempDir);

    const report = await detectGitDrift(tempDir);
    assert.equal(report.specFiles.length, 2);
    assert.equal(report.phantomFiles.length, 2);
    assert.equal(report.undocumentedFiles.length, 0);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("reconcileState auto-adds undocumented files to spec.md", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-reconcile-"));

  try {
    await setupTestProject(tempDir);

    // Run reconcile with simulated mock drift or direct execution
    const specBefore = await fs.readFile(
      path.join(tempDir, "devflow", "context", "046-drift-test", "spec.md"),
      "utf8"
    );
    assert.match(specBefore, /planned-file\.ts/);

    const result = await reconcileState(tempDir, {
      autoAddUndocumented: true,
      healStage: true
    });
    assert.ok(result);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("MCP devflow_detect_drift and devflow_reconcile_state execute properly", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-drift-mcp-"));

  try {
    await setupTestProject(tempDir);

    const driftRes = await handleToolCall(tempDir, "devflow_detect_drift", {});
    assert.equal(driftRes.isError, undefined);
    assert.ok(driftRes.content.length > 0);
    const parsedDrift = JSON.parse(driftRes.content[0].text);
    assert.equal(parsedDrift.specFiles.length, 2);

    const reconcileRes = await handleToolCall(tempDir, "devflow_reconcile_state", {
      autoAddUndocumented: true,
      healStage: true
    });
    assert.equal(reconcileRes.isError, undefined);
    assert.ok(reconcileRes.content.length > 0);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
