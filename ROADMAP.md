# PRPs-Framework Roadmap

Machine-readable source: `.workspaces/roadmap/roadmap.json`

## Vision

PRPs-Framework is an IDE-agnostic context engineering toolkit that turns AI-assisted software development into a structured, traceable, JSON-driven workflow.

## Phase 1: Foundation / MVP Hardening

Status: completed

Goal: make the framework reliable for roadmap and task workflows.

- **Done**: Generate canonical `project_index.json`
- **Done**: Formalize roadmap discovery output location
- **Done**: Normalize root documentation encoding

Milestones:

- Canonical project context is available
- Documentation renders cleanly

## Phase 2: Workflow Reliability

Status: completed

Goal: strengthen everyday developer use with validation and maintainable structure.

- **Done**: Add root-level framework validation command
- **Done**: Create agent bundle health checker
- **Done**: Introduce manifest-driven bundle definition

Milestones:

- One command validates framework health
- The active agent bundle is easy to verify and maintain

## Phase 3: Adoption and Scale

Status: completed

Goal: improve adoption across teams with guided setup, governance, and visible artifact health.

- **Done**: Build a guided quickstart and health check
- **Done**: Publish human-readable roadmap and governance docs
- **Done**: Add dashboard artifact health indicators

Milestones:

- New users can onboard quickly
- Roadmap operations are visible and governed

## Maintenance Policy

- Keep `.agent` as the active bundle.
- Keep `agent-bundle.manifest.json` aligned with required bundle files.
- Keep `.workspaces/roadmap/roadmap.json` and this file aligned.
- Run `npm run validate` before release or handoff.
- Regenerate project indexes with `npm run index` after structural changes.

