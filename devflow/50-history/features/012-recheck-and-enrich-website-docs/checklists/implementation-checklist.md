# Implementation Checklist: RUN-012-recheck-and-enrich-website-docs

- **Running ID**: `RUN-012-recheck-and-enrich-website-docs`
- **Status**: Completed
- **Last Updated**: 2026-08-18

---

## Phase 1: Start & Foundation (4 หน้า)
- [x] **Task 1.1**: ปรับปรุง `website/src/content/docs/start/getting-started.md` (Overlay Model, npx install, Onboard Checklist, 8-Stage Flow)
- [x] **Task 1.2**: ปรับปรุง `website/src/content/docs/start/existing-codebase.md` (`/onboard` vs `/adopt`, 5-step adopt process, baseline findings)
- [x] **Task 1.3**: ปรับปรุง `website/src/content/docs/start/project-context.md` (4 core context files, single source of truth, context drift prevention)
- [x] **Task 1.4**: ปรับปรุง `website/src/content/docs/start/updating-devflow.md` (`/check-for-updates`, safe upgrade, preserve custom skills, migrations)

---

## Phase 2: Workflow & Mainline Stages (2 หน้า)
- [x] **Task 2.1**: ปรับปรุง `website/src/content/docs/workflow/review-gates.md` (4 review gates, human-in-the-loop, AI boundaries)
- [x] **Task 2.2**: ปรับปรุง `website/src/content/docs/commands/mainline-stages.md` (8 stages deep-dive: purpose, inputs, loop, artifacts, gate criteria)

---

## Phase 3: Quality, Verification & Reports (4 หน้า)
- [x] **Task 3.1**: ปรับปรุง `website/src/content/docs/quality/senior-qa-verification.md` (Senior QA role, empirical evidence, 4-lane checks, impact analysis)
- [x] **Task 3.2**: ปรับปรุง `website/src/content/docs/quality/findings-ledger.md` (`findings.md` rules, P0-P3 severity, open/fixed/closed lifecycle, release block)
- [x] **Task 3.3**: ปรับปรุง `website/src/content/docs/quality/manual-review.md` (`/try` guide, 3-step format, Web/API/CLI testing examples)
- [x] **Task 3.4**: ปรับปรุง `website/src/content/docs/quality/interactive-reports.md` (`60-report.html` standalone features, interactive UI, stakeholder benefits)

---

## Phase 4: Reference & Tool Adapters (2 หน้า)
- [x] **Task 4.1**: ปรับปรุง `website/src/content/docs/reference/tool-adapters.md` (Multi-AI adapters, `.agents/`, `.claude/`, Universal Invocation `/`, `$`, rules)
- [x] **Task 4.2**: ปรับปรุง `website/src/content/docs/reference/file-reference.md` (Directory taxonomy, file roles, AI vs human edited, lifecycles)

---

## Phase 5: Verification & Site Build
- [x] **Task 5.1**: รันการทดสอบบิลด์เว็บไซต์จริง `npm --prefix website run build` ผ่าน 100% (18 pages built, exit code 0)
