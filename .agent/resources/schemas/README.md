# DevFlow 2.0 Schema And Template Guide

โฟลเดอร์นี้เป็นแหล่งกลางของ template และ contract สำหรับ DevFlow 2.0 แบบ `markdown-first`

อ่านกติกาหลักเพิ่มเติมได้ที่ [SCHEMA.md](./SCHEMA.md)

## แนวทางหลัก

1. ใช้ไฟล์ `.md` เป็น artifact หลักของแต่ละ stage
2. เก็บไฟล์งานจริงไว้ใน `.workspaces/` ของโปรเจกต์เป้าหมาย
3. แต่ละ stage ต้องมี input, output, และ template ของตัวเอง
4. คงหัวข้อหลักจาก template ไว้เสมอ แต่อนุญาตให้เพิ่มหัวข้อเสริมท้ายเอกสารได้ตามบริบท
5. JSON schema/template ถูกถอดออกจากเส้นหลัก 2.0 แล้ว
6. ทุก `.template.md` ต้องมี `artifact_language: "th"` หรือ `"en"` ใน frontmatter
7. ก่อนสร้าง artifact markdown ให้ workflow อ่านค่า `artifact_language` จาก template ก่อนเสมอ
8. Timeline stage templates now include manual review fields such as `AI Actions Performed`, `Human Review Required`, `Approval Status`, `Next Allowed Command`, and `Nexus Event`

## Timeline Workflow Mapping

| Stage | Command | Primary artifact |
| :--- | :--- | :--- |
| Discover | `/00-Discover` | `00-discover.md` |
| Define | `/10-Define` | `10-define.md` |
| Spec | `/20-Spec` | `20-spec.md` |
| Plan | `/30-Plan` | `30-plan.md` |
| Implement | `/40-Implement` | `40-implement.md` |
| Verify | `/50-Verify` | `50-verify.md` |
| Verify companion | `/50-Verify` when needed | `50-verify-impact.md` |
| Report | `/60-Report` | `60-report.md`, `60-report.html` |
| Release | `/70-Release` | `70-release.md` |

Use [report-html-placeholder-mapping.md](/D:/Projects/nexus-devflow/docs/report-html-placeholder-mapping.md) for the current report renderer contract and markdown-to-html notes.

Checklist support files may also be created under `.workspaces/specs/{ID}-{slug}/checklists/` and should be reflected in `60-report.md` and `60-report.html` when present.

Use `verify-impact.template.md` when `/50-Verify` needs a dedicated impact and rollback analysis companion file.

## Manual Review Flow

The active Timeline templates now support a manual review flow.

Humans should be able to read each stage artifact and answer:

- what AI used as input
- what AI changed or concluded
- what the reviewer must check
- whether the stage is approved
- which command may be run next
- which optional branches might help before returning to the next Timeline step

## Legacy Note

ถ้าพบไฟล์ JSON เก่าระหว่าง migration:

1. ใช้อ่านย้อนหลังเท่านั้น
2. อย่าใช้สร้างงานใหม่
3. ย้ายสาระสำคัญที่ยังต้องส่งต่อไปไว้ใน stage markdown ที่เกี่ยวข้อง
