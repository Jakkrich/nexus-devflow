# 🧭 Discovery Document: [DISC-20260822-006] Feature Briefing Skill (`/brief`)

> **Discovery ID**: `DISC-20260822-006`  
> **Source**: Intake from `[IDEA-011]` in `devflow/ideas.md`  
> **Date**: 2026-08-22  
> **Status**: `Proceed (Approved for Delivery)`  
> **Target Track**: Fast-Track (Blueprint Mode - `/feature`)  

---

## 1. Problem Statement & Motivation
เมื่อนักพัฒนาต้องการวางแผนหรือตัดสินใจว่าจะเริ่มทำฟีเจอร์ใดต่อไปใน `devflow/build-plan.md` หรือ `devflow/ideas.md` การเปิดดูรายการเฉยๆ อาจไม่เพียงพอที่จะตอบคำถามทางเทคนิคว่า:
- ฟีเจอร์นี้ต้องแตะต้องไฟล์หรือโมดูลใดบ้างในโค้ดเบสปัจจุบัน
- มีความซับซ้อนและขนาดงาน (`XS`..`XL`) ระดับใด
- มี Dependencies หรือข้อจำกัดทางสถาปัตยกรรมที่ต้องเคลียร์ก่อนเริ่มทำ Spec หรือไม่
- หากงานมีขนาดใหญ่เกินไป (`L` หรือ `XL`) ควรแบ่งย่อยเป็น sub-features (`4a`, `4b`) อย่างไร

DevFlow จึงต้องการทักษะ **`/brief`** ที่ทำหน้าที่เป็น **Deep Static Analysis & Scope Assessment Explainer** แบบ **Read-only 100%** เพื่อเป็นเรดาร์นำทางก่อนเริ่มขั้นตอน `/feature`

---

## 2. Exploration Lenses & Technical Analysis

### A. Core Architecture & Workflow
```text
devflow/build-plan.md (or ideas.md)  ──▶  [/brief]  ──▶  /feature {id}  ──▶  /implement
(Feature queue & Context)                 (Deep Static      (Write Spec)        (Build it)
                                           Analysis & Split)
```

- **Input Resolution Priority**:
  1. `devflow/build-plan.md` (ดึงฟีเจอร์แรกที่ยังไม่ได้ทำ `- [ ]`)
  2. `devflow/ideas.md` (หากไม่มี build plan)
  3. เจาะจงด้วยหมายเลข, ชื่อ, หรือ Idea ID เช่น `/brief 2`, `/brief "OAuth Login"`, `/brief IDEA-003`

- **Deep Static Analysis Engine**:
  - อ่านโค้ดเบสจริง (Directories, Routes, Schemas, State stores, Configs)
  - ประเมินไฟล์ที่จะได้รับผลกระทบ (**Files Touched**)
  - วิเคราะห์ความขึ้นตรง (**Dependencies & Prerequisites**)
  - ประเมินสิ่งที่ปลดล็อก (**Unblocks downstream capabilities**)
  - ประเมินขนาดงาน (**Estimated Size**): `XS`, `S`, `M`, `L`, `XL`

- **Sub-Feature Splitting Strategy**:
  - เมื่อพบว่างานมีขนาด `L` หรือ `XL` ให้เสนอแผนแบ่งเป็น sub-features (เช่น `4a`, `4b`) ทันที พร้อมแนะนำให้เรียก `/feature 4a`

- **Strict Read-Only Guardrail**:
  - ห้ามแก้ไขโค้ด, ห้ามเขียน Spec, ห้ามสร้าง branch หรือ commit ใดๆ ระหว่างรัน `/brief`

---

## 3. Decision & Next Step

### Final Decision: `Proceed` ✅
เริ่มกระบวนการจัดส่งผ่าน Fast-Track Autopilot ทันที
