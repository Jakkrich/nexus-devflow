import fs from "node:fs/promises";
import path from "node:path";

export type HistoryCategory = "feature" | "fix" | "rollback";

export interface HistoryLedgerEntry {
  completedDate: string;
  runId: string;
  category: HistoryCategory;
  title: string;
  gitCommit: string;
  status: string;
  archiveLink: string;
}

export interface ArchiveTaskOptions {
  gitCommit?: string;
  category?: HistoryCategory;
  buildPlanPath?: string;
  historyLedgerPath?: string;
  runStatePath?: string;
}

export interface ArchiveTaskResult {
  taskId: string;
  title: string;
  category: HistoryCategory;
  archivePath: string; // e.g. "features/047-studio.md"
  fullArchivePath: string; // absolute path
  ledgerEntry: HistoryLedgerEntry;
  buildPlanUpdated: boolean;
  contextCleaned: boolean;
}

export interface DeliveryCommitPlan {
  commitMessage: string;
  stagedPaths: string[];
  branchHint: string;
  recommendedDeliveryOption: "Option 1: Team MR/PR" | "Option 2: Direct Squash-Merge";
}

function stripCode(value: string): string {
  return value.replace(/^`|`$/g, "").trim();
}

function normalizeCategory(value: string | undefined): HistoryCategory {
  const normalized = value?.toLowerCase().trim();
  if (normalized === "fix") return "fix";
  if (normalized === "rollback") return "rollback";
  return "feature";
}

/**
 * In-memory model and deterministic serializer for devflow/history/HISTORY.md.
 */
export class HistoryLedger {
  public entries: HistoryLedgerEntry[];
  public preamble: string;

  constructor(entries: HistoryLedgerEntry[] = [], preamble: string = "") {
    this.entries = entries;
    this.preamble = preamble;
  }

  /**
   * Parses markdown content of HISTORY.md into a HistoryLedger instance.
   */
  static parse(markdown: string): HistoryLedger {
    const lines = markdown.split(/\r?\n/);
    const preambleLines: string[] = [];
    const entries: HistoryLedgerEntry[] = [];
    let tableFound = false;

    for (const line of lines) {
      if (!tableFound) {
        if (/^\|\s*Completed Date\s*\|/i.test(line)) {
          tableFound = true;
          continue;
        }
        preambleLines.push(line);
        continue;
      }

      if (/^\|\s*[-:]+\s*\|/.test(line)) {
        continue; // delimiter row
      }

      if (/^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)) {
        const cells = line.split("|").slice(1, -1).map((c) => c.trim());
        if (cells.length >= 7) {
          const completedDate = cells[0];
          const runId = stripCode(cells[1]);
          const category = normalizeCategory(cells[2]);
          const title = cells[3];
          const gitCommit = stripCode(cells[4]);
          const status = stripCode(cells[5]);
          const linkMatch = cells[6]?.match(/\(([^)]+)\)/);
          const archiveLink = linkMatch ? linkMatch[1] : cells[6];

          entries.push({
            completedDate,
            runId,
            category,
            title,
            gitCommit,
            status,
            archiveLink,
          });
        }
      }
    }

    const preamble = preambleLines.join("\n").trim();
    return new HistoryLedger(entries, preamble);
  }

  /**
   * Prepends a new delivery run entry to the beginning of the ledger.
   */
  prepend(entry: HistoryLedgerEntry): void {
    this.entries.unshift(entry);
  }

  /**
   * Finds an entry by run ID (case-insensitive).
   */
  find(runId: string): HistoryLedgerEntry | undefined {
    const target = runId.toLowerCase();
    return this.entries.find((e) => e.runId.toLowerCase() === target);
  }

  /**
   * Updates an entry by run ID.
   */
  update(runId: string, patch: Partial<HistoryLedgerEntry>): boolean {
    const index = this.entries.findIndex((e) => e.runId.toLowerCase() === runId.toLowerCase());
    if (index === -1) return false;
    this.entries[index] = { ...this.entries[index], ...patch };
    return true;
  }

  /**
   * Deletes an entry by run ID.
   */
  delete(runId: string): boolean {
    const index = this.entries.findIndex((e) => e.runId.toLowerCase() === runId.toLowerCase());
    if (index === -1) return false;
    this.entries.splice(index, 1);
    return true;
  }

  /**
   * Serializes the ledger to deterministic 7-column Markdown table.
   */
  serialize(): string {
    const lines: string[] = [];
    if (this.preamble) {
      lines.push(this.preamble);
      lines.push("");
    } else {
      lines.push("# Release History");
      lines.push("");
      lines.push("Master delivery ledger tracking all released features, fixes, and rollbacks.");
      lines.push("");
    }

    lines.push("| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");

    for (const e of this.entries) {
      const commitStr = e.gitCommit ? `\`${e.gitCommit}\`` : "-";
      const statusStr = e.status || "completed";
      const linkBase = path.basename(e.archiveLink || `${e.runId}.md`);
      const linkStr = e.archiveLink ? `[${linkBase}](${e.archiveLink})` : "-";

      lines.push(
        `| ${e.completedDate} | \`${e.runId}\` | ${e.category} | ${e.title} | ${commitStr} | ${statusStr} | ${linkStr} |`
      );
    }

    lines.push("");
    return lines.join("\n");
  }
}

