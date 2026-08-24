# Implementation Checklist

- **Running ID**: `RUN-010-improve-website-documentation-content`
- **Title**: Implementation Tasks Checklist
- **Status**: Completed

---

## Phase 1: Mainline Stages Deep-Dive (Non-Table)
- [x] **Subtask 1.1**: ปรับปรุงหน้า `website/src/content/docs/workflow/core-workflow.md` ให้อธิบาย 8 Stages เชิงลึกแบบการ์ด/ลำดับขั้น ไม่ใช้ตารางสรุปสั้น
- [x] **Subtask 1.2**: ปรับปรุงหน้า `website/src/content/docs/commands/mainline-stages.md` ให้อธิบาย Mainline Commands 00-70 พร้อม Arguments, Artifacts, และ Review Gates

## Phase 2: Companion Commands Catalog (70+ Skills)
- [x] **Subtask 2.1**: ปรับปรุงหน้า `website/src/content/docs/commands/companion-commands.md` ให้ครอบคลุมทุก Skill ใน `.agents/skills/` โดยแบ่งเป็น 8 หมวดหมู่อย่างเป็นระเบียบ

## Phase 3: Role-Based Usage Guide
- [x] **Subtask 3.1**: สร้างหน้า `website/src/content/docs/start/roles-guide.md` ครอบคลุม Junior, Mid/Senior, Tech Lead/Architect, และ Product/Engineering Manager
- [x] **Subtask 3.2**: อัปเดต Sidebar ใน `website/astro.config.mjs` เพิ่มลิงก์ Role-Based Guides

## Phase 4: Build Verification & Framework Integrity
- [x] **Subtask 4.1**: รันคำสั่งบิลด์ `npm run docs:build` และตรวจสอบความถูกต้องของผลลัพธ์ (17 หน้า Complete)
- [x] **Subtask 4.2**: รัน `npm run check:static` และ `npm test` เพื่อคงความสมบูรณ์ของทั้ง Repository
