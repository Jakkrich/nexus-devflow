---
description: DevFlow Wiki - Ingest, query, lint, and promote compiled project or framework knowledge.
---
# Wiki

In DevFlow 2.0, `Wiki` is a companion command, not a numbered mainline workflow. Its operational behavior remains detailed because wiki compilation is still an active workflow capability.

## Purpose

Use `Wiki` to compile reusable knowledge from verified DevFlow artifacts into a structured Markdown wiki without replacing source artifacts.

## Usage

```text
Wiki project ingest {source}
Wiki framework ingest {source}
Wiki query {framework|project|all} "{question}"
Wiki lint
Wiki promote project-to-framework {page}
```

## When To Use

Use `Wiki` when:

- verified knowledge should be preserved
- framework or project conventions should be documented
- a final report should be promoted into durable knowledge
- review, debug, research, or release output contains reusable patterns

Preferred DevFlow 2.0 pairing:

- after `/50-Verify`
- after `/70-Release`
- after `/60-Report`
- after meaningful `Debug` or review output

## Process

`Wiki` turns verified specs, verify reports, RCA reports, PR reviews, research, release notes, and final reports into durable linked pages.

It supports two namespaces:

- `framework`: knowledge about Nexus-DevFlow itself
- `project`: knowledge about the project that uses Nexus-DevFlow

Rules:

1. The wiki is compiled knowledge, not source of truth
2. Ingest only reusable knowledge
3. Prefer small, focused updates over broad rewrites
4. Always include source references
5. Do not promote unresolved hypotheses as settled project knowledge

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

## Process Detail

### 1. Classify Scope

Choose the namespace before editing:

- use `framework` for DevFlow workflow, agent, command, install, token/context, or framework design knowledge
- use `project` for target project architecture, domain, patterns, decisions, gotchas, and task lessons
- use `promote project-to-framework` only after confirming the lesson applies beyond one project

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

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Knowledge system command, not a numbered stage
- Typical entry points: after `/50-Verify`, `/60-Report`, `/70-Release`, `Debug`, `Insight`, `PR-Review`
- Typical handoff targets: return to the originating stage or finish as documentation-only work

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/wiki_page.template.md`
- `.agent/resources/schemas/wiki_project_index.template.md`
- Related commands: `/50-Verify`, `/60-Report`, `/70-Release`, `Debug`, `Insight`, `PR-Review`, `Help`

## Next Workflow Recommendation

- **Primary**: return to the stage or artifact flow that produced the reusable knowledge
- **Why**: `Wiki` compiles lessons after the source work is already validated
- **Common routes**: `/60-Report`, `/70-Release`, or `/50-Verify`