/**
 * The deep transactional engine that orchestrates the 4-stage task delivery boundary,
 * atomic archiving of living specs into historical categories, bidirectional build-plan synchronization,
 * and history ledger recording behind a unified seam.
 */
export class DeliveryLifecycleEngine {
  constructor(public projectRoot: string = process.cwd()) {}

  /**
   * Detects whether a task is a feature, fix, or rollback from its living spec and optional slug.
   */
  detectTaskCategory(specMarkdown: string, taskSlug?: string): HistoryCategory {
    const slug = (taskSlug || "").toLowerCase();
    if (slug.startsWith("fix-") || slug.startsWith("fix/")) return "fix";
    if (slug.startsWith("rollback-") || slug.startsWith("rollback/")) return "rollback";

    const lines = specMarkdown.split(/\r?\n/).slice(0, 30);
    for (const line of lines) {
      if (/^#\s*fix:\s*/i.test(line) || /\[fix\]/i.test(line) || /category:\s*fix\b/i.test(line)) {
        return "fix";
      }
      if (/^#\s*rollback:\s*/i.test(line) || /\[rollback\]/i.test(line) || /category:\s*rollback\b/i.test(line)) {
        return "rollback";
      }
      if (/^#\s*(feature|spec):\s*/i.test(line) || /category:\s*feature\b/i.test(line)) {
        return "feature";
      }
    }
    return "feature";
  }

  /**
   * Consolidates living spec, resolved findings, and independent review receipt into an immutable archive markdown.
   */
  consolidateArchiveContent(
    specMarkdown: string,
    findingsMarkdown?: string | null,
    reviewMarkdown?: string | null
  ): string {
    const sections: string[] = [specMarkdown.trim()];

    const hasFindings = Boolean(findingsMarkdown && findingsMarkdown.trim().length > 0);
    const hasReview = Boolean(reviewMarkdown && reviewMarkdown.trim().length > 0);

    if (hasFindings || hasReview) {
      sections.push("\n---\n");
      sections.push("## 📋 Audit Trail & Verification Receipts\n");

      if (hasFindings) {
        sections.push("### Resolved Findings\n");
        sections.push(findingsMarkdown!.trim());
        sections.push("\n");
      }

      if (hasReview) {
        sections.push("### Independent Review Receipt\n");
        sections.push(reviewMarkdown!.trim());
        sections.push("\n");
      }
    }

    return sections.join("\n").trimEnd() + "\n";
  }

