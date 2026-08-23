import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { resolveActiveContextPaths } from "./branch-context.js";
import { readFindings } from "./findings.js";
import { readProjectStatus } from "./status.js";

export type SliceStage = "implement" | "check" | "explore" | "feature" | "status";

export interface SliceOptions {
  maxTokens?: number;
  taskIndex?: number;
  customBranch?: string;
}

export interface ContextSliceSection {
  name: string;
  tokens: number;
  content: string;
}

export interface ContextSliceResult {
  stage: SliceStage;
  estimatedTokens: number;
  rawTokens: number;
  reductionPercentage: number;
  content: string;
  sections: ContextSliceSection[];
}

/**
 * Estimates token count for text using standard character/word heuristic for mixed markdown/code.
 */
export function estimateTokenCount(text: string): number {
  if (!text || text.length === 0) return 0;
  // Standard mixed heuristic: ~3.5 chars per token for markdown + code
  return Math.ceil(text.length / 3.5);
}

/**
 * Parses markdown into discrete sections by headings (## or ###) and filters by allowed patterns.
 */
export function pruneMarkdownSections(
  markdown: string,
  allowedHeadingPatterns: RegExp[],
  maxTokens?: number
): string {
  const lines = markdown.split("\n");
  const sections: Array<{ heading: string; lines: string[] }> = [];

  let currentHeading = "Header";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (/^#{1,3}\s+/.test(line)) {
      if (currentLines.length > 0) {
        sections.push({ heading: currentHeading, lines: currentLines });
      }
      currentHeading = line;
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }
  if (currentLines.length > 0) {
    sections.push({ heading: currentHeading, lines: currentLines });
  }

  const filteredSections = sections.filter((sec) => {
    if (sec.heading === "Header") return true; // keep frontmatter/title header
    return allowedHeadingPatterns.some((pattern) => pattern.test(sec.heading));
  });

  let result = filteredSections.map((s) => s.lines.join("\n")).join("\n").trim();

  if (maxTokens && estimateTokenCount(result) > maxTokens) {
    // Truncate safely at character limit
    const maxChars = Math.floor(maxTokens * 3.5);
    result = result.slice(0, maxChars) + "\n\n... [Content truncated to satisfy Token Budget]";
  }

  return result;
}

/**
 * Creates a stage-aware context slice for AI agents, omitting irrelevant sections.
 */
