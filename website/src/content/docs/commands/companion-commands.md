---
title: Companion Commands & Skills Catalog
description: รวมคำสั่งเสริมและทักษะเฉพาะทาง (Specialist Skills) ทั้งหมดในระบบ Nexus-DevFlow
---

import { Card, CardGrid } from '@astrojs/starlight/components';

นอกจากกระบวนการ 8-Stage Mainline แล้ว **Nexus-DevFlow 2.0** ยังมาพร้อมกับชุดคำสั่งเสริมและทักษะเฉพาะทาง (Specialist Skills) กว่า **62 รายการ** (รวม 70 ทักษะในระบบ) ครอบคลุมการนำทาง, การวางสถาปัตยกรรม, การเขียนโค้ด, ความปลอดภัย, และการประสานงาน AI หลายตัว

:::note[รูปแบบการเรียกใช้คำสั่ง (Universal Invocation)]
ทุกคำสั่งสามารถเรียกใช้ตามความเหมาะสมของ AI Engine:
- **Slash Commands (`/command`)**: สำหรับ Google Antigravity, Claude Code, Gemini CLI
- **Codex Commands (`$command`)**: สำหรับ OpenAI Codex CLI
- **Canonical Name (`command`)**: สำหรับโหมดข้อความทั่วไป หรือ Terminal
:::

---

## 🛠️ หมวดที่ 1: การตั้งค่าและการนำทาง (Setup, Navigation & Diagnostics)

คำสั่งพื้นฐานสำหรับการเริ่มต้นโครงการ ตรวจสุขภาพระบบ และนำทางในเวิร์กโฟลว์:

### 1. `/onboard`
- **หน้าที่**: วิเคราะห์ Stack เทคโนโลยีของโปรเจกต์ใหม่ที่เพิ่ง Scaffold กำหนด Baseline, คำสั่ง Verify, Coding Standards และสร้างไฟล์คอนฟิกเริ่มต้น
- **การใช้งาน**: `/onboard` หรือ `$onboard`

### 2. `/adopt`
- **หน้าที่**: นำ DevFlow ไปติดตั้งและปรับใช้กับโปรเจกต์เดิม (Brownfield Codebase) ที่มีโค้ดอยู่แล้ว โดยไม่ทำลายโครงสร้างเดิม พร้อมทำบทสัมภาษณ์ความตั้งใจของระบบ
- **การใช้งาน**: `/adopt`

### 3. `/devflow`
- **หน้าที่**: ผู้ช่วยนำทางอัจฉริยะ (State Inspector & Router) ตรวจสอบสถานะของ Workspace ปัจจุบัน และแนะนำขั้นตอนถัดไปที่เหมาะสมที่สุด
- **การใช้งาน**: `/devflow`

### 4. `/doctor`
- **หน้าที่**: ตรวจสุขภาพของโปรเจกต์ (Health Check) ความสมบูรณ์ของ Adapters ตรวจสอบไฟล์ที่ขาดหาย และตรวจจับ Workflow Drift
- **การใช้งาน**: `/doctor`

### 5. `/try`
- **หน้าที่**: สร้างคู่มือการทดสอบด้วยมือ (Manual QA Guide) สำหรับมนุษย์ โดยระบุ Where to go, What to click, และ What to expect อย่างเป็นขั้นเป็นตอน
- **การใช้งาน**: `/try [running-id]`

### 6. `/rollback`
- **หน้าที่**: วางแผนย้อนกลับฟีเจอร์ที่ปล่อยไปแล้วอย่างปลอดภัย โดยวิเคราะห์ Dependency Tree และ Git Commit History เพื่อป้องกันผลกระทบข้างเคียง
- **การใช้งาน**: `/rollback [feature-name]`

### 7. `/ci`
- **หน้าที่**: สำรวจคำสั่ง Test/Lint/Build จริงในโปรเจกต์ และสร้างไฟล์ GitHub Actions Workflow (`.github/workflows/verify.yml`) เพื่อตรวจสอบ Pull Request อัตโนมัติ
- **การใช้งาน**: `/ci`

