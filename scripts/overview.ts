#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

interface BuildQueueItem {
  readonly status: "done" | "pending";
  readonly title: string;
}

interface OverviewArgs {
  readonly projectRoot: string;
  readonly write: boolean;
  readonly templatePath?: string;
}

interface ParsedSections {
  readonly raw: string;
  readonly map: Record<string, string>;
}

interface OverviewValues {
  readonly generatedAt: string;
  readonly projectName: string;
  readonly projectPurpose: string;
  readonly architecture: string;
  readonly stackAndTooling: string;
  readonly constraints: string;
  readonly buildQueue: string;
  readonly shippedCapabilities: string;
  readonly ideasSummary: string;
  readonly dataSources: string;
  readonly verificationCommands: string;
}

function toTemplateContext(values: OverviewValues): Record<string, string> {
  return {
    generatedAt: values.generatedAt,
    projectName: values.projectName,
    projectPurpose: values.projectPurpose,
    architecture: values.architecture,
    stackAndTooling: values.stackAndTooling,
    constraints: values.constraints,
    buildQueue: values.buildQueue,
    shippedCapabilities: values.shippedCapabilities,
    ideasSummary: values.ideasSummary,
    dataSources: values.dataSources,
    verificationCommands: values.verificationCommands
  };
}

function parseArgs(argv: string[]): OverviewArgs {
  let write = false;
  let templatePath: string | undefined;
  let projectRoot = process.cwd();

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--write") {
      write = true;
      continue;
    }
    if (arg === "--template" && i + 1 < argv.length) {
      templatePath = argv[++i];
      continue;
    }
    if (arg.startsWith("--template=")) {
      templatePath = arg.slice("--template=".length);
      continue;
    }
    if (arg === "--project-root" && i + 1 < argv.length) {
      projectRoot = argv[++i];
      continue;
    }
    if (arg.startsWith("--project-root=")) {
      projectRoot = arg.slice("--project-root=".length);
      continue;
    }
  }

  return {
    projectRoot: path.resolve(projectRoot),
    write,
    templatePath
  };
}

async function readText(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function splitSections(markdown: string): ParsedSections {
  const lines = markdown.split(/\r?\n/);
  const sectionMap: Record<string, string> = {};
  let currentTitle: string | null = null;
  let currentLines: string[] = [];
  const headingRegex = /^#{2,6}\s+(.*)\s*$/;

  const flushSection = (): void => {
    if (!currentTitle) return;
    sectionMap[currentTitle.toLowerCase()] = currentLines.join("\n").trim();
  };

  for (const line of lines) {
    const headingMatch = headingRegex.exec(line);
    if (headingMatch) {
      flushSection();
      currentTitle = headingMatch[1];
      currentLines = [];
      continue;
    }
    currentLines.push(line);
  }
  flushSection();

  return { raw: markdown.trim(), map: sectionMap };
}

function sectionByKeywords(sections: ParsedSections, keywords: readonly string[]): string {
  for (const [title, content] of Object.entries(sections.map)) {
    if (keywords.some((keyword) => title.toLowerCase().includes(keyword))) {
      return content || "> โยนเนื้อหายังไม่ครบใน section นี้";
    }
  }
  return "> โยนเนื้อหายังไม่ครบใน section นี้";
}

function normalizeChecklistValue(value: string | null): string {
  const placeholders = [
    "feature one",
    "feature two",
    "- description",
    "todo",
    "template"
  ];
  const lowered = (value ?? "").toLowerCase();
  if (placeholders.some((entry) => lowered.includes(entry))) {
    return "TODO: แผนยังคงเป็นแผนต้นแบบ และยังไม่ใช่แผนสำหรับการคอมไพล์อัตโนมัติที่เสถียร";
  }
  return value || "> โยนเนื้อหายังไม่ครบ";
}

function extractBuildPlan(markdown: string): BuildQueueItem[] {
  const lines = markdown.split(/\r?\n/);
  const regex = /^(\s*)-\s*\[([ xX])\]\s*(.+?)\s*$/;
  const items: BuildQueueItem[] = [];

  for (const line of lines) {
    const match = regex.exec(line);
    if (!match) continue;
    const status = match[2].toLowerCase() === "x" ? "done" : "pending";
    const title = match[3].trim();
    if (title) {
      items.push({ status, title });
    }
  }
  return items;
}

function formatQueue(items: BuildQueueItem[]): string {
  if (items.length === 0) {
    return "- ไม่มีรายการใน `build-plan.md` ที่ตรงกับ checklist (`- [ ]` / `- [x]`).";
  }

  return items
    .map((item) => `- [${item.status === "done" ? "x" : " "}] ${item.title}`)
    .join("\n");
}

function extractHistoryRows(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  let categoryIdx = 2;
  let titleIdx = 3;
  let hasDetectedHeader = false;
  const rows: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) continue;

    const cells = trimmed
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim().replace(/^`|`$/g, ""));

    // Skip divider row (| :--- | :--- |)
    if (cells.every((cell) => /^[-:\s]+$/.test(cell))) {
      continue;
    }

    // Detect header row
    if (!hasDetectedHeader && cells.some((cell) => /category|หมวด/i.test(cell) || /title|หัวข้อ|ชื่อ/i.test(cell))) {
      const catIndex = cells.findIndex((cell) => /category|หมวด/i.test(cell));
      const titIndex = cells.findIndex((cell) => /title|หัวข้อ|ชื่อ|name/i.test(cell));
      if (catIndex !== -1) categoryIdx = catIndex;
      if (titIndex !== -1) titleIdx = titIndex;
      hasDetectedHeader = true;
      continue;
    }

    // Process data row (starting with date or having enough cells)
    if (cells.length > Math.max(categoryIdx, titleIdx)) {
      const dateCell = cells[0] || "";
      if (!/^\d{4}-\d{2}-\d{2}/.test(dateCell) && !hasDetectedHeader) continue;

      const runCategory = cells[categoryIdx]?.trim() || "Feature";
      const title = cells[titleIdx]?.trim() || "(ยังไม่ระบุ)";
      if (title && title !== "(ยังไม่ระบุ)" && !/^[-:\s]+$/.test(title)) {
        rows.push(`- **${runCategory}**: ${title}`);
      }
    }
  }

  const limitedRows = rows.slice(0, 8);
  return limitedRows.length > 0
    ? limitedRows.join("\n")
    : "- ยังไม่พบแถวประวัติที่อ่านได้จาก `devflow/history/HISTORY.md`";
}

