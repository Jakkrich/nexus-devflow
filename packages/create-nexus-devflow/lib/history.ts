import fs from "node:fs/promises";
import path from "node:path";
import { createStyle } from "./ui.js";

type HistoryItemType = "feature" | "fix" | "rollback";

interface HistoryItem {
  type: HistoryItemType;
  title: string;
  buildPlanItem: string | null;
  status: string | null;
  file: string;
}

interface HistorySummary {
  items: HistoryItem[];
  total: number;
}

const HISTORY_PATH = path.join("devflow", "history");
const HISTORY_GROUPS: ReadonlyArray<{
  directory: string;
  type: HistoryItemType;
}> = [
  { directory: "features", type: "feature" },
  { directory: "fixes", type: "fix" },
  { directory: "rollbacks", type: "rollback" }
];

async function readHistory(projectRoot: string): Promise<HistorySummary> {
  const ledgerItems = await readHistoryLedger(projectRoot);
  if (ledgerItems.length > 0) {
    return {
      items: ledgerItems.sort(compareHistoryItems),
      total: ledgerItems.length
    };
  }

  const items = (
    await Promise.all(
      HISTORY_GROUPS.map((group) => readHistoryGroup(projectRoot, group))
    )
  ).flat();

  return {
    items: items.sort(compareHistoryItems),
    total: items.length
  };
}

async function readHistoryLedger(projectRoot: string): Promise<HistoryItem[]> {
  const ledgerPath = path.join(projectRoot, HISTORY_PATH, "HISTORY.md");
  try {
    return parseHistoryLedger(await fs.readFile(ledgerPath, "utf8"));
  } catch (error: unknown) {
    if (getErrorCode(error) === "ENOENT") return [];
    throw error;
  }
}

function parseHistoryLedger(markdown: string): HistoryItem[] {
  const items: HistoryItem[] = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!/^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 7) continue;
    const runId = stripCode(cells[1] || "");
    const type = normalizeHistoryType(cells[2]) || "feature";
    const title = cells[3] || titleFromFile(runId);
    const status = stripCode(cells[5] || "") || null;
    const file = cells[6]?.match(/\(([^)]+)\)/)?.[1] || "";
    items.push({ type, title, buildPlanItem: runId || null, status, file });
  }
  return items;
}

function stripCode(value: string): string {
  return value.replace(/^`|`$/g, "").trim();
}

