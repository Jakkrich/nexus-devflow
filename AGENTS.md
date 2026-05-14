# 🤖 PRPs Specialist Agents (Personas)

รายการชื่อและบทบาทหน้าที่ของ AI Agents เฉพาะทาง (Personas) ที่ใช้ในเฟรมเวิร์กนี้

## 📋 วิธีเรียกใช้งาน
เรียกใช้ Agent เหล่านี้ได้ผ่านคำสั่ง:
```text
/90-Agent {ชื่อ_AGENT} {ไฟล์_หรือ_โฟลเดอร์_เป้าหมาย}
```

---

## 🏗️ 1. กลุ่มวางแผนและข้อกำหนด (Requirements & Planning)
*ขั้นตอน: `/30-Task`, `/31-Plan`, `/12-PRD`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`prp-core-planner`** 🌟 | **ผู้วางแผนหลัก** | วิเคราะห์โค้ดเชิงลึกและสร้างแผนการลงมือทำแบบทีละขั้นตอน (ใช้ใน `/31-Plan`) |
| **`discuss-spec`** | วิศวกรข้อกำหนด | ตรวจสอบและขัดเกลา `spec.md` ให้ชัดเจน 360 องศาก่อนเริ่มงาน |
| **`prp-core-prd-architect`**| ผู้ออกแบบ PRD | ร่างเอกสารความต้องการผลิตภัณฑ์ (PRD) จากไอเดียเริ่มต้น (ใช้ใน `/12-PRD`) |
| **`orchestrator`** | ผู้ประสานงานหลัก | ควบคุมและประสานงาน Agent หลายตัวเพื่อสร้างระบบที่มีความซับซ้อนสูง |

---

## 🔍 2. กลุ่มสำรวจและวิจัย (Research & Exploration)
*ขั้นตอน: `/11-Research`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`codebase-explorer`** 🌟| **นักสำรวจโค้ด** | ค้นหาตำแหน่งโค้ดและรูปแบบ (Patterns) เดิมที่มีอยู่เพื่อนำกลับมาใช้ใหม่ |
| **`codebase-analyst`** | นักวิเคราะห์ระบบ | วิเคราะห์การไหลของข้อมูล (Data Flow) และความสัมพันธ์ระหว่างโมดูลต่างๆ |
| **`web-researcher`** | นักวิจัยข้อมูล | ค้นหาข้อมูลเชิงลึกจากภายนอก (APIs, Best Practices) และระบุแหล่งอ้างอิง |

---

## 🛠️ 3. กลุ่มเขียนโค้ดและพัฒนา (Implementation & Development)
*ขั้นตอน: `/32-Code`, `/90-Agent`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`prp-core-coder`** 🌟 | **นักพัฒนาหลัก** | เขียนโค้ดตามแผนที่วางไว้ พร้อมระบบ Validation Loop ตรวจสอบความถูกต้องเสมอ |
| **`backend-specialist`** | ผู้เชี่ยวชาญ Backend | ออกแบบ API, ฐานข้อมูล และตรรกะฝั่ง Server |
| **`frontend-specialist`** | ผู้เชี่ยวชาญ Frontend | พัฒนา UI/UX ด้วย React, Next.js และทำให้หน้าตาเว็บสวยงาม |
| **`database-architect`** | ผู้ออกแบบฐานข้อมูล | ปรับแต่ง Query ที่ซับซ้อน, การทำ Index และออกแบบ Schema |
| **`code-simplifier`** | ผู้เชี่ยวชาญ Refactor | ปรับปรุงโค้ดให้อ่านง่ายและสะอาดขึ้น (Clean Code) |
| **`type-design-analyzer`** | สถาปนิก Type | ตรวจสอบการออกแบบ Type และ Interface ให้สอดคล้องกัน |

---

## 🛡️ 4. กลุ่มตรวจสอบและแก้ไขบั๊ก (Quality & Debugging)
*ขั้นตอน: `/33-Verify`, `/20-Debug`, `/40-Test`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`test-engineer`** 🌟 | **วิศวกรทดสอบ** | เขียนชุดทดสอบ Unit Test และ Integration Test |
| **`prp-core-debugger`** | ผู้เชี่ยวชาญ RCA | ค้นหาต้นตอของบั๊กด้วยเทคนิค 5 Whys (Root Cause Analysis) |
| **`code-reviewer`** | ผู้ตรวจสอบโค้ดอาวุโส | ตรวจสอบคุณภาพโค้ดตามมาตรฐานของโปรเจกต์และความปลอดภัย |
| **`security-auditor`** | ผู้ตรวจสอบความปลอดภัย | ค้นหาช่องโหว่และข้อผิดพลาดทางตรรกะ (OWASP) |
| **`performance-optimizer`** | ผู้ปรับแต่งประสิทธิภาพ | วิเคราะห์และแก้ปัญหาคอขวดเรื่อง Memory และ CPU |

---

## 📦 5. กลุ่มจัดการ Git และเอกสาร (Git & Documentation)
*ขั้นตอน: `/50-Commit`, `/51-PR`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`prp-core-git-committer`**🌟| **ผู้เชี่ยวชาญ Git** | ช่วยเลือกไฟล์และเขียน Commit Message ตามมาตรฐาน |
| **`prp-core-git-pr-maker`** | ผู้จัดการ PR | รวบรวมข้อมูลและสร้าง Pull Request ที่สมบูรณ์ |

---

## 🎓 6. กลุ่มช่วยเหลือและที่ปรึกษา (Support & Coaching)
*ขั้นตอน: `/99-Coach`*

| ชื่อ Agent | บทบาท (Role) | หน้าที่หลัก (Responsibilities) |
|:---|:---|:---|
| **`coach-guideline`** 🌟 | **ที่ปรึกษาหลัก** | ให้คำแนะนำด้านแนวทางและช่วยเลือกคำสั่งที่เหมาะสม |
| **`devops-engineer`** | วิศวกร DevOps | จัดการ Docker, Pipeline การ Deploy และความสมบูรณ์ของ Server |

---
🌟 = **Agent หลัก** ที่แนะนำให้เรียกใช้เป็นอันดับแรกในกลุ่มนั้นๆ