import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  assertDestinationType,
  validateInstallDestinations
} from "../lib/update.js";

test("assertDestinationType succeeds for missing path (ENOENT)", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-install-test-"));
  try {
    const missing = path.join(tempDir, "nonexistent");
    await assert.doesNotReject(() => assertDestinationType(missing, "file"));
    await assert.doesNotReject(() => assertDestinationType(missing, "directory"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("assertDestinationType refuses symbolic link paths", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-install-test-"));
  try {
    const outside = path.join(tempDir, "outside.txt");
    await fs.writeFile(outside, "content");
    const link = path.join(tempDir, "symlink.txt");
    await fs.symlink(outside, link, "file");

    await assert.rejects(
      () => assertDestinationType(link, "file"),
      /Refusing to install through symbolic-link path:/
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("assertDestinationType refuses incompatible types (file vs directory)", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-install-test-"));
  try {
    const file = path.join(tempDir, "plain.txt");
    await fs.writeFile(file, "hello");

    await assert.rejects(
      () => assertDestinationType(file, "directory"),
      /Refusing to install at .*: expected a directory\./
    );

    const dir = path.join(tempDir, "subdir");
    await fs.mkdir(dir);

    await assert.rejects(
      () => assertDestinationType(dir, "file"),
      /Refusing to install at .*: expected a file\./
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("assertDestinationType refuses nonexistent target when parent is a file", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-install-test-"));
  try {
    const file = path.join(tempDir, "parent-file");
    await fs.writeFile(file, "content");
    const child = path.join(file, "child");

    await assert.rejects(
      () => assertDestinationType(child, "file"),
      /Refusing to install at .*: a parent path is not a directory\./
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("validateInstallDestinations rejects symlink destinations in template files", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-install-test-"));
  try {
    const outside = path.join(tempDir, "outside.md");
    await fs.writeFile(outside, "outside");
    const targetDir = path.join(tempDir, "project");
    await fs.mkdir(targetDir);

    const linkAgents = path.join(targetDir, "AGENTS.md");
    await fs.symlink(outside, linkAgents, "file");

    await assert.rejects(
      () => validateInstallDestinations(["AGENTS.md", "CLAUDE.md"], targetDir),
      /Refusing to install through symbolic-link path:/
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
