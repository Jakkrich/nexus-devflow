export const issueMarker = "<!-- nexus-upstream-monitor -->";
export const issueTitle = "AI Blueprint upstream updates awaiting review";
export const upstreamWebUrl = "https://github.com/aiblueprinthq/ai-blueprint";

export interface InspectionReport {
  schemaVersion: number;
  updateAvailable: boolean;
  commitCount: number;
  baseline: { commit: string };
  upstream: { commit: string };
  commits: Array<{ commit: string; subject: string; authoredAt: string; category?: string }>;
  upstreamChanges: Array<{ status: string; paths: string[] }>;
  overlappingPaths: string[];
}

export function prepareMonitorResult(inspection: InspectionReport, options: { runUrl?: string } = {}) {
  validateInspection(inspection);

  if (!inspection.updateAvailable) {
    return {
      updateAvailable: false,
      issueBody: null,
      outputs: { "update-available": "false" }
    };
  }

  const issueBody = buildIssueBody(inspection, options);

  return {
    updateAvailable: true,
    issueBody,
    outputs: {
      "update-available": "true",
      "commit-count": String(inspection.commitCount),
      "upstream-head": inspection.upstream.commit,
      "issue-body-base64": Buffer.from(issueBody, "utf8").toString("base64")
    }
  };
}

export function buildIssueBody(inspection: InspectionReport, { runUrl = "" }: { runUrl?: string } = {}): string {
  validateInspection(inspection);

  if (!inspection.updateAvailable) {
    throw new Error("Cannot build an upstream Issue without an available update");
  }

  const overlapSet = new Set(inspection.overlappingPaths);
  const commits = inspection.commits.map((commit) => ({
    ...commit,
    category: classifyCommit(commit.subject)
  }));
  const commitRows = limitRows(commits, 75);
  const changeRows = limitRows(inspection.upstreamChanges, 75);
  const overlapRows = limitRows(inspection.overlappingPaths, 40);
  const lines = [
    issueMarker,
    "# AI Blueprint upstream update",
    "",
    "> สถานะ: รอผู้ดูแลอ่านรายงานและอนุมัติใน DevFlow ก่อนนำมาปรับใช้",
    "",
    "## ช่วงที่ตรวจพบ",
    "",
    "| รายการ | ค่า |",
    "| --- | --- |",
    `| Baseline | [\`${shortSha(inspection.baseline.commit)}\`](${commitUrl(inspection.baseline.commit)}) |`,
    `| Upstream HEAD | [\`${shortSha(inspection.upstream.commit)}\`](${commitUrl(inspection.upstream.commit)}) |`,
    `| Commit ที่ยังไม่ได้ review | ${inspection.commitCount} |`,
    `| GitHub Actions run | ${runUrl ? `[เปิด run](${escapeMarkdownLink(runUrl)})` : "ไม่ระบุ"} |`,
    "",
    "ระบบคำนวณช่วงแบบ `lastReviewedCommit..upstream HEAD` จึงรวม commit ที่ job",
    "เคยข้ามทั้งหมดไว้ในรอบนี้ โดยยังไม่เลื่อน baseline",
    "",
    "## สิ่งที่อาจได้รับเพิ่ม",
    "",
    "รายการนี้จัดกลุ่มจากชื่อ commit เพื่อช่วยคัดกรองเบื้องต้น ยังไม่ใช่ข้อสรุป",
    "การนำมาใช้กับ Nexus-DevFlow",
    "",
    "| ประเภท | Commit | วันที่ | รายการ |",
    "| --- | --- | --- | --- |",
    ...commitRows.items.map(
      (commit) =>
        `| ${commit.category} | [\`${shortSha(commit.commit)}\`](${commitUrl(commit.commit)}) | ${escapeTable(commit.authoredAt)} | ${escapeTable(commit.subject)} |`
    )
  ];

  appendOmitted(lines, commitRows.omitted, "commit");
  lines.push(
    "",
    "## ไฟล์ที่เปลี่ยน",
    "",
    "| สถานะ | Path | จุดทับซ้อนกับ DevFlow |",
    "| --- | --- | --- |",
    ...changeRows.items.map((change) => {
      const paths = change.paths
        .slice(0, 2)
        .map((entry) => `\`${escapeTable(entry)}\``)
        .join("<br>");
      const overlaps = change.paths.some((entry) => overlapSet.has(entry));
      return `| ${escapeTable(change.status)} | ${paths} | ${overlaps ? "ต้องตรวจ" : "ไม่พบ"} |`;
    })
  );
  appendOmitted(lines, changeRows.omitted, "path change");
  lines.push("", "## จุดทับซ้อนเบื้องต้น", "");

  if (overlapRows.items.length === 0) {
    lines.push("ไม่พบ path ที่ upstream และ DevFlow เปลี่ยนร่วมกันจากฐานเปรียบเทียบ");
  } else {
    lines.push(
      "Path ต่อไปนี้เป็น review signal เท่านั้น ยังไม่ถือว่าเป็น conflict จนกว่า",
      "`sync-upstream` จะตรวจ text, contract และ intent:",
      "",
      ...overlapRows.items.map((entry) => `- \`${escapeInlineCode(entry)}\``)
    );
    appendOmitted(lines, overlapRows.omitted, "overlap");
  }

  lines.push(
    "",
    "## ขั้นตอนอนุมัติและปรับใช้ใน DevFlow",
    "",
    "1. อ่าน Issue นี้และเปิด Nexus-DevFlow ใน AI Coding Assistant",
    "2. เริ่มขั้นตอน Discovery: `/00-explore sync-upstream <issue-url>`",
    "3. ตรวจสอบความเข้ากันได้ และเลือกฟีเจอร์ที่ต้องการนำมาปรับใช้",
    "4. ดำเนินการผ่านวงจร DevFlow Delivery Run (`10-define` ถึง `70-deliver`)",
    "",
    "Workflow นี้ไม่เรียก AI, ไม่แก้ repository, ไม่เปิด PR, ไม่ merge, ไม่ tag,",
    "ไม่ publish และไม่เขียนกลับไปยัง AI Blueprint"
  );

  const body = lines.join("\n");

  if (Buffer.byteLength(body, "utf8") > 60_000) {
    throw new Error("Upstream Issue report exceeds the safe GitHub body size");
  }

  return body;
}

