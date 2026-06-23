# DevFlow Markdown-to-HTML Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a DevFlow-native markdown-to-html rendering layer backed by `md2html` concepts, migrate `70-report` onto it without breaking existing commands, and leave reusable presets in place for future stage adoption.

**Architecture:** Extract generic rendering behavior into shared renderer modules, keep stage-specific mapping inside adapters, and preserve `70-report` compatibility through a wrapper command. The first real preset is `report`; `spec`, `plan`, and `default-doc` are scaffolded so future stages can opt in without architecture changes.

**Tech Stack:** Node.js ESM, filesystem-based HTML templates, existing DevFlow validation scripts, markdown parsing helpers inside `scripts/`, and the current report HTML contract under `.agent/resources/schemas/`.

---

## File Structure

### Files To Create

- `scripts/render-html.mjs`: Shared CLI entry point for generic HTML rendering.
- `scripts/lib/render-html/core.mjs`: Core render pipeline for markdown, presets, metadata, and file output.
- `scripts/lib/render-html/presets.mjs`: Preset registry and lookup helpers.
- `scripts/lib/render-html/presets/report.mjs`: DevFlow `report` preset definition.
- `scripts/lib/render-html/presets/spec.mjs`: Minimal `spec` preset scaffold.
- `scripts/lib/render-html/presets/plan.mjs`: Minimal `plan` preset scaffold.
- `scripts/lib/render-html/presets/default-doc.mjs`: Minimal fallback preset scaffold.
- `scripts/lib/render-html/stage-adapters/report-stage.mjs`: `70-report` adapter that maps workspace artifacts to renderer input.
- `scripts/lib/render-html/markdown.mjs`: Shared markdown-to-HTML helpers extracted from the report script.
- `scripts/lib/render-html/workspace-resolver.mjs`: Shared workspace and running-ID resolution helpers.
- `scripts/test-render-html-core.mjs`: Unit-style contract tests for the shared renderer.
- `scripts/test-render-report-stage.mjs`: Adapter-level tests for `70-report` mapping and preset usage.

### Files To Modify

- `package.json`: Add generic renderer scripts and test script wiring.
- `scripts/generate-report-html.mjs`: Convert into a compatibility wrapper around the shared renderer path.
- `scripts/test-generate-report-html.mjs`: Keep existing compatibility assertions while targeting the migrated implementation.
- `scripts/validate-all.mjs`: Add the new renderer tests to the full validation suite.
- `docs/report-html-placeholder-mapping.md`: Update to reflect the shared renderer and report adapter boundary.
- `docs/workspace-artifacts.md`: Clarify markdown source-of-truth and stage-specific HTML policy.
- `README.md`: Document the new shared renderer capability without exposing upstream branding as the public workflow.

### Dependencies And Environment

- **New Packages**: None in the first round unless the implementation proves that `md2html` cannot be adapted through DevFlow-owned templates and helpers.
- **Config Changes**: None.
- **Upstream Reference Rule**: Use `haidang1810/md2html` as a source of rendering ideas, document structure, and preset behavior, but keep the tracked implementation DevFlow-native.

## 1. Technical Design And Strategy

- **Overview**: Replace report-specific rendering internals with a reusable rendering pipeline. Keep `70-report.md` and `.agent/resources/schemas/report.template.html` as the active report contract while moving markdown rendering and file resolution into shared modules.
- **Reasoning**: This keeps the public DevFlow surface stable, reduces duplication, and allows future stages to adopt HTML output without copying report logic.
- **Impact Assessment**: The highest-risk area is `70-report.html` compatibility, because current tests and validation expect exact files and key output fragments. The plan keeps the wrapper command and existing template to minimize visible change while improving internal structure.

## 2. Implementation Blueprint

> **Mirror Pattern**: `scripts/generate-report-html.mjs` and `scripts/test-generate-report-html.mjs` are the baseline style references for file resolution, contract testing, and error handling.

```js
// Shared render pipeline shape used by the new CLI and by the report wrapper.
export function renderMarkdownDocument({
  sourcePath,
  markdown,
  preset,
  outputPath,
  metadata = {},
  assetsMode = 'self-contained',
  stagePolicy = { htmlRequired: false }
}) {
  const resolvedPreset = getPreset(preset);
  const html = resolvedPreset.render({
    markdown,
    metadata,
    assetsMode,
    sourcePath
  });

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, 'utf8');
  }

  return {
    html,
    outputPath,
    presetUsed: resolvedPreset.name,
    warnings: []
  };
}
```