export async function sliceContextForStage(
  projectRoot: string,
  stage: SliceStage,
  options: SliceOptions = {}
): Promise<ContextSliceResult> {
  const contextPaths = await resolveActiveContextPaths(projectRoot, options.customBranch);
  const sections: ContextSliceSection[] = [];
  let rawContentAccumulator = "";

  // Helper to read file safely
  async function safeRead(filePath: string): Promise<string> {
    try {
      if (fsSync.existsSync(filePath)) {
        const text = await fs.readFile(filePath, "utf8");
        rawContentAccumulator += text + "\n\n";
        return text;
      }
    } catch {}
    return "";
  }

  switch (stage) {
    case "implement": {
      // 1. Living Spec (Pruned: Scope + Checklist)
      const specRaw = await safeRead(contextPaths.featureSpecPath);
      if (specRaw) {
        const prunedSpec = pruneMarkdownSections(specRaw, [
          /1\.\s*Specification\s*&\s*Scope/i,
          /3\.\s*Implementation\s*Checklist/i
        ]);
        sections.push({
          name: "Active Spec (In-Scope & Tasks)",
          tokens: estimateTokenCount(prunedSpec),
          content: prunedSpec
        });
      }

      // 2. Relevant Coding Standards
      const standardsRaw = await safeRead(path.join(projectRoot, "devflow", "context", "coding-standards.md"));
      if (standardsRaw) {
        const prunedStandards = pruneMarkdownSections(standardsRaw, [
          /Core\s*Principles/i,
          /Engineering\s*Conventions/i,
          /Rules/i
        ], 800);
        sections.push({
          name: "Core Coding Standards",
          tokens: estimateTokenCount(prunedStandards),
          content: prunedStandards
        });
      }

      // 3. Active Findings Blockers
      const findings = await readFindings(projectRoot);
      if (findings.blockers.length > 0 || findings.items.length > 0) {
        const blockersText = [
          "## Active Findings Ledger",
          ...findings.blockers.map((b) => `- ✖ [${b.severity}] ${b.status}: ${b.title} (${b.id})`),
          ...findings.items.filter((a) => !findings.blockers.includes(a)).map((a) => `- ⚠ [${a.severity}] ${a.status}: ${a.title}`)
        ].join("\n");
        sections.push({
          name: "Findings & Quality Constraints",
          tokens: estimateTokenCount(blockersText),
          content: blockersText
        });
      }
      break;
    }

    case "check": {
      // 1. Acceptance Criteria & Verification Matrix
      const specRaw = await safeRead(contextPaths.featureSpecPath);
      if (specRaw) {
        const prunedSpec = pruneMarkdownSections(specRaw, [
          /Acceptance\s*Criteria/i,
          /Verification\s*Evidence/i,
          /Quality\s*Gates/i
        ]);
        sections.push({
          name: "Acceptance Criteria & Quality Gates",
          tokens: estimateTokenCount(prunedSpec),
          content: prunedSpec
        });
      }

      // 2. Active Blockers
      const findings = await readFindings(projectRoot);
      if (findings.blockers.length > 0) {
        const blockersText = [
          "## Blockers to Verify",
          ...findings.blockers.map((b) => `- ✖ [${b.severity}] ${b.status}: ${b.title}`)
        ].join("\n");
        sections.push({
          name: "Blocking Quality Findings",
          tokens: estimateTokenCount(blockersText),
          content: blockersText
        });
      }
      break;
    }

    case "explore": {
      // 1. Project Overview (Architecture Summary)
      const overviewRaw = await safeRead(path.join(projectRoot, "devflow", "context", "project-overview.md"));
      if (overviewRaw) {
        const prunedOverview = pruneMarkdownSections(overviewRaw, [
          /Architecture/i,
          /Vision/i,
          /Directives/i
        ], 600);
        sections.push({
          name: "Architecture & Directives",
          tokens: estimateTokenCount(prunedOverview),
          content: prunedOverview
        });
      }

      // 2. Ideas Backlog
      const ideasRaw = await safeRead(path.join(projectRoot, "devflow", "ideas.md"));
      if (ideasRaw) {
        const prunedIdeas = ideasRaw.split("\n").slice(0, 50).join("\n");
        sections.push({
          name: "Ideas Backlog (Top)",
          tokens: estimateTokenCount(prunedIdeas),
          content: prunedIdeas
        });
      }
      break;
    }

    case "feature": {
      // 1. Build Plan Feature Queue
      const buildPlanRaw = await safeRead(path.join(projectRoot, "devflow", "build-plan.md"));
      if (buildPlanRaw) {
        const nextFeatures = buildPlanRaw.split("\n").filter((l) => l.startsWith("- [ ]") || l.startsWith("##")).slice(0, 30).join("\n");
        sections.push({
          name: "Build Plan Feature Queue",
          tokens: estimateTokenCount(nextFeatures),
          content: nextFeatures
        });
      }

      // 2. Living Project Overview Constraints
      const overviewRaw = await safeRead(path.join(projectRoot, "devflow", "context", "project-overview.md"));
      if (overviewRaw) {
        const prunedOverview = pruneMarkdownSections(overviewRaw, [
          /Tech\s*Stack/i,
          /Standards/i
        ], 500);
        sections.push({
          name: "Tech Stack & Standards",
          tokens: estimateTokenCount(prunedOverview),
          content: prunedOverview
        });
      }
      break;
    }

    case "status":
    default: {
      const status = await readProjectStatus(projectRoot);
      const statusText = JSON.stringify(
        {
          project: status.project.name,
          currentWork: status.currentWork,
          findings: status.findings.total,
          blockers: status.findings.blockers.length,
          nextAction: status.nextAction
        },
        null,
        2
      );
      sections.push({
        name: "Pulse Status",
        tokens: estimateTokenCount(statusText),
        content: statusText
      });
      break;
    }
  }

  let finalContent = sections.map((s) => `### [Slice: ${s.name}]\n${s.content}`).join("\n\n---\n\n");

  if (options.maxTokens && estimateTokenCount(finalContent) > options.maxTokens) {
    const maxChars = Math.floor(options.maxTokens * 3.5);
    finalContent = finalContent.slice(0, maxChars) + "\n\n... [Truncated by JIT Token Budget]";
  }

  const rawTokens = estimateTokenCount(rawContentAccumulator) || estimateTokenCount(finalContent) * 2;
  const estimatedTokens = estimateTokenCount(finalContent);
  const reductionPercentage = Math.max(0, Math.round(((rawTokens - estimatedTokens) / rawTokens) * 100));

  return {
    stage,
    estimatedTokens,
    rawTokens,
    reductionPercentage,
    content: finalContent,
    sections
  };
}