function extractIdeasSummary(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const ideaHeader = /^###\s+\[(IDEA-\d+)\]\s*(.+)\s*$/;
  const statusDone = /สถานะ:\s*`?Claimed|สถานะ\s*:\s*`?\[x\]|สถานะ:\s*`?\(Shipped|Done|Closed/i;
  const statusPending = /สถานะ:\s*`?Pending/i;
  let currentId: string | null = null;
  let currentTitle = "";
  let open = 0;
  let total = 0;
  const openItems: string[] = [];

  for (const line of lines) {
    const header = ideaHeader.exec(line);
    if (header) {
      if (currentId) {
        total += 1;
      }
      currentId = header[1];
      currentTitle = header[2]?.trim() || "";
      continue;
    }
    if (currentId && statusDone.test(line)) {
      total += 1;
      currentId = null;
      currentTitle = "";
      continue;
    }
    if (currentId && statusPending.test(line)) {
      total += 1;
      open += 1;
      openItems.push(`- **${currentId}**: ${currentTitle}`);
      currentId = null;
      currentTitle = "";
    }
  }

  const summary = [
    `- รวมไอเดียทั้งหมด: ${total}`,
    `- ไอเดียค้างอยู่: ${open}`
  ];
  if (openItems.length > 0) {
    summary.push("- รายการค้าง:");
    summary.push(...openItems);
  }

  return summary.join("\n");
}

async function collectDataSources(projectRoot: string): Promise<string> {
  const entries = await fs.readdir(projectRoot, { withFileTypes: true });
  const visibleDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(".") && name !== "node_modules" && name !== "dist")
    .sort();

  return [
    `- โฟลเดอร์หลัก: ${visibleDirs.join(", ")}`,
    "- สภาพทั่วไป: ข้อมูลจริงถูกรูทผ่านไฟล์ใน `devflow/` และสคริปต์ช่วยอัปเดต"
  ].join("\n");
}

