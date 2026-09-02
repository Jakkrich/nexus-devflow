import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";

import {
  PROJECT_CONFIG_PATH,
  createDefaultProjectConfig,
  parseProjectConfig,
  readProjectConfig
} from "../lib/project-config.js";

test("default config keeps every quality gate manual and workflow efficient", () => {
  const defaults = createDefaultProjectConfig();
  const manualGates = {
    audit: "manual",
    independentReview: "manual",
    check: "manual",
    tryGuide: "manual"
  };

  assert.equal(defaults.workflow.stepReview, "feature");
  assert.equal(defaults.workflow.checkpointCommits, "disabled");
  assert.deepEqual(defaults.qualityGates.regular, manualGates);
  assert.deepEqual(defaults.qualityGates.continuous, manualGates);
  assert.equal(defaults.continuous.finalIntegrationAudit, false);
});

test("readProjectConfig returns defaults when config is missing", async (t) => {
  const projectRoot = await createProject(t);

  assert.deepEqual(await readProjectConfig(projectRoot), {
    path: PROJECT_CONFIG_PATH,
    state: "defaults",
    values: createDefaultProjectConfig(),
    warnings: []
  });
});

test("readProjectConfig merges partial project values over defaults", async (t) => {
  const projectRoot = await createProject(t);
  await writeConfig(projectRoot, {
    schemaVersion: 1,
    git: {
      featureBranchPrefix: "feat/"
    },
    qualityGates: {
      regular: {
        audit: "when-sensitive",
        check: "always"
      },
      continuous: {
        tryGuide: "when-user-facing"
      }
    },
    continuous: {
      maxFeatures: 4
    }
  });

  const result = await readProjectConfig(projectRoot);

  assert.equal(result.state, "project");
  assert.equal(result.values.git.featureBranchPrefix, "feat/");
  assert.equal(result.values.git.fixBranchPrefix, "fix/");
  assert.equal(result.values.qualityGates.regular.audit, "when-sensitive");
  assert.equal(result.values.qualityGates.regular.check, "always");
  assert.equal(result.values.qualityGates.regular.tryGuide, "manual");
  assert.equal(
    result.values.qualityGates.continuous.tryGuide,
    "when-user-facing"
  );
  assert.equal(result.values.continuous.maxFeatures, 4);
  assert.equal(result.values.continuous.maxRepairAttempts, 2);
  assert.deepEqual(result.warnings, []);
});

test("readProjectConfig reports malformed JSON and falls back safely", async (t) => {
  const projectRoot = await createProject(t);
  const configPath = path.join(projectRoot, PROJECT_CONFIG_PATH);
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, "not json\n");

  const result = await readProjectConfig(projectRoot);

  assert.equal(result.state, "invalid");
  assert.deepEqual(result.values, createDefaultProjectConfig());
  assert.deepEqual(result.warnings, [
    {
      code: "invalid_config",
      message: `Invalid DevFlow config JSON: ${PROJECT_CONFIG_PATH}`
    }
  ]);
});

test("readProjectConfig rejects unknown and invalid values", async (t) => {
  const projectRoot = await createProject(t);
  await writeConfig(projectRoot, {
    schemaVersion: 1,
    qualityGates: {
      regular: {
        audit: "sometimes"
      }
    }
  });

  const result = await readProjectConfig(projectRoot);

  assert.equal(result.state, "invalid");
  assert.match(
    result.warnings[0]?.message || "",
    /qualityGates\.regular\.audit must be one of/
  );
  assert.deepEqual(result.values, createDefaultProjectConfig());

  assert.throws(
    () => parseProjectConfig({ schemaVersion: 1, extra: true }),
    /config contains unknown key: extra/
  );
  assert.throws(
    () => parseProjectConfig({
      schemaVersion: 1,
      workflow: { manualTry: "every" }
    }),
    /workflow contains unknown key: manualTry/
  );
  assert.throws(
    () => parseProjectConfig({
      schemaVersion: 1,
      qualityGates: {
        continuous: { check: "when-sensitive" }
      }
    }),
    /qualityGates\.continuous\.check must be one of/
  );
});

test("readProjectConfig refuses symbolic links", async (t) => {
  const projectRoot = await createProject(t);
  const outsidePath = path.join(path.dirname(projectRoot), "outside.json");
  const configPath = path.join(projectRoot, PROJECT_CONFIG_PATH);
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(outsidePath, `${JSON.stringify(createDefaultProjectConfig())}\n`);
  await fs.symlink(outsidePath, configPath);

  const result = await readProjectConfig(projectRoot);

  assert.equal(result.state, "invalid");
  assert.match(result.warnings[0]?.message || "", /symbolic link/);
});

async function createProject(t: TestContext): Promise<string> {
  const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-config-"));
  t.after(() => fs.rm(projectRoot, { recursive: true, force: true }));
  return projectRoot;
}

async function writeConfig(projectRoot: string, value: unknown): Promise<void> {
  const configPath = path.join(projectRoot, PROJECT_CONFIG_PATH);
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, `${JSON.stringify(value, null, 2)}\n`);
}
