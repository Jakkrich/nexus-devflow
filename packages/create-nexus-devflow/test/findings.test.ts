import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseFindings, readFindings } from "../lib/findings.js";

test("parseFindings parses findings and classifies blockers accurately", () => {
  const markdown = `
# Findings Ledger

### SEC-001 [P0] open - SQL Injection in search query
Needs parameterized query.

### PERF-001 [P1] fixed - Heavy bundle size
Needs re-verification.

### UX-001 [P2] unverified - Missing button focus state
Minor UI issue.

### DOC-001 [P3] closed - Typos in README
Already fixed.
`;

  const summary = parseFindings(markdown);
  assert.equal(summary.total, 4);
  assert.equal(summary.byStatus.open, 1);
  assert.equal(summary.byStatus.fixed, 1);
  assert.equal(summary.byStatus.unverified, 1);
  assert.equal(summary.byStatus.closed, 1);

  // Blockers are P0/P1 with status open/fixed
  assert.equal(summary.blockers.length, 2);
  assert.equal(summary.blockers[0].id, "SEC-001");
  assert.equal(summary.blockers[1].id, "PERF-001");
  assert.equal(summary.warnings.length, 0);
});

test("parseFindings detects malformed finding headings", () => {
  const markdown = `
### MALFORMED [P0] unknown_status - Invalid format
`;

  const summary = parseFindings(markdown);
  assert.equal(summary.total, 0);
  assert.equal(summary.warnings.length, 1);
  assert.equal(summary.warnings[0].code, "malformed_findings");
});

test("readFindings returns empty summary when findings file is missing", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-find-non-"));
  try {
    const summary = await readFindings(tempDir);
    assert.equal(summary.total, 0);
    assert.equal(summary.blockers.length, 0);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
