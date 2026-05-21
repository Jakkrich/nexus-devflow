---
name: 9arm-skills
description: Credited engineering discipline pack adapted from thananon/9arm-skills for Antigravity IDE and Nexus-DevFlow workflows.
source_pack: 9arm-skills
credit: thananon/9arm-skills
upstream: https://github.com/thananon/9arm-skills
adapted_for: Antigravity IDE / Nexus-DevFlow
---

# 9arm-Skills Discipline Pack

This pack adapts the engineering discipline ideas from `9arm-skills` into the Nexus-DevFlow `.agent` bundle.

`9arm-skills` is used as a credited thinking layer, not as a replacement for Nexus-DevFlow. Users should keep invoking the normal workflows (`/20-Debug`, `/55-PR-Review`, `/54-Insight`, `/90-Agent`, `/99-Coach`). The workflow applies the relevant 9arm discipline internally and still writes the usual Nexus reports and artifacts.

## Credit

- Source pack: `9arm-skills`
- Credit: `thananon/9arm-skills`
- Upstream: https://github.com/thananon/9arm-skills
- Adapted for: Antigravity IDE / Nexus-DevFlow

## Workflow Mapping

| Nexus-DevFlow Workflow | Applied 9arm Skill | Purpose |
|---|---|---|
| `/20-Debug` | `debug-mantra` | Reproduce before fixing, trace the real fail path, falsify hypotheses, and preserve breadcrumbs. |
| `/54-Insight` | `post-mortem` | Turn validated bug fixes and incidents into durable team knowledge. |
| `/55-PR-Review` | `scrutinize` | Review intent, smaller alternatives, actual paths, and findings before approving changes. |
| `/90-Agent code-reviewer` | `scrutinize` | Apply outsider review discipline to specialist code reviews. |
| `/51-PR`, `/53-Changelog`, `/99-Coach` | `management-talk` | Translate engineering details into stakeholder-readable status, impact, owner, and next step. |

## Output Rule

Keep Nexus-DevFlow output formats intact:

- Debug output still goes to `.workspaces/debug/rca-{slug}.md`.
- PR review output still uses the PR review report contract.
- Specialist reports still go to `.workspaces/reports/`.
- Lessons still go to `.workspaces/lessons.md` or task logs.

When a report uses this pack, include a short source discipline note:

```md
## Source Discipline
- Source pack: 9arm-skills
- Applied skill: {skill-name}
- Credit: thananon/9arm-skills
- Adapted for: Antigravity IDE / Nexus-DevFlow
```
