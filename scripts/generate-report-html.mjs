import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const templatePath = path.join(projectRoot, '.agent', 'resources', 'schemas', 'report.template.html');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) {
    return { data: {}, body: markdown };
  }

  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: markdown };
  }

  const raw = match[1];
  const body = match[2];
  const data = {};
  let currentArrayKey = null;

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const arrayItem = line.match(/^\s*-\s+(.*)$/);
    if (arrayItem && currentArrayKey) {
      data[currentArrayKey].push(stripQuotes(arrayItem[1]));
      continue;
    }

    const keyValue = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyValue) {
      currentArrayKey = null;
      continue;
    }

    const [, key, rawValue] = keyValue;
    if (!rawValue.trim()) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    data[key] = stripQuotes(rawValue);
    currentArrayKey = null;
  }

  return { data, body };
}

function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, '\n');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractH3Section(body, heading) {
  const normalized = normalizeLineEndings(body);
  const regex = new RegExp(`^### ${escapeRegex(heading)}\\n([\\s\\S]*?)(?=^### |^## )`, 'm');
  const match = normalized.match(regex);
  return match ? match[1].trim() : '';
}

function extractH2Section(body, headingLabel, nextHeadingLabel = null) {
  const normalized = normalizeLineEndings(body);
  const headingToken = `## ${headingLabel}`;
  const startIndex = normalized.indexOf(headingToken);
  if (startIndex === -1) return '';

  const contentStart = normalized.indexOf('\n', startIndex);
  if (contentStart === -1) return '';

  const nextIndex = nextHeadingLabel
    ? normalized.indexOf(`\n## ${nextHeadingLabel}`, contentStart + 1)
    : -1;

  const content = nextIndex === -1
    ? normalized.slice(contentStart + 1)
    : normalized.slice(contentStart + 1, nextIndex);

  return content.trim();
}

function renderInline(text) {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return escaped;
}

function renderMarkdownToHtml(markdown, fallback = '<p class="placeholder">[No content provided]</p>') {
  const trimmed = markdown.trim();
  if (!trimmed) return fallback;

  const lines = normalizeLineEndings(trimmed).split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^- /.test(line)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i].trim())) {
        items.push(`<li>${renderInline(lines[i].trim().slice(2))}</li>`);
        i++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !/^- /.test(lines[i].trim()) && !lines[i].startsWith('```')) {
      paragraph.push(renderInline(lines[i].trim()));
      i++;
    }
    html.push(`<p>${paragraph.join('<br>')}</p>`);
  }

  return html.join('\n') || fallback;
}

function renderDecisionHtml(markdown) {
  const trimmed = markdown.trim();
  if (!trimmed) {
    return '<div class="decision-item placeholder">[Decision 1]</div>';
  }

  const lines = normalizeLineEndings(trimmed).split('\n').map((line) => line.trim()).filter(Boolean);
  const items = [];
  let buffer = [];

  const flushBuffer = () => {
    if (!buffer.length) return;
    items.push(`<div class="decision-item">${renderInline(buffer.join(' '))}</div>`);
    buffer = [];
  };

  for (const line of lines) {
    if (/^- /.test(line)) {
      flushBuffer();
      items.push(`<div class="decision-item">${renderInline(line.slice(2))}</div>`);
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();

  return items.join('\n');
}

function parseMarkdownTable(markdown) {
  const rows = [];
  const lines = normalizeLineEndings(markdown).split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (!/^\|/.test(lines[i].trim())) continue;
    if (i + 1 >= lines.length || !/^\|\s*[:\- ]+\|/.test(lines[i + 1].trim())) continue;

    const headers = lines[i].split('|').slice(1, -1).map((cell) => cell.trim().toLowerCase());
    i += 2;

    while (i < lines.length && /^\|/.test(lines[i].trim())) {
      const cells = lines[i].split('|').slice(1, -1).map((cell) => cell.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = cells[index] ?? '';
      });
      rows.push(row);
      i++;
    }
  }

  return rows;
}

