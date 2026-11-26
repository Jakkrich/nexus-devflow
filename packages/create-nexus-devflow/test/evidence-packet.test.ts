import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { inspectRunEvidence, inspectVerifyDriverSkill } from "../lib/evidence-packet.js";

test("inspectRunEvidence returns absent for null, unsafe traversal, empty dir, or symlinked report dir/file", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-evidence-"));

  try {
    const nullResult = await inspectRunEvidence(tempDir, null);
    assert.equal(nullResult.present, false);
    assert.equal(nullResult.artifactCount, 0);

    const traversalResult = await inspectRunEvidence(tempDir, "../escape");
    assert.equal(traversalResult.present, false);
    assert.ok(traversalResult.warnings.some((w) => w.includes("invalid")));

    const dotResult = await inspectRunEvidence(tempDir, ".");
    assert.equal(dotResult.present, false);
    assert.ok(dotResult.warnings.some((w) => w.includes("invalid")));

    const outsideReports = path.join(tempDir, "outside-reports");
    await fs.mkdir(path.join(outsideReports, "131c-ext"), { recursive: true });
    await fs.writeFile(path.join(outsideReports, "131c-ext", "fake.log"), "forged", "utf8");
    const reportsParent = path.join(tempDir, "devflow", "reports");
    await fs.mkdir(path.join(tempDir, "devflow"), { recursive: true });
    await fs.symlink(outsideReports, reportsParent, "junction");

    const symlinkReportsResult = await inspectRunEvidence(tempDir, "131c-ext");
    assert.equal(symlinkReportsResult.present, false);
    assert.ok(symlinkReportsResult.warnings.some((w) => w.includes("symlink")));
    await fs.rm(reportsParent, { recursive: true, force: true });

    const reportDir = path.join(tempDir, "devflow", "reports", "131c-test");
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(path.join(reportDir, ".gitkeep"), "", "utf8");
    await fs.writeFile(path.join(reportDir, "empty.log"), "", "utf8");

    const emptyResult = await inspectRunEvidence(tempDir, "131c-test");
    assert.equal(emptyResult.present, false);
    assert.equal(emptyResult.artifactCount, 0);

    const externalFile = path.join(tempDir, "secret.txt");
    await fs.writeFile(externalFile, "outside", "utf8");
    await fs.symlink(externalFile, path.join(reportDir, "linked.txt"));

    const symlinkFileResult = await inspectRunEvidence(tempDir, "131c-test");
    assert.equal(symlinkFileResult.present, false);
    assert.ok(symlinkFileResult.warnings.some((w) => w.includes("symlink")));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("inspectRunEvidence collects non-empty regular proof files including nested verify-proof artifacts", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-evidence-valid-"));

  try {
    const proofDir = path.join(tempDir, "devflow", "reports", "131c-demo", "verify-proof");
    await fs.mkdir(proofDir, { recursive: true });
    await fs.writeFile(
      path.join(tempDir, "devflow", "reports", "131c-demo", "verify-layers.json"),
      "{\"passed\":true}",
      "utf8"
    );
    await fs.writeFile(path.join(proofDir, "doctor.json"), "{\"failCount\":0}", "utf8");

    const result = await inspectRunEvidence(tempDir, "131c-demo");
    assert.equal(result.present, true);
    assert.equal(result.artifactCount, 2);
    assert.ok(result.totalBytes > 20);
    assert.deepEqual(
      result.artifacts.map((a) => a.relativePath),
      ["verify-layers.json", "verify-proof/doctor.json"]
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("inspectVerifyDriverSkill distinguishes absent, ready, incomplete, and symlinked verify skills", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-verify-driver-"));

  try {
    const absent = await inspectVerifyDriverSkill(tempDir);
    assert.equal(absent.state, "absent");

    const verifyDir = path.join(tempDir, ".agents", "skills", "verify");
    await fs.mkdir(verifyDir, { recursive: true });
    const skillPath = path.join(verifyDir, "SKILL.md");

    await fs.writeFile(skillPath, "# verify\n\n## Launch\n\n## Drive\n", "utf8");
    const incomplete = await inspectVerifyDriverSkill(tempDir);
    assert.equal(incomplete.state, "incomplete");
    assert.deepEqual(incomplete.missingSections, ["Doctor", "Evidence", "Cleanup"]);

    await fs.writeFile(
      skillPath,
      "# verify\n\n## Launch\n\n## Doctor\n\n## Drive\n\n## Evidence\n\n## Cleanup\n",
      "utf8"
    );
    const ready = await inspectVerifyDriverSkill(tempDir);
    assert.equal(ready.state, "ready");
    assert.equal(ready.skillPath, ".agents/skills/verify/SKILL.md");
    assert.deepEqual(ready.missingSections, []);

    const outsideSkill = path.join(tempDir, "outside-verify.md");
    await fs.writeFile(outsideSkill, "## Launch\n## Doctor\n## Drive\n## Evidence\n## Cleanup\n", "utf8");
    await fs.rm(skillPath);
    await fs.symlink(outsideSkill, skillPath);

    const unsafe = await inspectVerifyDriverSkill(tempDir);
    assert.equal(unsafe.state, "unsafe");

    // Symlinked .agents/skills and symlinked .agents must both return unsafe
    const outsideSkills = path.join(tempDir, "outside-skills");
    await fs.mkdir(path.join(outsideSkills, "verify"), { recursive: true });
    await fs.writeFile(
      path.join(outsideSkills, "verify", "SKILL.md"),
      "## Launch\n## Doctor\n## Drive\n## Evidence\n## Cleanup\n",
      "utf8"
    );
    await fs.rm(path.join(tempDir, ".agents", "skills"), { recursive: true, force: true });
    await fs.symlink(outsideSkills, path.join(tempDir, ".agents", "skills"), "junction");
    const unsafeSkillsDir = await inspectVerifyDriverSkill(tempDir);
    assert.equal(unsafeSkillsDir.state, "unsafe");

    await fs.rm(path.join(tempDir, ".agents"), { recursive: true, force: true });
    const outsideAgents = path.join(tempDir, "outside-agents");
    await fs.mkdir(path.join(outsideAgents, "skills", "verify"), { recursive: true });
    await fs.writeFile(
      path.join(outsideAgents, "skills", "verify", "SKILL.md"),
      "## Launch\n## Doctor\n## Drive\n## Evidence\n## Cleanup\n",
      "utf8"
    );
    await fs.symlink(outsideAgents, path.join(tempDir, ".agents"), "junction");
    const unsafeAgentsDir = await inspectVerifyDriverSkill(tempDir);
    assert.equal(unsafeAgentsDir.state, "unsafe");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