## 3. Execution Strategy

### Phase 1

- **Phase Name**: Build the shared renderer spine
- **Technical Details**: Create core modules for preset lookup, workspace resolution, and markdown rendering so generic logic no longer lives in `scripts/generate-report-html.mjs`.
- **Edge Cases And Risks**: Avoid changing report-specific placeholders or output sections in this phase. The new modules should be behavior-preserving extractions.

### Phase 2

- **Phase Name**: Migrate `70-report` onto the shared path
- **Technical Details**: Introduce a `70-report` adapter that prepares metadata, checklist stats, and section HTML, then route `scripts/generate-report-html.mjs` through it.
- **Edge Cases And Risks**: Checklist parsing and fallback behavior must remain compatible with validation and existing report test fixtures.

### Phase 3

- **Phase Name**: Expose generic CLI, tests, and docs
- **Technical Details**: Add `render:html`, expand validation coverage, and update documentation for the new renderer boundary and stage-specific HTML policy.
- **Edge Cases And Risks**: Keep docs consistent with the rule that DevFlow is the public surface and HTML is not mandatory for every stage.

## 4. Risks And Mitigations

| Risk | Mitigation |
| :--- | :--- |
| `70-report.html` output drifts enough to break downstream expectations | Keep `.agent/resources/schemas/report.template.html` intact in round one and preserve all existing compatibility assertions in `scripts/test-generate-report-html.mjs` |
| Shared modules become a thin rename of the old report script without true reuse | Separate generic markdown rendering, preset lookup, and workspace resolution into independent modules with dedicated tests |
| Future stage presets require a second refactor | Create the registry and scaffold preset files in round one, even if only `report` is fully exercised |
| Upstream `md2html` ideas leak into the public DevFlow interface | Keep all user-facing commands and docs DevFlow-native; treat upstream as implementation inspiration and internal reference only |

## 5. Verification Focus

### Test Decision Gate

| Subtask | Decision | Reason | Schema/Contract | Planned Test Cases | Test File & Command | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Extract shared render core | Required | Behavior changes from single-purpose script to reusable renderer must be protected | `renderMarkdownDocument()` return shape and preset contract | Arrange: sample markdown and report preset. Act: render through core API. Assert: HTML string, preset name, and output file path are returned correctly | `scripts/test-render-html-core.mjs` via `node scripts/test-render-html-core.mjs` | Script exits `0` and prints `[OK]` |
| Add `70-report` adapter migration | Required | Existing report rendering behavior is business-critical to DevFlow report artifacts | Report adapter input/output contract, checklist aggregation shape | Arrange: sample `70-report.md` plus checklist files. Act: render via adapter. Assert: title, checklist stats, blocked/skipped rows, and file links match expectations | `scripts/test-render-report-stage.mjs` via `node scripts/test-render-report-stage.mjs` | Script exits `0` and prints `[OK]` |
| Preserve wrapper compatibility | Required | Existing command `npm run report:html -- <workspace>` must continue working | Existing report HTML output contract | Arrange: current fixture workspace. Act: run wrapper command. Assert: generated `70-report.html` still includes current key strings | `scripts/test-generate-report-html.mjs` via `node scripts/test-generate-report-html.mjs` | Script exits `0` and prints `[OK]` |
| Add generic CLI wiring and validation suite coverage | Required | New CLI changes executable surface and validation path | CLI argument contract for `render:html` | Arrange: sample report workspace. Act: invoke `node scripts/render-html.mjs --stage 70-report <workspace>`. Assert: output file exists and validation suite can run the new test files | `npm.cmd run validate:all` | Full validation completes without renderer-related failures |
| Update docs for stage-specific HTML policy | Not Required | Documentation-only change with no behavior surface | N/A | Review changed docs for consistency with approved design and current commands | Manual review in diff plus `node scripts/scan-doc-contract.mjs` | Docs scan passes and wording matches design |

