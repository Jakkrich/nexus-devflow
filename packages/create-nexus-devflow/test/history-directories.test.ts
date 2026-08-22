import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { parseHistoryLedger, readHistory } from "../lib/history.js";

test("readHistory includes file and directory-based archives", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-history-dirs-"));
  try {
    const features = path.join(tempDir, "devflow", "history", "features");
    await fs.mkdir(path.join(features, "002-deep-run"), { recursive: true });
    await fs.writeFile(path.join(features, "001-fast.md"), "# [001] Feature: Fast archive\n**Status:** Completed");
    await fs.writeFile(path.join(features, "002-deep-run", "60-report.md"), "# [002] Feature: Deep archive\n**Status:** Released");
    const summary = await readHistory(tempDir);
    assert.equal(summary.total, 2);
    assert.deepEqual(summary.items.map((item) => item.title), ["Deep archive", "Fast archive"]);
    assert.match(summary.items[0].file, /002-deep-run[\\/]60-report\.md$/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("parseHistoryLedger uses the master release log as authoritative history", () => {
  const items = parseHistoryLedger(`# History
| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |
| 2026-08-22 | \`040\` | Feature | Dashboard parity | \`HEAD\` | \`Released\` | [report](features/040-dashboard.md) |
| 2026-08-21 | \`039\` | Fix | Parser repair | \`abc1234\` | \`Released\` | [report](fixes/039-parser.md) |`);
  assert.equal(items.length, 2);
  assert.deepEqual(items.map((item) => item.buildPlanItem), ["040", "039"]);
  assert.equal(items[1].type, "fix");
  assert.equal(items[0].file, "features/040-dashboard.md");
});