### 8. `/help`
- **หน้าที่**: แผนผังช่วยเหลือและแนะนำคำสั่งทั้งหมดในระบบ DevFlow
- **การใช้งาน**: `/help [topic]`

---

## 🚀 หมวดที่ 2: งานก่อนพัฒนาและระบบอัตโนมัติ (Pre-Flight & Autonomous)

คำสั่งสำหรับการวางกรอบเป้าหมาย การระดมความคิด และการทำงานอัตโนมัติแบบมีขอบเขต:

### 9. `/autopilot`
- **หน้าที่**: รันกระบวนการพัฒนาอัตโนมัติแบบมีขอบเขต (Autonomous Loop: Spec -> Plan -> Implement -> Verify) พร้อมบันทึก Checkpoint Commits และหยุดรอการอนุมัติก่อน Release
- **การใช้งาน**: `/autopilot [running-id]`

### 10. `/brief`
- **หน้าที่**: สรุปภาพรวมก่อนเริ่มเขียน Spec วิเคราะห์ขนาดงาน (Scope), รายชื่อไฟล์ที่น่าจะได้รับผลกระทบ, และ Dependencies ที่เกี่ยวข้อง
- **การใช้งาน**: `/brief [run-id]`

### 11. `/goal`
- **หน้าที่**: ตัวช่วยรับโจทย์กว้างๆ หรือเป้าหมายระยะยาว (Open-ended Goal) ก่อนส่งต่อเข้าสู่กระบวนการ `00-discover`
- **การใช้งาน**: `/goal [goal description]`

### 12. `/brainstorm`
- **หน้าที่**: ระดมความคิดเชิงลึก เปรียบเทียบทางเลือกหลายๆ รูปแบบ (Divergent & Convergent Ideation) โดยไม่จอง Running ID
- **การใช้งาน**: `/brainstorm [topic]`

### 13. `/prd`
- **หน้าที่**: ร่างเอกสาร Product Requirements Document (PRD), User Stories, และกำหนด Business Outcomes ก่อนเข้าสู่รอบการพัฒนา
- **การใช้งาน**: `/prd [feature-name]`

### 14. `/roadmap-strategy`
- **หน้าที่**: วางแผนกลยุทธ์ Roadmap ของผลิตภัณฑ์ กำหนดลำดับความสำคัญของฟีเจอร์ในระยะสั้นและระยะยาว
- **การใช้งาน**: `/roadmap-strategy`

### 15. `/competitor-analysis`
- **หน้าที่**: วิเคราะห์คู่แข่งในตลาด สำรวจจุดเด่นจุดด้อย และหาโอกาสสร้างความแตกต่างให้กับผลิตภัณฑ์
- **การใช้งาน**: `/competitor-analysis [domain]`

---

## 🔍 หมวดที่ 3: การตรวจสอบและควบคุมคุณภาพ (QA, Investigation & Security)

คำสั่งสำหรับการสืบค้นปัญหา ตรวจสอบคุณภาพโค้ด และความปลอดภัย:

### 16. `/debug`
- **หน้าที่**: วินิจฉัยหาสาเหตุของ Bug อย่างเป็นระบบ (Root Cause Investigation) โดยไม่แก้ไขโค้ดล่วงหน้าก่อนพบหลักฐานชัดเจน
- **การใช้งาน**: `/debug [issue description]`

### 17. `/issue-triage`
- **หน้าที่**: คัดกรอง จัดหมวดหมู่ และจัดลำดับความสำคัญของ Issue และ Bug Reports ที่เข้ามาใหม่
- **การใช้งาน**: `/issue-triage`

### 18. `/security-review`
- **หน้าที่**: ตรวจสอบช่องโหว่ความปลอดภัยตามมาตรฐาน OWASP ตรวจจับ Hardcoded Secrets และวิเคราะห์ความเสี่ยงด้านสิทธิ์
- **การใช้งาน**: `/security-review`

