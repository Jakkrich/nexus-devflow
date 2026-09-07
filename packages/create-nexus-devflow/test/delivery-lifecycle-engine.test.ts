import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { HistoryLedger, DeliveryLifecycleEngine } from "../lib/delivery-lifecycle-engine.js";

describe("DeliveryLifecycleEngine - Ticket 01: HistoryLedger In-Memory Model", () => {
  const sampleMarkdown = `# Release History

Master delivery ledger tracking all released features, fixes, and rollbacks.

| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-07 | \`002-billing\` | feature | Stripe Invoicing | \`885f010\` | completed | [002-billing.md](features/002-billing.md) |
| 2026-09-06 | \`001-auth\` | feature | Authentication Module | \`109781a\` | completed | [001-auth.md](features/001-auth.md) |
`;

  it("parses 7-column Markdown history table into typed entries", () => {
    const ledger = HistoryLedger.parse(sampleMarkdown);
    assert.equal(ledger.entries.length, 2);

    assert.equal(ledger.entries[0].runId, "002-billing");
    assert.equal(ledger.entries[0].category, "feature");
    assert.equal(ledger.entries[0].title, "Stripe Invoicing");
    assert.equal(ledger.entries[0].gitCommit, "885f010");
    assert.equal(ledger.entries[0].status, "completed");
    assert.equal(ledger.entries[0].archiveLink, "features/002-billing.md");

    assert.equal(ledger.entries[1].runId, "001-auth");
  });

  it("finds, updates, and prepends entries deterministically", () => {
    const ledger = HistoryLedger.parse(sampleMarkdown);
    const found = ledger.find("001-auth");
    assert.ok(found);
    assert.equal(found?.title, "Authentication Module");

    const updated = ledger.update("001-auth", { title: "Auth Core" });
    assert.equal(updated, true);
    assert.equal(ledger.find("001-auth")?.title, "Auth Core");

    ledger.prepend({
      completedDate: "2026-09-08",
      runId: "003-dashboard",
      category: "feature",
      title: "Dashboard Studio",
      gitCommit: "9d3c650",
      status: "completed",
      archiveLink: "features/003-dashboard.md"
    });

    assert.equal(ledger.entries.length, 3);
    assert.equal(ledger.entries[0].runId, "003-dashboard");
  });

  it("serializes back to clean Markdown table preserving header and formatting", () => {
    const ledger = HistoryLedger.parse(sampleMarkdown);
    const serialized = ledger.serialize();
    assert.ok(serialized.includes("| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |"));
    assert.ok(serialized.includes("| 2026-09-07 | `002-billing` | feature | Stripe Invoicing | `885f010` | completed | [002-billing.md](features/002-billing.md) |"));
    assert.ok(serialized.includes("| 2026-09-06 | `001-auth` | feature | Authentication Module | `109781a` | completed | [001-auth.md](features/001-auth.md) |"));

    // Round-trip parse test
    const reParsed = HistoryLedger.parse(serialized);
    assert.equal(reParsed.entries.length, 2);
    assert.equal(reParsed.entries[0].runId, "002-billing");
  });
});

describe("DeliveryLifecycleEngine - Ticket 02: Core Archiving & Findings/Review Consolidation", () => {
  it("detects task category from living spec correctly", () => {
    const engine = new DeliveryLifecycleEngine();
    assert.equal(engine.detectTaskCategory("# Spec: Billing Integration\n\nCategory: feature"), "feature");
    assert.equal(engine.detectTaskCategory("# Fix: Fix Memory Leak\n\n**Category:** fix"), "fix");
    assert.equal(engine.detectTaskCategory("# Rollback: Revert Feature 002\n\nCategory: rollback"), "rollback");
    assert.equal(engine.detectTaskCategory("# Standard Living Spec\n\nNo explicit category"), "feature");
  });

  it("consolidates spec, findings, and review receipt into single immutable archive markdown", () => {
    const engine = new DeliveryLifecycleEngine();
    const baseSpec = `# 📐 [047-studio] Studio Feature\n\nStatus: completed\n\n## Implementation Tasks\n- [x] Task 1`;
    const findings = `# Findings Ledger\n\n### [F-01] Type mismatch\n- Status: resolved`;
    const review = `# Independent Review Receipt\n\n- Verdict: APPROVED\n- Reviewer: Fresh Subagent`;

    const consolidated = engine.consolidateArchiveContent(baseSpec, findings, review);
    assert.ok(consolidated.includes("Studio Feature"));
    assert.ok(consolidated.includes("## 📋 Audit Trail & Verification Receipts"));
    assert.ok(consolidated.includes("### Resolved Findings"));
    assert.ok(consolidated.includes("[F-01] Type mismatch"));
    assert.ok(consolidated.includes("### Independent Review Receipt"));
    assert.ok(consolidated.includes("Verdict: APPROVED"));
  });
});

