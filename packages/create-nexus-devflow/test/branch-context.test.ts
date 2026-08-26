import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  calculateNextRunningId,
  cleanupBranchContext,
  cleanupRunContext,
  fuzzyMatchRunId,
  initBranchContext,
  initRunContext,
  listActiveRunContexts,
  listBranchContexts,
  resolveActiveContextPaths,
  resolveActiveRunContext,
  sanitizeBranchName
} from "../lib/branch-context.js";

async function setupTestProject(dir: string): Promise<void> {
  await fs.mkdir(path.join(dir, "devflow", "context"), { recursive: true });
  await fs.mkdir(path.join(dir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow\n", "utf8");
  await fs.writeFile(
    path.join(dir, "devflow", "context", "current-feature.md"),
    "# Current Feature\n\n_Nothing in progress. Run /feature, /fix, or /rollback to start._\n",
    "utf8"
  );
  await fs.writeFile(
    path.join(dir, "devflow", "context", "current-stage.md"),
    "# Current Stage\n\n- Track: `idle`\n- Current Stage: `idle`\n",
    "utf8"
  );
}

test("sanitizeBranchName produces clean cross-platform directory names", () => {
  assert.equal(sanitizeBranchName("feature/044-auth#login"), "feature-044-auth-login");
  assert.equal(sanitizeBranchName("feat/PAYMENT:v2.0"), "feat-payment-v2.0");
  assert.equal(sanitizeBranchName("fix/issue #123 (urgent)"), "fix-issue-123-urgent");
  assert.equal(sanitizeBranchName("///feature///nested///"), "feature-nested");
  assert.equal(sanitizeBranchName("feat*test?quoted\"pipe|name"), "feat-test-quoted-pipe-name");
  assert.equal(sanitizeBranchName("simple-branch"), "simple-branch");
});

test("resolveActiveContextPaths falls back to devflow/context on main or when no branch context exists", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-branch-fallback-"));

  try {
    await setupTestProject(tempDir);

    // Explicit main branch
    const mainPaths = await resolveActiveContextPaths(tempDir, "main");
    assert.equal(mainPaths.isBranchScoped, false);
    assert.equal(
      mainPaths.featureSpecPath,
      path.join(tempDir, "devflow", "context", "current-feature.md")
    );

    // Feature branch without branch isolation initialized
    const featPaths = await resolveActiveContextPaths(tempDir, "feature/044-auth");
    assert.equal(featPaths.isBranchScoped, false);
    assert.equal(
      featPaths.featureSpecPath,
      path.join(tempDir, "devflow", "context", "current-feature.md")
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("initBranchContext supports devflow/context/<branch>/ and .nexus/branches/<branch>/ end-to-end", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-branch-lifecycle-"));

  try {
    await setupTestProject(tempDir);

    const branch = "feature/044-user-auth";
    const customSpec = "# 📐 [044-user-auth] Authentication Module\n\n- [ ] Task 1: Setup auth\n";

    // 1. Initialize branch context in devflow/context/<sanitized>/
    const initPaths = await initBranchContext(tempDir, branch, customSpec, true);
    assert.equal(initPaths.isBranchScoped, true);
    assert.equal(initPaths.sanitizedBranch, "feature-044-user-auth");
    assert.ok(initPaths.featureSpecPath.includes(path.join("devflow", "context", "feature-044-user-auth")));

    // 2. List branch contexts
    const list = await listBranchContexts(tempDir);
    assert.equal(list.length, 1);
    assert.equal(list[0].branch, "feature-044-user-auth");
    assert.equal(list[0].hasSpec, true);
    assert.equal(list[0].type, "devflow");

    // 3. Resolve active context paths
    const resolved = await resolveActiveContextPaths(tempDir, branch);
    assert.equal(resolved.isBranchScoped, true);
    assert.equal(resolved.featureSpecPath, initPaths.featureSpecPath);

    // 4. Cleanup branch context
    const cleaned = await cleanupBranchContext(tempDir, branch);
    assert.equal(cleaned, true);

    // 5. Post-cleanup resolution returns to default fallback
    const postCleanup = await resolveActiveContextPaths(tempDir, branch);
    assert.equal(postCleanup.isBranchScoped, false);
    assert.equal(
      postCleanup.featureSpecPath,
      path.join(tempDir, "devflow", "context", "current-feature.md")
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("Multi-branch concurrency isolation in devflow/context/<branch>/ maintains distinct living specs", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-branch-multi-"));

  try {
    await setupTestProject(tempDir);

    const branchA = "feature/044-login";
    const branchB = "feature/045-payment";

    const specA = "# 📐 [044-login] Login Feature\n\n- [ ] Task A1: Auth login\n";
    const specB = "# 📐 [045-payment] Payment Gateway\n\n- [ ] Task B1: Stripe integration\n- [ ] Task B2: Webhook\n";

    await initBranchContext(tempDir, branchA, specA, true);
    await initBranchContext(tempDir, branchB, specB, true);

    const pathsA = await resolveActiveContextPaths(tempDir, branchA);
    const pathsB = await resolveActiveContextPaths(tempDir, branchB);

    assert.notEqual(pathsA.featureSpecPath, pathsB.featureSpecPath);
    assert.ok(pathsA.featureSpecPath.includes(path.join("devflow", "context", "feature-044-login")));
    assert.ok(pathsB.featureSpecPath.includes(path.join("devflow", "context", "feature-045-payment")));

    const contentA = await fs.readFile(pathsA.featureSpecPath, "utf8");
    const contentB = await fs.readFile(pathsB.featureSpecPath, "utf8");

    assert.match(contentA, /044-login/);
    assert.match(contentB, /045-payment/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("Multi-Run Context Resolver: initRunContext, listActiveRunContexts, fuzzyMatchRunId, and cleanupRunContext", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-multirun-"));

  try {
    await setupTestProject(tempDir);

    // 1. Create two run contexts
    const run1 = await initRunContext(tempDir, "012-devflow-ide-core", "DevFlow IDE Core Extension", {
      branch: "feature/012-devflow-ide-core",
      track: "fast",
      initialSpec: "# 📐 [012-devflow-ide-core] Core Extension\n\n## 3. Implementation Checklist\n- [ ] Task 1: Setup tree view\n- [ ] Task 2: Command palette\n"
    });

    const run2 = await initRunContext(tempDir, "013-kanban-board", "Kanban Board UI", {
      branch: "feature/013-kanban-board",
      track: "fast",
      initialSpec: "# 📐 [013-kanban-board] Kanban UI\n\n## 3. Implementation Checklist\n- [x] Task 1: Render columns\n- [ ] Task 2: Drag and drop\n"
    });

    assert.equal(run1.isMultiRun, true);
    assert.equal(run1.runId, "012-devflow-ide-core");
    assert.ok(run1.specPath.endsWith(path.join("devflow", "context", "012-devflow-ide-core", "spec.md")));

    // 2. List all active run contexts
    const activeList = await listActiveRunContexts(tempDir);
    assert.equal(activeList.length, 2);

    const r1 = activeList.find((r) => r.runId === "012-devflow-ide-core");
    const r2 = activeList.find((r) => r.runId === "013-kanban-board");
    assert.ok(r1 && r2);
    assert.equal(r1.totalTasks, 2);
    assert.equal(r1.completedTasks, 0);
    assert.equal(r2.totalTasks, 2);
    assert.equal(r2.completedTasks, 1);

    // 3. Fuzzy matching
    assert.equal(fuzzyMatchRunId("12", activeList)?.runId, "012-devflow-ide-core");
    assert.equal(fuzzyMatchRunId("012", activeList)?.runId, "012-devflow-ide-core");
    assert.equal(fuzzyMatchRunId("core", activeList)?.runId, "012-devflow-ide-core");
    assert.equal(fuzzyMatchRunId("13", activeList)?.runId, "013-kanban-board");
    assert.equal(fuzzyMatchRunId("kanban", activeList)?.runId, "013-kanban-board");
    assert.equal(fuzzyMatchRunId("999", activeList), null);

    // 4. Resolve active run context by ID, fuzzy input, or branch
    const resolvedByExact = await resolveActiveRunContext(tempDir, "012-devflow-ide-core");
    assert.equal(resolvedByExact.isMultiRun, true);
    assert.equal(resolvedByExact.runId, "012-devflow-ide-core");

    const resolvedByFuzzy = await resolveActiveRunContext(tempDir, "13");
    assert.equal(resolvedByFuzzy.isMultiRun, true);
    assert.equal(resolvedByFuzzy.runId, "013-kanban-board");

    // 5. Cleanup run context
    const cleaned = await cleanupRunContext(tempDir, "012-devflow-ide-core");
    assert.equal(cleaned, true);

    const postList = await listActiveRunContexts(tempDir);
    assert.equal(postList.length, 1);
    assert.equal(postList[0].runId, "013-kanban-board");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("calculateNextRunningId accounts for history archives and active run contexts", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-nextid-"));

  try {
    await setupTestProject(tempDir);

    // Create history archives
    await fs.mkdir(path.join(tempDir, "devflow", "history", "features"), { recursive: true });
    await fs.mkdir(path.join(tempDir, "devflow", "history", "fixes"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "devflow", "history", "features", "055-dashboard-fix.md"), "# 055\n", "utf8");
    await fs.writeFile(path.join(tempDir, "devflow", "history", "fixes", "056-auth-fix.md"), "# 056\n", "utf8");

    // Without active runs: next is 057
    const next1 = await calculateNextRunningId(tempDir);
    assert.equal(next1, "057");

    // Add active run 057-some-feature
    await initRunContext(tempDir, "057-some-feature", "Some Feature");
    const next2 = await calculateNextRunningId(tempDir);
    assert.equal(next2, "058");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