- **Success Criteria**:
  - [ ] Shared renderer modules exist and are used by `70-report`
  - [ ] `npm run report:html -- <workspace>` still works without changing user workflow
  - [ ] Generic `render:html` entry point exists for future stage adoption
  - [ ] `70-report` output compatibility remains covered by tests
  - [ ] Docs state that markdown is the source of truth and HTML is stage-specific
- **Required Evidence**:
  - [ ] Output from `node scripts/test-render-html-core.mjs`
  - [ ] Output from `node scripts/test-render-report-stage.mjs`
  - [ ] Output from `node scripts/test-generate-report-html.mjs`
  - [ ] Output from `npm.cmd run validate:all`
- **Manual Verification**: Open a generated `70-report.html` from the fixture workspace and confirm the title, summary sections, checklist stats, blocked/skipped table, and inputs/outputs sections match the current report style.

## 6. Task Breakdown

### Task 1: Scaffold shared renderer modules and scripts

**Files:**
- Create: `scripts/render-html.mjs`
- Create: `scripts/lib/render-html/core.mjs`
- Create: `scripts/lib/render-html/presets.mjs`
- Create: `scripts/lib/render-html/presets/report.mjs`
- Create: `scripts/lib/render-html/presets/spec.mjs`
- Create: `scripts/lib/render-html/presets/plan.mjs`
- Create: `scripts/lib/render-html/presets/default-doc.mjs`
- Create: `scripts/lib/render-html/workspace-resolver.mjs`
- Modify: `package.json`
- Test: `scripts/test-render-html-core.mjs`

- [ ] **Step 1: Write the failing renderer-core contract test**

```js
// scripts/test-render-html-core.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { renderMarkdownDocument } from './lib/render-html/core.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-render-core-'));
const outputPath = path.join(scratchRoot, 'sample.html');

const result = renderMarkdownDocument({
  sourcePath: 'sample.md',
  markdown: '### Executive Summary\\n\\n- Shared renderer is active.',
  preset: 'report',
  outputPath,
  metadata: {
    report_title: 'Report: Shared Renderer Smoke Test',
    report_id: 'smoke-report',
    doc_type: 'stage',
    stage: '70-report',
    created: '2026-06-23',
    updated: '2026-06-23',
    owner: 'codex',
    status: 'draft',
    executive_summary_html: '<p>Shared renderer is active.</p>',
    work_completed_html: '<p>Pending</p>',
    validation_outcome_html: '<p>Pending</p>',
    checklist_summary_html: '<p>Pending</p>',
    checklist_complete: '0',
    checklist_blocked: '0',
    checklist_skipped: '0',
    checklist_total: '0',
    checklist_rows_html: '<tr><td colspan="3">None</td></tr>',
    open_risks_html: '<p>None</p>',
    next_actions_html: '<p>None</p>',
    decisions_html: '<div class="decision-item">Adopt shared renderer</div>',
    inputs_list_html: '<li>70-report.md</li>',
    outputs_list_html: '<li>70-report.html</li>',
    additional_notes_html: '<p>n/a</p>',
    footer_text: 'Generated from smoke test'
  }
});

assert(result.presetUsed === 'report', 'presetUsed should equal report');
assert(result.outputPath === outputPath, 'outputPath should be preserved');
assert(fs.existsSync(outputPath), 'renderer should write output file');
assert(result.html.includes('Shared Renderer Smoke Test'), 'html should include report title');
console.log('[OK] renderMarkdownDocument writes HTML through the shared preset pipeline.');
```

- [ ] **Step 2: Run the test to verify it fails before implementation**

Run: `node scripts/test-render-html-core.mjs`
Expected: FAIL with module-not-found or missing export errors for the new renderer files.

- [ ] **Step 3: Implement the minimal shared renderer spine**

```js
// scripts/lib/render-html/presets.mjs
import { reportPreset } from './presets/report.mjs';
import { specPreset } from './presets/spec.mjs';
import { planPreset } from './presets/plan.mjs';
import { defaultDocPreset } from './presets/default-doc.mjs';

const registry = new Map([
  [reportPreset.name, reportPreset],
  [specPreset.name, specPreset],
  [planPreset.name, planPreset],
  [defaultDocPreset.name, defaultDocPreset]
]);

export function getPreset(name = 'default-doc') {
  const preset = registry.get(name);
  if (!preset) throw new Error(`Unknown render preset: ${name}`);
  return preset;
}
```

