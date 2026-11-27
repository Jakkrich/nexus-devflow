import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkPlaybooks } from "../../.agents/skills/devflow-mode/scripts/check-playbooks.mjs";

const bundledDir = path.resolve(import.meta.dirname, "../../.agents/skills/devflow-mode/playbooks");

test("checkPlaybooks returns empty array when .agents/playbooks does not exist", async (t) => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-pb-empty-"));
  t.after(() => fs.rm(tempRoot, { recursive: true, force: true }));

  assert.deepEqual(checkPlaybooks(tempRoot, bundledDir), []);
});

test("checkPlaybooks passes valid project playbook extending bundled feature playbook", async (t) => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-pb-valid-"));
  t.after(() => fs.rm(tempRoot, { recursive: true, force: true }));

  const pbDir = path.join(tempRoot, ".agents", "playbooks");
  await fs.mkdir(pbDir, { recursive: true });
  await fs.writeFile(
    path.join(pbDir, "custom-feature.md"),
    `---
extends: feature
when: Building a custom feature with extra security scan
---

- **After** "Trace the affected subsystem": run dependency license scan.
`,
    "utf8"
  );

  assert.deepEqual(checkPlaybooks(tempRoot, bundledDir), []);
});

test("checkPlaybooks rejects missing when:, unknown extends, unquoted verbs, and missing anchors", async (t) => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-pb-invalid-"));
  t.after(() => fs.rm(tempRoot, { recursive: true, force: true }));

  const pbDir = path.join(tempRoot, ".agents", "playbooks");
  await fs.mkdir(pbDir, { recursive: true });
  await fs.writeFile(
    path.join(pbDir, "broken.md"),
    `---
extends: nonexistent
---

- **After** unquoted step text
- **Before** "This quote does not exist in any extended playbook"
`,
    "utf8"
  );

  const problems = checkPlaybooks(tempRoot, bundledDir);
  assert.ok(problems.some((p) => p.includes('needs a "when:" line')));
  assert.ok(problems.some((p) => p.includes("extends `nonexistent`")));
  assert.ok(problems.some((p) => p.includes("no straight-quoted step text")));
  assert.ok(problems.some((p) => p.includes("is not in any playbook it extends")));
});

