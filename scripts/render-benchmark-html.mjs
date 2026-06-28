#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { escapeHtml, renderMarkdownBody } from './lib/render-html/markdown.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const benchmarkDir = path.join(rootDir, '.workspaces', 'benchmarks');
const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(benchmarkDir)) {
  console.error('ERROR: No .workspaces/benchmarks directory found. Run npm.cmd run benchmark:feature first.');
  process.exit(1);
}

const benchmarkFiles = fs.readdirSync(benchmarkDir)
  .filter((name) => name.endsWith('.benchmark.json'))
  .sort();

if (benchmarkFiles.length === 0) {
  console.error('ERROR: No benchmark JSON files found in .workspaces/benchmarks.');
  process.exit(1);
}

const selectedFile = args.source
  ? path.basename(args.source)
  : benchmarkFiles.at(-1);

if (!benchmarkFiles.includes(selectedFile)) {
  console.error(`ERROR: Benchmark source not found: ${selectedFile}`);
  process.exit(1);
}

const entries = benchmarkFiles.map((fileName) => {
  const jsonPath = path.join(benchmarkDir, fileName);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return {
    fileName,
    jsonPath,
    markdownPath: jsonPath.replace(/\.json$/, '.md'),
    htmlPath: jsonPath.replace(/\.json$/, '.html'),
    data
  };
});

const selectedEntry = entries.find((entry) => entry.fileName === selectedFile);
renderBenchmarkRun(selectedEntry);
renderHistory(entries);

console.log(`Generated ${path.relative(rootDir, selectedEntry.htmlPath)}`);
console.log(`Generated ${path.relative(rootDir, path.join(benchmarkDir, 'benchmark-history.html'))}`);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = rawArgs[i + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i++;
    }
  }
  return parsed;
}

function renderBenchmarkRun(entry) {
  const markdown = fs.existsSync(entry.markdownPath)
    ? fs.readFileSync(entry.markdownPath, 'utf8')
    : fallbackMarkdown(entry.data);

  const html = page({
    title: `Benchmark: ${entry.data.feature}`,
    body: `
      <section class="hero">
        <div>
          <p class="eyebrow">DevFlow Benchmark</p>
          <h1>${escapeHtml(entry.data.feature)}</h1>
          <p>Status: ${statusBadge(entry.data.status)} Commit: <code>${escapeHtml(entry.data.git_commit || 'unknown')}</code></p>
        </div>
        <a class="button" href="benchmark-history.html">View History</a>
      </section>
      ${summaryCards(entry.data)}
      <section class="panel">
        ${renderMarkdownBody(markdown)}
      </section>
    `
  });

  fs.writeFileSync(entry.htmlPath, html, 'utf8');
}

function renderHistory(entries) {
  const grouped = groupByFeature(entries);
  const featureSections = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([feature, featureEntries]) => renderFeatureHistory(feature, featureEntries))
    .join('\n');

  const html = page({
    title: 'DevFlow Benchmark History',
    body: `
      <section class="hero">
        <div>
          <p class="eyebrow">DevFlow Benchmark</p>
          <h1>Benchmark History</h1>
          <p>${entries.length} recorded run(s) across ${grouped.size} feature family/families.</p>
        </div>
      </section>
      ${overallCards(entries)}
      ${featureSections}
    `
  });

  fs.writeFileSync(path.join(benchmarkDir, 'benchmark-history.html'), html, 'utf8');
}

function groupByFeature(entries) {
  const grouped = new Map();
  for (const entry of entries) {
    const feature = entry.data.feature || 'unknown';
    if (!grouped.has(feature)) grouped.set(feature, []);
    grouped.get(feature).push(entry);
  }
  return grouped;
}

