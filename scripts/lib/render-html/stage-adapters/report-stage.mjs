import fs from 'node:fs';
import path from 'node:path';
import { renderMarkdownDocument } from '../core.mjs';
import {
  deriveRunningId,
  deriveWorkTitle,
  escapeHtml,
  extractH2Section,
  extractH3Section,
  parseFrontmatter,
  renderDecisionHtml,
  renderMarkdownToHtml
} from '../markdown.mjs';
import { resolveWorkspaceDir as resolveSharedWorkspaceDir } from '../workspace-resolver.mjs';

const REPORT_LOCALE = {
  en: {
    locale: 'en',
    reportTitlePrefix: 'Report',
    unknownItem: 'Unknown item',
    noBlockedOrSkipped: 'No blocked or skipped items.',
    noEvidence: '[No note or evidence provided]',
    checklistSummary: {
      progress: 'Overall progress',
      blocked: 'Blocked items',
      skipped: 'Skipped items',
      noFiles: '[No checklist files were included in this run]'
    },
    statusDisplay: {
      completed: 'Completed',
      complete: 'Completed',
      done: 'Done',
      blocked: 'Blocked',
      failed: 'Failed',
      draft: 'Draft',
      pending: 'Pending',
      in_progress: 'In Progress',
      released: 'Released'
    },
    statusTag: {
      blocked: 'Blocked',
      skipped: 'Skipped',
      done: 'Done',
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      complete: 'Complete',
      released: 'Released'
    },
    placeholders: {
      executiveSummary: '[Summarize the overall outcome of the run]',
      workCompleted: '[List the work completed in this run]',
      validationOutcome: '[Summarize the verification and validation outcome]',
      openRisks: '[List any open risks or unresolved concerns]',
      nextActions: '[List any remaining next actions]',
      additionalNotes: '[Add any extra notes here when useful]',
      decision: '[Decision 1]'
    },
    fileList: {
      present: 'present',
      markdownReport: 'Markdown summary',
      htmlReport: 'HTML summary'
    },
    footer: {
      generatedFrom: 'Generated from 70-report.md',
      nextStep: 'Mainline next step: end of flow',
      checklistItems: 'Checklist items'
    }
  },
  th: {
    locale: 'th',
    reportTitlePrefix: 'รายงานสรุป',
    unknownItem: 'Unknown item',
    noBlockedOrSkipped: 'ไม่มีรายการที่ติดขัดหรือข้ามไป',
    noEvidence: '[ไม่มีหมายเหตุหรือหลักฐาน]',
    checklistSummary: {
      progress: 'ความคืบหน้าภาพรวม',
      blocked: 'รายการที่ติดขัด',
      skipped: 'รายการที่ข้ามไป',
      noFiles: '[ไม่มีไฟล์เช็คลิสต์ในการรันครั้งนี้]'
    },
    statusDisplay: {
      completed: 'เสร็จสมบูรณ์',
      complete: 'เสร็จสมบูรณ์',
      done: 'เสร็จสิ้น',
      blocked: 'ติดขัด',
      failed: 'ล้มเหลว',
      draft: 'ร่าง (Draft)',
      pending: 'รอดำเนินการ',
      in_progress: 'กำลังดำเนินการ',
      released: 'ปล่อยใช้งานแล้ว'
    },
    statusTag: {
      blocked: 'ติดขัด',
      skipped: 'ข้ามไป',
      done: 'เสร็จสิ้น',
      pending: 'รอดำเนินการ',
      in_progress: 'กำลังดำเนินการ',
      completed: 'เสร็จสมบูรณ์',
      complete: 'เสร็จสมบูรณ์',
      released: 'ปล่อยใช้งานแล้ว'
    },
    placeholders: {
      executiveSummary: '[สรุปภาพรวมของงานทั้งหมด]',
      workCompleted: '[งานที่เสร็จสิ้น]',
      validationOutcome: '[ผลการทดสอบระบบ]',
      openRisks: '[ความเสี่ยงที่พบ]',
      nextActions: '[งานขั้นถัดไป]',
      additionalNotes: '[สามารถระบุหัวข้อหรือบันทึกเพิ่มเติมได้ที่นี่เมื่อต้องการ]',
      decision: '[การตัดสินใจ 1]'
    },
    fileList: {
      present: 'มีอยู่',
      markdownReport: 'รายงานสรุป Markdown',
      htmlReport: 'รายงานสรุป HTML'
    },
    footer: {
      generatedFrom: 'สร้างจาก 70-report.md',
      nextStep: 'ขั้นถัดไปของ Mainline: สิ้นสุดกระบวนการทำงาน',
      checklistItems: 'Checklist items'
    }
  }
};

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function resolveArtifactLanguage(frontmatter) {
  return frontmatter.artifact_language === 'th' ? 'th' : 'en';
}

