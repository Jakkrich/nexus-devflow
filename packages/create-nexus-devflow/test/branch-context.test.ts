import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  cleanupBranchContext,
  initBranchContext,
  listBranchContexts,
  resolveActiveContextPaths,
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
