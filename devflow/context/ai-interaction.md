# AI Interaction Guidelines for Nexus-DevFlow

> **Nexus-DevFlow is an agentic workflow layer**, overlaying on top of scaffolded or existing codebases. Never run a framework scaffolder inside an initialized DevFlow directory.

---

## 1. Communication & Principles

- **Be Concise and Direct**: State conclusions, status, and findings first; provide supporting context afterward.
- **Explain Non-Obvious Decisions Briefly**: Highlight architectural trade-offs, edge-case rationale, or safety considerations in 1–2 sentences.
- **Ask Before Destructive or Architectural Changes**: Always obtain explicit confirmation before deleting files, executing major refactors, or altering public interfaces.
- **Don't Add Unplanned Scope**: Stick strictly to the Acceptance Criteria defined in the spec. Avoid adding "nice-to-have" features that were not requested.
- **Preserve Existing Codebase Patterns**: Respect existing file structure, typing patterns, naming conventions, and deep module boundaries.

---

## 2. Output Formatting

Format every response for fast scanning and readability:

- **Real Markdown, Not Prose Walls**: Use bold labels, concise bullet points, and blank lines between blocks.
- **Enumerations Are Lists**: Numbered or bulleted lists for sequential steps or findings, never inline runs crammed into paragraphs.
- **Tables for Comparative Matrices**: Use markdown tables when comparing status, options, test results, or trade-offs.
- **Backticks for Code References**: Wrap file paths, variable names, functions, CLI flags, and commands in backticks (e.g. `current-feature.md`, `npm run check`).
- **Clickable File Links**: Use GitHub-style markdown links with `file://` scheme (e.g. `[current-feature.md](file:///d:/path/to/current-feature.md)`).
- **Lead With the Result**: State pass/fail status or completed action before presenting logs.

---

## 3. The 3-Pillars Unified Architecture (DevFlow 2.5.0)

```text
devflow/
├── 🔮 ideas.md        # [Future] Idea Inbox with AI Feasibility Scoring
├── ⚡ context/         # [Present] Single Living Spec (current-feature.md) & Active State
└── 📦 history/         # [Past] features/, fixes/, rollbacks/, and HISTORY.md
```

### ⚡ The Unified 4-Stage Living Spec Lifecycle
*ขับเคลื่อนการพัฒนาทุกระดับ (ตั้งแต่ Fast Fix จนถึง Architectural Epic) ด้วยเอกสารฉบับเดียว **Single Living Spec (`devflow/context/current-feature.md`)** ที่รวมความลึกระดับ Architect Mode เข้ากับความคล่องตัวระดับ Lean Velocity:*

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **Stage 1: Spec (`/feature` หรือ `/fix`)**:
   - ตรวจสอบ **Single Active Run Guardrail** (บล็อกการเปิดงานซ้อนถ้ามีงานที่ยังไม่เสร็จ)
   - ดึงบริบทจาก `devflow/discoveries/`, `devflow/ideas.md`, หรือคำขอของผู้ใช้
   - จัดสรร Running ID (`xxx-slug`) และสร้าง Branch `feature/{xxx-slug}` หรือ `fix/{xxx-slug}`
   - เขียน **Single Living Spec (`current-feature.md`)** ครอบคลุม:
     - `## 🎯 1. Define & Boundaries` (Problem, In/Out Scope, Risks, Success Criteria)
     - `## 📐 2. Technical Spec & Contracts` (Architecture, Models, Interface Contracts, Non-functional, ACs)
     - `## 📋 3. Execution Plan & TDD Checklist` (Atomic tasks, `[TDD-Red/Green/Refactor]` Triplets)

2. **Stage 2: Implement (`/implement`)**:
   - ดำเนินการ Task-by-task ตาม Checklist อย่างเคร่งครัดด้วย **TDD (Red-Green-Refactor)**
   - ติ๊กเครื่องหมาย `- [x]` และบันทึก `## ⚡ 4. Implementation Log & Evidence` (Diff summary, Checkpoints) ลงใน `current-feature.md`

3. **Stage 3: Check (`/check`)**:
   - Senior QA Multi-Lane Verification (Typecheck, Lint, Test Suites, Manual Proof)
   - บันทึกผลการพิสูจน์เชิงประจักษ์ลงใน `## 🧪 5. Multi-Lane Verification Matrix` ใน `current-feature.md`

4. **Stage 4: Complete (`/complete`)**:
   - สรุปผล `## 📦 6. Release Digest & Retrospective` (Changelog, Lessons Learned, ADRs)
   - ทำการ Archive `current-feature.md` ไปเป็นไฟล์เดี่ยวที่ `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`
   - **Mandatory Delivery Gate**: บังคับถามผู้ใช้ก่อนเสมอว่าต้องการ Delivery รูปแบบใด:
     - **Option 1 (Team MR/PR Flow)**: Pull master/main ล่าสุดมารวมกับ Feature/Dev Branch แล้ว push branch ขึ้นไปเพื่อเปิด MR/PR (ไม่ merge เข้า main/master ในเครื่อง และไม่แตะ protected branch)
     - **Option 2 (Direct Squash-Merge)**: ทำการ Squash-merge เข้า main/master ในเครื่องเฉพาะเมื่อผู้ใช้สั่งโดยตรงเท่านั้น
   - รีเซ็ต `current-feature.md` กลับเป็น Idle stub เมื่อปิดรอบงานเรียบร้อย

