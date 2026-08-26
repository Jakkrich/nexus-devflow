import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildCodeGraph, calculateBlastRadius } from "../lib/code-graph.js";
import { generateSwarmPlan } from "../lib/swarm-orchestrator.js";
import { handleToolCall } from "../lib/mcp.js";

async function setupTestCodebase(dir: string): Promise<void> {
  const taskDir = path.join(dir, "devflow", "context", "048-swarm-test");
  await fs.mkdir(taskDir, { recursive: true });
  await fs.mkdir(path.join(dir, "src"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow\n", "utf8");

  // Create modular codebase files
  await fs.writeFile(
    path.join(dir, "src", "db.ts"),
    `export interface Database { query(): void; }\nexport function connectDb() { return {}; }\n`,
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "src", "user-service.ts"),
    `import { connectDb } from "./db.js";\nexport function getUser() { connectDb(); return { id: 1 }; }\n`,
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "src", "auth-controller.ts"),
    `import { getUser } from "./user-service.js";\nexport function login() { return getUser(); }\n`,
    "utf8"
  );

  await fs.writeFile(
    path.join(taskDir, "spec.md"),
    `# 📐 [048-swarm-test] Swarm Test Feature

## 3. Implementation Checklist
- [ ] **Task 1: Core Database Migration**
- [ ] **Task 2: Automated QA Test Coverage**
- [ ] **Task 3: Security & Vulnerability Audit**
`,
    "utf8"
  );
}

test("buildCodeGraph parses imports, exports and builds dependency graph", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-graph-"));

  try {
    await setupTestCodebase(tempDir);

    const graph = await buildCodeGraph(tempDir);
    assert.ok(graph.totalFiles >= 3);
    assert.ok(graph.totalEdges >= 2);

    const dbKey = Object.keys(graph.nodes).find((k) => k.includes("db.ts"));
    assert.ok(dbKey);
    assert.ok(graph.nodes[dbKey].exports.includes("connectDb"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("calculateBlastRadius finds direct and transitive dependents correctly", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-blast-"));

  try {
    await setupTestCodebase(tempDir);

    const graph = await buildCodeGraph(tempDir);
    const blast = calculateBlastRadius(graph, "src/db.ts");

    assert.equal(blast.exists, true);
    assert.ok(blast.totalAffected >= 2);
    assert.ok(blast.affectedFiles.some((f) => f.includes("user-service.ts")));
    assert.ok(blast.affectedFiles.some((f) => f.includes("auth-controller.ts")));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("generateSwarmPlan assigns specialized roles from spec tasks", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-swarm-"));

  try {
    await setupTestCodebase(tempDir);

    const plan = await generateSwarmPlan(tempDir);
    assert.equal(plan.runId, "048-swarm-test");
    assert.equal(plan.totalTasks, 3);
    assert.equal(plan.tasks[0].role, "coder");
    assert.equal(plan.tasks[1].role, "qa");
    assert.equal(plan.tasks[2].role, "security");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("generateSwarmPlan uses a pre-resolved branch context without Git discovery", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-swarm-branch-"));

  try {
    await setupTestCodebase(tempDir);
    const branchContextDir = path.join(
      tempDir,
      "devflow",
      "context",
      "055-cache"
    );
    await fs.mkdir(branchContextDir, { recursive: true });
    await fs.writeFile(
      path.join(branchContextDir, "spec.md"),
      `# 📐 [055-branch-context] Branch Scoped Swarm

## 3. Implementation Checklist
- [ ] **Task 1: Branch Context Implementation**
`,
      "utf8"
    );

    const plan = await generateSwarmPlan(tempDir, { branch: "feature/055-cache" });
    assert.equal(plan.runId, "055-branch-context");
    assert.equal(plan.totalTasks, 1);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("MCP devflow_swarm_plan and devflow_query_code_graph execute properly", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-swarm-mcp-"));

  try {
    await setupTestCodebase(tempDir);

    const swarmRes = await handleToolCall(tempDir, "devflow_swarm_plan", {});
    assert.equal(swarmRes.isError, undefined);
    assert.ok(swarmRes.content.length > 0);
    const parsedSwarm = JSON.parse(swarmRes.content[0].text);
    assert.equal(parsedSwarm.runId, "048-swarm-test");

    const graphRes = await handleToolCall(tempDir, "devflow_query_code_graph", { file: "src/db.ts" });
    assert.equal(graphRes.isError, undefined);
    assert.ok(graphRes.content.length > 0);
    const parsedBlast = JSON.parse(graphRes.content[0].text);
    assert.equal(parsedBlast.exists, true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