describe("DeliveryLifecycleEngine - Ticket 03: Atomic Task Archiving & State Teardown", () => {
  it("atomically archives active feature task, updates ledger & build-plan, and tears down workspace", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-delivery-"));
    try {
      const taskDir = path.join(tempDir, "devflow", "context", "047-studio");
      await fs.mkdir(taskDir, { recursive: true });
      await fs.mkdir(path.join(tempDir, "devflow", "history"), { recursive: true });

      await fs.writeFile(
        path.join(taskDir, "spec.md"),
        `# 📐 [047-studio] Studio Feature\n\nStatus: ready\n\n## Tasks\n- [x] Task 1\n`,
        "utf8"
      );
      await fs.writeFile(
        path.join(taskDir, "findings.md"),
        `# Findings\n\n- All clean\n`,
        "utf8"
      );
      await fs.writeFile(
        path.join(tempDir, "devflow", "build-plan.md"),
        `# Master Build Plan\n\n- [ ] 047-studio: Studio Feature\n`,
        "utf8"
      );
      await fs.writeFile(
        path.join(tempDir, "devflow", "history", "HISTORY.md"),
        `| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |\n| --- | --- | --- | --- | --- | --- | --- |\n`,
        "utf8"
      );

      const engine = new DeliveryLifecycleEngine(tempDir);
      const result = await engine.archiveTask("047-studio", { gitCommit: "abc1234" });

      assert.equal(result.taskId, "047-studio");
      assert.equal(result.category, "feature");
      assert.equal(result.archivePath, "features/047-studio.md");
      assert.equal(result.contextCleaned, true);

      // Verify archive file exists and contains consolidated findings
      const archivedContent = await fs.readFile(result.fullArchivePath, "utf8");
      assert.ok(archivedContent.includes("Studio Feature"));
      assert.ok(archivedContent.includes("All clean"));

      // Verify task context directory was cleaned up
      await assert.rejects(fs.access(taskDir));

      // Verify HISTORY.md has new entry
      const historyContent = await fs.readFile(path.join(tempDir, "devflow", "history", "HISTORY.md"), "utf8");
      assert.ok(historyContent.includes("047-studio"));
      assert.ok(historyContent.includes("abc1234"));

      // Verify build-plan was checked off
      const buildPlanContent = await fs.readFile(path.join(tempDir, "devflow", "build-plan.md"), "utf8");
      assert.ok(buildPlanContent.includes("- [x] 047-studio: Studio Feature"));
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it("rolls back all changes if an error occurs during archiving", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-delivery-fail-"));
    try {
      const taskDir = path.join(tempDir, "devflow", "context", "048-failing");
      await fs.mkdir(taskDir, { recursive: true });
      await fs.mkdir(path.join(tempDir, "devflow", "history"), { recursive: true });

      const originalSpec = `# 📐 [048-failing] Failing Feature\n\nStatus: ready\n`;
      await fs.writeFile(path.join(taskDir, "spec.md"), originalSpec, "utf8");

      const originalHistory = `| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |\n| --- | --- | --- | --- | --- | --- | --- |\n`;
      await fs.writeFile(
        path.join(tempDir, "devflow", "history", "HISTORY.md"),
        originalHistory,
        "utf8"
      );

      // Create a file blocking directory creation to reliably simulate disk I/O error
      const blockerFile = path.join(tempDir, "blocker");
      await fs.writeFile(blockerFile, "file-not-dir", "utf8");

      const engine = new DeliveryLifecycleEngine(tempDir);
      await assert.rejects(
        engine.archiveTask("048-failing", {
          historyLedgerPath: path.join(blockerFile, "HISTORY.md")
        })
      );

      // Verify rollback: task context directory MUST still exist
      assert.equal(await fs.readFile(path.join(taskDir, "spec.md"), "utf8"), originalSpec);

      // Verify rollback: HISTORY.md was restored
      assert.equal(
        await fs.readFile(path.join(tempDir, "devflow", "history", "HISTORY.md"), "utf8"),
        originalHistory
      );
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});

describe("DeliveryLifecycleEngine - Ticket 04: DeliveryCommitPlan & Backward-Compatible History Facade", () => {
  it("generates conventional commit plan matching task category", () => {
    const engine = new DeliveryLifecycleEngine();
    const mockFeatureResult = {
      taskId: "047-studio",
      title: "Studio Feature",
      category: "feature" as const,
      archivePath: "features/047-studio.md",
      fullArchivePath: "/test/devflow/history/features/047-studio.md",
      ledgerEntry: {} as any,
      buildPlanUpdated: true,
      contextCleaned: true
    };

    const commitPlan = engine.generateCommitPlan(mockFeatureResult);
    assert.ok(commitPlan.commitMessage.startsWith("feat:"));
    assert.ok(commitPlan.commitMessage.includes("047-studio"));
    assert.ok(commitPlan.stagedPaths.includes("devflow/history/features/047-studio.md"));
    assert.ok(commitPlan.stagedPaths.includes("devflow/history/HISTORY.md"));
    assert.ok(commitPlan.stagedPaths.includes("devflow/build-plan.md"));

    const mockFixResult = { ...mockFeatureResult, taskId: "048-fix", category: "fix" as const, archivePath: "fixes/048-fix.md" };
    assert.ok(engine.generateCommitPlan(mockFixResult).commitMessage.startsWith("fix:"));

    const mockRollbackResult = { ...mockFeatureResult, taskId: "049-revert", category: "rollback" as const, archivePath: "rollbacks/049-revert.md" };
    assert.ok(engine.generateCommitPlan(mockRollbackResult).commitMessage.startsWith("revert:"));
  });

  it("verifies history.ts facade functions delegate cleanly and re-export DeliveryLifecycleEngine", async () => {
    const { readHistory, readHistoryLedger, formatHistoryHuman, DeliveryLifecycleEngine: ExportedEngine } = await import(
      "../lib/history.js"
    );

    assert.equal(typeof readHistory, "function");
    assert.equal(typeof readHistoryLedger, "function");
    assert.equal(typeof formatHistoryHuman, "function");
    assert.equal(typeof ExportedEngine, "function");
  });
});
