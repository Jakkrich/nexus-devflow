import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseHistoryItem, readHistory } from "../lib/history.js";

test("parseHistoryItem parses markdown metadata correctly", () => {
  const markdown = `# Feature: Add User Authentication
**From build-plan:** feature 001
**Status:** Released

Implementation notes here.
`;

  const item = parseHistoryItem(markdown, "feature", "features/001-auth.md");
  assert.equal(item.type, "feature");
  assert.equal(item.title, "Add User Authentication");
  assert.equal(item.buildPlanItem, "001");
  assert.equal(item.status, "Released");
});

test("readHistory returns summary of history directory", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-test-history-"));
  try {
    const featuresDir = path.join(tempDir, "devflow", "history", "features");
    await fs.mkdir(featuresDir, { recursive: true });
    await fs.writeFile(
      path.join(featuresDir, "001-feature.md"),
      "# [001] Feature: Test Feature\n**Status:** Released\n"
    );

    const history = await readHistory(tempDir);
    assert.equal(history.total, 1);
    assert.equal(history.items[0].type, "feature");
    assert.equal(history.items[0].title, "Test Feature");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("parseHistoryItem and readHistory handle sub-feature IDs with alpha suffixes (4a, 4b)", async () => {
  const markdownA = `# [038a] Feature: Backend Schema & API
**Status:** Released
`;
  const markdownB = `# [038b] Feature: Frontend UI & Client State
**Status:** Released
`;

  const itemA = parseHistoryItem(markdownA, "feature", "features/038a-backend-schema.md");
  const itemB = parseHistoryItem(markdownB, "feature", "features/038b-frontend-ui.md");

  assert.equal(itemA.buildPlanItem, "038a");
  assert.equal(itemA.title, "Backend Schema & API");
  assert.equal(itemB.buildPlanItem, "038b");
  assert.equal(itemB.title, "Frontend UI & Client State");

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-test-subfeature-"));
  try {
    const featuresDir = path.join(tempDir, "devflow", "history", "features");
    await fs.mkdir(featuresDir, { recursive: true });
    await fs.writeFile(path.join(featuresDir, "038a-backend-schema.md"), markdownA);
    await fs.writeFile(path.join(featuresDir, "038b-frontend-ui.md"), markdownB);

    const history = await readHistory(tempDir);
    assert.equal(history.total, 2);
    // Should be sorted in descending order: 038b then 038a
    assert.equal(history.items[0].buildPlanItem, "038b");
    assert.equal(history.items[1].buildPlanItem, "038a");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

