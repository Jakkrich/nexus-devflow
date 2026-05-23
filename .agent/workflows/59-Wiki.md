---
description: DevFlow Wiki - Ingest, query, lint, and promote compiled project or framework knowledge.
---
# Phase 59: DevFlow Wiki

Compile reusable knowledge from DevFlow artifacts into a structured Markdown wiki without replacing source artifacts.

## Usage

```text
/59-Wiki project ingest {source}
/59-Wiki framework ingest {source}
/59-Wiki query {framework|project|all} "{question}"
/59-Wiki lint
/59-Wiki promote project-to-framework {page}
```

## Purpose

DevFlow Wiki turns verified specs, QA reports, RCA reports, PR reviews, research, and insight notes into durable linked Markdown pages. It supports two namespaces:

- `framework`: knowledge about Nexus-DevFlow itself.
- `project`: knowledge about the project that uses Nexus-DevFlow.

The wiki is compiled knowledge. It is not the source of truth. Source artifacts, code, commits, and reports remain authoritative.

Apply `.agent/skills/devflow-wiki/SKILL.md` when initializing, ingesting, querying, linting, or deciding whether wiki updates are needed.

## Canonical Layout

```text
.workspaces/wiki/
|-- framework/
|   |-- index.md
|   |-- agents/
|   |-- commands/
|   |-- decisions/
|   |-- gotchas/
|   |-- token-context/
|   `-- workflows/
`-- project/
    |-- index.md
    |-- architecture/
    |-- decisions/
    |-- domain/
    |-- gotchas/
    |-- patterns/
    |-- tasks/
    |-- token-context/
    `-- _drafts/
```

## When To Ingest

Ingest only when the source contains reusable knowledge:

- after `/33-Verify` passes and the task has reusable patterns or decisions
- after `/54-Insight` extracts durable lessons
- after `/20-Debug` confirms root cause and prevention
- after `/55-PR-Review` finds reusable risk, convention, or architecture guidance
- after architecture, API, schema, workflow, or agent contract changes

Do not ingest unverified hypotheses, noisy logs, one-off status messages, or routine edits with no reusable learning.

## Process

### 0. Initialize Or Lint With CLI

Use the script-first command surface for deterministic setup and linting:

```powershell
npm run agent -- wiki:init project
npm run agent -- wiki:init framework
npm run agent -- wiki:lint project
npm run agent -- wiki:lint framework
```

### 1. Classify Scope

Choose the namespace before editing:

- Use `framework` for DevFlow workflow, agent, command, install, token/context, or framework design knowledge.
- Use `project` for target project architecture, domain, patterns, decisions, gotchas, and task lessons.
- Use `promote project-to-framework` only after confirming the lesson applies beyond one project.

### 2. Load Source Evidence

Read the source path or range:

- `.workspaces/specs/{ID}-*/`
- `.workspaces/debug/*.md`
- `.workspaces/reports/*.md`
- `.workspaces/research/*.md`
- `.workspaces/lessons.md`
- git diff or commit range when explicit source artifacts are missing

### 3. Draft Or Update Pages

Prefer the smallest page set:

- create or update one concept page when possible
- add backlinks to related pages with `[[wikilinks]]`
- include a `Sources` section with paths, commits, or reports
- put uncertain or unreviewed pages under `_drafts/`
- avoid broad rewrites of unrelated wiki pages

### 4. Lint Before Reporting Complete

For `lint`, inspect wiki pages for:

- missing `Sources`
- broken local links or stale paths
- duplicate concept pages
- orphan pages without incoming links
- framework/project namespace leakage

## Output

Return:

- pages created or updated
- source artifacts used
- unresolved questions or stale-risk notes
- lint result if run

## Next Workflow Recommendation

- **Primary**: `/54-Insight {source}` when ingest finds lessons that should also be recorded in task logs or `.workspaces/lessons.md`.
- **Why**: `/54-Insight` preserves task-specific or project-wide lessons before or alongside wiki compilation.
- **Alternatives**:
  - `/33-Verify {ID}` - choose this when the source task has not been validated yet.
  - `/55-PR-Review {target}` - choose this when the source is an unreviewed diff or PR.
  - `/99-Help {topic}` - choose this when the user needs route guidance instead of wiki edits.

## Wiki Update Recommendation

- **Needed**: `yes`
- **Scope**: `framework` or `project`, matching the command scope.
- **Reason**: `/59-Wiki` exists specifically to compile reusable knowledge into the wiki.
- **Suggested Command**: `/59-Wiki lint`
