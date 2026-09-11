# Discovery Document: [DISC-20260909-001] DietrichGebert/ponytail Skill Integration Evaluation

> **Discovery ID**: `DISC-20260909-001`  
> **Topic**: การวิเคราะห์ความเหมาะสมและการนำ `DietrichGebert/ponytail` มาติดตั้งใน Nexus-DevFlow ด้วยรูปแบบ `"type": "git"`  
> **Date**: 2026-09-09  
> **Status**: `Proceed with Guardrails (On-Demand & Targeted Lifecycle Integration — DO NOT install as Global Always-On Rule)`  
> **Target Scope**: Nexus-DevFlow Ecosystem, Skill Registry Engine (`skill-registry-engine.ts`), Lifecycle Stages (`/implement`, `/fix`, `/audit`), Multi-Harness Adapters (`.agents/`, `.claude/`, `.opencode/`)

---

## 1. Executive Summary & บทสรุปผู้บริหาร (TL;DR)

**คำถามหลัก**: นำ skill `https://github.com/DietrichGebert/ponytail` มาติดตั้งใน DevFlow แบบ `"type": "git"` จะมีข้อดีอย่างไร เสริมดีขึ้นหรือแย่ลง หรือควรใช้เฉพาะบางจุด?

**คำตอบสรุป**:
- **"ดีขึ้นอย่างมหาศาล"** หากนำมาใช้เป็น **On-Demand Companion Skill** สำหรับงาน **Backend Logic, Bug Fixing (`/fix`), Refactoring, และ Code Health Audit (`/audit`)** เพราะช่วยหยุดพฤติกรรม Over-Engineering ของ LLM ตัดโค้ดขยะได้ถึง ~54% และป้องกันการติดตั้ง external library พร่ำเพรื่อ
- **"แย่ลงทันที"** หากนำมาติดตั้งเป็น **Global Always-On Rule** (ใน `.agents/rules/` หรือ Hook ทุก Prompt) เพราะจะเกิด **Aesthetic Clash** ขัดแย้งกับมาตรฐานการทำ UI/UX ที่พรีเมียมของระบบ และเสี่ยงต่อ **Under-Engineering** ในงานวางสถาปัตยกรรมระดับองค์กร (DDD / Modular Architecture)

---

## 2. เจาะลึก DietrichGebert/ponytail คืออะไร? (Repository Profile)

