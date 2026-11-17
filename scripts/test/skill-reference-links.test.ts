import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { findBrokenSkillReferenceLinks } from "../validate-framework.js";

for (const adapter of [".agents", ".claude"]) {
  test(adapter + " diagram references resolve their instruction sections", () => {
    const root = path.resolve(adapter, "skills/diagram-design");
    const entry = fs.readFileSync(path.join(root, "SKILL.md"), "utf8");
    for (const file of fs.readdirSync(path.join(root, "references"))) {
      if (!file.endsWith(".md")) continue;
      const text = fs.readFileSync(path.join(root, "references", file), "utf8");
      assert.doesNotMatch(text, /\[[^\]\n]*\[[^\]\n]+\]\([^\)\n]+\)\]\(/, file + " has a nested Markdown link");
      if (file.startsWith("type-") && !/^## \d+\./m.test(text)) {
        assert.doesNotMatch(text, /§\d+/, file + " needs explicit links for external numbered sections");
      }
      for (const match of text.matchAll(/SKILL\.md`?\s*§(\d+)/g)) {
        assert.match(entry, new RegExp("^## " + match[1] + "\\.", "m"), file + " has a stale SKILL.md section pointer");
      }
    }
    for (const file of ["SKILL.md", ...["setup", "selection", "design", "svg-primitives", "layout", "validation", "variants", "imports", "delivery"].map(name => "references/" + name + ".md")]) {
      const full = path.join(root, file);
      for (const link of fs.readFileSync(full, "utf8").matchAll(/\]\(([^\s)]+)\)/g)) {
        const target = link[1].split("#")[0];
        if (!target || /^https?:/.test(target)) continue;
        assert.ok(fs.existsSync(path.resolve(path.dirname(full), target)), file + " -> " + target);
      }
    }
  });
}

test("findBrokenSkillReferenceLinks resolves valid relative and cross-skill paths and flags broken or escaping links", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-ref-links-"));
  try {
    const skillsRoot = path.join(tempDir, ".agents", "skills");
    fs.mkdirSync(path.join(skillsRoot, "alpha", "reference"), { recursive: true });
    fs.mkdirSync(path.join(skillsRoot, "beta", "reference"), { recursive: true });
    fs.writeFileSync(path.join(skillsRoot, "alpha", "reference", "guide.md"), "# guide\n");
    fs.writeFileSync(path.join(skillsRoot, "beta", "reference", "target.md"), "# target\n");

    // Valid links across SKILL.md and reference/*.md
    fs.writeFileSync(
      path.join(skillsRoot, "alpha", "SKILL.md"),
      "Read `reference/guide.md`, `../beta/reference/target.md`, and `beta/reference/target.md`.\n"
    );
    fs.writeFileSync(
      path.join(skillsRoot, "alpha", "reference", "guide.md"),
      "See `../../beta/reference/target.md`.\n"
    );
    assert.deepEqual(findBrokenSkillReferenceLinks(skillsRoot, ["alpha", "beta"]), []);

    // Broken relative, cross-skill, bare, and root-escaping links
    fs.writeFileSync(
      path.join(skillsRoot, "beta", "SKILL.md"),
      "Bad `reference/missing.md`, `../alpha/reference/nope.md`, `alpha/reference/missing2.md`, and `../../../outside/reference/secret.md`.\n"
    );
    const broken = findBrokenSkillReferenceLinks(skillsRoot, ["alpha", "beta"]);
    assert.equal(broken.length, 4);
    assert.ok(broken.some((item) => item.includes("reference/missing.md")));
    assert.ok(broken.some((item) => item.includes("../alpha/reference/nope.md")));
    assert.ok(broken.some((item) => item.includes("alpha/reference/missing2.md")));
    assert.ok(broken.some((item) => item.includes("../../../outside/reference/secret.md")));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