### 19. `/review`
- **หน้าที่**: ตรวจสอบโค้ดและ Pull Request หลายมิติ (Correctness, Security, Performance, Coding Standards)
- **การใช้งาน**: `/review [branch or PR]`

### 20. `/lint-and-validate`
- **หน้าที่**: รัน Static Analysis, Typecheck, และตรวจสอบ Syntax ของโค้ดตามมาตรฐานของภาษา
- **การใช้งาน**: `/lint-and-validate`

### 21. `/test`
- **หน้าที่**: จัดการชุดทดสอบ รัน Unit/Integration Tests, คำนวณ Test Coverage, และช่วยออกแบบ Test Cases
- **การใช้งาน**: `/test [filter]`

---

## 🏛️ หมวดที่ 4: สถาปัตยกรรมและการออกแบบระบบ (Architecture & Engineering Design)

ทักษะระดับ Senior/Architect สำหรับการวางโครงสร้างระบบและโมดูล:

### 22. `/architecture`
- **หน้าที่**: กรอบการตัดสินใจด้านสถาปัตยกรรม ประเมิน Trade-offs และจัดทำ Architecture Decision Records (ADRs)
- **การใช้งาน**: `/architecture [decision-topic]`

### 23. `/codebase-design`
- **หน้าที่**: ออกแบบ Deep Modules, กำหนด Seams ของระบบ, วาง Interface Contracts และลด Coupling ระหว่างโมดูล
- **การใช้งาน**: `/codebase-design`

### 24. `/domain-modeling`
- **หน้าที่**: สร้างและปรับแต่ง Ubiquitous Language และ Domain Model ให้สอดคล้องกับแก่นธุรกิจ
- **การใช้งาน**: `/domain-modeling`

### 25. `/database-design`
- **หน้าที่**: ออกแบบ Database Schema, วาง Indexing Strategy, เลือก ORM และออกแบบ Data Migration
- **การใช้งาน**: `/database-design`

### 26. `/api-and-interface-design`
- **หน้าที่**: ออกแบบ REST / GraphQL Endpoints, กำหนด Request/Response Contracts และ Versioning Strategy
- **การใช้งาน**: `/api-and-interface-design`

### 27. `/type-design`
- **หน้าที่**: ออกแบบ TypeScript Types/Interfaces เพื่อความปลอดภัยสูงสุด (Type Safety) และป้องกัน Invalid State
- **การใช้งาน**: `/type-design`

### 28. `/performance-optimization`
- **หน้าที่**: วิเคราะห์คอขวด (Bottlenecks) ของระบบ ปรับปรุง Core Web Vitals และ Optimize Database Queries
- **การใช้งาน**: `/performance-optimization`

### 29. `/spec-driven-development`
- **หน้าที่**: แนวคิดการพัฒนาที่เน้นการทำ Spec นำโค้ด เพื่อลดความผิดพลาดและความเข้าใจผิด
- **การใช้งาน**: `/spec-driven-development`

### 30. `/documentation-and-adrs`
- **หน้าที่**: บันทึกการตัดสินใจทางสถาปัตยกรรมและเอกสารอ้างอิงของระบบสำหรับทีม
- **การใช้งาน**: `/documentation-and-adrs`

### 31. `/app-builder`
- **หน้าที่**: ผู้ช่วยประสานงานสร้าง Fullstack Application ตั้งแต่เลือก Stack จนถึงวางโครงสร้างโปรเจกต์
- **การใช้งาน**: `/app-builder`

### 32. `/mcp-builder`
- **หน้าที่**: แนวทางการพัฒนา Model Context Protocol (MCP) Server ออกแบบ Tools และ Resources
- **การใช้งาน**: `/mcp-builder`

---

## 🎨 หมวดที่ 5: การพัฒนาส่วนติดต่อผู้ใช้ (Frontend, UI & Full-Stack)

ทักษะสำหรับการพัฒนาเว็บแอปพลิเคชันและ UI ระดับพรีเมียม:

