---
name: brief
description: "[Devflow] Deep read-only scope, codebase impact, dependency, and sub-feature split briefing before speccing a run (reads build-plan.md or ideas.md)."
argument-hint: "[feature-number | 'feature-name' | IDEA-xxx]"
---

# brief - Deep Scope, Dependency & Codebase Impact Briefing

Where this sits in the workflow:

```text
devflow/build-plan.md (or ideas.md)  ──▶  [brief]  ──▶  feature / 20-spec  ──▶  implement / 40-execute
(feature queue & context)                 (deep read-only  (write spec)          (build it)
                                           explainer)
```

This skill answers one essential question: ***"What does this upcoming feature actually touch and involve in the real codebase before I commit to writing a full specification?"***

It inspects `devflow/build-plan.md` (or `devflow/ideas.md` / `project-overview.md`) and conducts a **Deep Static Codebase Analysis** to provide a concise briefing — calculating files touched, dependency chains, estimated size (`XS`..`XL`), and actionable sub-feature split proposals before any work begins.

It is **strictly read-only 100%**. It never writes specs, creates directories, branches, or commits code.

---

## Usage & Invocations

```text
brief                     # Briefs the next unchecked feature in build-plan.md
brief 2                   # Briefs feature #2 in build-plan.md
brief "OAuth Login"       # Briefs a specific feature by name
brief IDEA-003            # Briefs a pending idea from ideas.md
```

If there is no build plan or pending idea, plainly report that context is needed and recommend `/discovery` or `/overview`.

---

## 3-Step Briefing Protocol

### Step 1 - Read Context & Target Resolution (Read-Only)

1. **Target Item Resolution**:
   - If argument provided (`2`, `"OAuth Login"`, `IDEA-003`): find matching item in `devflow/build-plan.md` or `devflow/ideas.md`.
   - If no argument: locate the first unchecked item (`- [ ]`) in `devflow/build-plan.md`. If build plan is empty, locate the first pending item in `devflow/ideas.md`.
2. **Project Architecture**: Read `devflow/context/project-overview.md` and `devflow/context/coding-standards.md`.
3. **Deep Codebase Inspection**:
   - Inspect existing directory structures, routing files, data models/schemas, database migrations, API handlers, and UI component trees.
   - Trace existing modules related to the target feature.

---

### Step 2 - Analyze Scope, Dependencies & Sizing

Evaluate with concrete facts:

1. **What It Is**: Core capability and user-visible or system-visible outcome.
2. **Dependencies & Prerequisites**: Upstream database models, authentication layers, environment variables, or sibling features that must be complete first.
3. **Unblocks**: Downstream features or workflows enabled once this item ships.
4. **Files & Modules Touched**: List predicted files and folders likely to be created or modified (e.g. `lib/`, `routes/`, `components/`, `test/`).
5. **Estimated Size**:
   - `XS`: Small tweak / config (~15-30 mins, 1-2 files)
   - `S`: Single component or route (~1-2 hours, 2-4 files)
   - `M`: Full CRUD feature or service integration (~half day, 4-7 files)
   - `L`: Complex multi-component subsystem (~1 day, 7-12 files)
   - `XL`: Major epic (>12 files or heavy cross-cutting concerns)
6. **Sub-Feature Split Engine (for L and XL)**:
   - If the feature is `L` or `XL`, draft a concrete 2-3 sub-feature breakdown (e.g. `4a: Backend Schema & Core APIs`, `4b: Frontend UI & Client State`) with individual sizing and sequential dependencies.
7. **Key Risks & Open Questions**: Unsettled API contracts, performance bottlenecks, migration risks, or design decisions.

---

### Step 3 - Output Structured Briefing Card

Produce a clean, scannable briefing directly in the chat in **Thai (`th`)**:

```markdown
### 📋 Feature Briefing: [หมายเลขหรือรหัส - ชื่อฟีเจอร์]

- **🎯 What**: [สรุปเป้าหมายและความสามารถหลักสั้นๆ]
- **🔗 Dependencies**: [ฟีเจอร์หรือโมดูลก่อนหน้าที่ต้องมี หรือ 'None']
- **🔓 Unlocks**: [ฟีเจอร์ถัดไปในแผนงานที่จะถูกปลดล็อก]
- **📁 Files Touched**: [รายชื่อไฟล์และโมดูลที่คาดว่าจะต้องแก้ไขหรือสร้างใหม่]
- **⚖️ Estimated Scope & Size**: `[XS | S | M | L | XL]`
- **✂️ Sub-Feature Split Proposal** *(กรณีขนาด L หรือ XL)*:
  - `[ID]a: [ขอบเขตย่อยส่วนที่ 1]` (Size: M, Dependencies: None)
  - `[ID]b: [ขอบเขตย่อยส่วนที่ 2]` (Size: M, Dependencies: [ID]a)
- **⚠️ Key Risks & Open Questions**: [ความเสี่ยงทางเทคนิคหรือคำถามที่ต้องตอบใน Spec]

---
👉 **Next Recommended Action**: `/feature {target}` (หรือเริ่มทำ sub-feature แรก เช่น `/feature 4a`)
```

---

## Strict Rules & Guardrails

1. **Always Read-Only**: Never edit workspace files, allocate running IDs, switch branches, or commit code during `/brief`.
2. **Explain, Don't Spec**: Focus on scope, architectural dependencies, and size estimation. The formal delivery contract belongs to `/feature` or `20-spec`.
3. **Ground In Reality**: Trace all assertions back to `project-overview.md` and active codebase inspection. Do not hallucinate non-existent files or packages.