function getReportLocale(frontmatter) {
  return REPORT_LOCALE[resolveArtifactLanguage(frontmatter)] || REPORT_LOCALE.en;
}

function parseMarkdownTable(markdown) {
  const rows = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  for (let index = 0; index < lines.length; index++) {
    if (!/^\|/.test(lines[index].trim())) continue;
    if (index + 1 >= lines.length || !/^\|\s*[:\- ]+\|/.test(lines[index + 1].trim())) continue;

    const headers = lines[index].split('|').slice(1, -1).map((cell) => cell.trim().toLowerCase());
    index += 2;

    while (index < lines.length && /^\|/.test(lines[index].trim())) {
      const cells = lines[index].split('|').slice(1, -1).map((cell) => cell.trim());
      const row = {};
      headers.forEach((header, cellIndex) => {
        row[header] = cells[cellIndex] ?? '';
      });
      rows.push(row);
      index++;
    }
  }

  return rows;
}

function parseCheckboxRows(markdown) {
  const rows = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const markerStatus = {
    ' ': 'pending',
    x: 'done',
    X: 'done',
    '/': 'in_progress',
    '~': 'in_progress',
    '!': 'blocked',
    '-': 'skipped'
  };

  for (const line of lines) {
    const match = line.match(/^\s*-\s*\[([ xX\/~!\-])\]\s*(.+)$/);
    if (!match) continue;
    const marker = match[1];
    const text = match[2].trim();
    let status = markerStatus[marker] || 'pending';
    const explicitStatus = text.match(/\((pending|in[_ -]?progress|blocked|skipped|done|complete|completed|released)\)\s*$/i);
    if (explicitStatus) {
      status = explicitStatus[1].toLowerCase().replace(/[ -]/g, '_');
    }
    rows.push({
      item: text,
      status,
      evidence: '',
      notes: text
    });
  }

  return rows;
}

function normalizeChecklistRows(markdown) {
  const tableRows = parseMarkdownTable(markdown);
  if (tableRows.length) {
    return tableRows.map((row) => ({
      item: row.item || row.unit || row.check || row.subtask || row.id || '',
      status: (row.status || 'pending').toLowerCase(),
      evidence: row.evidence || row.verification || row['note / evidence'] || '',
      notes: row.notes || row['important context'] || row.reason || row['finding severity'] || ''
    }));
  }
  return parseCheckboxRows(markdown);
}

function summarizeChecklists(workspaceDir) {
  const files = [
    path.join(workspaceDir, 'checklists', 'master-checklist.md'),
    path.join(workspaceDir, 'checklists', 'implementation-checklist.md'),
    path.join(workspaceDir, 'checklists', 'verification-checklist.md')
  ];

  const rows = files
    .map(readFileSafe)
    .filter(Boolean)
    .flatMap((content) => normalizeChecklistRows(content));

  const totals = {
    total: rows.length,
    complete: 0,
    blocked: 0,
    skipped: 0
  };

  for (const row of rows) {
    const status = String(row.status || '').toLowerCase();
    if (['done', 'complete', 'completed', 'released'].includes(status)) totals.complete++;
    if (status === 'blocked') totals.blocked++;
    if (status === 'skipped') totals.skipped++;
  }

  const blockedOrSkipped = rows.filter((row) => ['blocked', 'skipped'].includes(String(row.status || '').toLowerCase()));
  return { totals, blockedOrSkipped, files };
}