---

### 🔮 Pre-Flight Discovery & Architectural Alignment (Companion Tools)
สำหรับงานที่ต้องการสำรวจไอเดีย, ค้นคว้าทางเทคนิค, หรือการออกแบบสถาปัตยกรรมก่อนเริ่มสร้าง Spec:
- `/discovery`: Unified Pre-delivery Discovery & Research (บันทึกใน `devflow/discoveries/`)
- `/idea`: วิเคราะห์และบันทึกไอเดียลงใน `devflow/ideas.md`
- `/grill` (หรือ `/align`): Socratic Alignment, Domain Modeling & บันทึก ADRs ลงใน `devflow/decisions/`
- `/brainstorm`: เครื่องมือระดมความคิดทางเลือก 2-3 Options พร้อมเปรียบเทียบ Trade-offs


## 4. Strict TDD & Two-Stage Review Interaction Rules

### 🔴🟢 Strict TDD Execution Discipline
During implementation in `/implement` and `40-execute`:
- **Show Red Phase**: First execute tests to demonstrate expected failure *before* adding production code.
- **Show Green Phase**: Add minimal production code, re-run tests, and report pass rate.
- **Show Refactor Phase**: Polish and clean up with zero test regression.
- **Forbidden**: Never present functional code changes without matching test execution evidence.

### 🛡️ Two-Stage Verification Reporting
During `/check` and `50-verify`:
- **Stage 1 (Spec Fidelity Gate)**: Report each Acceptance Criterion and "Done When" status.
- **Stage 2 (Code Quality & Security Gate)**: Report Typecheck, Lint, Test Suites, Security checks, and Findings Ledger (0 blockers).

---

## 5. Standalone HTML Reporting Policy

> [!IMPORTANT]
> **No Auto-Generated HTML**: Mainline stages (`/complete` and `60-report`) strictly output Markdown only.
> When an interactive web dashboard is desired for presentation or sharing, invoke the standalone companion command:
> `/report:html` (or `npm run report:html -- {ID}`).

---

## 5. Resuming After Context Clear

Progress lives in persistent files, not in transient chat history:

- In Fast-Track: `devflow/context/current-feature.md` maintains ticked checklist boxes `- [x]`.
- In Deep-Track: `devflow/context/current-run/` maintains stage markdown files.
- In Git: Commits, branches, and working tree maintain the code history.
- When starting a fresh session after a context clear, run `devflow` or inspect `current-stage.md` to pick up immediately from the next pending step.

---

## 6. Single Active Run Guardrail (One Thing at a Time)

- Only one active run is allowed at a time across both Fast-Track and Deep-Track.
- The AI will actively block opening a new feature or fix until the current one is completed with `/complete` or `70-deliver` (or explicitly rolled back/cancelled).

---

## 7. Branching & Git Conventions

- **Branch Naming**: `feature/{xxx-slug}` or `fix/{xxx-slug}`.
- **Commit Messages**: Conventional imperative format (e.g. `feat(uninstall): add clean eject CLI command`, `fix(parser): handle undefined metadata field`).
- **No AI Attribution in Commits**: Never include "Generated with AI" or agent metadata in Git commit logs.
- **Explicit Approval for Push & Deploy**: Merge approval is strictly separate from consent to `git push` to remote repositories or deploy to production.

---

## 8. Autopilot Policy

- `autopilot` is an explicit opt-in command (`/autopilot`). Never suggest it as the default next action.
- When invoked, it runs one bounded spec/plan/implement/verify pass.
- Autopilot **MUST stop** before `/complete`, merge, push, deploy, or any destructive action.

---

## 9. Socratic Alignment & Grilling Discipline (`/grill`)

- **Align Before You Build**: When plans, domain language, or architectural boundaries are fuzzy, invoke `/grill` (or use the Grilling Lens in `00-explore`) to conduct a structured interview before creating specifications.
- **Codebase-Grounded Inquiry**: Inspect existing context and code before asking questions. Never ask questions the codebase already answers.
- **Turn Discipline**: Ask only 1–2 high-leverage questions per turn with clear recommended defaults. Never dump a wall of questions.
- **Lazy Inline Persistence**:
  - Immediately append resolved terms to `devflow/context/glossary.md`.
  - Immediately record major, hard-to-reverse architectural decisions as Architecture Decision Records in `devflow/decisions/ADR-xxx-{slug}.md`.