- **Repository**: [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- **สโลแกน**: *"He says nothing. He writes one line. It works."* (Lazy senior dev mode for AI agents)
- **ผลลัพธ์เชิงประจักษ์ (Benchmarks on Haiku/Sonnet)**:
  - โค้ดลดลงเฉลี่ย **~54%** (บางเคสลดได้ถึง **94%**)
  - ประหยัด Token **~22%**, ลดค่าใช้จ่าย API **~20%**, ประหยัดเวลา **~27%**
  - **Safety 100%**: ไม่ลดทอน Error Handling, Validation, Security Boundary, หรือ Accessibility (a11y)

### 2.1 The Decision Ladder (บันได 7 ขั้นก่อนเขียนโค้ด)
Agent จะหยุดที่ขั้นแรกที่แก้โจทย์ได้:
1. **Does this need to exist? (YAGNI)**: ถ้ารายละเอียดยังไม่จำเป็นจริง ให้ข้ามและบอกเหตุผลใน 1 บรรทัด
2. **Already in this codebase?**: มี helper, util, type, pattern ในโปรเจกต์อยู่แล้วหรือไม่? ให้ reuse ห้ามเขียนใหม่
3. **Stdlib does it?**: Standard Library ของภาษา/รันไทม์รองรับหรือไม่? ให้ใช้ stdlib
4. **Native platform feature?**: ฟีเจอร์ของแพลตฟอร์มรองรับไหม? (เช่น `<input type="date">` แทน lib datepicker, CSS แทน JS logic, Database constraints แทน application checks)
5. **Installed dependency?**: แพ็กเกจที่ลงไว้แล้วแก้ได้ไหม? ห้ามสั่ง npm/pip install dependency ใหม่เพื่อโค้ดไม่กี่บรรทัด
6. **One line?**: ทำเป็นบรรทัดเดียวได้หรือไม่?
7. **Only then: minimum that works**: เขียนโค้ดให้น้อยที่สุดที่ทำงานได้ถูกต้อง

### 2.2 ชุด Skills ใน Repository
| Skill Name | บทบาทและหน้าที่ |
| :--- | :--- |
| `ponytail` | ทักษะหลัก (Mindset Controller) รองรับ intensity: `lite`, `full` (default), `ultra` |
| `ponytail-audit` | สแกน Codebase ตรวจจับ Over-engineering, Dead abstractions, Bloated dependencies |
| `ponytail-debt` | ประเมิน Technical Debt ที่เกิดจากการสร้าง Abstraction เกินความจำเป็น |
| `ponytail-gain` | คำนวณความคุ้มค่า (LOC saved, Token reduced, Cost efficiency) |
| `ponytail-review` | เลนส์ Code Review เน้นเจาะจงความเรียบง่ายและการลบโค้ดที่ไม่จำเป็น |

---

## 3. การประเมินทางเทคนิค: ติดตั้งแบบ `"type": "git"` ใน Nexus-DevFlow

ใน Nexus-DevFlow กลไก `skill-registry-engine.ts` และ `create-nexus-devflow` มีระบบจัดการ Third-party skills แบบ `"type": "git"`:

```text
git clone --depth 1 https://github.com/DietrichGebert/ponytail
  └── ค้นหาโฟลเดอร์ที่มี SKILL.md (พบในโฟลเดอร์ skills/*)
  └── คัดลอกไปยัง .agents/skills/ และ Sync ข้าม Adapters (.claude/, .opencode/ ฯลฯ)
```

### 3.1 ผลการทดสอบความเข้ากันได้ (Compatibility Test)
1. **Directory Structure**: Ponytail จัดเก็บทักษะไว้ใต้โฟลเดอร์ `skills/` ซึ่งตรงตามข้อกำหนดของ `discoverSkillsInDirectory()` ใน DevFlow 100%
2. **Multi-Skill Discovery**: เนื่องจากใน repo มี 5 skills ย่อย หากสั่งติดตั้งผ่าน CLI:
   - เจาะจงทักษะหลัก: `nexus-devflow skill add https://github.com/DietrichGebert/ponytail --name ponytail` (ติดตั้งเฉพาะตัวหลัก)
   - ติดตั้งทั้งหมด: `nexus-devflow skill add https://github.com/DietrichGebert/ponytail --all` (ติดตั้งครบทั้ง 5 skills)
3. **Multi-Harness Support**: รองรับทุกค่ายที่ DevFlow ใช้งาน (Claude Code, Google Antigravity, OpenAI Codex, OpenCode, Cursor, Copilot)

---

## 4. วิเคราะห์เปรียบเทียบ: ข้อดี vs ข้อควรระวัง (Pros & Cons)

### 4.1 ข้อดี (เมื่อนำมาเสริมใน DevFlow)
1. **สกัดพฤติกรรม "AI Over-Engineering"**: LLM มักชอบสร้างไฟล์ย่อยๆ เต็มไปหมด สร้าง Interface ที่มีคลาสเดียว หรือเขียนฟังก์ชันครอบ (wrapper) เกินจำเป็น Ponytail บังคับให้ Agent ใช้หลัก *Boring over clever* และ *Deletion over addition*
2. **เสริมพลังขั้นสุดให้ `/implement` (TDD Discipline)**: ในลูป Red-Green-Refactor สเตจ Green ต้องการโค้ดที่สั้นและตรงประเด็นที่สุดเพื่อให้เทสต์ผ่าน Ponytail ladder ช่วยป้องกันไม่ให้ Agent เขียนโค้ดบวมออกนอกขอบเขตของ living spec
3. **เสริมวินัยในสเตจ `/fix` (Root-Cause Fix)**: กฎของ Ponytail บังคับว่า *"Bug fix = root cause, not symptom. Grep every caller and fix the shared function once"* ซึ่งตรงกับมาตรฐาน Senior QA/Debug ของ Nexus-DevFlow ป้องกันการแก้บั๊กแบบลิงแก้แห
4. **ประหยัด Context Window ใน Continuous Mode (`/continuous`)**: ในโหมดอัตโนมัติหลายฟีเจอร์ Context window มีจำกัด การที่โค้ดใน diff สั้นลง 50% ช่วยลด Token consumption และลดความเสี่ยง context drift อย่างเห็นได้ชัด
5. **ป้องกัน Dependency Leaks**: ป้องกันไม่ให้ Agent แอบลง npm library เล็กๆ น้อยๆ (เช่น uuid, debounce, is-odd, date-fns) ทั้งที่โปรเจกต์มี Node.js stdlib `crypto.randomUUID()` หรือ Native JS APIs รองรับอยู่แล้ว

---

### 4.2 ข้อควรระวัง & จุดที่อาจทำให้ "แย่ลง" (Failure Modes)

| ความเสี่ยง | สาเหตุ | ผลกระทบต่อ Nexus-DevFlow |
| :--- | :--- | :--- |
| **Aesthetic Clash (ขัดแย้งกับงาน UI/UX)** | กฎ Ponytail สั่ง "Platform native over lib" และ "Boring over clever" | หากเปิดใช้งานในงาน Web/Frontend Agent จะเลือกใช้ HTML ธรรมดา เช่น `<input type="date">` หรือ `<select>` บ้านๆ โดยไม่ยอมใช้ Modern Design Tokens, Micro-animations หรือ Rich Components ขัดแย้งกับกฎความสวยงามพรีเมียมของระบบ |
| **Under-Engineering ใน Enterprise Architecture** | กฎ "No abstractions that weren't explicitly requested" | ในระบบขนาดใหญ่ที่ต้องการ Domain-Driven Design (DDD), Modular Hexagonal Architecture, หรือ Event Bus การบังคับไม่ให้สร้าง Interface/Abstraction ล่วงหน้าอาจทำให้โค้ดกลายเป็น Procedural Script กองอยู่ในไฟล์เดียว |
| **Always-On Prompt Pollution** | ในต้นทาง Ponytail พยายามใช้ Hook / Rule แบบ "ACTIVE EVERY RESPONSE" | หากนำมาลงเป็น Global Rule ทุกข้อความ จะไปครอบงำ Intent ของคำสั่งอื่นๆ เช่น `/prototype` (ต้องการ mockup สวย), `/archify` (ต้องการ diagram ละเอียด), หรือ `/brainstorm` (ต้องการไอเดียหลากหลาย) |

---

## 5. ตารางสรุปการประยุกต์ใช้งานตามจุดต่างๆ (Stage-by-Stage Matrix)

| DevFlow Stage / Skill | ความเหมาะสม | คำแนะนำในการใช้งาน |
| :--- | :---: | :--- |
| **`/fix` & `/debug`** | ⭐⭐⭐⭐⭐ **(ยอดเยี่ยม)** | **เปิดใช้งานเต็มที่**: บังคับแก้ที่ root cause และห้ามเพิ่ม code bloat |
| **`/implement` (Backend/Logic/CLI)** | ⭐⭐⭐⭐⭐ **(ยอดเยี่ยม)** | **เปิดใช้งาน**: คุม diff ให้กระชับ ใช้ stdlib และ reuse โค้ดเดิมใน codebase |
| **`/audit`** | ⭐⭐⭐⭐⭐ **(ยอดเยี่ยม)** | **ใช้ `ponytail-audit`**: ตรวจจับ unneeded abstraction และ unused dependencies ก่อน release |
| **`/continuous` & `/autopilot`** | ⭐⭐⭐⭐ **(ดีมาก)** | **เปิดโหมด `lite` หรือ `full`**: ประหยัด token และรักษาความเร็วใน long-running tasks |
| **`/complete` & `/check`** | ⭐⭐⭐ **(ปานกลาง)** | ใช้ตรวจสอบ empirical proof ว่าไม่มีโค้ดส่วนเกินหลุดเข้า main branch |
| **`/prototype` & Web Frontend** | ❌ **(ไม่ควรใช้)** | **ปิดการใช้งาน**: ต้องคงความพรีเมียม สุนทรียศาสตร์ และ Rich UI/UX ไว้ |
| **`/brainstorm` & `/grill`** | ❌ **(ไม่ควรใช้)** | **ปิดการใช้งาน**: ต้องการ Divergent Thinking และ Domain Exploration เชิงลึก |

---

## 6. ข้อเสนอแนะเชิงกลยุทธ์ (Actionable Recommendations)

1. **ติดตั้งเป็น "Tier 3: Specialized On-Demand Skill" (แนะนำ)**:
   - เพิ่มเป็นทางเลือกใน Nexus-DevFlow ติดตั้งแบบ `"type": "git"`
   - เรียกใช้งานเฉพาะกิจผ่านคำสั่ง: `/ponytail [lite|full|ultra]` เมื่อต้องการรีแฟกเตอร์, ลีนโค้ด, หรือแก้บั๊ก
2. **ไม่ติดตั้งเป็น Global Rule หรือ Global Hook**:
   - ห้ามคัดลอกลงใน `.agents/rules/ponytail.md` หรือเปิด hook `ponytail-activate.js` ที่ทำงานทุก Response
   - เพื่อให้สิทธิขาดแก่ผู้ใช้และ Agent ในการเลือกใช้ตามบริบทของงาน (Context-Aware)
3. **รวมเข้ากับระบบตรวจสุขภาพโค้ด (`/audit`)**:
   - สามารถนำชุดตรวจของ `ponytail-audit` มาเป็น Checklist ตรวจสอบ YAGNI & Code Bloat ในรายงาน Audit Receipt ได้อย่างคุ้มค่า
4. **เพิ่ม Preset Alias ใน `skill-registry-engine.ts`**:
   - เพิ่ม `ponytail: { source: "https://github.com/DietrichGebert/ponytail", description: "Lazy senior dev mode - cuts LOC and token bloat via YAGNI ladder" }` เพื่อให้ผู้ใช้ติดตั้งได้ง่ายๆ ด้วยคำสั่ง `nexus-devflow skill add ponytail`

---

## 7. บทตัดสินการค้นพบ (Decision Gate)

- **Decision**: **`Proceed with Guardrails`**
- **Next Step**:
  - หากผู้ใช้ต้องการติดตั้ง: สามารถเพิ่ม alias ลงใน `KNOWN_SKILL_ALIASES` ของ `skill-registry-engine.ts` และติดตั้งเฉพาะตัว skill เป็น On-demand companion
  - เอกสารนี้พร้อมใช้เป็นแนวทางปฏิบัติอ้างอิงของทีม
