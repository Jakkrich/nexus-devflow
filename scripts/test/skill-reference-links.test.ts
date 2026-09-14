import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

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
