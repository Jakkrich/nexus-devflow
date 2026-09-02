import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  addLocalDevFlowScripts,
  createDevFlowNpxArguments,
  parseSandboxArgs,
  sandboxChildEnvironment,
  scaffoldProject,
  writeDemoPlans
} from "./scaffold-sandbox.js";

test("uses an interactive minimal app sandbox by default", () => {
  const options = parseSandboxArgs([], new Date("2026-08-25T16:30:00.000Z"));

  assert.deepEqual(options, {
    adapter: null,
    clean: false,
    demoPlan: false,
    help: false,
    name: "minimal-app-2026-08-25T16-30-00-000Z",
    server: true
  });
});

test("accepts supported sandbox overrides", () => {
  const options = parseSandboxArgs([
    "--name",
    "manual-proof",
    "--adapter",
    "claude",
    "--clean",
    "--demo-plan",
    "--no-server"
  ]);

  assert.equal(options.name, "manual-proof");
  assert.equal(options.adapter, "claude");
  assert.equal(options.clean, true);
  assert.equal(options.demoPlan, true);
  assert.equal(options.server, false);
});

test("runs the packed DevFlow through npx with real prompts by default", () => {
  assert.deepEqual(createDevFlowNpxArguments("/tmp/nexus-devflow.tgz", null), [
    "--yes",
    "--package",
    "/tmp/nexus-devflow.tgz",
    "create-nexus-devflow"
  ]);
  assert.deepEqual(createDevFlowNpxArguments("/tmp/nexus-devflow.tgz", "claude"), [
    "--yes",
    "--package",
    "/tmp/nexus-devflow.tgz",
    "create-nexus-devflow",
    "--",
    "--claude",
    "--yes"
  ]);
});

test("does not leak sandbox options into child npm commands", () => {
  const environment = sandboxChildEnvironment({
    PATH: "/test/bin",
    npm_config_adapter: "claude",
    npm_config_clean: "true"
  });

  assert.equal(environment.PATH, "/test/bin");
  assert.equal(environment.npm_config_adapter, undefined);
  assert.equal(environment.npm_config_clean, undefined);
  assert.equal(environment.npm_config_audit, "false");
});

test("rejects unsafe paths, unsupported adapters, and unknown arguments", () => {
  assert.throws(() => parseSandboxArgs(["--name", "../outside"]), /only letters/);
  assert.throws(() => parseSandboxArgs(["--adapter", "cursor"]), /Unknown adapter/);
  assert.throws(() => parseSandboxArgs(["--wat"]), /Unknown argument/);
  assert.throws(() => parseSandboxArgs(["--name"]), /requires a value/);
});

test("creates a dependency-free app with a server and test", async () => {
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-minimal-app-"));
  const projectRoot = path.join(workspace, "project");

  try {
    await scaffoldProject(projectRoot);
    const packageJson = JSON.parse(
      await fs.readFile(path.join(projectRoot, "package.json"), "utf8")
    ) as { scripts: Record<string, string> };

    assert.equal(packageJson.scripts.dev, "node server.js");
    assert.equal(packageJson.scripts.test, "node --test");
    assert.match(
      await fs.readFile(path.join(projectRoot, "index.html"), "utf8"),
      /ready for inspection/
    );
  } finally {
    await fs.rm(workspace, { recursive: true, force: true });
  }
});

test("adds realistic plans that are ready for overview", async () => {
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-demo-plan-"));

  try {
    await writeDemoPlans(workspace);
    const projectPlan = await fs.readFile(
      path.join(workspace, "devflow", "project-plan.md"),
      "utf8"
    );
    const buildPlan = await fs.readFile(
      path.join(workspace, "devflow", "build-plan.md"),
      "utf8"
    );

    assert.match(projectPlan, /Personal Task Tracker/);
    assert.equal(buildPlan.match(/^- \[ \]/gm)?.length, 3);
  } finally {
    await fs.rm(workspace, { recursive: true, force: true });
  }
});

test("adds sandbox commands pinned to the locally packed CLI", async () => {
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-local-cli-"));
  const projectRoot = path.join(workspace, "project");
  const tarball = path.join(workspace, "artifacts", "create-nexus-devflow-local.tgz");

  try {
    await scaffoldProject(projectRoot);
    await addLocalDevFlowScripts(projectRoot, tarball);
    const packageJson = JSON.parse(
      await fs.readFile(path.join(projectRoot, "package.json"), "utf8")
    ) as { scripts: Record<string, string> };

    assert.equal(
      packageJson.scripts["devflow:status"],
      "npx --yes --package ../artifacts/create-nexus-devflow-local.tgz create-nexus-devflow status"
    );
    assert.equal(
      packageJson.scripts["devflow:dashboard"],
      "npx --yes --package ../artifacts/create-nexus-devflow-local.tgz create-nexus-devflow dashboard"
    );
  } finally {
    await fs.rm(workspace, { recursive: true, force: true });
  }
});