  /**
   * Extracts a readable title from living spec markdown or task ID.
   */
  extractTaskTitle(specMarkdown: string, taskId: string): string {
    const firstHeading = specMarkdown.split(/\r?\n/).find((l) => /^#\s+/.test(l));
    if (firstHeading) {
      const clean = firstHeading
        .replace(/^#\s*/, "")
        .replace(/^📐\s*/, "")
        .replace(/^\[[0-9a-zA-Z-]+\]\s*/, "")
        .replace(/^(Feature|Fix|Rollback|Spec):\s*/i, "")
        .trim();
      if (clean) return clean;
    }
    const basename = taskId.replace(/^\d+[a-z]?-/, "");
    return basename
      .split("-")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  /**
   * Atomically archives an active task living spec into devflow/history/{features|fixes|rollbacks}/,
   * updates devflow/history/HISTORY.md, synchronizes devflow/build-plan.md, cleans up active context directory,
   * and records completed run state, with transactional rollback on error.
   */
  async archiveTask(taskId: string, options: ArchiveTaskOptions = {}): Promise<ArchiveTaskResult> {
    const contextRoot = path.join(this.projectRoot, "devflow", "context");
    let taskDir = path.join(contextRoot, taskId);
    let specPath = path.join(taskDir, "spec.md");

    try {
      await fs.access(specPath);
    } catch {
      // Look for task workspace matching prefix or slug
      const entries = await fs.readdir(contextRoot, { withFileTypes: true }).catch(() => []);
      const match = entries.find(
        (e) =>
          e.isDirectory() &&
          (e.name === taskId || e.name.startsWith(taskId + "-") || e.name.endsWith("-" + taskId))
      );
      if (match) {
        taskDir = path.join(contextRoot, match.name);
        specPath = path.join(taskDir, "spec.md");
        taskId = match.name;
      } else {
        throw new Error(`Task workspace not found for ID: ${taskId}`);
      }
    }

    const specMarkdown = await fs.readFile(specPath, "utf8");
    const findingsPath = path.join(taskDir, "findings.md");
    const reviewPath = path.join(taskDir, "review.md");
    const findingsMarkdown = await fs.readFile(findingsPath, "utf8").catch(() => null);
    const reviewMarkdown = await fs.readFile(reviewPath, "utf8").catch(() => null);

    const category = options.category || this.detectTaskCategory(specMarkdown, taskId);
    const title = this.extractTaskTitle(specMarkdown, taskId);

    const categoryFolder = category === "fix" ? "fixes" : category === "rollback" ? "rollbacks" : "features";
    const historyRoot = path.join(this.projectRoot, "devflow", "history");
    const categoryDir = path.join(historyRoot, categoryFolder);
    const archiveFileName = `${taskId}.md`;
    const fullArchivePath = path.join(categoryDir, archiveFileName);
    const relativeArchivePath = `${categoryFolder}/${archiveFileName}`;

    const consolidatedContent = this.consolidateArchiveContent(
      specMarkdown,
      findingsMarkdown,
      reviewMarkdown
    );

    const rollbackActions: Array<() => Promise<void>> = [];

    try {
      // 1. Write archive file
      const archiveAlreadyExisted = await fs.access(fullArchivePath).then(() => true).catch(() => false);
      const originalArchiveContent = archiveAlreadyExisted ? await fs.readFile(fullArchivePath, "utf8") : null;
      rollbackActions.push(async () => {
        if (archiveAlreadyExisted && originalArchiveContent !== null) {
          await fs.writeFile(fullArchivePath, originalArchiveContent, "utf8");
        } else {
          await fs.rm(fullArchivePath, { force: true });
        }
      });

      await fs.mkdir(categoryDir, { recursive: true });
      await fs.writeFile(fullArchivePath, consolidatedContent, "utf8");

      // 2. Update HISTORY.md ledger
      const ledgerPath = options.historyLedgerPath || path.join(historyRoot, "HISTORY.md");
      const originalLedger = await fs.readFile(ledgerPath, "utf8").catch(() => null);
      rollbackActions.push(async () => {
        if (originalLedger !== null) {
          await fs.writeFile(ledgerPath, originalLedger, "utf8");
        } else {
          await fs.rm(ledgerPath, { force: true });
        }
      });

      const ledger = originalLedger !== null ? HistoryLedger.parse(originalLedger) : new HistoryLedger();
      const ledgerEntry: HistoryLedgerEntry = {
        completedDate: new Date().toISOString().split("T")[0],
        runId: taskId,
        category,
        title,
        gitCommit: options.gitCommit || "-",
        status: "completed",
        archiveLink: relativeArchivePath,
      };
      ledger.prepend(ledgerEntry);
      await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
      await fs.writeFile(ledgerPath, ledger.serialize(), "utf8");

      // 3. Update build-plan.md
      let buildPlanUpdated = false;
      const buildPlanPath = options.buildPlanPath || path.join(this.projectRoot, "devflow", "build-plan.md");
      const originalBuildPlan = await fs.readFile(buildPlanPath, "utf8").catch(() => null);
      if (originalBuildPlan !== null) {
        rollbackActions.push(async () => {
          await fs.writeFile(buildPlanPath, originalBuildPlan, "utf8");
        });

        let updatedPlan = originalBuildPlan;
        const idRegex = new RegExp(`(-\\s*\\[)[ xX](\\]\\s*.*\\b${taskId}\\b.*)`, "i");
        if (idRegex.test(updatedPlan)) {
          const replacement = category === "rollback" ? "$1 $2" : "$1x$2";
          updatedPlan = updatedPlan.replace(idRegex, replacement);
          buildPlanUpdated = true;
        } else {
          const titleWord = title.split(" ")[0];
          if (titleWord && titleWord.length > 3) {
            const titleRegex = new RegExp(`(-\\s*\\[)[ xX](\\]\\s*.*\\b${titleWord}\\b.*)`, "i");
            if (titleRegex.test(updatedPlan)) {
              const replacement = category === "rollback" ? "$1 $2" : "$1x$2";
              updatedPlan = updatedPlan.replace(titleRegex, replacement);
              buildPlanUpdated = true;
            }
          }
        }
        if (buildPlanUpdated) {
          await fs.writeFile(buildPlanPath, updatedPlan, "utf8");
        }
      }

      // 4. Update run.json if it exists
      const runStatePath = options.runStatePath || path.join(this.projectRoot, "devflow", ".state", "run.json");
      const originalRunState = await fs.readFile(runStatePath, "utf8").catch(() => null);
      if (originalRunState !== null) {
        rollbackActions.push(async () => {
          await fs.writeFile(runStatePath, originalRunState, "utf8");
        });
        try {
          const runData = JSON.parse(originalRunState);
          runData.status = "completed";
          runData.updatedAt = new Date().toISOString();
          await fs.writeFile(runStatePath, JSON.stringify(runData, null, 2), "utf8");
        } catch {
          // Ignore malformed json
        }
      }

      // 5. Clean up task context workspace directory
      await fs.rm(taskDir, { recursive: true, force: true });

      return {
        taskId,
        title,
        category,
        archivePath: relativeArchivePath,
        fullArchivePath,
        ledgerEntry,
        buildPlanUpdated,
        contextCleaned: true,
      };
    } catch (error) {
      // Execute rollbacks in reverse order
      for (const rollback of rollbackActions.reverse()) {
        try {
          await rollback();
        } catch {
          // Ignore secondary rollback failures
        }
      }
      throw error;
    }
  }

  /**
   * Generates a conventional delivery commit plan and staged paths for user delivery gate review.
   */
  generateCommitPlan(taskResult: ArchiveTaskResult): DeliveryCommitPlan {
    let prefix = "feat:";
    if (taskResult.category === "fix") {
      prefix = "fix:";
    } else if (taskResult.category === "rollback") {
      prefix = "revert: rollback";
    }

    const commitMessage = `${prefix} ${taskResult.title} (#${taskResult.taskId})`;
    const stagedPaths = [
      `devflow/history/${taskResult.archivePath}`,
      "devflow/history/HISTORY.md",
    ];
    if (taskResult.buildPlanUpdated) {
      stagedPaths.push("devflow/build-plan.md");
    }

    return {
      commitMessage,
      stagedPaths,
      branchHint: `git checkout main && git merge --squash feature/${taskResult.taskId}`,
      recommendedDeliveryOption: "Option 1: Team MR/PR",
    };
  }
}