### 33. `/frontend-ui-engineering`
- **หน้าที่**: พัฒนา User Interface ระดับ Production ใส่ใจ Performance, State Management และ Accessibility (a11y)
- **การใช้งาน**: `/frontend-ui-engineering`

### 34. `/ui-ux-pro-max`
- **หน้าที่**: ระบบผู้ช่วยด้าน Design Intelligence กว่า 50+ สไตล์ และ 95+ Color Palettes สร้างสรรค์ UI สวยงามระดับโลก
- **การใช้งาน**: `/ui-ux-pro-max`

### 35. `/tailwind-patterns`
- **หน้าที่**: แนวทางปฏิบัติสำหรับ Tailwind CSS v4, Modern Tokens, Container Queries และ CSS Variables
- **การใช้งาน**: `/tailwind-patterns`

### 36. `/nextjs-react-expert`
- **หน้าที่**: เทคนิคขั้นสูงสำหรับ React และ Next.js (App Router, Server Components, Waterfall Elimination) จาก Vercel Engineering
- **การใช้งาน**: `/nextjs-react-expert`

### 37. `/mobile-design`
- **หน้าที่**: ออกแบบ UX/UI แบบ Mobile-First สำหรับ iOS, Android, React Native และ Flutter
- **การใช้งาน**: `/mobile-design`

### 38. `/prototype`
- **หน้าที่**: สร้างหน้า Static Mockup (HTML/CSS) แบบรวดเร็วเพื่อล็อกดีไซน์และพรีวิวก่อนเริ่มเขียนโค้ดจริง
- **การใช้งาน**: `/prototype`

---

## ⚙️ หมวดที่ 6: ระบบหลังบ้านและสภาพแวดล้อม (Backend, Systems & Platforms)

ทักษะสำหรับการพัฒนา Backend และจัดการ Environment:

### 39. `/nodejs-best-practices`
- **หน้าที่**: แนวทางปฏิบัติสำหรับ Node.js การจัดการ Async Patterns, Stream, และสถาปัตยกรรม Backend
- **การใช้งาน**: `/nodejs-best-practices`

### 40. `/python-patterns`
- **หน้าที่**: การเขียน Python คุณภาพสูง Type Hints, AsyncIO, และการจัดโครงสร้างโปรเจกต์
- **การใช้งาน**: `/python-patterns`

### 41. `/bash-linux`
- **หน้าที่**: สคริปต์ Bash และคำสั่ง Linux Terminal สำหรับการจัดการระบบและ CI/CD
- **การใช้งาน**: `/bash-linux`

### 42. `/powershell-windows`
- **หน้าที่**: สคริปต์ PowerShell สำหรับระบบปฏิบัติการ Windows และการจัดการ CLI Environment
- **การใช้งาน**: `/powershell-windows`

### 43. `/server-management`
- **หน้าที่**: การจัดการ Process Server, การ Monitor ประสิทธิภาพ และการ Scale ระบบ
- **การใช้งาน**: `/server-management`

---

## 📦 หมวดที่ 7: วงรอบการส่งมอบและการจัดการ Git (Delivery Lifecycle & Git)

คำสั่งสำหรับการจัดการ Source Control และการส่งมอบ:

### 44. `/commit`
- **หน้าที่**: Smart Commit จัดการ Stage ไฟล์อย่างชาญฉลาดและเขียน Conventional Commit Message ที่สื่อความหมาย
- **การใช้งาน**: `/commit`

### 45. `/pr`
- **หน้าที่**: สร้าง Pull Request พร้อมสรุปรายการเปลี่ยนแปลง ลิงก์ไปยัง Stage Artifacts และหลักฐานการทดสอบ
- **การใช้งาน**: `/pr`

### 46. `/merge`
- **หน้าที่**: รวม PR Branch เข้าสู่ Base Branch อย่างปลอดภัย พร้อมตรวจสอบ Release Readiness
- **การใช้งาน**: `/merge`

### 47. `/deploy`
- **หน้าที่**: ตรวจสอบ Pre-flight Checks และเตรียมความพร้อมก่อน Deploy สู่ Production
- **การใช้งาน**: `/deploy`