function parseCheckboxRows(markdown) {
  const rows = [];
  const lines = normalizeLineEndings(markdown).split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*-\s*\[( |x|X)\]\s*(.+)$/);
    if (!match) continue;
    const checked = match[1].toLowerCase() === 'x';
    const text = match[2].trim();
    let status = checked ? 'done' : 'pending';
    if (/\(BLOCKED:/i.test(text)) status = 'blocked';
    if (/\(SKIPPED:/i.test(text)) status = 'skipped';
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
      item: row.item || row.unit || row.check || row.subtask || row.id || 'Unknown item',
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

function renderChecklistRowsHtml(rows) {
  if (!rows.length) {
    return '<tr><td colspan="3" class="placeholder">No blocked or skipped items.</td></tr>';
  }

  return rows.map((row) => {
    const status = String(row.status || '').toLowerCase();
    const tagClass = status === 'blocked' ? 'blocked' : 'skipped';
    const note = row.evidence || row.notes || '[no note]';
    return `<tr><td>${escapeHtml(row.item)}</td><td><span class="tag ${tagClass}">${escapeHtml(status)}</span></td><td>${escapeHtml(note)}</td></tr>`;
  }).join('\n');
}

function renderFileListItem(href, label, icon, opt = '') {
  const optHtml = opt ? `<span class="opt">${escapeHtml(opt)}</span>` : '';
  return `<li><span class="icon">${icon}</span><a href="${escapeHtml(href)}">${escapeHtml(label)}</a>${optHtml}</li>`;
}

function deriveRunningId(workspaceDir, frontmatter) {
  if (frontmatter.related_run) return frontmatter.related_run;
  const base = path.basename(workspaceDir);
  const match = base.match(/^(\d+)/);
  return match ? match[1] : base;
}

function deriveWorkTitle(frontmatter, workspaceDir) {
  if (frontmatter.title) {
    return frontmatter.title.replace(/^Report:\s*/, '').trim();
  }
  return path.basename(workspaceDir).replace(/^\d+-/, '').replace(/-/g, ' ').trim() || 'Untitled Work';
}

function resolveWorkspaceDir(argument) {
  if (!argument) {
    fail('Usage: node scripts/generate-report-html.mjs <workspace-path-or-running-id>');
  }

  const directPath = path.resolve(projectRoot, argument);
  if (fs.existsSync(directPath)) {
    const stats = fs.statSync(directPath);
    if (stats.isDirectory()) return directPath;
    if (stats.isFile() && path.basename(directPath) === '70-report.md') return path.dirname(directPath);
  }

  const specsRoot = path.join(projectRoot, '.workspaces', 'specs');
  if (!fs.existsSync(specsRoot)) {
    fail('Could not find .workspaces/specs to resolve running ID.');
  }

  const candidates = fs.readdirSync(specsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(argument))
    .map((entry) => path.join(specsRoot, entry.name));

  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) {
    fail(`Multiple workspace directories match "${argument}". Use an explicit path.`);
  }

  fail(`Could not resolve workspace path or running ID: ${argument}`);
}

function replaceAll(template, replacements) {
  let output = template;
  for (const [key, value] of Object.entries(replacements)) {
    output = output.split(`{{${key}}}`).join(String(value));
  }
  return output;
}

function buildReportHtml(workspaceDir) {
  const reportMdPath = path.join(workspaceDir, '70-report.md');
  const reportMd = readFileSafe(reportMdPath);
  if (!reportMd) {
    fail(`Missing report markdown: ${reportMdPath}`);
  }

  const template = readFileSafe(templatePath);
  if (!template) {
    fail(`Missing HTML template: ${templatePath}`);
  }

  const { data: frontmatter, body } = parseFrontmatter(reportMd);
  const runningId = deriveRunningId(workspaceDir, frontmatter);
  const workTitle = deriveWorkTitle(frontmatter, workspaceDir);
  const reportTitle = frontmatter.title || `Report: ${workTitle}`;
  const reportId = frontmatter.id || `${runningId}-report`;
  const created = frontmatter.created || frontmatter.updated || new Date().toISOString().slice(0, 10);
  const updated = frontmatter.updated || frontmatter.created || new Date().toISOString().slice(0, 10);
  const owner = frontmatter.owner || 'unknown';
  const status = frontmatter.status || 'draft';
  const docType = frontmatter.doc_type || 'stage';
  const stage = frontmatter.stage || '70-report';

  const executiveSummary = renderMarkdownToHtml(extractH3Section(body, 'Executive Summary'), '<p class="placeholder">[Short summary of the whole job]</p>');
  const workCompleted = renderMarkdownToHtml(extractH3Section(body, 'Work Completed'), '<p class="placeholder">[What was completed]</p>');
  const validationOutcome = renderMarkdownToHtml(extractH3Section(body, 'Validation Outcome'), '<p class="placeholder">[What verification proved]</p>');
  const checklistSummarySource = extractH3Section(body, 'Checklist Summary');
  const openRisks = renderMarkdownToHtml(extractH3Section(body, 'Open Risks'), '<p class="placeholder">[Remaining concerns]</p>');
  const nextActions = renderMarkdownToHtml(extractH3Section(body, 'Next Actions'), '<p class="placeholder">[What happens next, if anything]</p>');
  const decisions = renderDecisionHtml(extractH2Section(body, '4. Decisions', '5. Outputs'));
  const additionalNotes = renderMarkdownToHtml(extractH2Section(body, '7. Additional Notes'), '<p class="placeholder">[Add any extra headings below this section when useful]</p>');

  const checklist = summarizeChecklists(workspaceDir);
  const derivedChecklistSummary = checklist.totals.total
    ? renderMarkdownToHtml(
        `- Overall completion: ${checklist.totals.complete}/${checklist.totals.total}\n- Blocked items: ${checklist.totals.blocked}\n- Skipped items: ${checklist.totals.skipped}`,
        ''
      )
    : '<p class="placeholder">[No checklist files were present for this run]</p>';
  const checklistSummary = renderMarkdownToHtml(checklistSummarySource, derivedChecklistSummary);

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
      return renderFileListItem(rel, rel, '&#128203;', 'present');
    });

  const inputsListHtml = [...inputFiles, ...checklistInputFiles].join('\n');
  const outputsListHtml = [
    renderFileListItem('70-report.md', '70-report.md', '&#128196;', 'final markdown summary'),
    renderFileListItem('70-report.html', '70-report.html', '&#127760;', 'final HTML summary')
  ].join('\n');

  const footerText = `Generated from 70-report.md | Mainline next step: end of flow | Checklist items: ${checklist.totals.total}`;

  const replacements = {
    report_title: escapeHtml(reportTitle),
    report_id: escapeHtml(reportId),
    doc_type: escapeHtml(docType),
    stage: escapeHtml(stage),
    created: escapeHtml(created),
    updated: escapeHtml(updated),
    owner: escapeHtml(owner),
    status: escapeHtml(status),
    executive_summary_html: executiveSummary,
    work_completed_html: workCompleted,
    validation_outcome_html: validationOutcome,
    checklist_summary_html: checklistSummary,
    checklist_complete: escapeHtml(checklist.totals.complete),
    checklist_blocked: escapeHtml(checklist.totals.blocked),
    checklist_skipped: escapeHtml(checklist.totals.skipped),
    checklist_total: escapeHtml(checklist.totals.total),
    checklist_rows_html: renderChecklistRowsHtml(checklist.blockedOrSkipped),
    open_risks_html: openRisks,
    next_actions_html: nextActions,
    decisions_html: decisions,
    inputs_list_html: inputsListHtml,
    outputs_list_html: outputsListHtml,
    additional_notes_html: additionalNotes,
    footer_text: escapeHtml(footerText)
  };

  return replaceAll(template, replacements);
}

function main() {
  const workspaceDir = resolveWorkspaceDir(process.argv[2]);
  const html = buildReportHtml(workspaceDir);
  const outputPath = path.join(workspaceDir, '70-report.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Generated ${outputPath}`);
}

main();