function renderChecklistRowsHtml(rows, localeText) {
  if (!rows.length) {
    return `<tr><td colspan="3" class="placeholder">${escapeHtml(localeText.noBlockedOrSkipped)}</td></tr>`;
  }

  return rows.map((row) => {
    const status = String(row.status || '').toLowerCase();
    const tagClass = status === 'blocked' ? 'blocked' : 'skipped';
    const statusText = localeText.statusTag[status] || status;
    const note = row.evidence || row.notes || localeText.noEvidence;
    const item = row.item || localeText.unknownItem;
    return `<tr><td>${escapeHtml(item)}</td><td><span class="tag ${tagClass}">${escapeHtml(statusText)}</span></td><td>${escapeHtml(note)}</td></tr>`;
  }).join('\n');
}

function renderFileListItem(href, label, icon, opt = '') {
  const optHtml = opt ? `<span class="opt">${escapeHtml(opt)}</span>` : '';
  return `<li><span class="icon">${icon}</span><a href="${escapeHtml(href)}">${escapeHtml(label)}</a>${optHtml}</li>`;
}

export function resolveReportWorkspaceDir(argument, projectRoot) {
  const directPath = path.resolve(projectRoot, argument);
  if (fs.existsSync(directPath)) {
    const stats = fs.statSync(directPath);
    if (stats.isDirectory()) return directPath;
    if (stats.isFile() && path.basename(directPath) === '70-report.md') return path.dirname(directPath);
  }

  const specsRoot = path.join(projectRoot, '.workspaces', 'specs');
  if (fs.existsSync(specsRoot) && fs.statSync(specsRoot).isDirectory()) {
    const specCandidates = fs.readdirSync(specsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith(argument))
      .map((entry) => path.join(specsRoot, entry.name));

    if (specCandidates.length === 1) {
      return specCandidates[0];
    }
    if (specCandidates.length > 1) {
      throw new Error(`Multiple workspace directories match "${argument}". Use an explicit path.`);
    }
  }

  return resolveSharedWorkspaceDir({ argument, projectRoot });
}