### 48. `/preview`
- **หน้าที่**: จัดการ Local Preview Server เพื่อให้ผู้พัฒนาเปิดดูผลงานจริงในเครื่องได้ทันที
- **การใช้งาน**: `/preview`

### 49. `/changelog`
- **หน้าที่**: อัปเดต `CHANGELOG.md` อัตโนมัติจากประวัติ Commit, Specs, และ Stage Reports
- **การใช้งาน**: `/changelog`

### 50. `/followup`
- **หน้าที่**: ติดตามงานที่ต้องทำต่อหลังปล่อยฟีเจอร์ และส่งต่อเป็น Backlog สำหรับ Run ถัดไป
- **การใช้งาน**: `/followup`

---

## 🤖 หมวดที่ 8: การประสานงาน AI และทักษะสนับสนุน (AI Orchestration & Metaprogramming)

เครื่องมือควบคุมพฤติกรรม AI และการเรียนรู้ระบบ:

### 51. `/agent`
- **หน้าที่**: เรียกใช้ Specialist Persona หรือ Role-based Agent เฉพาะทางสำหรับโฟลเดอร์หรือไฟล์เป้าหมาย
- **การใช้งาน**: `/agent [persona-name] [target]`

### 52. `/parallel-agents`
- **หน้าที่**: รูปแบบการประสานงาน AI หลายตัวให้ทำงานคู่ขนานกันในงานที่อิสระจากกัน
- **การใช้งาน**: `/parallel-agents`

### 53. `/behavioral-modes`
- **หน้าที่**: ปรับโหมดการทำงานของ AI (Brainstorm, Implement, Debug, Review, Teach, Ship) ให้เหมาะกับสถานการณ์
- **การใช้งาน**: `/behavioral-modes [mode]`

### 54. `/context-engineering`
- **หน้าที่**: ปรับแต่ง Context Window และ Memory Bank ของ AI ให้มีประสิทธิภาพสูงสุด
- **การใช้งาน**: `/context-engineering`

### 55. `/insight`
- **หน้าที่**: สกัดบทเรียน (Lessons Learned), Architectural Patterns, และแนวทางป้องกันปัญหาจากงานที่ทำเสร็จ
- **การใช้งาน**: `/insight`

### 56. `/skill-development`
- **หน้าที่**: คู่มือการสร้างและดูแล Agent Skills ตามมาตรฐาน PRP Framework
- **การใช้งาน**: `/skill-development`

### 57. `/simplify`
- **หน้าที่**: ปรับโครงสร้างโค้ดให้เข้าใจง่าย กระชับ สะอาด โดยไม่เปลี่ยนพฤติกรรมการทำงาน (Refactoring)
- **การใช้งาน**: `/simplify [file]`

### 58. `/i18n-localization`
- **หน้าที่**: ตรวจจับ Hardcoded Strings และจัดการโครงสร้างไฟล์แปลภาษา (Localization & RTL)
- **การใช้งาน**: `/i18n-localization`

### 59. `/seo-fundamentals`
- **หน้าที่**: ตรวจสอบและปรับปรุงปัจจัย SEO, E-E-A-T, Open Graph Tags และ Core Web Vitals
- **การใช้งาน**: `/seo-fundamentals`

### 60. `/handoff`
- **หน้าที่**: ส่งต่องานระหว่างรอบการทำงาน (Agent-to-Human หรือ Agent-to-Agent Session Handoff)
- **การใช้งาน**: `/handoff`

### 61. `/package-json-generator`
- **หน้าที่**: สร้างและปรับแต่ง Scripts ใน `package.json` ให้เป็นมาตรฐานเดียวกันของโปรเจกต์
- **การใช้งาน**: `/package-json-generator`

### 62. `/research`
- **หน้าที่**: ทำการค้นคว้าเชิงลึกใน Codebase หรือหาข้อมูลทางเทคนิคภายนอกพร้อมแหล่งอ้างอิง
- **การใช้งาน**: `/research [topic]`
