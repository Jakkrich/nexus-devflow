# Implementation Checklist: RUN-011

- **Running ID**: `RUN-011-sync-comprehensive-docs-to-website`
- **Status**: Completed

## Phase 1: Workflow Deep-Dive (`core-workflow.md`)
- [x] เพิ่มกล่อง Interactive HTML Pipeline Flow สำหรับแสดง Discovery & Delivery Mainline
- [x] ขยายความทั้ง 8 Stages ครบ 5 มิติ (Purpose, Inputs, Loop, Artifacts, Review Gate Criteria)
- [x] เพิ่มคำอธิบาย ID Isolation และการแยก Namespace ระหว่าง Discovery ID กับ Running ID

## Phase 2: Mainline Stages Catalog (`mainline-stages.md`)
- [x] เพิ่มตัวอย่างคำสั่งครอบคลุมทั้ง Claude/Antigravity (`/`), OpenAI Codex (`$`), และ Plain CLI
- [x] เพิ่มตารางเส้นทางการสืบค้นร่วม (Supporting Routes) สำหรับ Stage 00
- [x] ใส่ตัวอย่างพาธ Artifact และมาตรฐาน Checklist Layer ครบทั้ง 8 Stages

## Phase 3: Companion Commands 70+ (`companion-commands.md`)
- [x] จัดกลุ่ม 70+ Skills ใน `.agents/skills/` ออกเป็น 8 หมวดหมู่วิศวกรรม
- [x] อธิบายหน้าที่ วิธีการเรียกใช้ และ Use Case ตัวอย่างของแต่ละ Command

## Phase 4: Role-Based Usage Guide (`roles-guide.md` & `astro.config.mjs`)
- [x] สร้างไฟล์ `website/src/content/docs/start/roles-guide.md` ครอบคลุม 4 บทบาท (Junior, Senior, Tech Lead, PM/EM)
- [x] เพิ่มรายการเมนู `Role-Based Guides` ใน Sidebar หมวด `Start` ของ `astro.config.mjs`

## Phase 5: Verification & Site Build
- [x] รันคำสั่ง `npm run build` ใน `website/` ผ่าน 100%