```js
// scripts/lib/render-html/core.mjs
import fs from 'node:fs';
import path from 'node:path';
import { getPreset } from './presets.mjs';

export function renderMarkdownDocument({
  sourcePath,
  markdown,
  preset,
  outputPath,
  metadata = {},
  assetsMode = 'self-contained',
  stagePolicy = { htmlRequired: false }
}) {
  const resolvedPreset = getPreset(preset);
  const html = resolvedPreset.render({ sourcePath, markdown, metadata, assetsMode, stagePolicy });

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, 'utf8');
  }

  return {
    html,
    outputPath,
    presetUsed: resolvedPreset.name,
    warnings: []
  };
}
```

```js
// scripts/lib/render-html/presets/report.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
const templatePath = path.join(projectRoot, '.agent', 'resources', 'schemas', 'report.template.html');

export const reportPreset = {
  name: 'report',
  render({ metadata }) {
    const template = fs.readFileSync(templatePath, 'utf8');
    return Object.entries(metadata).reduce(
      (output, [key, value]) => output.split(`{{${key}}}`).join(String(value)),
      template
    );
  }
};
```

```js
// scripts/lib/render-html/presets/spec.mjs
export const specPreset = { name: 'spec', render() { throw new Error('Spec preset is not implemented yet.'); } };
```

```js
// scripts/lib/render-html/presets/plan.mjs
export const planPreset = { name: 'plan', render() { throw new Error('Plan preset is not implemented yet.'); } };
```

```js
// scripts/lib/render-html/presets/default-doc.mjs
export const defaultDocPreset = { name: 'default-doc', render() { throw new Error('Default doc preset is not implemented yet.'); } };
```

```json
// package.json (scripts excerpt)
{
  "scripts": {
    "render:html": "node ./scripts/render-html.mjs",
    "render:html:test": "node ./scripts/test-render-html-core.mjs"
  }
}
```

- [ ] **Step 4: Run the renderer-core test to verify it passes**

Run: `node scripts/test-render-html-core.mjs`
Expected: PASS with `[OK] renderMarkdownDocument writes HTML through the shared preset pipeline.`

- [ ] **Step 5: Commit the renderer scaffold**

```bash
git add package.json scripts/render-html.mjs scripts/lib/render-html scripts/test-render-html-core.mjs
git commit -m "feat: scaffold shared html renderer"
```

### Task 2: Extract shared markdown and workspace helpers

**Files:**
- Create: `scripts/lib/render-html/markdown.mjs`
- Create: `scripts/lib/render-html/workspace-resolver.mjs`
- Modify: `scripts/generate-report-html.mjs`
- Test: `scripts/test-render-report-stage.mjs`

- [ ] **Step 1: Write the failing report-adapter helper test**

```js
// scripts/test-render-report-stage.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { renderReportStageWorkspace } from './lib/render-html/stage-adapters/report-stage.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-report-stage-'));
const workspaceDir = path.join(scratchRoot, '.workspaces', 'specs', '999-render-stage');

writeFile(path.join(workspaceDir, '70-report.md'), `---
id: "999-report"
title: "Report: Adapter Smoke Test"
doc_type: "stage"
stage: "70-report"
created: "2026-06-23"
updated: "2026-06-23"
owner: "codex"
status: "completed"
related_run: "999"
---

# Report: Adapter Smoke Test

## 3. Required Content

### Executive Summary

- Adapter path renders this report.

### Work Completed

- Rendered through the shared stage adapter.

### Validation Outcome

- Adapter smoke test should pass.

### Open Risks

- None

### Next Actions

- Expand to more stages later.

## 4. Decisions

- Keep report output compatible.
`);

const result = renderReportStageWorkspace({ workspaceDir });

assert(result.outputPath.endsWith('70-report.html'), 'adapter should target 70-report.html');
assert(result.html.includes('Adapter Smoke Test'), 'html should include report title');
assert(result.html.includes('shared stage adapter'), 'html should include work-completed content');
console.log('[OK] report stage adapter renders a workspace through the shared renderer.');
```

