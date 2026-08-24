# Verification Checklist: RUN-011

- **Running ID**: `RUN-011-sync-comprehensive-docs-to-website`
- **Status**: Pending

## Acceptance Verification Checks
- [ ] **AC-1**: หน้า `core-workflow.md` และ `mainline-stages.md` มีคำอธิบาย 8 Stages เชิงลึกแบบ Non-Table ครบทั้ง 5 มิติ และมี Interactive HTML Diagrams
- [ ] **AC-2**: หน้า `companion-commands.md` แสดงรายการคำสั่งครบทุกโฟลเดอร์ใน `.agents/skills/` (ทั้ง 8 หมวดหมู่)
- [ ] **AC-3**: มีไฟล์ `start/roles-guide.md` แสดงบน Sidebar ครอบคลุมทั้ง 4 กลุ่มบทบาท
- [ ] **AC-4**: คำสั่งบิลด์เว็บไซต์ `astro build` ใน `website/` ผ่าน 100% ปราศจากข้อผิดพลาด
