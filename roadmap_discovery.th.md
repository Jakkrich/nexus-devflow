# Roadmap Discovery: Nexus-DevFlow

สร้างเมื่อ: 2026-05-18T15:31:54Z

## สรุปภาพรวม

Nexus-DevFlow คือชุดเครื่องมือ Context Engineering สำหรับทำงานร่วมกับ AI coding agents อย่างเป็นระบบ โดยใช้ JSON และ Markdown เป็นแหล่งข้อมูลหลักของงาน ตั้งแต่ requirement, planning, coding, verification ไปจนถึง roadmap

โครงสร้างล่าสุดกำหนดให้ `.agent` เป็น bundle หลักสำหรับ Antigravity IDE และใช้ `.workspaces` เป็นพื้นที่เก็บ artifact ของโปรเจคทั้งหมด

## ประเภทโปรเจค

- ประเภท: CLI / Agentic Workflow Framework
- ภาษาหลัก: JavaScript และ Python
- Runtime สำคัญ: Node.js >= 18.17, Python 3, Git
- Artifact หลัก: `.workspaces/project_index.json`, `.workspaces/roadmap/roadmap_discovery.json`, `.workspaces/roadmap/roadmap.json`

## กลุ่มผู้ใช้เป้าหมาย

ผู้ใช้หลักคือ SA/BA และนักพัฒนาซอฟต์แวร์ที่ใช้ AI coding agents และต้องการ workflow ที่ชัดเจน ทำซ้ำได้ และตรวจสอบย้อนหลังได้

ผู้ใช้รอง:

- Tech Lead ที่ต้องการมาตรฐานการทำงานกับ AI ภายในทีม
- Solo Developer ที่ต้องการ context management ที่ดีขึ้น
- QA และ Reviewer ที่ต้องการ artifact เพื่อ audit งาน
- ผู้ใช้ Antigravity IDE ที่ทำงานผ่าน `.agent` workflow

## Pain Points ที่แก้

- AI หลุดบริบทเมื่องานข้าม phase
- Requirement และ planning กระจัดกระจายในแชทหรือเอกสารหลายที่
- Artifact ระหว่าง planning, coding, review และ QA ไม่สม่ำเสมอ
- ทีมต้องการ command surface เดียวที่ตรวจสอบได้
- Prompt และ context ใหญ่เกินไปจนทำให้ทำงานช้าและ error ง่าย

## Product Vision

Nexus-DevFlow เป็น toolkit สำหรับเปลี่ยนการพัฒนาซอฟต์แวร์ด้วย AI ให้เป็น workflow ที่มีโครงสร้าง ชัดเจน และ trace ได้

คุณค่าหลักคือการรวม agent personas, numbered workflows, schemas, scripts, dashboard assets และ roadmap artifacts ไว้ในระบบเดียว โดยใช้ `.agent` เป็น Antigravity runtime bundle และ `.workspaces` เป็นพื้นที่เก็บ machine-readable artifacts

## สถานะปัจจุบัน

ระดับ maturity: MVP

สิ่งที่มีแล้ว:

- `.agent` bundle สำหรับ agents, numbered workflows, rules, schemas, scripts, skills และ dashboard
- Root `package.json` สำหรับสั่งงานผ่าน npm
- `npm run activate` สำหรับเตรียม `.workspaces` และ generate project index
- `npm run validate` สำหรับตรวจ framework health
- `npm run index` สำหรับ regenerate project index
- `npm run sync:check` สำหรับตรวจว่า `.agent` เป็น active bundle หลัก
- Roadmap artifacts ใน `.workspaces/roadmap`
- `ROADMAP.md` และ docs สำหรับผู้ใช้อ่าน

## กติกา Workflow

- Workflow ทุกไฟล์ใน `.agent/workflows` ต้องขึ้นต้นด้วยเลขหมวดสองหลัก เช่น `30-Task.md`
- ถ้ามี workflow ใหม่ ต้องเลือกหมวดที่เหมาะสมก่อนเพิ่ม
- ถ้าไม่มีหมวดที่เหมาะสม ให้สร้างหมวดใหม่ด้วยเลขกำกับ
- `README.md` เป็นสารบัญ ไม่ถือเป็น workflow

## ช่องว่างที่ควรทำต่อ

- เพิ่ม automated tests ให้ root scripts
- เพิ่ม release checklist และ governance process
- ทำตัวอย่าง task end-to-end ตั้งแต่ `/30-Task` ถึง `/33-Verify`
- ทำ source-template generation หากอนาคตต้องรองรับ bundle layout อื่น

## Technical Debt สำคัญ

- `.agent` ยังมีไฟล์ rules/templates จำนวนมากที่ควรค่อยๆ ตรวจคุณภาพภาษาและ encoding
- ควรเพิ่ม test coverage ให้ scripts ใหม่
- ควร sync `ROADMAP.md` กับ `.workspaces/roadmap/roadmap.json` เป็นระยะ
- Dashboard ควรขยาย artifact health indicators ให้ครอบคลุม task artifact รายตัว

## ข้อจำกัด

- ต้องใช้ Node.js >= 18.17
- Python 3 ยังจำเป็นสำหรับ helper scripts บางตัวใน `.agent/scripts`
- การ symlink `.agent` บน Windows อาจต้องใช้สิทธิ์ Administrator
- Artifact JSON ต้อง regenerate หลังเปลี่ยนโครงสร้างสำคัญ

## ข้อเสนอ Roadmap ถัดไป

1. เพิ่ม tests สำหรับ `scripts/*.mjs`
2. เพิ่ม release checklist และ governance process
3. ทำตัวอย่าง workflow end-to-end สำหรับผู้ใช้ใหม่
4. พิจารณา source-template generation เฉพาะเมื่อมี requirement รองรับ bundle layout อื่น