- [ ] **Step 2: Run the test to verify it fails before helper extraction**

Run: `node scripts/test-render-report-stage.mjs`
Expected: FAIL with missing adapter module or missing export errors.

- [ ] **Step 3: Extract reusable markdown and workspace helpers from the old report script**

```js
// scripts/lib/render-html/workspace-resolver.mjs
import fs from 'node:fs';
import path from 'node:path';

export function resolveWorkspaceDir({ argument, projectRoot }) {
  const directPath = path.resolve(projectRoot, argument);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isDirectory()) return directPath;

  const specsRoot = path.join(projectRoot, '.workspaces', 'specs');
  const candidates = fs.readdirSync(specsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(argument))
    .map((entry) => path.join(specsRoot, entry.name));

  if (candidates.length !== 1) {
    throw new Error(`Could not resolve workspace path or running ID: ${argument}`);
  }

  return candidates[0];
}
```

```js
// scripts/lib/render-html/markdown.mjs
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderInline(text) {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return escaped;
}
```

```js
// scripts/generate-report-html.mjs (shape after extraction)
import { runReportHtmlCommand } from './lib/render-html/stage-adapters/report-stage.mjs';

runReportHtmlCommand({
  projectRoot: process.cwd(),
  argument: process.argv[2]
});
```

- [ ] **Step 4: Run the adapter helper test to verify it passes**

Run: `node scripts/test-render-report-stage.mjs`
Expected: PASS with `[OK] report stage adapter renders a workspace through the shared renderer.`

- [ ] **Step 5: Commit the shared helper extraction**

```bash
git add scripts/generate-report-html.mjs scripts/lib/render-html/markdown.mjs scripts/lib/render-html/workspace-resolver.mjs scripts/test-render-report-stage.mjs
git commit -m "refactor: extract shared html renderer helpers"
```

### Task 3: Implement the `70-report` adapter and preserve compatibility

**Files:**
- Create: `scripts/lib/render-html/stage-adapters/report-stage.mjs`
- Modify: `scripts/generate-report-html.mjs`
- Modify: `scripts/test-generate-report-html.mjs`
- Test: `scripts/test-generate-report-html.mjs`

- [ ] **Step 1: Keep the current compatibility test as the failing guardrail**

```js
// scripts/test-generate-report-html.mjs
assert(html.includes('<title>Report: Sample Password Reset</title>'), 'html should include rendered title');
assert(html.includes('Checklist items: 7'), 'html footer should include checklist total');
assert(html.includes('Build reset confirmation API'), 'html should include blocked checklist row');
assert(html.includes('Publish release note'), 'html should include skipped checklist row');
```

- [ ] **Step 2: Run the current report test before adapter migration**

Run: `node scripts/test-generate-report-html.mjs`
Expected: PASS before migration; re-run after each adapter change to catch drift immediately.

- [ ] **Step 3: Implement the `70-report` adapter and wrapper command**

