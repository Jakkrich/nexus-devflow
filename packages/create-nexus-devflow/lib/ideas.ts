import fs from "node:fs/promises";
import path from "node:path";
import { createStyle } from "./ui.js";

export interface IdeaItem {
  id: string;
  title: string;
  date: string;
  rawInput: string;
  feasibility: string;
  value: string;
  status: "Pending" | "Claimed" | "Completed" | "Unknown";
}

export interface IdeasSummary {
  totalPending: number;
  totalArchived: number;
  pending: IdeaItem[];
}

export interface AddIdeaOptions {
  text: string;
  title?: string;
  feasibility?: string;
  value?: string;
}

export async function readIdeas(projectRoot: string): Promise<IdeasSummary> {
  const ideasPath = path.join(projectRoot, "devflow", "ideas.md");

  try {
    const content = await fs.readFile(ideasPath, "utf8");
    return parseIdeasContent(content);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {
        totalPending: 0,
        totalArchived: 0,
        pending: []
      };
    }
    throw error;
  }
}

export async function addIdea(
  projectRoot: string,
  options: AddIdeaOptions
): Promise<IdeaItem> {
  const ideasPath = path.join(projectRoot, "devflow", "ideas.md");
  let content = "";
  try {
    content = await fs.readFile(ideasPath, "utf8");
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      content = `# 💡 DevFlow Idea Inbox & Backlog\n\nบันทึกไอเดียที่รอดำเนินการ พร้อมบทวิเคราะห์ความเป็นไปได้เบื้องต้นจาก AI (บันทึกด้วยคำสั่ง \`/idea "<text>"\`)\n\n---\n\n## 📌 Pending Ideas\n\n## 📦 Archived / Shipped Ideas\n`;
      await fs.mkdir(path.dirname(ideasPath), { recursive: true });
    } else {
      throw error;
    }
  }

  const idMatches = content.match(/IDEA-(\d+)/g) || [];
  let maxId = 0;
  for (const match of idMatches) {
    const num = parseInt(match.replace("IDEA-", ""), 10);
    if (!isNaN(num) && num > maxId) {
      maxId = num;
    }
  }
  const nextIdNum = maxId + 1;
  const newId = `IDEA-${String(nextIdNum).padStart(3, "0")}`;

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const cleanText = options.text.trim();
  const rawTitle = options.title?.trim() || cleanText.split("\n")[0].slice(0, 60);
  const title = rawTitle.replace(/[#*`_]/g, "").trim() || "Untitled Idea";
  const feasibility = options.feasibility || "**รอวิเคราะห์ (Pending AI Review)**";
  const value = options.value || "**รอวิเคราะห์**";

  const newIdeaBlock = `### [${newId}] ${title}\n- **บันทึกเมื่อ**: ${dateStr}\n- **ไอเดียตั้งต้น**: ${cleanText}\n- **AI Feasibility & Tech**: ${feasibility}\n- **Value & Potential**: ${value}\n- **Quick Seed (กันลืม)**:\n  1. ${cleanText.slice(0, 100)}\n- **สถานะ**: \`Pending\` (หยิบไปทำได้ด้วย \`/feature ${newId}\` หรือ \`/00-explore ${newId}\`)\n\n---\n\n`;

  const pendingIndex = content.indexOf("## 📌 Pending Ideas");
  if (pendingIndex !== -1) {
    const newlineAfterPending = content.indexOf("\n", pendingIndex);
    const insertPos = newlineAfterPending !== -1 ? newlineAfterPending + 1 : pendingIndex + "## 📌 Pending Ideas".length;
    content = content.slice(0, insertPos) + "\n" + newIdeaBlock + content.slice(insertPos);
  } else {
    content += `\n\n## 📌 Pending Ideas\n\n${newIdeaBlock}`;
  }

  await fs.writeFile(ideasPath, content, "utf8");

  return {
    id: newId,
    title,
    date: dateStr,
    rawInput: cleanText,
    feasibility,
    value,
    status: "Pending"
  };
}

export function formatIdeasHuman(
  summary: IdeasSummary,
  options: { color?: boolean } = {}
): string {
  const style = createStyle(options.color);
  const lines: string[] = [];

  lines.push(
    style.bold(
      `DevFlow Idea Inbox & Backlog (${summary.totalPending} pending, ${summary.totalArchived} archived)`
    )
  );
  lines.push("");

  if (summary.pending.length === 0) {
    lines.push(style.dim("  No pending ideas found in devflow/ideas.md"));
    lines.push(style.dim("  Record a new idea with: nexus-devflow idea add \"<text>\""));
  } else {
    for (const idea of summary.pending) {
      lines.push(
        `  ${style.bold(style.cyan(`[${idea.id}]`))} ${style.bold(idea.title)}`
      );
      if (idea.rawInput) {
        lines.push(`    ${style.dim("Input:")} ${idea.rawInput}`);
      }
      if (idea.feasibility) {
        lines.push(`    ${style.dim("Feasibility:")} ${idea.feasibility}`);
      }
      lines.push(
        `    ${style.dim("Start:")} ${style.yellow(`/feature ${idea.id}`)} or ${style.yellow(`/00-explore ${idea.id}`)}`
      );
      lines.push("");
    }
  }

  return lines.join("\n").trimEnd();
}

export function parseIdeasContent(content: string): IdeasSummary {
  const lines = content.split(/\r?\n/);
  const pending: IdeaItem[] = [];
  let totalArchived = 0;

  let inArchivedSection = false;
  let currentIdea: Partial<IdeaItem> | null = null;

  for (const line of lines) {
    if (line.startsWith("## 📦 Archived")) {
      if (currentIdea && currentIdea.id && currentIdea.title && !inArchivedSection) {
        pending.push(finalizeIdea(currentIdea));
        currentIdea = null;
      }
      inArchivedSection = true;
      continue;
    }

    if (inArchivedSection) {
      if (line.startsWith("### [IDEA-") || line.startsWith("### ") || line.startsWith("- [x] **[IDEA-")) {
        totalArchived++;
      }
      continue;
    }

    const headerMatch = line.match(/^###\s+\[(IDEA-\d+)\]\s+(.+)$/);
    if (headerMatch) {
      if (currentIdea && currentIdea.id && currentIdea.title) {
        pending.push(finalizeIdea(currentIdea));
      }

      currentIdea = {
        id: headerMatch[1],
        title: headerMatch[2].trim(),
        date: "",
        rawInput: "",
        feasibility: "",
        value: "",
        status: "Pending"
      };
      continue;
    }

    if (currentIdea) {
      if (line.includes("- **บันทึกเมื่อ**:")) {
        currentIdea.date = line.replace("- **บันทึกเมื่อ**:", "").trim();
      } else if (line.includes("- **ไอเดียตั้งต้น**:")) {
        currentIdea.rawInput = line.replace("- **ไอเดียตั้งต้น**:", "").trim();
      } else if (line.includes("- **AI Feasibility & Tech**:")) {
        currentIdea.feasibility = line.replace("- **AI Feasibility & Tech**:", "").trim();
      } else if (line.includes("- **Value & Potential**:")) {
        currentIdea.value = line.replace("- **Value & Potential**:", "").trim();
      } else if (line.includes("- **สถานะ**:")) {
        const rawStatus = line.replace("- **สถานะ**:", "").trim();
        if (rawStatus.includes("Claimed")) {
          currentIdea.status = "Claimed";
        } else if (rawStatus.includes("Pending")) {
          currentIdea.status = "Pending";
        }
      }
    }
  }

  if (currentIdea && currentIdea.id && currentIdea.title && !inArchivedSection) {
    pending.push(finalizeIdea(currentIdea));
  }

  return {
    totalPending: pending.length,
    totalArchived,
    pending
  };
}

function finalizeIdea(raw: Partial<IdeaItem>): IdeaItem {
  return {
    id: raw.id || "IDEA-UNKNOWN",
    title: raw.title || "Untitled Idea",
    date: raw.date || "",
    rawInput: raw.rawInput || "",
    feasibility: raw.feasibility || "",
    value: raw.value || "",
    status: raw.status as IdeaItem["status"] || "Pending"
  };
}
