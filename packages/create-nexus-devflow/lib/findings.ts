import fs from "node:fs/promises";
import path from "node:path";
import { createStyle } from "./ui.js";

type FindingSeverity = "P0" | "P1" | "P2" | "P3";
type FindingStatus =
  | "unverified"
  | "open"
  | "fixed"
  | "closed"
  | "accepted"
  | "invalid";

interface Finding {
  id: string;
  severity: FindingSeverity;
  status: FindingStatus;
  title: string;
  line: number;
}

type FindingsWarningCode =
  | "invalid_findings_path"
  | "malformed_findings"
  | "unsafe_findings_path";

interface FindingsWarning {
  code: FindingsWarningCode;
  message: string;
}

interface FindingsSummary {
  items: Finding[];
  total: number;
  byStatus: Record<FindingStatus, number>;
  blockers: Finding[];
  warnings: FindingsWarning[];
}

const DEVFLOW_FINDINGS_PATH = path.join("devflow", "context", "findings.md");
const BLUEPRINT_FINDINGS_PATH = path.join("blueprint", "context", "findings.md");
const FINDING_PATTERN = /^###\s+(\S+)\s+\[(P[0-3])\]\s+(unverified|open|fixed|closed|accepted|invalid)\s+-\s+(.+?)\s*$/i;

async function getFindingsFilePath(projectRoot: string): Promise<string | null> {
  const devflowPath = path.join(projectRoot, DEVFLOW_FINDINGS_PATH);
  const blueprintPath = path.join(projectRoot, BLUEPRINT_FINDINGS_PATH);

  try {
    const stats = await fs.lstat(devflowPath);
    if (stats.isFile()) return devflowPath;
  } catch {
    // try fallback
  }

  try {
    const stats = await fs.lstat(blueprintPath);
    if (stats.isFile()) return blueprintPath;
  } catch {
    // not found
  }

  return null;
}

async function readFindings(projectRoot: string): Promise<FindingsSummary> {
  let findingsPath = path.join(projectRoot, DEVFLOW_FINDINGS_PATH);

  try {
    let stats = await fs.lstat(findingsPath);
    if (!stats.isFile()) {
      const altPath = path.join(projectRoot, BLUEPRINT_FINDINGS_PATH);
      const altStats = await fs.lstat(altPath).catch(() => null);
      if (altStats?.isFile()) {
        findingsPath = altPath;
        stats = altStats;
      }
    }

    if (stats.isSymbolicLink()) {
      return emptySummary({
        code: "unsafe_findings_path",
        message: "Findings file is a symbolic link and was not read."
      });
    }

    if (!stats.isFile()) {
      return emptySummary({
        code: "invalid_findings_path",
        message: "Findings path is not a regular file."
      });
    }

    return parseFindings(await fs.readFile(findingsPath, "utf8"));
  } catch (error: unknown) {
    if (getErrorCode(error) === "ENOENT") {
      try {
        const altPath = path.join(projectRoot, BLUEPRINT_FINDINGS_PATH);
        const altContent = await fs.readFile(altPath, "utf8");
        return parseFindings(altContent);
      } catch {
        return emptySummary();
      }
    }

    throw error;
  }
}

async function resolveFinding(
  projectRoot: string,
  findingId: string,
  newStatus: FindingStatus = "closed"
): Promise<{
  success: boolean;
  message: string;
  previousStatus?: FindingStatus;
  finding?: Finding;
}> {
  const filePath = await getFindingsFilePath(projectRoot);
  if (!filePath) {
    return {
      success: false,
      message: `Findings file not found in ${projectRoot}`
    };
  }

  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  let targetIndex = -1;
  let previousStatus: FindingStatus | undefined;
  let updatedFinding: Finding | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(FINDING_PATTERN);
    if (match && match[1]?.toLowerCase() === findingId.toLowerCase()) {
      targetIndex = i;
      const id = match[1];
      const severity = (match[2] || "").toUpperCase() as FindingSeverity;
      previousStatus = (match[3] || "").toLowerCase() as FindingStatus;
      const title = (match[4] || "").trim();

      lines[i] = `### ${id} [${severity}] ${newStatus} - ${title}`;
      updatedFinding = {
        id,
        severity,
        status: newStatus,
        title,
        line: i + 1
      };
      break;
    }
  }

  if (targetIndex === -1 || !updatedFinding) {
    return {
      success: false,
      message: `Finding with ID '${findingId}' not found in ${filePath}`
    };
  }

  await fs.writeFile(filePath, lines.join("\n"), "utf8");

  return {
    success: true,
    message: `Finding ${updatedFinding.id} status updated from '${previousStatus}' to '${newStatus}'`,
    previousStatus,
    finding: updatedFinding
  };
}

