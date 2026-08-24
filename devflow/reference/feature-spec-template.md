# [ID-slug] Feature Title

> **Template Type**: Single Living Spec (DevFlow 2.5.0)
> **Active Location**: `devflow/context/current-feature.md`
> **Archive Location**: `devflow/history/{features|fixes|rollbacks}/{ID-slug}.md`

- **Feature ID**: `{xxx-slug}`
- **Category**: `features` | `fixes` | `rollbacks`
- **Target Branch**: `feature/{xxx-slug}`
- **Status**: `Spec Ready` | `In-Progress` | `Verified` | `Completed`
- **Track**: `Unified Fast-Track`
- **Discovery Ref**: `devflow/discoveries/DISC-xxx.md` (Optional)
- **ADR Ref**: `devflow/decisions/ADR-xxx.md` (Optional)

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
- **Problem**: อธิบายปัญหาที่พบ หรือสิ่งที่ต้องการแก้ไข/ปรับปรุง
- **Goal**: ผลลัพธ์หรือเป้าหมายที่ต้องการให้เกิดขึ้น

### In-Scope & Out-of-Scope
- **In-Scope**:
  - สิ่งที่ต้องทำในรอบนี้
- **Out-of-Scope**:
  - สิ่งที่ไม่ทำในรอบนี้ หรือยกยอดไปทำในเฟสถัดไป

### Risk & Mitigation Matrix
| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| ความเสี่ยงที่อาจเกิดขึ้น | Low/Medium/High | แนวทางป้องกันหรือรับมือ |

### Success Criteria
1. เกณฑ์ชี้วัดความสำเร็จข้อที่ 1
2. เกณฑ์ชี้วัดความสำเร็จข้อที่ 2

---

## 📐 2. Technical Spec & Contracts

### Architecture & Component Design
- อธิบายโครงสร้างหรือ Flow การทำงานของ Component/Module

### Data Models & Schemas
```typescript
// Interface หรือ Type Definition
```

### API & Interface Contracts
- **Endpoint / Function**: `methodName(params: Type): ReturnType`
- **Error Handling**: รายละเอียด Error Codes และวิธีจัดการ

### Non-Functional Constraints
- **Security**: การตรวจสอบ Input, การจัดการสิทธิ์, Secrets
- **Performance**: ข้อจำกัดเรื่องความเร็ว หรือ Resource Usage

### Acceptance Criteria (AC)
- [ ] **AC-1**: เงื่อนไขการยอมรับข้อที่ 1
- [ ] **AC-2**: เงื่อนไขการยอมรับข้อที่ 2

---

## 📋 3. Execution Plan & TDD Checklist

- [ ] **Task 1: Core Foundation & Types**
  - [ ] 1.1 `[TDD-Red]` เขียน Unit Test สำหรับ Logic ส่วนที่ 1
  - [ ] 1.2 `[TDD-Green]` Implement Logic ให้ผ่าน Test
  - [ ] 1.3 `[TDD-Refactor]` Clean up และ Optimize โค้ด

- [ ] **Task 2: Feature Implementation**
  - [ ] 2.1 `[TDD-Red]` เขียน Test ครอบคลุม Edge Cases
  - [ ] 2.2 `[TDD-Green]` Implement Feature ตาม Contract
  - [ ] 2.3 `[TDD-Refactor]` ตรวจสอบความถูกต้องและ Architecture

- [ ] **Task 3: Integration & QA Verification**
  - [ ] 3.1 `[TDD-Green]` เชื่อมต่อ UI/API และตรวจสอบ End-to-End

---

## ⚡ 4. Implementation Log & Evidence

*(จะถูกบันทึกและอัปเดตความคืบหน้าระหว่างรันคำสั่ง `/implement`)*

- **Step 1**: ...
- **Checkpoint Commit**: `feat(scope): ...`

---

## 🧪 5. Multi-Lane Verification Matrix

*(จะถูกบันทึกผลการตรวจสอบระหว่างรันคำสั่ง `/check`)*

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :--- | :--- |
| **Typecheck** | `npm run typecheck` | ⏳ PENDING | |
| **Lint** | `npm run lint` | ⏳ PENDING | |
| **Unit Tests** | `npm test` | ⏳ PENDING | |
| **Manual Proof** | UI / CLI Behavioral Verification | ⏳ PENDING | |

---

## 📦 6. Release Digest & Retrospective

*(จะถูกสรุปและบันทึกอัตโนมัติก่อนทำการ Squash Merge ในคำสั่ง `/complete`)*

- **What Changed**: สรุปสิ่งที่เปลี่ยนแปลง
- **Key Decisions**: การตัดสินใจสำคัญระหว่างพัฒนา
- **Lessons Learned**: บทเรียนที่ได้รับ
- **Known Limitations**: ข้อจำกัดที่ทราบและข้อเสนอแนะในอนาคต
