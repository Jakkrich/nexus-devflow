# Team Presets

This guide is for maintainers who need to recommend a practical DevFlow adoption shape without changing the public command model.

Presets are recommendation bundles on top of the same DevFlow 2.0 mainline and public companion commands. They do not create alternate workflows, new commands, or forked operating systems for teams.

## Product Feature Team

### Who It Is For

Teams shipping new product capability, multi-step enhancements, or user-facing changes that benefit from fuller discovery, definition, specification, planning, verification, and reporting discipline.

### Recommended Starting Commands

- `/00-Discover` for new requests or broad goals
- `Brainstorm` when direction is still fuzzy before definition locks
- `Research` when external docs, integrations, or product evidence are needed

### Minimum Artifact Set

- `00-discover/discover.md`
- `00-discover.md`
- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-implement.md`
- `50-verify.md`
- `70-report.md`

### Optional Layers

- Add `60-release.md` when release-facing packaging or coordination matters
- Add `checklists/` when the team wants live execution visibility across planning, implementation, and verification
- Add `PRD` artifacts when product framing needs to mature before or during spec work
- Skip early companion layers when the request is already clear and `/10-Define` can start immediately

## Bugfix Or Operations Team

### Who It Is For

Teams handling defects, regressions, incidents, operational fixes, or smaller reliability work where root-cause clarity and verification discipline matter more than long upfront discovery.

### Recommended Starting Commands

- `Debug` when root cause is still unknown
- `Issue-Triage` when the work begins from ticket intake or an ops queue
- `/10-Define` when the bug and required fix are already well understood

### Minimum Artifact Set

- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-implement.md`
- `50-verify.md`

### Optional Layers

- Add `00-discover.md` when the issue is still ambiguous or multiple failure modes are competing
- Add `70-report.md` when the fix needs a durable wrap-up for handoff, incident learning, or stakeholder visibility
- Add `50-verify-impact.md` when rollback, blast radius, or impact analysis should be captured explicitly
- Skip heavier discovery or PRD-style framing when the issue is narrow and urgency is high

## Framework Maintainer Team

### Who It Is For

Maintainers evolving the Nexus-DevFlow framework itself, especially when the work touches workflow docs, validation, release readiness, install or update guidance, governance, or stable surface policy.

### Recommended Starting Commands

- `Help` when the right public route is still unclear
- `/00-Discover` for new framework work that needs scoped context
- `Research` when framework decisions depend on source-backed tooling or policy checks
- `/50-Verify` and `/60-Release` more often than product teams when the work is mainly framework hardening, validation, or packaging

### Minimum Artifact Set

- The stage markdown artifacts required by the active mainline work item
- Maintainer-facing docs affected by the change, such as `README.md`, `USAGE.md`, `SETUP.md`, `AGENTS.md`, or supporting docs under `docs/`
- Validation evidence for the framework commands touched by the change

### Optional Layers

- Add `30-plan.md` when the change spans multiple docs, scripts, or policy surfaces
- Add `70-report.md` when the change needs a durable release or governance summary
- Add roadmap or governance documentation updates when the work changes stable expectations
- Skip broader discovery layers when the change is already tightly scoped and the required surfaces are known

## How To Use Presets

- Use presets to recommend a starting shape, not to replace the mainline
- Keep the numbered workflow order intact once a team is on the mainline
- Prefer the smallest preset that still preserves definition, implementation, and verification discipline
- Add optional layers later when the team needs more visibility, evidence, or product framing
