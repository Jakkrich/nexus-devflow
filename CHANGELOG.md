# Changelog

All notable changes from the DevFlow 2.0 line onward are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-18

### Added

- Established the DevFlow 2.0 mainline: `/00-Discover` -> `/70-Report`
- Added markdown-first stage templates for Discover, Define, Spec, Plan, Implement, Verify, Release, and Report
- Added skill-backed companion layers including `preview-local-check`, `spec-research`, `competitor-analysis`, `roadmap-strategy`, `spec-orchestration`, `human-review-decisions`, `release-git-operations`, `pr-review-analysis`, `review-followup-routing`, `insight-capture`, and `specialist-agent-routing`
- Added standardized roadmap discovery markdown contract at `.workspaces/roadmap/roadmap-discovery.md`
- Added stable report output direction for final HTML reporting

### Changed

- Converted Nexus-DevFlow from JSON/dashboard-centered flow to DevFlow 2.0 markdown-first workflow contracts
- Renamed non-mainline workflows to unnumbered companion commands
- Reduced the public command surface and reclassified many former workflows as internal wrappers backed by skills
- Rewrote key guides and framework instructions for 2.0, including setup, usage, roadmap, workspace artifacts, workflow surface mapping, and agent routing
- Switched roadmap validation from JSON artifact checks to markdown contract validation
- Updated provider-facing and framework-facing instructions to treat `.agent` as the single active bundle

### Removed

- Legacy numbered alias workflows outside the mainline
- `-fast` workflow family
- Dashboard runtime as part of the active engine
- JSON-first task contracts as the primary workflow engine
- Old PRP runtime scripts that mutated task JSON as the normal path
- Obsolete Python helper scripts under `.agent/scripts` that were no longer part of the active 2.0 engine

### Validation

- `npm.cmd run roadmap:validate`
- `npm.cmd run validate`
- `npm.cmd run validate:all`
