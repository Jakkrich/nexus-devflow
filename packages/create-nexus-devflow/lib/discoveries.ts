import fs from "node:fs/promises";
import path from "node:path";
import type { Dirent } from "node:fs";

interface DiscoveryItem {
  id: string;
  title: string;
  date: string | null;
  decision: "Proceed" | "Defer" | "Reject" | "Unknown";
  approvalStatus: string | null;
  status: string | null;
  file: string;
}

interface DiscoverySummary {
  total: number;
  activeId: string | null;
  active: DiscoveryItem | null;
  recent: DiscoveryItem[];
}

async function readDiscoveries(
  projectRoot: string,
  activeId: string | null = null
): Promise<DiscoverySummary> {
  const root = path.join(projectRoot, "devflow", "discoveries");
  let entries: Dirent<string>[];
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch (error: unknown) {
    if (getErrorCode(error) === "ENOENT") return emptySummary(activeId);
    throw error;
  }

  const items = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
      .map(async (entry) => {
        let file = path.join(entry.name, "discovery.md");
        let markdown = "";
        try {
          markdown = await fs.readFile(path.join(root, file), "utf8");
        } catch (error: unknown) {
          if (getErrorCode(error) === "ENOENT") {
            file = path.join(entry.name, "00-explore.md");
            try {
              markdown = await fs.readFile(path.join(root, file), "utf8");
            } catch (fallbackError: unknown) {
              if (getErrorCode(fallbackError) === "ENOENT") return null;
              throw fallbackError;
            }
          } else {
            throw error;
          }
        }
        return parseDiscovery(markdown, file, entry.name);
      })
  );
  const valid = items.filter((item): item is DiscoveryItem => item !== null)
    .sort((left, right) => right.id.localeCompare(left.id));

  return {
    total: valid.length,
    activeId,
    active: valid.find((item) => item.id === activeId) || null,
    recent: valid.slice(0, 6)
  };
}

function parseDiscovery(markdown: string, file: string, fallbackId: string): DiscoveryItem {
  const id = field(markdown, "Discovery ID") || fallbackId.match(/DISC-\d{8}-\d{3}/)?.[0] || fallbackId;
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallbackId;
  const title = heading
    .replace(/^.*?\]\s*/, "")
    .replace(/^Discovery Document:\s*/i, "")
    .trim();
  const finalDecision = markdown.match(/Final Decision:\s*`?(Proceed|Defer|Reject)`?/i)?.[1];
  const status = field(markdown, "Status");
  const statusDecision = status?.match(/\b(Proceed|Defer|Reject)\b/i)?.[1];
  const normalizedDecision = finalDecision || statusDecision;

  return {
    id,
    title,
    date: field(markdown, "Date"),
    decision: normalizeDecision(normalizedDecision),
    approvalStatus: field(markdown, "Approval Status"),
    status,
    file: file.replaceAll("\\", "/")
  };
}

function field(markdown: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return markdown.match(new RegExp(`\\*\\*${escaped}\\*\\*:\\s*\\x60?([^\\r\\n\\x60]+)`, "i"))?.[1]?.trim() || null;
}

function normalizeDecision(value: string | undefined): DiscoveryItem["decision"] {
  const normalized = value?.toLowerCase();
  if (normalized === "proceed") return "Proceed";
  if (normalized === "defer") return "Defer";
  if (normalized === "reject") return "Reject";
  return "Unknown";
}

function emptySummary(activeId: string | null): DiscoverySummary {
  return { total: 0, activeId, active: null, recent: [] };
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
    ? error.code
    : undefined;
}

export { parseDiscovery, readDiscoveries };
export type { DiscoveryItem, DiscoverySummary };