async function readHistoryGroup(
  projectRoot: string,
  group: (typeof HISTORY_GROUPS)[number]
): Promise<HistoryItem[]> {
  const historyRoot = path.join(projectRoot, HISTORY_PATH);
  const directoryPath = path.join(projectRoot, HISTORY_PATH, group.directory);

  try {
    if (
      !(await isRegularDirectory(historyRoot)) ||
      !(await isRegularDirectory(directoryPath))
    ) {
      return [];
    }

    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const archiveEntries = entries
      .filter(
        (entry) =>
          !entry.isSymbolicLink() &&
          (entry.isDirectory() || (
            entry.isFile() &&
            entry.name.endsWith(".md") &&
            entry.name.toLowerCase() !== "readme.md" &&
            entry.name.toLowerCase() !== "history.md"
          ))
      )
      .sort((left, right) => left.name.localeCompare(right.name));

    const items = await Promise.all(
      archiveEntries.map((entry) =>
        readHistoryEntry(directoryPath, group, entry.name, entry.isDirectory())
      )
    );
    return items.filter((item): item is HistoryItem => item !== null);
  } catch (error: unknown) {
    if (getErrorCode(error) === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function readHistoryEntry(
  directoryPath: string,
  group: (typeof HISTORY_GROUPS)[number],
  entryName: string,
  isDirectory: boolean
): Promise<HistoryItem | null> {
  if (!isDirectory) {
    const relativeFile = path.join(group.directory, entryName);
    const markdown = await fs.readFile(path.join(directoryPath, entryName), "utf8");
    return parseHistoryItem(markdown, group.type, relativeFile);
  }

  const preferred = ["current-feature.md", "spec.md", "discovery.md", "report.md"];
  const selected = preferred.find((name) =>
    entries.some((entry) => entry.isFile() && !entry.isSymbolicLink() && entry.name === name)
  ) || entries.find((entry) =>
    entry.isFile() &&
    !entry.isSymbolicLink() &&
    entry.name.endsWith(".md") &&
    entry.name.toLowerCase() !== "readme.md"
  )?.name;
  if (!selected) return null;

  const relativeFile = path.join(group.directory, entryName, selected);
  const markdown = await fs.readFile(path.join(archivePath, selected), "utf8");
  return parseHistoryItem(markdown, group.type, relativeFile);
}

async function isRegularDirectory(directoryPath: string): Promise<boolean> {
  try {
    const stats = await fs.lstat(directoryPath);
    return !stats.isSymbolicLink() && stats.isDirectory();
  } catch (error: unknown) {
    if (getErrorCode(error) === "ENOENT") {
      return false;
    }

    throw error;
  }
}

function parseHistoryItem(
  markdown: string,
  fallbackType: HistoryItemType,
  file: string
): HistoryItem {
  const line = markdown.split(/\r?\n/)[0] || "";
  let cleanLine = line.replace(/^#\s*/, "").trim();

  let buildPlanItem: string | null = null;
  const idBrackets = cleanLine.match(/^\[([0-9a-zA-Z-]+)\]\s*/);
  if (idBrackets) {
    buildPlanItem = idBrackets[1];
    cleanLine = cleanLine.slice(idBrackets[0].length).trim();
  }

  const typeMatch = cleanLine.match(/^(Feature|Fix|Rollback):\s*/i);
  let type: HistoryItemType = fallbackType;
  if (typeMatch) {
    const normalized = normalizeHistoryType(typeMatch[1]);
    if (normalized) {
      type = normalized;
    }
    cleanLine = cleanLine.slice(typeMatch[0].length).trim();
  }

  if (!buildPlanItem) {
    buildPlanItem = markdown.match(
      /^\*\*From build-plan:\*\*\s*feature\s+([0-9]+[a-z]?)\b/im
    )?.[1]?.toLowerCase() || null;
  }

  const title = cleanLine || titleFromFile(file);
  const status = markdown.match(/^\*\*Status:\*\*\s*(.+)$/im)?.[1]?.trim() || null;

  return { type, title, buildPlanItem, status, file };
}

function titleFromFile(file: string): string {
  const basename = path.basename(file, ".md").replace(/^\d+[a-z]?-/, "");
  return basename
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function normalizeHistoryType(value: string | undefined): HistoryItemType | null {
  const normalized = value?.toLowerCase();
  return normalized === "feature" || normalized === "fix" || normalized === "rollback"
    ? normalized
    : null;
}

function compareHistoryItems(left: HistoryItem, right: HistoryItem): number {
  const leftId = parseBuildPlanOrder(left.buildPlanItem);
  const rightId = parseBuildPlanOrder(right.buildPlanItem);

  if (leftId !== rightId) {
    return rightId - leftId;
  }

  return right.file.localeCompare(left.file);
}

function parseBuildPlanOrder(value: string | null): number {
  if (!value) {
    return -1;
  }

  const match = value.match(/^(\d+)([a-z]?)$/i);
  if (!match) {
    return -1;
  }

  const whole = Number.parseInt(match[1] || "0", 10);
  const suffix = match[2]?.toLowerCase().charCodeAt(0) || 96;
  return whole * 100 + Math.max(0, suffix - 96);
}

function formatHistoryHuman(
  summary: HistorySummary,
  options: { color?: boolean; statsOnly?: boolean } = {}
): string {
  const style = createStyle(options.color);
  const lines: string[] = [];

  const features = summary.items.filter((i) => i.type === "feature");
  const fixes = summary.items.filter((i) => i.type === "fix");
  const rollbacks = summary.items.filter((i) => i.type === "rollback");

  lines.push(
    style.bold(
      `Nexus-DevFlow Delivery Archives (${summary.total} total: ${features.length} features, ${fixes.length} fixes, ${rollbacks.length} rollbacks)`
    )
  );
  lines.push("");

  if (options.statsOnly) {
    lines.push(`  ${style.cyan("Features:")}  ${features.length}`);
    lines.push(`  ${style.yellow("Fixes:")}     ${fixes.length}`);
    lines.push(`  ${style.red("Rollbacks:")} ${rollbacks.length}`);
    return lines.join("\n");
  }

  if (summary.items.length === 0) {
    lines.push(style.dim("  No archived delivery runs found in devflow/history/"));
  } else {
    for (const item of summary.items) {
      let typeBadge = style.cyan(`[${item.type}]`);
      if (item.type === "fix") typeBadge = style.yellow(`[${item.type}]`);
      if (item.type === "rollback") typeBadge = style.red(`[${item.type}]`);

      const idBadge = item.buildPlanItem ? style.bold(`[${item.buildPlanItem}]`) : "";
      lines.push(`  ${typeBadge} ${idBadge} ${style.bold(item.title)}`);
      lines.push(`     ${style.dim(item.file)}`);
    }
  }

  return lines.join("\n").trimEnd();
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
    ? error.code
    : undefined;
}

export { HISTORY_PATH, formatHistoryHuman, parseHistoryItem, parseHistoryLedger, readHistory };

export type { HistoryItem, HistoryItemType, HistorySummary };
