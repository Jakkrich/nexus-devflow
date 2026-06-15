---
description: Fast Markdown Changelog - Draft user-facing release notes from a fast task without JSON task scans.
---
# Phase 53-fast: Changelog Fast Markdown Task

Draft a changelog entry from fast task evidence and git diff.

## Usage

```text
/53-Changelog-fast {ID}-{slug}
```

## Fast Mode Contract

- Read `.workspaces/specs/{ID}-{slug}-spec.md`, `implementation.md`, `verify.md`, and `commit.md` when available.
- Write `.workspaces/specs/{ID}-{slug}-changelog.md`.
- Do not scan or mutate JSON task artifacts.
- Keep user-facing changes in changelog text and internal gotchas in insight notes.

## Process

### 1. Gather Evidence

- Read fast task artifacts.
- Inspect git diff or recent commits when relevant.
- Identify user-visible additions, changes, fixes, removals, and security notes.

### 2. Draft Entry

Use clear release-note language:

- `Added` for new capability.
- `Changed` for behavior or workflow changes.
- `Fixed` for bug fixes.
- `Removed` for removals.
- `Security` for security-relevant changes.

### 3. Write `changelog.md`

Use this structure:

```markdown
---
id: "{ID}-{slug}"
workflow: "fast"
status: "draft"
source_workflow: "/53-Changelog-fast"
---

# Changelog: <Title>

## Suggested Version Impact

## Entry

### Added

### Changed

### Fixed

### Removed

### Security

## Evidence

## Handoff
```

Write `None` for empty sections.

## Output

Report:

- Suggested version impact
- Draft changelog entry
- Evidence source
- Whether `CHANGELOG.md` was updated or only a task-local draft was created

## Next Workflow Recommendation

- **Primary**: `/50-Commit-fast {ID}-{slug}` when release notes and verification are ready.
- **Alternative**: `/54-Insight-fast {ID}-{slug}` when internal lessons should be captured separately.
