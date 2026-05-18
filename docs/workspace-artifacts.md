# Workspace Artifacts

PRPs-Framework stores machine-readable generated files under `.workspaces`.

## Canonical Files

```text
.workspaces/
├── active-agent.json
├── project_index.json
├── issues/
├── research/
├── specs/
└── roadmap/
    ├── project_index.json
    ├── roadmap_discovery.json
    └── roadmap.json
```

## File Responsibilities

| File | Purpose |
| :--- | :--- |
| `.workspaces/active-agent.json` | Records that `.agent` is the active Antigravity bundle and npm is the command surface |
| `.workspaces/project_index.json` | Project-wide structure, services, conventions, and commands |
| `.workspaces/roadmap/project_index.json` | Project index copy used by roadmap prompts |
| `.workspaces/roadmap/roadmap_discovery.json` | Project purpose, audience, vision, current state, constraints |
| `.workspaces/roadmap/roadmap.json` | Prioritized roadmap features organized into phases |

## Regeneration

```powershell
npm.cmd run activate
npm.cmd run index
```

`npm run activate` prepares directories and metadata. `npm run index` refreshes project index files after structure changes.

## Validation

```powershell
npm.cmd run validate
npm.cmd run roadmap:validate
```

Validation checks JSON syntax, required fields, roadmap feature references, workflow numbering, and expected file locations.
