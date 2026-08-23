# Type: Rollback - 026-fast-track-and-flow-icons-extension-ui

## 1. Target Rollback Metadata

- **Target Feature**: `026-fast-track-and-flow-icons-extension-ui`
- **Archive Path**: [`devflow/history/features/026-fast-track-and-flow-icons-extension-ui/`](file:///d:/devtools/nexus-devflow/devflow/history/features/026-fast-track-and-flow-icons-extension-ui/)
- **Target Commit**: `d4570608b65de6d62695f8e0fa2c45589bcde3e8`
- **User Reason**: ย้อนคืนการเปลี่ยนแปลงในสเตจ 026 (Fast-Track & Flow Icons UI Support)
- **Risk Classification**: `No overlap / Low Risk` (การย้อนโค้ดไม่กระทบต่อประวัติการทำงานของ Blueprint/DevFlow)

---

## 2. Product Paths to Reverse

การ Rollback จะทำการย้อนคืนการแก้ไขในไฟล์โค้ดหลักดังต่อไปนี้:
- [`docs/workflow-surface-map.md`](file:///d:/devtools/nexus-devflow/docs/workflow-surface-map.md) (คืนค่า Surface Taxonomy สภาพเดิม)
- [`scripts/summarize-run-status.mjs`](file:///d:/devtools/nexus-devflow/scripts/summarize-run-status.mjs) (ย้อนคืนตาราง `stageIcons` และ `trackMode`)
- [`scripts/test-summarize-run-status.mjs`](file:///d:/devtools/nexus-devflow/scripts/test-summarize-run-status.mjs) (ย้อนคืนการตั้งค่าโฟลเดอร์ชั่วคราว)

---

## 3. Protected Workflow Paths (Preserved)

ไฟล์ประวัติและโครงสร้างของ DevFlow จะถูกคงไว้เพื่อไม่ให้สูญหาย:
- [`devflow/history/features/026-fast-track-and-flow-icons-extension-ui/`](file:///d:/devtools/nexus-devflow/devflow/history/features/026-fast-track-and-flow-icons-extension-ui/) (คงเอกสาร 10-70 ทั้งหมดไว้)
- [`devflow/history/HISTORY.md`](file:///d:/devtools/nexus-devflow/devflow/history/HISTORY.md) (คงประวัติการ Release ใน Ledger)
- `.agents/**` และ `.claude/**` (คงไว้ซึ่งทักษะและอแดปเตอร์ทั้งหมด)

---

## 4. Verification & Removal Criteria

- [x] **Reversed Product Diff**: Reverted `docs/workflow-surface-map.md`, `scripts/summarize-run-status.mjs`, `scripts/test-summarize-run-status.mjs` to pre-026 commit `19b501c`
- **Static Check Pass**: `npm run check:static` ➔ PASS
- **Run Status Test Pass**: `npm run validate:run-status:test` ➔ PASS
- **Test Pass**: `npm test` ➔ PASS

---

## 5. Next Steps

1. ตรวจสอบรายละเอียด Rollback Spec ในเอกสารนี้ [`devflow/context/current-feature.md`](file:///d:/devtools/nexus-devflow/devflow/context/current-feature.md)
2. เมื่ออนุมัติ ให้เรียกคำสั่ง **`/implement`** เพื่อสร้าง branch และทำการย้อนคืนซอร์สโค้ดผลิตภัณฑ์โดยปลอดภัย
