---
description: ภาพรวมของ Specialist Agents ทั้งหมดและบทบาทหน้าที่ใน PRP Framework (ภาษาไทย)
---

# 🤖 PRPs Specialist Agents (Personas)

รายการชื่อและบทบาทหน้าที่ของ AI Agents เฉพาะทาง (Personas) ที่ใช้ในเฟรมเวิร์กนี้ เพื่อกำหนดพฤติกรรมของ AI ให้ทำงานได้อย่างแม่นยำและตรงตามวัตถุประสงค์ในทุก IDE

## 📋 วิธีเรียกใช้งาน
ในหน้า Chat ของ AI (Cursor, Windsurf, Antigravity) คุณสามารถเรียกใช้ Agent เหล่านี้ได้ผ่านคำสั่ง:
```text
/90-Agent {ชื่อ_AGENT} {ไฟล์_หรือ_โฟลเดอร์_เป้าหมาย}
```
*ตัวอย่าง: `/90-Agent discuss-spec .workspaces/specs/007/spec.md`*

---

## 🏗️ 1. กลุ่มวางแผนและข้อกำหนด (Requirements & Planning)
*ใช้สำหรับขั้นตอน: `/30-Task`, `/31-Plan`, `/12-PRD`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`prp-core-planner`** 🌟 | **ผู้วางแผนหลัก** | วิเคราะห์โค้ดเชิงลึกและสร้างแผนการลงมือทำแบบทีละขั้นตอน (ใช้ใน `/31-Plan`) |
| **`discuss-spec`** | วิศวกรข้อกำหนด | ตรวจสอบและขัดเกลา `spec.md` ให้ชัดเจน 360 องศาก่อนเริ่มงาน |
| **`prp-core-prd-architect`**| ผู้ออกแบบ PRD | ร่างเอกสารความต้องการผลิตภัณฑ์ (PRD) จากไอเดียเริ่มต้น (ใช้ใน `/12-PRD`) |
| **`orchestrator`** | ผู้ประสานงานหลัก | ควบคุมและประสานงาน Agent หลายตัวเพื่อสร้างระบบที่มีความซับซ้อนสูง |

---

## 🔍 2. กลุ่มสำรวจและวิจัย (Research & Exploration)
*ใช้สำหรับขั้นตอน: `/11-Research`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`codebase-explorer`** 🌟| **นักสำรวจโค้ด** | ค้นหาตำแหน่งโค้ดและรูปแบบ (Patterns) เดิมที่มีอยู่เพื่อนำกลับมาใช้ใหม่ |
| **`codebase-analyst`** | นักวิเคราะห์ระบบ | วิเคราะห์การไหลของข้อมูล (Data Flow) และความสัมพันธ์ระหว่างโมดูลต่างๆ |
| **`web-researcher`** | นักวิจัยข้อมูล | ค้นหาข้อมูลเชิงลึกจากภายนอก (APIs, Best Practices) และระบุแหล่งอ้างอิง |

---

## 🛠️ 3. กลุ่มเขียนโค้ดและพัฒนา (Implementation & Development)
*ใช้สำหรับขั้นตอน: `/32-Code`, `/90-Agent`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`prp-core-coder`** 🌟 | **นักพัฒนาหลัก** | เขียนโค้ดตามแผนที่วางไว้ พร้อมระบบ Validation Loop ตรวจสอบความถูกต้องเสมอ |
| **`backend-specialist`** | ผู้เชี่ยวชาญ Backend | ออกแบบ API, ฐานข้อมูล และตรรกะฝั่ง Server (Node.js, Python, PHP) |
| **`frontend-specialist`** | ผู้เชี่ยวชาญ Frontend | พัฒนา UI/UX ด้วย React, Next.js และทำให้หน้าตาเว็บสวยงาม |
| **`database-architect`** | ผู้ออกแบบฐานข้อมูล | ปรับแต่ง Query ที่ซับซ้อน, การทำ Index และออกแบบ Schema |
| **`code-simplifier`** | ผู้เชี่ยวชาญ Refactor | ปรับปรุงโค้ดให้อ่านง่ายและสะอาดขึ้น (Clean Code) โดยไม่เปลี่ยนตรรกะเดิม |
| **`type-design-analyzer`** | สถาปนิก Type | ตรวจสอบการออกแบบ Type และ Interface ให้สอดคล้องกันทั้งโปรเจกต์ |

