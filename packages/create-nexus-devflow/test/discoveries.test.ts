import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { parseDiscovery, readDiscoveries } from "../lib/discoveries.js";

test("parseDiscovery reads identity and approved decision", () => {
  const item = parseDiscovery(`# Discovery Document: [DISC-20260822-008] Dashboard Parity
> **Discovery ID**: \`DISC-20260822-008\`
> **Date**: 2026-08-22
> **Status**: \`Proceed (Ready)\`
> **Approval Status**: \`Approved\`
### Final Decision: \`Proceed\``, "folder/00-explore.md", "fallback");
  assert.equal(item.id, "DISC-20260822-008");
  assert.equal(item.title, "Dashboard Parity");
  assert.equal(item.decision, "Proceed");
  assert.equal(item.approvalStatus, "Approved");
});

test("readDiscoveries returns recent items and handles discovery.md or 00-explore.md", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-discoveries-"));
  try {
    assert.equal((await readDiscoveries(tempDir)).total, 0);
    const dir1 = path.join(tempDir, "devflow", "discoveries", "DISC-20260822-001-one");
    await fs.mkdir(dir1, { recursive: true });
    await fs.writeFile(path.join(dir1, "discovery.md"), "# Discovery Document: [DISC-20260822-001] One\n> **Status**: `Defer`");

    const dir2 = path.join(tempDir, "devflow", "discoveries", "DISC-20260822-002-two");
    await fs.mkdir(dir2, { recursive: true });
    await fs.writeFile(path.join(dir2, "00-explore.md"), "# Discovery Document: [DISC-20260822-002] Two\n> **Status**: `Proceed`");

    const summary = await readDiscoveries(tempDir, "DISC-20260822-001");
    assert.equal(summary.total, 2);
    assert.equal(summary.active?.decision, "Defer");
    assert.equal(summary.recent.find((item) => item.id === "DISC-20260822-002")?.decision, "Proceed");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