function renderFeatureHistory(feature, entries) {
  const sorted = [...entries].sort((a, b) => String(a.data.created_at).localeCompare(String(b.data.created_at)));
  const rows = sorted.map((entry) => {
    const validate = entry.data.commands?.find((item) => item.name === 'validate');
    const skills = entry.data.commands?.find((item) => item.name === 'validate:skills:test');
    const comparison = entry.data.comparison?.command_duration_delta_ms || {};
    return `
      <tr>
        <td><a href="${escapeHtml(path.basename(entry.htmlPath))}">${escapeHtml(entry.data.created_at || entry.fileName)}</a></td>
        <td>${statusBadge(entry.data.status)}</td>
        <td><code>${escapeHtml(entry.data.git_commit || 'unknown')}</code></td>
        <td>${numberCell(validate?.duration_ms)}</td>
        <td>${deltaCell(comparison.validate)}</td>
        <td>${numberCell(skills?.duration_ms)}</td>
        <td>${deltaCell(comparison['validate:skills:test'])}</td>
        <td>${scoreAverage(entry.data.human_scores)}</td>
      </tr>
    `;
  }).join('\n');

  return `
    <section class="panel">
      <h2>${escapeHtml(feature)}</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Run</th>
              <th>Status</th>
              <th>Commit</th>
              <th>Validate ms</th>
              <th>Delta</th>
              <th>Skill test ms</th>
              <th>Delta</th>
              <th>Human avg</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function summaryCards(data) {
  const validate = data.commands?.find((item) => item.name === 'validate');
  const skills = data.commands?.find((item) => item.name === 'validate:skills:test');
  return `
    <section class="cards">
      <div class="card"><span>Status</span><strong>${escapeHtml(data.status || 'unknown')}</strong></div>
      <div class="card"><span>Validate</span><strong>${formatMs(validate?.duration_ms)}</strong></div>
      <div class="card"><span>Skill Test</span><strong>${formatMs(skills?.duration_ms)}</strong></div>
      <div class="card"><span>Human Avg</span><strong>${scoreAverage(data.human_scores)}</strong></div>
    </section>
  `;
}

function overallCards(entries) {
  const passCount = entries.filter((entry) => entry.data.status === 'pass').length;
  const latest = entries.at(-1)?.data;
  return `
    <section class="cards">
      <div class="card"><span>Total Runs</span><strong>${entries.length}</strong></div>
      <div class="card"><span>Passing</span><strong>${passCount}</strong></div>
      <div class="card"><span>Latest Commit</span><strong>${escapeHtml(latest?.git_commit || 'unknown')}</strong></div>
      <div class="card"><span>Latest Status</span><strong>${escapeHtml(latest?.status || 'unknown')}</strong></div>
    </section>
  `;
}

function statusBadge(status) {
  const normalized = status === 'pass' ? 'pass' : status === 'fail' ? 'fail' : 'neutral';
  return `<span class="badge ${normalized}">${escapeHtml(status || 'unknown')}</span>`;
}

function numberCell(value) {
  return typeof value === 'number' ? `${value}` : '';
}

function deltaCell(value) {
  if (typeof value !== 'number') return '<span class="muted">none</span>';
  const className = value <= 0 ? 'good' : 'warn';
  const prefix = value > 0 ? '+' : '';
  return `<span class="${className}">${prefix}${value}</span>`;
}

function formatMs(value) {
  return typeof value === 'number' ? `${value} ms` : 'n/a';
}

function scoreAverage(scores) {
  const values = Object.values(scores || {}).filter((value) => typeof value === 'number');
  if (values.length === 0) return 'n/a';
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return average.toFixed(1);
}

function fallbackMarkdown(data) {
  return `# Feature Benchmark: ${data.feature}\n\nNo markdown report was found for this benchmark run.\n`;
}

function page({ title, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
:root {
  color-scheme: light;
  --bg: #f6f7f9;
  --ink: #20242c;
  --muted: #667085;
  --line: #d8dee8;
  --panel: #ffffff;
  --green: #16794c;
  --red: #b42318;
  --amber: #b54708;
  --blue: #175cd3;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.5;
}
main {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 48px;
}
.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0 18px;
  border-bottom: 1px solid var(--line);
}
.eyebrow {
  color: var(--blue);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 8px;
  text-transform: uppercase;
}
h1, h2, h3 { line-height: 1.2; }
h1 { font-size: 34px; margin: 0 0 8px; }
h2 { font-size: 22px; margin: 0 0 16px; }
p { color: var(--muted); }
a { color: var(--blue); }
code {
  background: #eef2f7;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 1px 4px;
}
.button {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--panel);
  color: var(--ink);
  text-decoration: none;
  font-weight: 700;
}
.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 20px 0;
}
.card, .panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.card { padding: 14px; }
.card span {
  display: block;
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 4px;
}
.card strong { font-size: 20px; }
.panel {
  padding: 18px;
  margin: 16px 0;
}
.table-wrap { overflow-x: auto; }
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
th, td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
  vertical-align: top;
}
th {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
}
.badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 700;
}
.badge.pass { background: #dcfae6; color: var(--green); }
.badge.fail { background: #fee4e2; color: var(--red); }
.badge.neutral { background: #eef2f7; color: var(--muted); }
.good { color: var(--green); font-weight: 700; }
.warn { color: var(--amber); font-weight: 700; }
.muted { color: var(--muted); }
pre {
  overflow-x: auto;
  background: #101828;
  color: #f9fafb;
  padding: 14px;
  border-radius: 8px;
}
@media (max-width: 760px) {
  main { width: min(100% - 20px, 1180px); padding-top: 18px; }
  .hero { align-items: flex-start; flex-direction: column; }
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  h1 { font-size: 26px; }
}
</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>`;
}
