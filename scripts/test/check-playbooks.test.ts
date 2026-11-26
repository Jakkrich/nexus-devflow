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

test("checkPlaybooks validates devflow/playbooks/ strictly and skips poteto-mode extensions in shared .agents/playbooks/", async (t) => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-pb-ns-"));
  t.after(() => fs.rm(tempRoot, { recursive: true, force: true }));

  const devflowPbDir = path.join(tempRoot, "devflow", "playbooks");
  const sharedPbDir = path.join(tempRoot, ".agents", "playbooks");
  const pstackBundledDir = path.join(tempRoot, "fake-pstack-playbooks");
  await fs.mkdir(devflowPbDir, { recursive: true });
  await fs.mkdir(sharedPbDir, { recursive: true });
  await fs.mkdir(pstackBundledDir, { recursive: true });

  await fs.writeFile(
    path.join(pstackBundledDir, "feature.md"),
    "# Pstack Feature\n\n1. Copy its steps into the todolist tool first.\n",
    "utf8"
  );

  // 1. Valid DevFlow playbook in devflow/playbooks/
  await fs.writeFile(
    path.join(devflowPbDir, "strict-queue.md"),
    `---
extends: autonomous-queue
when: Running strict release checks before local merge
---

- **Before** "Local Archive & Delivery": run release-readiness gate.
`,
    "utf8"
  );

  // 2. Shared .agents/playbooks/ containing pstack-only stems, explicit pstack namespace, and pstack-anchored shared stem
  await fs.writeFile(
    path.join(sharedPbDir, "pstack-ship.md"),
    `---
extends: shipping
when: Shipping stacked PRs via pstack
---

- **After** "Land the stack": notify team channel.
`,
    "utf8"
  );
  await fs.writeFile(
    path.join(sharedPbDir, "pstack-multi.md"),
    `---
extends: [babysit, opening-a-pr]
when: Custom PR babysit rules
---

- **Before** "Open the PR": verify changelog entry.
`,
    "utf8"
  );
  await fs.writeFile(
    path.join(sharedPbDir, "pstack-namespaced.md"),
    `---
namespace: pstack
extends: feature
when: Custom pstack feature behavior
---

- **After** "Any pstack step": do custom thing.
`,
    "utf8"
  );
  await fs.writeFile(
    path.join(sharedPbDir, "pstack-shared-feature.md"),
    `---
extends: feature
when: Adding custom check inside pstack feature playbook
---

- **After** "Copy its steps into the todolist tool first.": log extra note.
`,
    "utf8"
  );

  // 3. Explicit devflow:feature in shared .agents/playbooks/ still validates cleanly
  await fs.writeFile(
    path.join(sharedPbDir, "devflow-explicit.md"),
    `---
extends: devflow:feature
when: Adding DevFlow security gate
---

- **After** "Trace the affected subsystem": run dependency audit.
`,
    "utf8"
  );

  assert.deepEqual(checkPlaybooks(tempRoot, bundledDir, { pstackBundled: pstackBundledDir }), []);

  // 4. Invalid pstack stem inside dedicated devflow/playbooks/ MUST fail
  await fs.writeFile(
    path.join(devflowPbDir, "bad-in-devflow.md"),
    `---
extends: shipping
when: Misplaced pstack playbook inside devflow/playbooks
---

- **After** "Land the stack": fail here.
`,
    "utf8"
  );

  const problems = checkPlaybooks(tempRoot, bundledDir, { pstackBundled: pstackBundledDir });
  assert.equal(problems.length, 2);
  assert.ok(problems.some((p) => /devflow\/playbooks\/bad-in-devflow\.md: extends `shipping`/.test(p)));
  assert.ok(problems.some((p) => /devflow\/playbooks\/bad-in-devflow\.md: "Land the stack" is not in any playbook it extends/.test(p)));
});

test("checkPlaybooks auto-discovers pstack playbooks in Claude plugin cache without explicit pstackBundled", async (t) => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-pb-cache-"));
  const fakeHome = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-pb-home-"));
  t.after(async () => {
    await fs.rm(tempRoot, { recursive: true, force: true });
    await fs.rm(fakeHome, { recursive: true, force: true });
  });

  const cachedPlaybooks = path.join(fakeHome, ".claude", "plugins", "cache", "pstack-claude", "pstack", "0.9.158", "skills", "poteto-mode", "playbooks");
  await fs.mkdir(cachedPlaybooks, { recursive: true });
  await fs.writeFile(
    path.join(cachedPlaybooks, "feature.md"),
    "# Pstack Feature\r\n\r\n1. Copy its steps into the todolist tool first.\r\n",
    "utf8"
  );

  const sharedPbDir = path.join(tempRoot, ".agents", "playbooks");
  await fs.mkdir(sharedPbDir, { recursive: true });
  await fs.writeFile(
    path.join(sharedPbDir, "pstack-cached.md"),
    "---\r\nextends: feature\r\nwhen: Cached pstack feature extension\r\n---\r\n\r\n- **After** \"Copy its steps into the todolist tool first.\": verify cache.\r\n",
    "utf8"
  );

  assert.deepEqual(checkPlaybooks(tempRoot, bundledDir, { homeDir: fakeHome, env: {} }), []);
});
