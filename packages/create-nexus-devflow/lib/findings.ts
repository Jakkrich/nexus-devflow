import fs from "node:fs/promises";
import path from "node:path";

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

export { DEVFLOW_FINDINGS_PATH, parseFindings, readFindings };

export type {
  Finding,
  FindingSeverity,
  FindingsSummary,
  FindingStatus,
  FindingsWarning,
  FindingsWarningCode
};
