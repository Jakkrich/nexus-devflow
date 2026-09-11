# Discovery Document: [DISC-20260901-001] Claude-BugHunter Third-Party Skill Suitability Evaluation

> **Discovery ID**: `DISC-20260901-001`  
> **Topic**: การประเมินความเหมาะสมของ `Claude-BugHunter` (https://github.com/elementalsouls/Claude-BugHunter) ในฐานะ Third-Party Skill ของ Nexus-DevFlow  
> **Date**: 2026-09-01  
> **Status**: `Approved with Scope Boundary (On-Demand / Selective Plugin - Not Recommended as Default Preset)`  
> **Target Scope**: Nexus-DevFlow Ecosystem, Skill Manager (`skill-manager.ts`), Security & Quality Gates (`audit`, `check`), Multi-Harness Adapters (`.agents/`, `.claude/`)

---

## 1. Executive Summary & คำตอบสรุป (TL;DR)

**คำถาม**: `https://github.com/elementalsouls/Claude-BugHunter` เหมาะที่จะเป็น `thirdPartySkills` ใน Nexus-DevFlow หรือไม่?

**คำตอบ**: **"เหมาะมากในฐานะ On-Demand Domain-Specific Skill (ติดตั้งเมื่อต้องการทดสอบความปลอดภัย) แต่ ไม่เหมาะ ที่จะนำมาเป็น Core / Default Recommended Preset ของ Framework"**

### สรุปจุดยืนทางสถาปัตยกรรม (Architectural Verdict):
1. **เข้ากันได้ทางเทคนิค 100% (Technically Compatible)**: Claude-BugHunter สร้างขึ้นด้วยมาตรฐาน `SKILL.md` (Agent Skills Standard) ซึ่งรองรับโครงสร้างโฟลเดอร์และ Frontmatter เดียวกับที่ Nexus-DevFlow ใช้ สามารถติดตั้งผ่านคำสั่ง `nexus-devflow skill add https://github.com/elementalsouls/Claude-BugHunter` ได้ทันที
2. **ขอบเขตการใช้งานต่างกัน (Domain Mismatch for Default Preset)**:
   - **Nexus-DevFlow**: เน้น **SDLC (Software Development Life Cycle)** การสร้าง ฟีเจอร์ รีแฟกเตอร์ สถาปัตยกรรม Clean Code และ TDD (`feature`, `implement`, `check`, `complete`, `audit`)
   - **Claude-BugHunter**: เน้น **Offensive Security & Red-Teaming** (การเจาะระบบจากภายนอก, Bug Bounty Hunting, การทดสอบช่องโหว่เว็บและโครงสร้างพื้นฐานระดับองค์กร เช่น SQLi, XSS, SSRF, IDOR, OAuth Bypasses)
3. **ปัญหาเรื่อง Context & Token Budget หากติดตั้งทั้งหมด (Token Bloat Risk)**:
   - Claude-BugHunter มีทักษะมากถึง **83 Skills** หากผู้ใช้ติดตั้งทั้งหมด (`--all`) ลงในโปรเจกต์พัฒนาทั่วไป จะเพิ่ม System Prompt overhead มหาศาล และอาจทำให้ AI Agent เกิด Routing Confusion ระหว่างงาน Development ปกติกับงาน Exploit/Security Testing
4. **แนวทางที่แนะนำสูงสุด (Recommended Strategy)**:
   - จัดเป็น **"Tier 3: Specialized Security Extension"** 
   - ใช้งานแบบ **Cherry-picking (เลือกติดตั้งเฉพาะทักษะที่เกี่ยวข้อง)** เช่น `hunt-oauth`, `hunt-jwt`, `hunt-idor`, `hunt-ssrf` หรือติดตั้งแบบ Global Profile เมื่อต้องทำ Security Review / Pentest

---

## 2. ข้อมูลเชิงลึกเกี่ยวกับ Claude-BugHunter (Repository Profile)

- **Repository**: [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)
- **ผู้พัฒนา**: Sachin Sharma (Bug Hunting & GenAI Security Research)
- **ขนาดและองค์ประกอบ**:
  - **83 Skills** (58+ `hunt-*` vulnerability classes, Recon, OSINT, Cloud IAM, Enterprise Platforms)
  - **15 Slash Commands** (เช่น `/hunt`, `/recon` - ออกแบบสำหรับ Claude Code CLI)
  - **681 Disclosed Report Patterns** จาก HackerOne / Bugcrowd
  - **Burp Suite MCP Integration** สำหรับเชื่อมต่อ Burp Proxy

### สถาปัตยกรรม 4 ชั้นของ Claude-BugHunter:
```text
┌─────────────────────────────────────────────────────────────┐
│ 1. THINK: bb-methodology, redteam-mindset (5-Phase Flow)    │
├─────────────────────────────────────────────────────────────┤
│ 2. HUNT WEBAPPS: 58 hunt-* skills (IDOR, SSRF, SQLi, OAuth) │
├─────────────────────────────────────────────────────────────┤
│ 3. PERIMETER: M365/Entra, Okta, vCenter, SSL-VPN Appliances │
├─────────────────────────────────────────────────────────────┤
│ 4. SHIP: triage-validation, 7-Question Gate, VRT-aware H1   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. การเปรียบเทียบและการจัดลำดับชั้นใน Nexus-DevFlow (Tier Classification)

เพื่อรักษาความกระชับ ความเร็ว และความแม่นยำของ Agent ในระบบ Nexus-DevFlow เราแบ่งประเภทของ Skills ออกเป็น 3 ระดับ:

```
┌─────────────────────────────────────────────────────────────────┐
│ Tier 1: Core Built-in Skills (29 Skills)                        │
│ (feature, fix, implement, check, complete, audit, debug, etc.)   │
├─────────────────────────────────────────────────────────────────┤
│ Tier 2: Recommended Presets (`--recommended` - 8 Skills)        │
│ (archify, diagram-design, 9arm-skills - ครอบคลุมงาน dev ทั่วไป)  │
├─────────────────────────────────────────────────────────────────┤
│ Tier 3: Specialized Domain Bundles (On-Demand / User Selected)  │
│ ⭐ Claude-BugHunter จัดอยู่ในกลุ่มนี้ (Offensive Security)       │
└─────────────────────────────────────────────────────────────────┘
```

| มิติการเปรียบเทียบ | Nexus-DevFlow Core / Recommended | Claude-BugHunter |
| :--- | :--- | :--- |
| **เป้าหมายหลัก** | Software Engineering & Product Delivery (สร้างซอฟต์แวร์) | Penetration Testing & Bug Hunting (ทดสอบเจาะระบบ) |
| **มุมมองความปลอดภัย** | **Defensive**: Static Analysis, Dependency Audit, Fowler Smell (`/audit`) | **Offensive**: Active Probing, Exploit Payloads, Bypass Matrices |
| **จำนวน Skills** | 29 Core + 8 Recommended = 37 Skills | 83 Specialized Skills |
| **ผลกระทบต่อ Context Window** | มีการคำนวณและ Optimize ให้กระชับ ไม่รบกวน AI Prompt | ขนาดใหญ่มาก (หากโหลดทั้ง 83 skills จะกิน Token สูง) |
| **ความเข้ากันได้ของ Adapters** | รองรับครบทั้ง 5 ตัว (Codex, Antigravity, Copilot, OpenCode, Claude) | รองรับ `SKILL.md` ครบ 5 ตัว แต่บาง Slash Commands รองรับเฉพาะ Claude Code |

---

## 4. Trade-off Analysis: ข้อดี ข้อควรระวัง และแนวทางการนำมาใช้

### 4.1 ข้อดีเมื่อนำมาใช้ (Pros)
1. **เสริมพลังการทดสอบด้าน Security อย่างก้าวกระโดด**: ทำให้นักพัฒนาสามารถทดสอบระบบของตัวเองในมุมมองของ Hacker/Attacker ได้ ก่อนที่จะขึ้น Production
2. **ลดช่องโหว่ของ API & Web Applications**: มีเทมเพลตและแพทเทิร์นตรวจสอบช่องโหว่ยอดนิยม เช่น IDOR, Broken Object Level Auth, SSRF, JWT Signature bypasses
3. **มาตรฐาน SKILL.md ตรงกัน**: โครงสร้างไฟล์ตรงตามมาตรฐาน Agent Skills ไม่ต้องแปลงโครงสร้าง สามารถนำมาใช้งานร่วมกับระบบ Adapter Sync ของ Nexus-DevFlow ได้ทันที

### 4.2 ข้อควรระวังและความเสี่ยง (Cons & Risks)
1. **Context/System Prompt Bloat**: การเพิ่ม 83 skills จะทำให้ Token พื้นฐานของ Agent บวมขึ้น ส่งผลให้ Agent ตอบสนองช้าลงและเปลืองค่า API Token
2. **Routing Confusion**: หากในโปรเจกต์มีทั้ง `audit` (Defensive) และ `hunt-*` (Offensive) จำนวนมาก AI อาจสับสนบริบทเมื่อผู้ใช้สั่งให้ตรวจสอบโค้ดทั่วไป
3. **Safety & Operational Boundaries**: ทักษะประเภท Offensive Testing ต้องการความระมัดระวังในการใช้งาน (ต้องได้รับอนุญาตให้ทดสอบระบบเท่านั้น) การนำมาเป็น Default อาจไม่เหมาะกับทีมพัฒนาซอฟต์แวร์ทั่วไป

---

## 5. แนะนำแนวทางการใช้งาน Claude-BugHunter ใน Nexus-DevFlow

หากต้องการนำ Claude-BugHunter มาใช้งานร่วมกับ Nexus-DevFlow มี 3 รูปแบบที่แนะนำ:

### แนวทางที่ 1: Selective Cherry-Picking (แนะนำที่สุดสำหรับโปรเจกต์)
เลือกติดตั้งเฉพาะ Skill ที่เกี่ยวข้องกับ Stack หรือช่องโหว่ที่กำลังพัฒนาในโปรเจกต์นั้นๆ เช่น เมื่อทำระบบ Authentication/SSO:

```bash
# ติดตั้งเฉพาะทักษะ hunt-oauth
npx @jakkrichm/create-nexus-devflow skill add https://github.com/elementalsouls/Claude-BugHunter --name hunt-oauth

# ติดตั้งเฉพาะทักษะ hunt-jwt
npx @jakkrichm/create-nexus-devflow skill add https://github.com/elementalsouls/Claude-BugHunter --name hunt-jwt

# ติดตั้งเฉพาะทักษะ hunt-idor
npx @jakkrichm/create-nexus-devflow skill add https://github.com/elementalsouls/Claude-BugHunter --name hunt-idor
```

### แนวทางที่ 2: ติดตั้งทั้งหมดใน Global Agent Config (สำหรับ Security Engineer / Red-Teamer)
หากผู้ใช้ทำงานเป็น Security Researcher หรือต้องการใช้ทุกสกิลในระดับเครื่อง (User Profile) โดยไม่ผูกกับ Repository ซอฟต์แวร์เฉพาะ:

```bash
# ติดตั้งเข้า Global Antigravity Config
git clone https://github.com/elementalsouls/Claude-BugHunter.git
cd Claude-BugHunter
pwsh ./scripts/install.ps1 -Antigravity -BurpMcp
```

### แนวทางที่ 3: บูรณาการร่วมกับ `/check` และ `/audit` ใน Nexus-DevFlow
เมื่อพัฒนาฟีเจอร์ที่มีความเสี่ยงสูง (เช่น Payment, Auth, Data Export) สามารถเรียกใช้ทักษะ BugHunter ระหว่างขั้นตอน `/check` หรือการทำ Security Review เพื่อทำ Red-Team Self-Assessment:

```text
/check 12
"ใช้แนวทางจาก hunt-idor และ hunt-ssrf ในการทดสอบ API Endpoint นี้ เพื่อยืนยันว่าไม่มีช่องโหว่การเข้าถึงข้อมูลข้าม Tenant"
```

---

## 6. Decision & Approval Gate

- **Decision**: `Approved as On-Demand Security Extension (Reject as Default Framework Preset)`
- **Rationale**: 
  - `Claude-BugHunter` เป็นชุดเครื่องมือที่ยอดเยี่ยมและมีคุณภาพสูงมากในสายงาน Security/Bug Bounty
  - เข้ากันได้กับ Nexus-DevFlow `skill-manager` อย่างสมบูรณ์
  - **แต่ไม่ควรบรรจุลงใน `RECOMMENDED_THIRD_PARTY_SKILLS` (หรือคำสั่ง `--recommended`)** ของ Nexus-DevFlow เพื่อรักษาความ Lean, Fast, และ Dev-Centric ของ Core Framework ไว้
  - แนะนำให้เพิ่มเอกสารหรือ Guide ในการ Cherry-pick สกิลเหล่านี้สำหรับนักพัฒนาที่ต้องการทำ Security Hardening

---

## 7. Next Actions & Recommendations

1. **สำหรับทีม Nexus-DevFlow**:
   - คงรายการ `RECOMMENDED_THIRD_PARTY_SKILLS` ปัจจุบันไว้ (archify, diagram-design, 9arm-skills)
   - อาจพิจารณาเพิ่มหัวข้อ **"Security Hardening with Claude-BugHunter"** ใน Documentation (`devflow/reference/` หรือ `README.md`) แนะนำตัวอย่างการ Cherry-pick สำหรับงาน Security Review
2. **สำหรับผู้ใช้ที่ต้องการใช้งานทันที**:
   - สามารถใช้ `nexus-devflow skill add https://github.com/elementalsouls/Claude-BugHunter --name <skill-name>` เพื่อดึงเฉพาะ Skill ที่ต้องการเข้ามาในโปรเจกต์ได้เลย
