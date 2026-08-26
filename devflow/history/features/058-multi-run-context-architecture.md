# [058-multi-run-context-architecture] Multi-Run Context Architecture & Spec Queue Engine

> **Document Type**: Categorized Delivery Archive (Nexus-DevFlow 2.6.0)  
> **Category**: `features`  
> **Archived Date**: 2026-08-26  
> **Status**: `Released / Shipped`  
> **Target Branch**: `feature/058-multi-run-context-architecture`  
> **Discovery Ref**: [`devflow/discoveries/DISC-20260826-001-multi-run-context-architecture/discovery.md`](../../discoveries/DISC-20260826-001-multi-run-context-architecture/discovery.md)  
> **Idea Ref**: [`devflow/ideas.md`](../../ideas.md) (`[IDEA-026]`)  

---

## 🎯 1. Overview & Problem Statement

เดิมที Nexus-DevFlow ใช้ Single Active Run Guardrail ซึ่งจำกัดให้มีงานในคิวได้เพียง 1 รายการ (`current-feature.md`) ทำให้ไม่สามารถสำรวจและเขียน Spec เตรียมไว้ล่วงหน้าหลายตัวได้ (No Spec-Ahead), ก่อให้เกิด Context Collision เมื่อทำงานพร้อมกันหลายคนหรือหลาย Agent, และสลับงานได้ยาก

ฟีเจอร์นี้ได้ปรับปรุงสถาปัตยกรรม Context ให้รองรับ **Multi-Run Task Queues & Spec-Ahead Model** โดยแยกจัดเก็บ Task-Specific Context (`spec.md`, `stage.md`, `findings.md`) เป็นโฟลเดอร์ย่อยใน `devflow/context/{xxx-slug}/` พร้อมพัฒนา Context Resolver และคำสั่งที่เรียกทำงานเจาะจงตามเลข ID ได้อย่างแม่นยำ

---

## 📐 2. Technical Architecture & Schemas

```text
devflow/context/
├── project-overview.md         (🌐 Shared Global)
├── coding-standards.md         (🌐 Shared Global)
├── ai-interaction.md           (🌐 Shared Global)
├── glossary.md                 (🌐 Shared Global)
│
├── 012-core-extension/         (⚡ Task-Specific Run 012)
│   ├── spec.md                 [Living Spec + Tasks]
│   ├── stage.md                [Runtime State + Branch]
│   └── findings.md             [Audit Findings Ledger]
│
└── 013-kanban-board/           (⚡ Task-Specific Run 013)
    ├── spec.md
    ├── stage.md
    └── findings.md
```

### Data Models & Contracts
```typescript
export interface RunContextPaths {
  isMultiRun: boolean;
  runId: string | null;
  runDir: string | null;
  specPath: string;
  stagePath: string;
  findingsPath: string;
  globalOverviewPath: string;
  globalStandardsPath: string;
}

export interface ActiveRunSummary {
  runId: string;
  title: string;
  status: string;
  track: string;
  branch: string;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  hasOpenFindings: boolean;
  runDir: string;
  specPath: string;
}
```

---

## 📋 3. Acceptance Criteria & Implementation Verification

- [x] **AC-1**: รองรับการสร้างโฟลเดอร์ `devflow/context/{xxx-slug}/` เมื่อสั่ง `/feature` หรือ `/fix` โดยไม่ลบ/ไม่ทับงานอื่น
- [x] **AC-2**: ฟังก์ชัน `fuzzyMatchRunId` สามารถค้นพบงานได้จากเลขสั้น (`1` ➔ `001-*`), เลข 3 หลัก (`012`), หรือ slug keyword
- [x] **AC-3**: `/implement [id]` โหลดเฉพาะ Context ของงานนั้น และสลับ Git branch ไปยัง `feature/{xxx-slug}` ได้อย่างปลอดภัย
- [x] **AC-4**: `/complete [id]` รวบรวมเอกสาร Archive ไปยัง `devflow/history/{features|fixes}/{xxx-slug}.md` และลบโฟลเดอร์ของงานนั้นออกจาก `devflow/context/`
- [x] **AC-5**: คง Backward Compatibility 100% หากพบไฟล์ `current-feature.md` เดิม

---

## ⚡ 4. Implementation Log & Diff Evidence

- **Step 1 (Core Context Resolver & ID Matcher)**:
  - เพิ่มฟังก์ชัน `listActiveRunContexts`, `fuzzyMatchRunId`, `resolveActiveRunContext`, `initRunContext`, `cleanupRunContext`, `calculateNextRunningId` ใน `packages/create-nexus-devflow/lib/branch-context.ts`
  - เพิ่ม Unit Tests ใน `test/branch-context.test.ts` ทดสอบการจับคู่เลข `12`, `012`, `kanban` และการคำนวณ Sequential Next ID
- **Step 2 (Status & Current Work Engine)**:
  - อัปเกรด `packages/create-nexus-devflow/lib/status.ts` ให้เพิ่ม `activeRuns` ใน `ProjectStatus` และเรนเดอร์ส่วน `Spec Queue` ใน Human format
  - เพิ่ม Unit Test ใน `test/status.test.ts`
- **Step 3 (Skill Adapters & Directives)**:
  - อัปเกรด `.agents/skills/{feature, fix, implement, check, complete}/SKILL.md` ให้รองรับ `argument-hint: "[{run-id, number, or name}]"` และระเบียบ Multi-Run
  - ซิงก์ adapter ไปยัง `.claude/skills/` สำเร็จครบ 28 skills
  - อัปเดตสัญญาการทำงานใน `devflow/reference/running-id-contract.md`
- **Step 4 (Verification)**:
  - รัน `npm run check:static` และ `npm test` ผ่าน 103/103 tests
  - รัน `npm run check` (Typecheck + Package build + Smoke test) ผ่าน 100%

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :--- | :--- |
| **Typecheck** | `tsc --noEmit` | ✅ PASSED | Zero TypeScript compilation errors |
| **Static Contract** | `npm run check:static` | ✅ PASSED | Framework structure, 28 core skills parity |
| **Unit Tests** | `npm test` | ✅ PASSED | 103 tests in create-nexus-devflow + overview tests |
| **Package Smoke** | `npm run check` | ✅ PASSED | Package overlay smoke test passed in temp directory |

---

## 📜 6. Findings Ledger

_No audit findings recorded or carried forward._