function buildStackText(pkgJson: string | null): string {
  if (!pkgJson) {
    return "- ไม่มี `package.json` ในโปรเจกต์ราก (กรุณาตรวจสอบก่อนรัน /overview)";
  }
  try {
    const manifest = JSON.parse(pkgJson) as { scripts?: Record<string, string>; engines?: Record<string, string>; dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const scripts = manifest.scripts || {};
    const commands = [
      "- Verified/Dev commands:",
      `  - build: \`${scripts.build ?? "ยังไม่กำหนด"}\``,
      `  - test: \`${scripts.test ?? "ยังไม่กำหนด"}\``,
      `  - check: \`${scripts.check ?? "ยังไม่กำหนด"}\``,
      `  - check:static: \`${scripts["check:static"] ?? "ยังไม่กำหนด"}\``
    ];
    const runtime = [
      `- Runtime: Node.js ${manifest.engines?.node ? `(${manifest.engines.node})` : "(ไม่ได้ระบุ)"}`,
      `- ภาษา: ${manifest.devDependencies?.typescript ? "TypeScript" : "ตรวจสอบเองเพิ่มเติม"}`
    ];
    return [...runtime, ...commands].join("\n");
  } catch {
    return "- อ่าน `package.json` ไม่ผ่าน: เนื้อหาอาจไม่ถูกต้อง";
  }
}

function renderTemplate(template: string, values: OverviewValues): string {
  const context = toTemplateContext(values);
  return template.replace(/{{\s*([A-Za-z0-9_]+)\s*}}/g, (_, key: string): string => {
    const replacement = context[key];
    if (replacement === undefined) {
      return "";
    }
    return replacement;
  });
}

function createDefaultTemplate(): string {
  return [
    "# Project Overview & Source of Truth",
    "",
    "> Living context artifact generated by `scripts/overview.ts` on {{generatedAt}}.",
    "",
    "## 1. Project Purpose & Target Users",
    "{{projectPurpose}}",
    "",
    "## 2. Architecture & Directory Layout",
    "{{architecture}}",
    "",
    "## 3. Technology Stack & Tooling",
    "{{stackAndTooling}}",
    "",
    "## 4. Source-of-Truth Constraints & Scope Gaps",
    "{{constraints}}",
    "",
    "## 5. Upcoming Build Queue",
    "{{buildQueue}}",
    "",
    "## 6. Shipped Capabilities Snapshot",
    "{{shippedCapabilities}}",
    "",
    "## 7. Ideas & Backlog Pulse",
    "{{ideasSummary}}",
    "",
    "## 8. Data Sources Read by Compiler",
    "{{dataSources}}",
    "",
    "## 9. Verified Developer Commands",
    "{{verificationCommands}}"
  ].join("\n");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const projectRoot = args.projectRoot;
  const projectPlanPath = path.join(projectRoot, "devflow", "project-plan.md");
  const buildPlanPath = path.join(projectRoot, "devflow", "build-plan.md");
  const ideasPath = path.join(projectRoot, "devflow", "ideas.md");
  const historyPath = path.join(projectRoot, "devflow", "history", "HISTORY.md");
  const templateDefaultPath = path.join(projectRoot, "devflow", "reference", "project-overview-template.md");
  const outputPath = path.join(projectRoot, "devflow", "context", "project-overview.md");

  const projectPlanRaw = await readText(projectPlanPath);
  const buildPlanRaw = await readText(buildPlanPath);
  const ideasRaw = await readText(ideasPath);
  const historyRaw = await readText(historyPath);
  const packageRaw = await readText(path.join(projectRoot, "package.json"));

  if (!projectPlanRaw) {
    throw new Error(`Missing required file: ${projectPlanPath}`);
  }
  if (!buildPlanRaw) {
    throw new Error(`Missing required file: ${buildPlanPath}`);
  }

  const projectPlanSections = splitSections(projectPlanRaw);
  const buildPlanSections = splitSections(buildPlanRaw);
  const templatePath = args.templatePath
    ? path.resolve(projectRoot, args.templatePath)
    : templateDefaultPath;
  const template = (await readText(templatePath)) || createDefaultTemplate();
  const buildPlanItems = extractBuildPlan(buildPlanRaw);
  const historyRows = historyRaw ? extractHistoryRows(historyRaw) : "- ไม่มี `devflow/history/HISTORY.md` สำหรับสรุป";
  const ideasSummary = ideasRaw ? extractIdeasSummary(ideasRaw) : "- ไม่พบ `devflow/ideas.md`";
  const dataSources = await collectDataSources(projectRoot);

  const values: OverviewValues = {
    generatedAt: new Date().toISOString(),
    projectName: path.basename(projectRoot),
    projectPurpose: normalizeChecklistValue(sectionByKeywords(projectPlanSections, ["product vision", "vision", "problem statement", "target users"])),
    architecture: `${normalizeChecklistValue(sectionByKeywords(projectPlanSections, ["architecture", "directory", "technology"]))}\n${normalizeChecklistValue(sectionByKeywords(buildPlanSections, ["project architecture", "feature", "roadmap"]))}`,
    stackAndTooling: buildStackText(packageRaw),
    constraints: normalizeChecklistValue(sectionByKeywords(projectPlanSections, ["constraints", "non-goals"])),
    buildQueue: formatQueue(buildPlanItems),
    shippedCapabilities: historyRows,
    ideasSummary,
    dataSources,
    verificationCommands: [
      "- `npm run check`",
      "- `npm run check:static`",
      "- `npm run test`",
      "- `npm run test:package`",
      "- `npm run overview -- --write`"
    ].join("\n")
  };

  const content = renderTemplate(template, values)
    .replace("{{projectName}}", values.projectName)
    .replace("{{projectName}}", values.projectName);
  if (args.write) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, "utf8");
    console.log(`Generated: ${outputPath}`);
    return;
  }

  console.log(content);
}

main().catch((error: unknown) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
