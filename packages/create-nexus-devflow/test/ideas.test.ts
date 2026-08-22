import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  addIdea,
  formatIdeasHuman,
  parseIdeasContent,
  readIdeas
} from "../lib/ideas.js";

test("addIdea creates ideas.md and appends new pending idea with calculated ID", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-ideas-"));

  try {
    const item1 = await addIdea(tempDir, {
      text: "ระบบแจ้งเตือนผ่าน LINE Notify",
      title: "LINE Notify Integration"
    });

    assert.equal(item1.id, "IDEA-001");
    assert.equal(item1.title, "LINE Notify Integration");
    assert.equal(item1.status, "Pending");

    const item2 = await addIdea(tempDir, {
      text: "Export report as PDF",
      title: "PDF Export"
    });

    assert.equal(item2.id, "IDEA-002");

    const summary = await readIdeas(tempDir);
    assert.equal(summary.totalPending, 2);
    assert.equal(summary.pending[0].id, "IDEA-002"); // newest first
    assert.equal(summary.pending[1].id, "IDEA-001");

    const humanText = formatIdeasHuman(summary);
    assert.match(humanText, /DevFlow Idea Inbox & Backlog/);
    assert.match(humanText, /IDEA-001/);
    assert.match(humanText, /IDEA-002/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("parseIdeasContent handles empty or missing section gracefully", () => {
  const summary = parseIdeasContent("# Ideas\n\nNo structured content");
  assert.equal(summary.totalPending, 0);
  assert.equal(summary.totalArchived, 0);
});