export function classifyCommit(subject: string): string {
  const normalized = subject.trim().toLowerCase();

  if (/^(feat|add|new)(\([^)]*\))?[!: ]/.test(normalized)) {
    return "เพิ่ม";
  }

  if (/^(fix|bugfix|hotfix)(\([^)]*\))?[!: ]/.test(normalized)) {
    return "แก้ไข";
  }

  if (/^(docs?|readme)(\([^)]*\))?[!: ]/.test(normalized)) {
    return "เอกสาร";
  }

  if (/^(remove|delete|drop)(\([^)]*\))?[!: ]/.test(normalized)) {
    return "นำออก";
  }

  return "เปลี่ยนแปลง";
}

function validateInspection(inspection: unknown): asserts inspection is InspectionReport {
  const report = inspection as InspectionReport;
  if (
    report?.schemaVersion !== 1 ||
    typeof report.updateAvailable !== "boolean" ||
    !Number.isInteger(report.commitCount) ||
    !isSha(report?.baseline?.commit) ||
    !isSha(report?.upstream?.commit) ||
    !Array.isArray(report.commits) ||
    !Array.isArray(report.upstreamChanges) ||
    !Array.isArray(report.overlappingPaths)
  ) {
    throw new Error("Unsupported upstream inspection report");
  }

  if (report.updateAvailable !== (report.commitCount > 0)) {
    throw new Error("Upstream inspection update flag does not match commit count");
  }

  if (report.commits.length !== report.commitCount) {
    throw new Error("Upstream inspection commit list is incomplete");
  }
}

function isSha(value: unknown): boolean {
  return typeof value === "string" && /^[0-9a-f]{40}$/.test(value);
}

function shortSha(commit: string): string {
  return commit.slice(0, 7);
}

function commitUrl(commit: string): string {
  return `${upstreamWebUrl}/commit/${commit}`;
}

function escapeTable(value: unknown): string {
  return truncate(String(value).replaceAll("|", "\\|").replace(/[\r\n]+/g, " "), 180);
}

function escapeInlineCode(value: unknown): string {
  return truncate(String(value).replaceAll("`", "\\`"), 180);
}

function escapeMarkdownLink(value: unknown): string {
  return encodeURI(String(value)).replaceAll("(", "%28").replaceAll(")", "%29");
}

function limitRows<T>(items: readonly T[], maximum: number): { items: T[]; omitted: number } {
  return {
    items: items.slice(0, maximum),
    omitted: Math.max(0, items.length - maximum)
  };
}

function appendOmitted(lines: string[], count: number, label: string): void {
  if (count > 0) {
    lines.push("", `> ย่อรายงาน ${label} อีก ${count} รายการเพื่อไม่ให้ Issue เกินขนาด แต่ช่วง commit ที่ต้อง review ยังไม่เปลี่ยน`);
  }
}

function truncate(value: string, maximum: number): string {
  return value.length > maximum ? `${value.slice(0, maximum - 3)}...` : value;
}
