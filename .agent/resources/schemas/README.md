# DevFlow 2.0 Schema And Template Guide

โฟลเดอร์นี้เป็นแหล่งกลางของ template และ contract สำหรับ DevFlow 2.0 แบบ `markdown-first`

อ่านกติกาหลักเพิ่มเติมได้ที่ [SCHEMA.md](./SCHEMA.md)

## แนวทางหลัก

1. ใช้ไฟล์ `.md` เป็น artifact หลักของแต่ละ stage
2. เก็บไฟล์งานจริงไว้ใน `.workspaces/` ของโปรเจกต์เป้าหมาย
3. แต่ละ stage ต้องมี input, output, และ template ของตัวเอง
4. คงหัวข้อหลักจาก template ไว้เสมอ แต่อนุญาตให้เพิ่มหัวข้อเสริมท้ายเอกสารได้ตามบริบท
5. JSON schema/template ถูกถอดออกจากเส้นหลัก 2.0 แล้ว

## Mainline Workflow Mapping

| Stage | Command | Primary artifact |
| :--- | :--- | :--- |
| Discover | `/00-Discover` | `00-discover.md` |
| Define | `/10-Define` | `10-define.md` |
| Spec | `/20-Spec` | `20-spec.md` |
| Plan | `/30-Plan` | `30-plan.md` |
| Implement | `/40-Implement` | `40-implement.md` |
| Verify | `/50-Verify` | `50-verify.md` |
| Release | `/60-Release` | `60-release.md` |
| Report | `/70-Report` | `70-report.md`, `70-report.html`, `report.template.html` |

Use [report-html-placeholder-mapping.md](/D:/Projects/nexus-devflow/docs/report-html-placeholder-mapping.md) for the canonical placeholder-to-source mapping used by the HTML generator.

Checklist support files may also be created under `.workspaces/specs/{ID}-{slug}/checklists/` and should be reflected in `70-report.md` and `70-report.html` when present.

## Legacy Note

ถ้าพบไฟล์ JSON เก่าระหว่าง migration:

1. ใช้อ่านย้อนหลังเท่านั้น
2. อย่าใช้สร้างงานใหม่
3. ย้ายสาระสำคัญที่ยังต้องส่งต่อไปไว้ใน stage markdown ที่เกี่ยวข้อง
