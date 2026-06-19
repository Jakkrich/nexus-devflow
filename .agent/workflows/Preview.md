---
description: Preview management and temporary runtime checks. Transitional compatibility path for the Preview companion command in DevFlow 2.0.
---

# Preview Management

## Usage

```text
Preview
Preview start
Preview stop
Preview restart
Preview check
```

This file keeps its old numeric path for migration compatibility.

In DevFlow 2.0, `Preview` is a companion command, not a numbered mainline workflow.

Primary behavior now lives in:

```text
.agent/skills/preview-local-check/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill.

Manage the local preview development server or temporary runtime check.

Use it when:

- the team wants a quick visual or runtime check before formal verification
- implementation needs a local smoke check
- a temporary render helps clarify what changed
- a human reviewer needs something concrete to inspect before giving feedback

Preferred DevFlow 2.0 pairing:

- from `/40-Implement`
- from `/50-Verify`

---

## Sub-commands

- `Preview` - show current preview status
- `Preview start` - start the server
- `Preview stop` - stop the server
- `Preview restart` - restart the server
- `Preview check` - run a health check

---

## Internal Process

`Preview` manages the local preview workflow using the `preview-local-check` skill plus any available preview automation or equivalent project-local commands.

When handling preview operations:

1. detect the correct project or server command path
2. report the current state clearly
3. handle port conflicts gracefully
4. keep the action scoped to preview management, not broader deployment
5. distinguish between preview success and full verification success

Commands should use the nearest equivalent project-local preview command for the project, such as `npm run dev`, `npm run preview`, framework-specific local servers, or other runtime helpers that already exist in the target project.

### Resolving Port Conflicts

If the port is in use, offer options:

1. start on a different port
2. terminate the process on the existing port
3. specify a custom port

### Status Format

When displaying status, clearly state:

- URL
- project path
- app type
- health status
- notes about blockers, missing dependencies, or startup warnings

Example summary:

```markdown
## Preview Status

- **URL**: `http://localhost:3000`
- **Project Path**: `[absolute path]`
- **App Type**: `Next.js | FastAPI | Odoo | PHP | Other`
- **Health Status**: `OK | Warning | Failed`
- **Notes**: [port conflict, startup issue, missing dependency, or none]
```

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: `/40-Implement`, `/50-Verify`, UI or runtime checking
- Typical handoff targets: `/50-Verify`, `Debug`, `/40-Implement`

## Sources

- `AGENTS.md`
- `.agent/skills/preview-local-check/SKILL.md`
- Related commands: `/40-Implement`, `/50-Verify`, `Debug`

## Next Workflow Recommendation

- **Primary**: `/50-Verify` when preview confirms the change is ready for formal checks
- **Alternative**: `/40-Implement` when preview exposed implementation work