```js
// scripts/lib/render-html/stage-adapters/report-stage.mjs
import fs from 'node:fs';
import path from 'node:path';
import { renderMarkdownDocument } from '../core.mjs';
import { resolveWorkspaceDir } from '../workspace-resolver.mjs';
import {
  parseFrontmatter,
  extractH2Section,
  extractH3Section,
  renderDecisionHtml,
  renderMarkdownToHtml,
  summarizeChecklists,
  renderChecklistRowsHtml,
  renderFileListItem,
  deriveRunningId,
  deriveWorkTitle
} from '../markdown.mjs';

export function renderReportStageWorkspace({ workspaceDir }) {
  const reportPath = path.join(workspaceDir, '70-report.md');
  const reportMarkdown = fs.readFileSync(reportPath, 'utf8');
  const { data: frontmatter, body } = parseFrontmatter(reportMarkdown);
  const checklist = summarizeChecklists(workspaceDir);

  const metadata = {
    report_title: frontmatter.title || `Report: ${deriveWorkTitle(frontmatter, workspaceDir)}`,
    report_id: frontmatter.id || `${deriveRunningId(workspaceDir, frontmatter)}-report`,
    doc_type: frontmatter.doc_type || 'stage',
    stage: frontmatter.stage || '70-report',
    created: frontmatter.created || frontmatter.updated || new Date().toISOString().slice(0, 10),
    updated: frontmatter.updated || frontmatter.created || new Date().toISOString().slice(0, 10),
    owner: frontmatter.owner || 'unknown',
    status: frontmatter.status || 'draft',
    executive_summary_html: renderMarkdownToHtml(extractH3Section(body, 'Executive Summary')),
    work_completed_html: renderMarkdownToHtml(extractH3Section(body, 'Work Completed')),
    validation_outcome_html: renderMarkdownToHtml(extractH3Section(body, 'Validation Outcome')),
    checklist_summary_html: renderMarkdownToHtml(extractH3Section(body, 'Checklist Summary')),
    checklist_complete: String(checklist.totals.complete),
    checklist_blocked: String(checklist.totals.blocked),
    checklist_skipped: String(checklist.totals.skipped),
    checklist_total: String(checklist.totals.total),
    checklist_rows_html: renderChecklistRowsHtml(checklist.blockedOrSkipped),
    open_risks_html: renderMarkdownToHtml(extractH3Section(body, 'Open Risks')),
    next_actions_html: renderMarkdownToHtml(extractH3Section(body, 'Next Actions')),
    decisions_html: renderDecisionHtml(extractH2Section(body, '4. Decisions', '5. Outputs')),
    inputs_list_html: buildInputsListHtml(workspaceDir, checklist.files),
    outputs_list_html: buildOutputsListHtml(),
    additional_notes_html: renderMarkdownToHtml(extractH2Section(body, '7. Additional Notes')),
    footer_text: `Generated from 70-report.md | Mainline next step: end of flow | Checklist items: ${checklist.totals.total}`
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
  const workspaceDir = resolveWorkspaceDir({ argument, projectRoot });
  const result = renderReportStageWorkspace({ workspaceDir });
  console.log(`Generated ${result.outputPath}`);
}
```

- [ ] **Step 4: Run both adapter and compatibility tests**

Run: `node scripts/test-render-report-stage.mjs`
Expected: PASS with `[OK] report stage adapter renders a workspace through the shared renderer.`

Run: `node scripts/test-generate-report-html.mjs`
Expected: PASS with `[OK] generate-report-html renders standardized report HTML from markdown report and checklist tables.`

- [ ] **Step 5: Commit the report migration**

```bash
git add scripts/lib/render-html/stage-adapters/report-stage.mjs scripts/generate-report-html.mjs scripts/test-generate-report-html.mjs
git commit -m "refactor: migrate report html generation to shared renderer"
```

### Task 4: Add generic CLI command and validation coverage

**Files:**
- Modify: `scripts/render-html.mjs`
- Modify: `package.json`
- Modify: `scripts/validate-all.mjs`
- Test: `scripts/test-render-html-core.mjs`
- Test: `scripts/test-render-report-stage.mjs`

- [ ] **Step 1: Write the generic CLI behavior into a focused command path**

```js
// scripts/render-html.mjs
import process from 'node:process';
import { resolveWorkspaceDir } from './lib/render-html/workspace-resolver.mjs';
import { renderReportStageWorkspace } from './lib/render-html/stage-adapters/report-stage.mjs';

const args = process.argv.slice(2);
const stageIndex = args.indexOf('--stage');
const stage = stageIndex >= 0 ? args[stageIndex + 1] : null;
const target = args.filter((value, index) => index !== stageIndex && index !== stageIndex + 1)[0];

if (stage !== '70-report') {
  throw new Error('Round-one CLI support is currently limited to --stage 70-report.');
}

const workspaceDir = resolveWorkspaceDir({ argument: target, projectRoot: process.cwd() });
const result = renderReportStageWorkspace({ workspaceDir });
console.log(`Generated ${result.outputPath}`);
```

- [ ] **Step 2: Add the scripts and validation wiring**

```json
// package.json (scripts excerpt)
{
  "scripts": {
    "render:html": "node ./scripts/render-html.mjs",
    "render:html:test": "node ./scripts/test-render-html-core.mjs",
    "report:html:test": "node ./scripts/test-generate-report-html.mjs"
  }
}
```