function formatFindingsHuman(
  summary: FindingsSummary,
  options: { blockersOnly?: boolean; color?: boolean } = {}
): string {
  const style = createStyle(options.color);
  const lines: string[] = [];

  const items = options.blockersOnly ? summary.blockers : summary.items;
  const headerTitle = options.blockersOnly
    ? `Findings Blockers (${summary.blockers.length} active P0/P1)`
    : `Findings Ledger (${summary.total} total, ${summary.blockers.length} blockers)`;

  lines.push(style.bold(headerTitle));
  lines.push("");

  if (items.length === 0) {
    lines.push(
      style.dim(
        options.blockersOnly
          ? "  No active P0/P1 blockers! Ready for delivery."
          : "  No findings recorded in devflow/context/findings.md"
      )
    );
  } else {
    for (const finding of items) {
      const isBlocker =
        (finding.severity === "P0" || finding.severity === "P1") &&
        (finding.status === "open" || finding.status === "fixed");
      const sevFormatted = isBlocker
        ? style.bold(style.red(`[${finding.severity}]`))
        : style.yellow(`[${finding.severity}]`);
      const statusFormatted =
        finding.status === "closed" || finding.status === "accepted"
          ? style.green(finding.status)
          : finding.status === "fixed"
            ? style.cyan(finding.status)
            : style.yellow(finding.status);

      lines.push(
        `  ${style.bold(style.cyan(finding.id))} ${sevFormatted} ${statusFormatted} - ${finding.title}`
      );
    }
  }

  return lines.join("\n").trimEnd();
}

function parseFindings(markdown: string): FindingsSummary {
  const items: Finding[] = [];
  let malformed = false;

  for (const [index, line] of markdown.split(/\r?\n/).entries()) {
    const match = line.match(FINDING_PATTERN);

    if (match) {
      items.push({
        id: match[1] || "",
        severity: (match[2] || "").toUpperCase() as FindingSeverity,
        status: (match[3] || "").toLowerCase() as FindingStatus,
        title: (match[4] || "").trim(),
        line: index + 1
      });
    } else if (/^###\s+\S+\s+\[P/i.test(line)) {
      malformed = true;
    }
  }

  const byStatus = createStatusCounts();
  for (const finding of items) {
    byStatus[finding.status] += 1;
  }

  return {
    items,
    total: items.length,
    byStatus,
    blockers: items.filter(
      (finding) =>
        (finding.severity === "P0" || finding.severity === "P1") &&
        (finding.status === "open" || finding.status === "fixed")
    ),
    warnings: malformed
      ? [{
          code: "malformed_findings",
          message: "One or more finding headings do not match the required ledger format."
        }]
      : []
  };
}

function createStatusCounts(): Record<FindingStatus, number> {
  return {
    unverified: 0,
    open: 0,
    fixed: 0,
    closed: 0,
    accepted: 0,
    invalid: 0
  };
}

function emptySummary(warning?: FindingsWarning): FindingsSummary {
  return {
    items: [],
    total: 0,
    byStatus: createStatusCounts(),
    blockers: [],
    warnings: warning ? [warning] : []
  };
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
    ? error.code
    : undefined;
}

interface AddFindingOptions {
  id?: string;
  severity?: FindingSeverity;
  status?: FindingStatus;
  location?: string;
  impact?: string;
  remediation?: string;
}

async function addFinding(
  projectRoot: string,
  title: string,
  options: AddFindingOptions = {}
): Promise<{
  success: boolean;
  message: string;
  finding?: Finding;
  filePath: string;
}> {
  let filePath = await getFindingsFilePath(projectRoot);
  let content = "";

  if (!filePath) {
    filePath = path.join(projectRoot, DEVFLOW_FINDINGS_PATH);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    content = `# Findings Ledger\n\n> Durable record of audit findings, security issues, and code quality items.\n> Active P0 and P1 findings in \`open\` or \`fixed\` status block delivery and releases.\n\n`;
  } else {
    content = await fs.readFile(filePath, "utf8");
  }

  const existing = parseFindings(content);
  const severity = options.severity || "P2";
  const status = options.status || "open";

  let id = options.id?.trim();
  if (!id) {
    let maxNum = 0;
    for (const item of existing.items) {
      const numMatch = item.id.match(/\d+$/);
      if (numMatch) {
        const n = parseInt(numMatch[0], 10);
        if (!isNaN(n) && n > maxNum) {
          maxNum = n;
        }
      }
    }
    const nextSeq = String(maxNum + 1).padStart(3, "0");
    id = `FIND-${nextSeq}`;
  }

  const cleanTitle = title.trim();
  const entryLines: string[] = [];
  entryLines.push(`### ${id} [${severity}] ${status} - ${cleanTitle}`);

  if (options.location) {
    entryLines.push(`- **Location**: \`${options.location}\``);
  }
  if (options.impact) {
    entryLines.push(`- **Impact**: ${options.impact}`);
  }
  if (options.remediation) {
    entryLines.push(`- **Remediation**: ${options.remediation}`);
  }

  const newEntry = entryLines.join("\n") + "\n";

  let updatedContent = content.trimEnd();
  if (updatedContent.length > 0) {
    updatedContent += "\n\n" + newEntry;
  } else {
    updatedContent = newEntry;
  }

  await fs.writeFile(filePath, updatedContent, "utf8");

  const finding: Finding = {
    id,
    severity,
    status,
    title: cleanTitle,
    line: updatedContent.split(/\r?\n/).length
  };

  return {
    success: true,
    message: `Added finding ${id} [${severity}] ${status} to ${filePath}`,
    finding,
    filePath
  };
}

export {
  DEVFLOW_FINDINGS_PATH,
  addFinding,
  formatFindingsHuman,
  parseFindings,
  readFindings,
  resolveFinding
};

export type {
  AddFindingOptions,
  Finding,
  FindingSeverity,
  FindingsSummary,
  FindingStatus,
  FindingsWarning,
  FindingsWarningCode
};
