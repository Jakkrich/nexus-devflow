---
id: "{running_id}"
title: "{Work Title}"
doc_type: "spec"
stage: "current-feature"
created: "{YYYY-MM-DD}"
updated: "{YYYY-MM-DD}"
owner: "{Owner/AI}"
status: "in-progress"
artifact_language: "th"
related_run: "{running_id}"
source_discovery: "{DISC-ID or null}"
source_idea: "{IDEA-ID or null}"
dependencies: []
related_files: []
---

# Feature: {Work Title}

## 🎯 1. Define & Boundaries

### Problem Statement
- คำอธิบายปัญหาหรือความต้องการทางธุรกิจที่ชัดเจน

### Proposed Solution
- สรุปแนวทางแก้ไขเชิงสถาปัตยกรรมและเทคโนโลยีที่ใช้

### In-Scope & Boundaries
- [x] ขอบเขตที่ต้องส่งมอบในงานนี้ (In-scope item 1)
- [x] ขอบเขตที่ต้องส่งมอบในงานนี้ (In-scope item 2)

### Non-Goals (Out of Scope)
- สิ่งที่ไม่ทำในงานนี้ (Out-of-scope item 1)
- สิ่งที่จะยกยอดไปรอบถัดไป (Deferred item 2)

### Invariants (สิ่งที่ห้ามพังเด็ดขาด)
- ระบบเดิมส่วนไหนที่ต้องทำงานได้ตามปกติ 100%

---

## 📐 2. Technical Spec & Contracts

### Architecture & Data Contracts
```typescript
export interface ExampleDataContract {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
```

### Acceptance Criteria (AC)
- [ ] **AC-1**: เงื่อนไขความสำเร็จข้อที่ 1 (สามารถตรวจสอบและทดสอบได้)
- [ ] **AC-2**: เงื่อนไขความสำเร็จข้อที่ 2 (ครอบคลุม Error handling / Edge cases)
- [ ] **AC-3**: การผสานรวมและการทำงานร่วมกับส่วนอื่นไม่มีการเกิด Regression

---

## 📋 3. Execution Plan & TDD Checklist

- [ ] **Task 1: Setup & Domain Model**
  - [ ] `[TDD-Red]` เขียน Unit test สำหรับทดสอบ Domain Model ที่ยังไม่ผ่าน
  - [ ] `[TDD-Green]` สร้าง Entity และ Type definitions จน Test ผ่าน
  - [ ] `[TDD-Refactor]` ปรับโครงสร้างโค้ดให้สะอาดและเป็น Deep Module

- [ ] **Task 2: Core Service Implementation**
  - [ ] `[TDD-Red]` เขียน Service integration test ดัก edge cases
  - [ ] `[TDD-Green]` พัฒนา Service logic ขั้นต่ำให้ Test ผ่าน
  - [ ] `[TDD-Refactor]` เพิ่ม error logging และแยก helper functions

- [ ] **Task 3: Verification & Integration Gate**
  - [ ] `[TDD-Red]` เขียน End-to-end หรือ Component smoke test
  - [ ] `[TDD-Green]` เชื่อมต่อ UI/API เข้ากับ Core service
  - [ ] `[TDD-Refactor]` รัน typecheck, linting และ polish โค้ด

---

## ⚡ 4. Implementation Log & Evidence

### Step 1: {Step Title}
- **Action**: อธิบายการลงมือเขียนโค้ดและไฟล์ที่แก้ไข
- **Files Modified**: `src/services/example.ts`, `src/types/example.ts`
- **Diff Summary**:
```diff
+ export function processData(input: InputData): Result {
+   return { status: 'success' };
+ }
```

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- |
| **Typecheck** | `npm run typecheck` | `PASS` | 0 errors |
| **Lint** | `npm run lint` | `PASS` | Clean syntax |
| **Unit Tests** | `npm test` | `PASS` | 14 tests passing |
| **Manual Proof** | UI / CLI inspection | `PASS` | Verified in browser / terminal |

---

## 📦 6. Release Digest & Retrospective

### Release Summary
- สรุปผลงานที่ส่งมอบและคุณค่าที่ได้รับ

### Architectural Decisions
- ลิงก์ไปยัง ADR ที่เกี่ยวข้อง (เช่น `devflow/decisions/ADR-001.md`)

### Retrospective & Lessons Learned
- สิ่งที่ทำได้ดีและข้อควรระวังสำหรับงานในอนาคต
