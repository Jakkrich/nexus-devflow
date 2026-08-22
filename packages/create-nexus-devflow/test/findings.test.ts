import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  addFinding,
  formatFindingsHuman,
  parseFindings,
  readFindings,
  resolveFinding
} from "../lib/findings.js";

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

test("resolveFinding updates finding status in devflow/context/findings.md", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-resolve-"));
  const findingsDir = path.join(tempDir, "devflow", "context");
  await fs.mkdir(findingsDir, { recursive: true });
  const findingsFile = path.join(findingsDir, "findings.md");

  await fs.writeFile(
    findingsFile,
    `# Findings Ledger\n\n### BUG-001 [P1] open - Critical crash on startup\n\n### BUG-002 [P2] unverified - Minor glitch\n`,
    "utf8"
  );

  try {
    const res = await resolveFinding(tempDir, "BUG-001", "closed");
    assert.equal(res.success, true);
    assert.equal(res.previousStatus, "open");
    assert.equal(res.finding?.status, "closed");

    const content = await fs.readFile(findingsFile, "utf8");
    assert.match(content, /### BUG-001 \[P1\] closed - Critical crash on startup/);

    const notFound = await resolveFinding(tempDir, "BUG-999", "closed");
    assert.equal(notFound.success, false);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("formatFindingsHuman formats findings for CLI output", () => {
  const summary = parseFindings(`
# Findings Ledger

### SEC-001 [P0] open - SQL Injection
### UX-001 [P2] closed - Fixed button
`);
  const text = formatFindingsHuman(summary);
  assert.match(text, /Findings Ledger \(2 total, 1 blockers\)/);
  assert.match(text, /SEC-001/);
  assert.match(text, /UX-001/);

  const blockersOnlyText = formatFindingsHuman(summary, { blockersOnly: true });
  assert.match(blockersOnlyText, /Findings Blockers \(1 active P0\/P1\)/);
  assert.match(blockersOnlyText, /SEC-001/);
});

test("addFinding creates findings file and appends new finding with auto ID", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-add-find-"));
  try {
    const res = await addFinding(tempDir, "Unsanitized user input in search", {
      severity: "P1",
      location: "src/search.ts:42",
      impact: "Potential XSS vulnerability",
      remediation: "Escape HTML before rendering"
    });

    assert.equal(res.success, true);
    assert.equal(res.finding?.id, "FIND-001");
    assert.equal(res.finding?.severity, "P1");
    assert.equal(res.finding?.status, "open");

    const summary = await readFindings(tempDir);
    assert.equal(summary.total, 1);
    assert.equal(summary.items[0].id, "FIND-001");
    assert.equal(summary.items[0].severity, "P1");
    assert.equal(summary.blockers.length, 1);

    // Second finding auto-increments to FIND-002
    const res2 = await addFinding(tempDir, "Minor typo in logs", {
      severity: "P3"
    });
    assert.equal(res2.success, true);
    assert.equal(res2.finding?.id, "FIND-002");
    assert.equal(res2.finding?.severity, "P3");

    const summary2 = await readFindings(tempDir);
    assert.equal(summary2.total, 2);
    assert.equal(summary2.blockers.length, 1);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("addFinding respects custom ID and explicit status", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-custom-find-"));
  try {
    const res = await addFinding(tempDir, "Hardcoded private key", {
      id: "SEC-999",
      severity: "P0",
      status: "unverified"
    });

    assert.equal(res.success, true);
    assert.equal(res.finding?.id, "SEC-999");
    assert.equal(res.finding?.severity, "P0");
    assert.equal(res.finding?.status, "unverified");

    const summary = await readFindings(tempDir);
    assert.equal(summary.total, 1);
    assert.equal(summary.items[0].id, "SEC-999");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