export function renderReportStageWorkspace({ workspaceDir }) {
  const reportPath = path.join(workspaceDir, '70-report.md');
  const reportMarkdown = readFileSafe(reportPath);
  if (!reportMarkdown) {
    throw new Error(`Missing report markdown: ${reportPath}`);
  }

  const { data: frontmatter, body } = parseFrontmatter(reportMarkdown);
  const localeText = getReportLocale(frontmatter);
  const runningId = deriveRunningId(workspaceDir, frontmatter);
  const workTitle = deriveWorkTitle(frontmatter, workspaceDir);
  const checklist = summarizeChecklists(workspaceDir);

  const checklistSummarySource = extractH3Section(body, 'Checklist Summary');
  const derivedChecklistSummary = checklist.totals.total
    ? renderMarkdownToHtml(
        `- ${localeText.checklistSummary.progress}: ${checklist.totals.complete}/${checklist.totals.total}\n- ${localeText.checklistSummary.blocked}: ${checklist.totals.blocked}\n- ${localeText.checklistSummary.skipped}: ${checklist.totals.skipped}`,
        ''
      )
    : `<p class="placeholder">${escapeHtml(localeText.checklistSummary.noFiles)}</p>`;

  const inputFiles = [
    '00-discover.md',
    '10-define.md',
    '20-spec.md',
    '30-plan.md',
    '40-implement.md',
    '50-verify.md',
    '60-release.md'
  ].filter((file) => fs.existsSync(path.join(workspaceDir, file)))
    .map((file) => renderFileListItem(file, file, '&#128196;'));

  const checklistInputFiles = checklist.files
    .filter((file) => fs.existsSync(file))
    .map((file) => {
      const rel = path.relative(workspaceDir, file).replace(/\\/g, '/');
      return renderFileListItem(rel, rel, '&#128203;', localeText.fileList.present);
    });

  const statusRaw = frontmatter.status || 'draft';
  const statusDisplay = localeText.statusDisplay[String(statusRaw).toLowerCase()] || statusRaw;

  const metadata = {
    artifact_language: localeText.locale,
    report_title: frontmatter.title || `${localeText.reportTitlePrefix}: ${workTitle}`,
    report_id: frontmatter.id || `${runningId}-report`,
    doc_type: frontmatter.doc_type || 'stage',
    stage: frontmatter.stage || '70-report',
    created: frontmatter.created || frontmatter.updated || new Date().toISOString().slice(0, 10),
    updated: frontmatter.updated || frontmatter.created || new Date().toISOString().slice(0, 10),
    owner: frontmatter.owner || 'unknown',
    status: statusRaw,
    status_display: statusDisplay,
    executive_summary_html: renderMarkdownToHtml(extractH3Section(body, 'Executive Summary'), `<p class="placeholder">${escapeHtml(localeText.placeholders.executiveSummary)}</p>`),
    work_completed_html: renderMarkdownToHtml(extractH3Section(body, 'Work Completed'), `<p class="placeholder">${escapeHtml(localeText.placeholders.workCompleted)}</p>`),
    validation_outcome_html: renderMarkdownToHtml(extractH3Section(body, 'Validation Outcome'), `<p class="placeholder">${escapeHtml(localeText.placeholders.validationOutcome)}</p>`),
    checklist_summary_html: renderMarkdownToHtml(checklistSummarySource, derivedChecklistSummary),
    checklist_complete: String(checklist.totals.complete),
    checklist_blocked: String(checklist.totals.blocked),
    checklist_skipped: String(checklist.totals.skipped),
    checklist_total: String(checklist.totals.total),
    checklist_rows_html: renderChecklistRowsHtml(checklist.blockedOrSkipped, localeText),
    open_risks_html: renderMarkdownToHtml(extractH3Section(body, 'Open Risks'), `<p class="placeholder">${escapeHtml(localeText.placeholders.openRisks)}</p>`),
    next_actions_html: renderMarkdownToHtml(extractH3Section(body, 'Next Actions'), `<p class="placeholder">${escapeHtml(localeText.placeholders.nextActions)}</p>`),
    decisions_html: renderDecisionHtml(extractH2Section(body, '4. Decisions', '5. Outputs'), `<div class="decision-item placeholder">${escapeHtml(localeText.placeholders.decision)}</div>`),
    inputs_list_html: [...inputFiles, ...checklistInputFiles].join('\n'),
    outputs_list_html: [
      renderFileListItem('70-report.md', '70-report.md', '&#128196;', localeText.fileList.markdownReport),
      renderFileListItem('70-report.html', '70-report.html', '&#127760;', localeText.fileList.htmlReport)
    ].join('\n'),
    additional_notes_html: renderMarkdownToHtml(extractH2Section(body, '7. Additional Notes'), `<p class="placeholder">${escapeHtml(localeText.placeholders.additionalNotes)}</p>`),
    footer_text: `${localeText.footer.generatedFrom} | ${localeText.footer.nextStep} | ${localeText.footer.checklistItems}: ${checklist.totals.total}`
  };

  const outputPath = path.join(workspaceDir, '70-report.html');
  return renderMarkdownDocument({
    sourcePath: reportPath,
    markdown: reportMarkdown,
    preset: 'report',
    outputPath,
    metadata,
    stagePolicy: { htmlRequired: true }
  });
}

export function runReportHtmlCommand({ projectRoot, argument }) {
  if (!argument) {
    throw new Error('Usage: node scripts/generate-report-html.mjs <workspace-path-or-running-id>');
  }

  const workspaceDir = resolveReportWorkspaceDir(argument, projectRoot);
  const result = renderReportStageWorkspace({ workspaceDir });
  return result.outputPath;
}
