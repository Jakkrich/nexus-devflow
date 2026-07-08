## Project Context Index

Use this file as a human-readable starting point for Nexus-DevFlow 2.0.

### Project Overview

- **Platform/Stack**: Nexus-DevFlow 2.0, Node.js tooling, markdown-first stage contracts
- **Description**: Framework for stage-based AI collaboration across discovery, definition, specification, planning, implementation, verification, release, and reporting
- **Active Bundle**: `.agent`
- **Primary Contract**: stage markdown files under `.workspaces`

### Mainline Workflow

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

### Public Companion Commands

- `Goal`
- `Brainstorm`
- `Research`
- `Debug`
- `PRD`
- `Issue-Triage`
- `Security-Review`
- `Wiki`
- `Check-For-Updates`
- `Help`

### Important Files

- `package.json`: root npm command surface
- `AGENTS.md`: framework operating model
- `docs/quickstart.md`: quickest valid start
- `docs/workspace-artifacts.md`: artifact contract guide
- `ROADMAP.md`: current roadmap summary
- `CHANGELOG.md`: release notes from DevFlow 2.0 onward

### Core Commands

- `npm run activate`
- `npm run index`
- `npm run roadmap:validate`
- `npm run validate`
- `npm run validate:all`
- `npm run sync:check`

### Workspace Notes

- `.workspaces/specs/` stores per-running-ID stage artifacts
- `.workspaces/roadmap/roadmap-discovery.md` stores roadmap discovery context
- `.workspaces/reports/` stores cross-cutting reports
- `.workspaces/lessons.md` stores reusable lessons

### Current State

- Framework target mode: `workspace-stage-first`
- Artifact contract: `markdown-first`
- Legacy dashboard and JSON-first runtime: removed from active engine

### Maintenance Notes

- Keep `.agent` as the single source for framework workflow assets
- Keep historical docs clearly marked as historical
- Regenerate or revalidate after structural edits
