import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { clearSandboxEntries, listSandboxEntries } from "./clear-sandbox.js";

test("lists directories inside sandbox root", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-clear-list-"));
  try {
    await fs.mkdir(path.join(root, "run-1"));
    await fs.mkdir(path.join(root, "run-2"));
    const entries = await listSandboxEntries(root);
    assert.deepEqual(entries, ["run-1", "run-2"]);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("returns empty array when sandbox root does not exist", async () => {
  const entries = await listSandboxEntries(path.join(os.tmpdir(), "nonexistent-sandbox-dir"));
  assert.deepEqual(entries, []);
});

test("clears specified sandbox entries safely", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-clear-action-"));
  try {
    await fs.mkdir(path.join(root, "run-1"));
    await fs.mkdir(path.join(root, "run-2"));
    await clearSandboxEntries(root, ["run-1"]);
    const entries = await listSandboxEntries(root);
    assert.deepEqual(entries, ["run-2"]);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