---

## 🛡️ 4. กลุ่มตรวจสอบและแก้ไขบั๊ก (Quality & Debugging)
*ใช้สำหรับขั้นตอน: `/33-Verify`, `/20-Debug`, `/40-Test`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`test-engineer`** 🌟 | **วิศวกรทดสอบ** | เขียนชุดทดสอบ Unit Test และ Integration Test ให้ครอบคลุมทุกกรณี |
| **`prp-core-debugger`** | ผู้เชี่ยวชาญ RCA | ค้นหาต้นตอของบั๊กด้วยเทคนิค 5 Whys (Root Cause Analysis) |
| **`code-reviewer`** | ผู้ตรวจสอบโค้ดอาวุโส | ตรวจสอบคุณภาพโค้ดตามมาตรฐานของโปรเจกต์และความปลอดภัย |
| **`silent-failure-hunter`**| นักล่าบั๊กซ่อนเร้น | ค้นหาจุดเสี่ยงที่อาจเกิด Error แบบเงียบๆ หรือไม่ได้ถูกบันทึก Log ไว้ |
| **`security-auditor`** | ผู้ตรวจสอบความปลอดภัย | ค้นหาช่องโหว่และข้อผิดพลาดทางตรรกะ (OWASP) |
| **`penetration-tester`** | นักเจาะระบบสายขาว | จำลองการโจมตีเพื่อทดสอบความแข็งแกร่งของระบบ |
| **`performance-optimizer`** | ผู้ปรับแต่งประสิทธิภาพ | วิเคราะห์และแก้ปัญหาคอขวด (Bottlenecks) เรื่อง Memory และ CPU |
| **`seo-specialist`** | ที่ปรึกษา SEO | ตรวจสอบหน้าเว็บเพื่อให้คะแนน SEO และ Google Compliance ดีที่สุด |

---

## 📦 5. กลุ่มจัดการ Git และเอกสาร (Git & Documentation)
*ใช้สำหรับขั้นตอน: `/50-Commit`, `/51-PR`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`prp-core-git-committer`**🌟| **ผู้เชี่ยวชาญ Git** | ช่วยเลือกไฟล์และเขียน Commit Message ตามมาตรฐาน |
| **`prp-core-git-pr-maker`** | ผู้จัดการ PR | รวบรวมข้อมูลและสร้าง Pull Request ที่สมบูรณ์ |
| **`docs-impact-agent`** | ผู้จัดการเอกสาร | วิเคราะห์ว่าการเปลี่ยนโค้ดส่งผลกระทบต่อเอกสารส่วนไหนบ้าง |

---

## 🎓 6. กลุ่มช่วยเหลือและที่ปรึกษา (Support & Coaching)
*ใช้สำหรับขั้นตอน: `/99-Coach`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`coach-guideline`** 🌟 | **ที่ปรึกษาหลัก** | ให้คำแนะนำด้านแนวทาง (Best Practices) และช่วยเลือกคำสั่งที่เหมาะสม |
| **`prp-core-codebase-assistant`**| ผู้ช่วยโค้ดเบส | ตอบคำถามเกี่ยวกับโครงสร้างและตรรกะภายในโปรเจกต์ |
| **`devops-engineer`** | วิศวกร DevOps | จัดการ Docker, Pipeline การ Deploy และความสมบูรณ์ของ Server |

---
🌟 = **Agent หลัก** ที่แนะนำให้เรียกใช้เป็นอันดับแรกในกลุ่มนั้นๆ
---
*Note: Agents ทั้งหมดทำงานในระบบ Pure Agentic โดยใช้เครื่องมือมาตรฐาน (Read/Write/Search) ที่รองรับโดย AI IDE ยุคใหม่และ PRPs-Framework*
