import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  estimateTokenCount,
  pruneMarkdownSections,
  sliceContextForStage
} from "../lib/context-slicer.js";
import { handleToolCall } from "../lib/mcp.js";

async function setupTestProject(dir: string): Promise<void> {
  await fs.mkdir(path.join(dir, "devflow", "context"), { recursive: true });
  await fs.mkdir(path.join(dir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow System\n", "utf8");

  await fs.writeFile(
    path.join(dir, "devflow", "context", "current-feature.md"),
    `# 📐 [045-test-feature] Sample Feature Title

## 1. Specification & Scope
- In-Scope: Feature logic details
- Out-of-Scope: Other things

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [ ] **AC-01**: Test criterion 1

## 2. Plan & Test Strategy
- Large detailed plan text...

## 3. Implementation Checklist
- [ ] Task 1: Core logic
- [ ] Task 2: Unit tests

## 4. Verification Evidence & Quality Gates
- [ ] Lane 1: Typecheck
- [ ] Lane 2: Unit tests
`,
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "devflow", "context", "coding-standards.md"),
    `# Coding Standards

## 1. Core Principles
- Rule 1: Clean code
- Rule 2: TDD discipline

## 2. Long Historical Context
- This section is very long and irrelevant for active coding tasks...
`,
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "devflow", "context", "project-overview.md"),
    `# Project Overview

## 1. Architecture & Vision
- Modern 3-Pillars & Dual-Track model

## 2. Deep Historical Background
- Long legacy description...
`,
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "devflow", "build-plan.md"),
    `# Build Plan

## Phase 1
- [x] 1. Quality Gatekeeper
- [ ] 2. Next feature in queue
`,
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "devflow", "ideas.md"),
    `# Ideas Inbox

### [IDEA-001] AI Code Reviewer
- High feasibility, high value
`,
    "utf8"
  );

  await fs.writeFile(
    path.join(dir, "devflow", "context", "current-stage.md"),
    "# Current Stage\n\n- Track: `fast`\n- Current Stage: `implement`\n",
    "utf8"
  );
}

test("estimateTokenCount returns accurate heuristic token estimates", () => {
  assert.equal(estimateTokenCount(""), 0);
  assert.equal(estimateTokenCount("hello world"), 4);
  const sample = "The quick brown fox jumps over the lazy dog";
  assert.ok(estimateTokenCount(sample) > 0);
});

test("pruneMarkdownSections extracts only matching headings and applies token budget", () => {
  const sampleMarkdown = `# Document Title

## Section A
Content of section A.

## Section B
Content of section B.

## Section C
Content of section C.
`;

  const pruned = pruneMarkdownSections(sampleMarkdown, [/Section A/i, /Section C/i]);
  assert.match(pruned, /Section A/);
  assert.match(pruned, /Section C/);
  assert.doesNotMatch(pruned, /Section B/);

  // Test token limit truncation
  const truncated = pruneMarkdownSections(sampleMarkdown, [/Section/i], 5);
  assert.match(truncated, /Truncated/i);
});

test("sliceContextForStage produces efficient stage-aware slices", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-slicer-"));

  try {
    await setupTestProject(tempDir);

    // 1. Stage: implement
    const implementSlice = await sliceContextForStage(tempDir, "implement");
    assert.equal(implementSlice.stage, "implement");
    assert.match(implementSlice.content, /Specification & Scope/);
    assert.match(implementSlice.content, /Implementation Checklist/);
    assert.match(implementSlice.content, /Core Principles/);
    assert.doesNotMatch(implementSlice.content, /Deep Historical Background/);
    assert.ok(implementSlice.estimatedTokens < implementSlice.rawTokens);

    // 2. Stage: check
    const checkSlice = await sliceContextForStage(tempDir, "check");
    assert.equal(checkSlice.stage, "check");
    assert.match(checkSlice.content, /Acceptance Criteria/);
    assert.doesNotMatch(checkSlice.content, /Core Principles/);

    // 3. Stage: explore
    const exploreSlice = await sliceContextForStage(tempDir, "explore");
    assert.equal(exploreSlice.stage, "explore");
    assert.match(exploreSlice.content, /Architecture & Vision/);
    assert.match(exploreSlice.content, /AI Code Reviewer/);

    // 4. Stage: feature
    const featureSlice = await sliceContextForStage(tempDir, "feature");
    assert.equal(featureSlice.stage, "feature");
    assert.match(featureSlice.content, /Build Plan Feature Queue/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("MCP devflow_get_sliced_context returns formatted JIT slice", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-slicer-mcp-"));

  try {
    await setupTestProject(tempDir);

    const mcpResult = await handleToolCall(tempDir, "devflow_get_sliced_context", {
      stage: "implement",
      maxTokens: 1000
    });

    assert.equal(mcpResult.isError, undefined);
    assert.ok(mcpResult.content.length > 0);
    assert.match(mcpResult.content[0].text, /JIT Context Slice - Stage: implement/);
    assert.match(mcpResult.content[0].text, /Specification & Scope/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