```js
// scripts/validate-all.mjs (checks excerpt)
['Shared renderer core test', [process.execPath, ['scripts/test-render-html-core.mjs']]],
['Report stage adapter test', [process.execPath, ['scripts/test-render-report-stage.mjs']]],
['Report HTML generator test', [process.execPath, ['scripts/test-generate-report-html.mjs']]],
```

- [ ] **Step 3: Run the command-level checks**

Run: `node scripts/render-html.mjs --stage 70-report .workspaces/specs/999-sample-report`
Expected: PASS when a fixture workspace exists and prints `Generated ...70-report.html`

Run: `node scripts/test-render-html-core.mjs`
Expected: PASS

Run: `node scripts/test-render-report-stage.mjs`
Expected: PASS

- [ ] **Step 4: Run the full validation suite**

Run: `npm.cmd run validate:all`
Expected: PASS with the new shared renderer checks included in the output.

- [ ] **Step 5: Commit the CLI and validation updates**

```bash
git add package.json scripts/render-html.mjs scripts/validate-all.mjs
git commit -m "feat: add shared html render cli"
```

### Task 5: Update documentation for the new renderer boundary

**Files:**
- Modify: `README.md`
- Modify: `docs/workspace-artifacts.md`
- Modify: `docs/report-html-placeholder-mapping.md`
- Test: `scripts/scan-doc-contract.mjs`

- [ ] **Step 1: Update README wording to introduce the shared renderer without changing the public workflow surface**

```md
## HTML Rendering

DevFlow keeps markdown as the source of truth for stage artifacts.

HTML is a derived artifact controlled by stage policy. In the current framework round:

- `70-report` requires `70-report.html`
- other stages remain markdown-first unless they explicitly opt into HTML rendering later

Use:

```powershell
npm.cmd run report:html -- <workspace-path-or-running-id>
npm.cmd run render:html -- --stage 70-report <workspace-path-or-running-id>
```
```

- [ ] **Step 2: Update workspace and placeholder docs to reflect the adapter/shared-renderer split**

```md
Generator boundary:

- `scripts/render-html.mjs` provides the shared DevFlow-native HTML CLI
- `scripts/generate-report-html.mjs` remains the compatibility wrapper for `70-report`
- `scripts/lib/render-html/stage-adapters/report-stage.mjs` owns report-specific placeholder mapping
```

- [ ] **Step 3: Run the documentation contract scan**

Run: `node scripts/scan-doc-contract.mjs`
Expected: PASS with no documentation contract violations.

- [ ] **Step 4: Manually verify consistency against the approved design spec**

Check:
- `docs/superpowers/specs/2026-06-23-devflow-md2html-engine-design.md`
- updated `README.md`
- updated `docs/workspace-artifacts.md`
- updated `docs/report-html-placeholder-mapping.md`

Expected: All three docs state that `.md` is the source of truth and `.html` is stage-specific.

- [ ] **Step 5: Commit the documentation updates**

```bash
git add README.md docs/workspace-artifacts.md docs/report-html-placeholder-mapping.md
git commit -m "docs: describe shared html renderer"
```

## 7. Checklist Initialization

- **Checklist Directory**: Not required for this framework-internal planning artifact unless the implementation is moved into a numbered DevFlow running-ID workspace.
- **Required Files**: If execution is promoted into a `/30-Plan` run under `.workspaces/specs/`, create `master-checklist.md`, `implementation-checklist.md`, and `verification-checklist.md` there before `/40-Implement`.
- **Checklist Rule**: Convert the five tasks above into live checklist items if execution moves into a tracked running-ID workspace.
- **Synchronization Rule**: Keep commit boundaries aligned with task boundaries so checklist evidence stays easy to update.

## 8. Sources

- `docs/superpowers/specs/2026-06-23-devflow-md2html-engine-design.md`
- `scripts/generate-report-html.mjs`
- `scripts/test-generate-report-html.mjs`
- `scripts/validate-all.mjs`
- `scripts/validate-framework.mjs`
- `.agent/resources/schemas/report.template.html`
- `docs/report-html-placeholder-mapping.md`
- `README.md`
- Upstream reference: [haidang1810/md2html](https://github.com/haidang1810/md2html)

---

Technical plan generated via Nexus-DevFlow Manager.
