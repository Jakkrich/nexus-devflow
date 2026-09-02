<p align="center">
  <img src="docs/logo-nexus-devflow.png" alt="Nexus-DevFlow" width="120">
</p>

<h1 align="center">Nexus-DevFlow</h1>

<p align="center"><strong>สถาปัตยกรรม 3 เสาหลัก และ Single Living Spec Model สำหรับการพัฒนาซอฟต์แวร์ระดับโปรดักชันร่วมกับ AI Coding Agents อย่างเป็นระบบและควบคุมได้จริง</strong></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow"><img src="https://img.shields.io/npm/v/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef" alt="npm version"></a>
  <a href="https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml"><img src="https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml/badge.svg" alt="Validate DevFlow"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/Jakkrich/nexus-devflow?style=flat-square&color=155eef" alt="MIT license"></a>
</p>

<p align="center"><strong>ไทย</strong> | <a href="README.md">English</a></p>

<p align="center">
  <a href="https://github.com/Jakkrich/nexus-devflow">Repository</a> |
  <a href="https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow">npm</a> |
  <a href="https://github.com/Jakkrich/nexus-devflow/releases">Releases</a> |
  <a href="CHANGELOG.md">Changelog</a>
</p>

คุณบันทึกไอเดีย การตัดสินใจเชิงสถาปัตยกรรม และความต้องการของผลิตภัณฑ์ลงในเอกสาร Markdown ที่มีโครงสร้างชัดเจน จากนั้น AI จะแปลงสิ่งเหล่านั้นเป็นบริบทของโปรเจกต์ (Context), สเปกมีชีวิต (Single Living Spec), และลำดับงานพัฒนาแบบ TDD อย่างละเอียด คุณจะส่งมอบงานทีละฟีเจอร์ ตรวจสอบสเปกก่อนเริ่มเขียนโค้ด และตรวจสอบความเปลี่ยนแปลง (Diffs) พร้อมผลทดสอบจริงก่อนผสานโค้ดเข้าสู่ระบบหลักเสมอ

ติดตั้งลงใน Git repository ใดๆ ได้ในไม่กี่วินาที:

```bash
npx -y @jakkrichm/create-nexus-devflow@latest -y
```

> [!NOTE]
> Nexus-DevFlow ถูกออกแบบเป็น Workflow Overlay Layer ที่ครอบอยู่บน codebase ของแอปพลิเคชันคุณ เพื่อนำทักษะมัลติเอเจนต์ (`.agents/skills` & `.claude/skills`), อาร์ติแฟกต์ 3 เสาหลัก (`devflow/`), และจุดตรวจ Senior QA ไปยัง AI IDE ที่คุณชื่นชอบ (**Google Antigravity**, **Claude Code**, **OpenAI Codex**, **Cursor**, **GitHub Copilot**, **Gemini CLI**, **Aider**, **OpenCode** และอื่นๆ)

---

## นิยามและแนวคิด (What this is)

การเขียนโค้ดแบบไร้ทิศทาง (Vibe Coding) คือการอธิบายไอเดียแบบกว้างๆ แล้วกดยอมรับทุกอย่างที่ AI ส่งกลับมา แม้จะดูรวดเร็วในช่วงแรก แต่จะนำไปสู่โค้ดที่ซับซ้อนและไม่มีใครเข้าใจ (Spaghetti Code), ปัญหา Regression สะสม และซอฟต์แวร์ที่เปราะบางจนไม่สามารถแก้ไขได้อย่างปลอดภัย

**Nexus-DevFlow** มอบวงจรการพัฒนาทางวิศวกรรมที่มีการควบคุมอย่างรัดกุม:

1. **กำหนดสเปกก่อนเขียนโค้ด (Spec before code)**: AI จะสร้าง Living Spec ที่ชัดเจนแล้วหยุดรอให้คุณรีวิวขอบเขต, Data Contracts และ Edge Cases ก่อนเริ่มเขียนโค้ดแม้แต่บรรทัดเดียว
2. **ขั้นตอนย่อยแบบ TDD ที่ตรวจสอบได้ (Small, reviewable TDD steps)**: ทุกขั้นตอนการลงมือทำจะบังคับใช้วินัย Red-Green-Refactor พร้อมแสดง Diff, ผลการรัน Test และหลักฐานเชิงประจักษ์
3. **ส่งมอบทีละงานอย่างมีโฟกัส (One work item at a time)**: `devflow/context/current-feature.md` เก็บงานปัจจุบันเพียง 1 รายการ (ฟีเจอร์, บั๊ก หรือการ Rollback) เมื่อเสร็จสิ้นจะถูกย้ายไปเก็บถาวรใน `devflow/history/` ก่อนเริ่มงานถัดไป
4. **จุดตรวจและสมุดบันทึก Findings ที่เข้มงวด (Findings & Quality Gates with teeth)**: ข้อบกพร่องที่พบจากการ Audit จะได้รับรหัสประจำตัวถาวรในสมุดบันทึก (`findings.md`) และปัญหาสำคัญ (P0/P1) จะบล็อกการ Release จนกว่าจะได้รับการแก้ไขและตรวจซ้ำ หรือได้รับการยกเว้นอย่างเป็นทางการ ข้อมูลจะไม่สูญหายแม้ AI Context จะถูกรีเซ็ต

เป้าหมายไม่ใช่แค่การพิมพ์โค้ดให้น้อยลง แต่คือการ **รักษาการควบคุม** อย่างสมบูรณ์ใน codebase ที่พัฒนาด้วย AI

---

## ภาพรวมโดยสรุป (At a glance)

| หลักการ (Principle) | ความหมายและสิ่งที่ได้รับ (What it means) |
| :--- | :--- |
| **Spec first** | AI สร้าง Living Spec ที่มีโครงสร้างชัดเจนและหยุดรอการรีวิวจากมนุษย์ก่อนลงมือเขียนโค้ด |
| **Strict TDD discipline** | การพัฒนาขับเคลื่อนด้วยขั้นตอน `[TDD-Red]`, `[TDD-Green]`, และ `[TDD-Refactor]` พร้อมบันทึกผลการทดสอบ |
| **The 3-Pillars Workspace** | แยกบริบทชัดเจนเป็น 3 เสาหลัก: อนาคต (`ideas.md`), ปัจจุบัน (`context/`), และอดีต (`history/` & `decisions/`) |
| **Findings gate** | ข้อบกพร่องจาก `/audit` ถูกบันทึกลง `findings.md` พร้อมรหัสถาวร; ปัญหา P0/P1 จะบล็อก `/complete` อย่างเด็ดขาด |
| **Universal tool adapters** | Antigravity, Claude Code, OpenAI Codex, Cursor, GitHub Copilot และ OpenCode ใช้ Skill ร่วมกันได้ทันที |
| **Real-time observability** | มี Web Dashboard ในตัว แสดงผลทันทีใน 0ms (First Paint), มี Multi-Agent Swarm Visualizer และ Code Graph RAG |
| **Zero-drop context** | สถานะของงานถูกบันทึกลงไฟล์ Markdown ทำให้ทนทานต่อการเคลียร์ Context Window ของ AI ได้ 100% |

---

## สารบัญ (Contents)

- [นิยามและแนวคิด (What this is)](#นิยามและแนวคิด-what-this-is)
- [ภาพรวมโดยสรุป (At a glance)](#ภาพรวมโดยสรุป-at-a-glance)
- [เริ่มต้นใช้งานด่วน (Quick start)](#เริ่มต้นใช้งานด่วน-quick-start)
  - [กรณีมี Codebase อยู่แล้ว? (Already have a codebase?)](#กรณีมี-codebase-อยู่แล้ว-already-have-a-codebase)
  - [การอัปเดต DevFlow (Keep DevFlow current)](#การอัปเดต-devflow-keep-devflow-current)
  - [ตรวจสอบสถานะโปรเจกต์ (Check project status)](#ตรวจสอบสถานะโปรเจกต์-check-project-status)
  - [เปิด Web Dashboard ในเครื่อง (Open the local dashboard)](#เปิด-web-dashboard-ในเครื่อง-open-the-local-dashboard)
- [เครื่องมือและ AI ที่รองรับ (Tool support)](#เครื่องมือและ-ai-ที่รองรับ-tool-support)
- [วงจรการทำงานร่วมกับ AI (The AI workflow)](#วงจรการทำงานร่วมกับ-ai-the-ai-workflow)
- [ตัวอย่างการทำงานจริง (See it in action)](#ตัวอย่างการทำงานจริง-see-it-in-action)
- [แผนภาพกระบวนการทำงาน (Visual overview)](#แผนภาพกระบวนการทำงาน-visual-overview)
- [สถาปัตยกรรม 3 เสาหลัก (The 3-Pillars Workspace Architecture)](#สถาปัตยกรรม-3-เสาหลัก-the-3-pillars-workspace-architecture)
- [โมเดลสเปกมีชีวิต (The Single Living Spec Model)](#โมเดลสเปกมีชีวิต-the-single-living-spec-model)
- [ชุดเครื่องมือ Pre-Flight Discovery & Architectural Alignment](#ชุดเครื่องมือ-pre-flight-discovery--architectural-alignment)
- [ไฟล์และอาร์ติแฟกต์ที่ระบบสร้างขึ้น (What gets generated)](#ไฟล์และอาร์ติแฟกต์ที่ระบบสร้างขึ้น-what-gets-generated)
- [คู่มือการใช้งานเวิร์กโฟลว์ (Using the workflow)](#คู่มือการใช้งานเวิร์กโฟลว์-using-the-workflow)
  - [การแก้บั๊ก (Fixes)](#การแก้บั๊ก-fixes)
  - [การย้อนคืนฟีเจอร์อย่างปลอดภัย (Rollbacks)](#การย้อนคืนฟีเจอร์อย่างปลอดภัย-rollbacks)
- [ตารางอ้างอิงคำสั่งทั้งหมด (Command reference)](#ตารางอ้างอิงคำสั่งทั้งหมด-command-reference)
  - [โหมดออโต้ไพลอต (Autopilot)](#โหมดออโต้ไพลอต-autopilot)
- [การตรวจสอบอัตโนมัติบน GitHub (Automatic GitHub checks)](#การตรวจสอบอัตโนมัติบน-github-automatic-github-checks)
- [การทดสอบและวินัย Strict TDD (Testing & Strict TDD Discipline)](#การทดสอบและวินัย-strict-tdd-testing--strict-tdd-discipline)
- [การตรวจสอบคุณภาพโค้ดและสมุดบันทึก Findings (Code quality audits & Findings ledger)](#การตรวจสอบคุณภาพโค้ดและสมุดบันทึก-findings-code-quality-audits--findings-ledger)
- [คู่มือการทดสอบด้วยตนเอง (Manual try guides)](#คู่มือการทดสอบด้วยตนเอง-manual-try-guides)
- [Enterprise Web Dashboard และ Real-Time Studio](#enterprise-web-dashboard-และ-real-time-studio)
- [ชุดคำสั่งจัดการผ่าน CLI (CLI Management Commands)](#ชุดคำสั่งจัดการผ่าน-cli-cli-management-commands)
- [สกิลเสริมและส่วนขยายแนะนำ (Recommended Extensions)](#สกิลเสริมและส่วนขยายแนะนำ-recommended-third-party-skills--extensions)
- [การเตรียมความพร้อมก่อน Deploy (Deployment readiness)](#การเตรียมความพร้อมก่อน-deploy-deployment-readiness)
- [การสานต่องานเดิมอย่างต่อเนื่อง (Picking up where you left off)](#การสานต่องานเดิมอย่างต่อเนื่อง-picking-up-where-you-left-off)
- [แผนผังโครงสร้างไฟล์ (File map)](#แผนผังโครงสร้างไฟล์-file-map)
- [เอกสารอ้างอิงและกติกากำกับ (Documentation and governance)](#เอกสารอ้างอิงและกติกากำกับ-documentation-and-governance)
- [การสนับสนุนและการมีส่วนร่วม (Support and contributing)](#การสนับสนุนและการมีส่วนร่วม-support-and-contributing)
- [สัญญาอนุญาต (License)](#สัญญาอนุญาต-license)
- [หมายเหตุและข้อควรทราบ (Notes)](#หมายเหตุและข้อควรทราบ-notes)

---

## เริ่มต้นใช้งานด่วน (Quick start)

สร้างโครงสร้างโปรเจกต์ของแอปพลิเคชันคุณก่อน แล้วจึงติดตั้ง Nexus-DevFlow ทับลงไป

**สิ่งที่ต้องเตรียมล่วงหน้า (Prerequisites):**
- Node.js เวอร์ชัน 20 ขึ้นไป
- แอปพลิเคชันที่สร้างขึ้นด้วย Tech Stack ที่คุณต้องการ (Next.js, Vite, NestJS, Python, Go ฯลฯ)
- ติดตั้ง Git และสั่ง `git init` ในโฟลเดอร์แอปพลิเคชันนั้นแล้ว

> [!IMPORTANT]
> สร้างแอปพลิเคชันของคุณก่อนเสมอ แล้วจึงติดตั้ง Nexus-DevFlow ห้ามรันคำสั่ง Framework Scaffolder ในโฟลเดอร์ที่มีไฟล์ของ DevFlow อยู่แล้ว

### 1. สร้างแอปพลิเคชันของคุณ (Scaffold your app)
ในโฟลเดอร์ว่างใหม่ (ตัวอย่างนี้ใช้ Next.js):

```bash
npx create-next-app@latest my-app
cd my-app
git init
```

### 2. ติดตั้ง Nexus-DevFlow
รันคำสั่งติดตั้งแบบ Non-intrusive ในโฟลเดอร์รากของโปรเจกต์:

```bash
npx -y @jakkrichm/create-nexus-devflow@latest -y
```

ตัวติดตั้งจะวางโฟลเดอร์ Multi-agent skills (`.agents/skills/` และ `.claude/skills/`), สร้าง Workspace โครงสร้าง `devflow/`, และอัปเดตไฟล์ `AGENTS.md` รวมถึง `CLAUDE.md` ให้อัตโนมัติ

### 3. รัน onboard เป็นสิ่งแรก
สั่ง `/onboard` เพื่อตรวจจับ Stack, ตั้งค่าคำสั่งทดสอบ (Test runner), ตรวจสอบ Git conventions และปรับมาตรฐานโค้ดให้ตรงกับโปรเจกต์:

```text
/onboard
```

*(ใน Google Antigravity / Claude Code: สั่ง `/onboard` | ใน OpenAI Codex: สั่ง `$onboard` | ใน Cursor/Copilot: พิมพ์บอก AI ให้รัน onboard)*

### 4. ตรวจสอบการตั้งค่า
ดูไฟล์คอนฟิกที่ระบบสร้างขึ้น:
- `devflow/context/coding-standards.md` — ปรับแต่งมาตรฐานโค้ด, กฎ Lint และ Test Gates
- `devflow/context/ai-interaction.md` — ปรับพฤติกรรมการตอบและการทำงานร่วมกับ AI

หากรู้สึกว่าการตั้งค่ามีปัญหา สามารถสั่ง `/doctor` เพื่อรัน Health check แบบอ่านอย่างเดียวได้ทันที

### 5. วางแผนและบันทึกไอเดีย
บันทึกความต้องการ, User stories หรือแนวคิดเริ่มต้น:
- ใส่ไอเดียระดับสูงลงใน `devflow/ideas.md` หรือใช้ `/idea` เพื่อให้ AI ประเมินความเป็นไปได้
- รัน `/grill` (หรือ `/align`) เพื่อทดสอบสมมติฐานสถาปัตยกรรมและบันทึก Decision Records (`devflow/decisions/`)
- รัน `/discovery` สำหรับการค้นคว้าและสำรวจเชิงลึกหลายรอบ

### 6. สร้างภาพรวมโปรเจกต์ (Overview)
สั่ง `/overview` เพื่อสังเคราะห์ข้อมูลทั้งหมดให้กลายเป็น `devflow/context/project-overview.md` ซึ่งเป็น Source of Truth หลักที่ AI จะอ่านทุกครั้ง:

```text
/overview
```

### 7. ดำเนินการตามวงจรการพัฒนา (Build loop)
เมื่อมี Overview แล้ว สามารถเริ่มพัฒนาฟีเจอร์หรือแก้บั๊กได้ทีละงาน:

```text
/feature -> รีวิวสเปก -> /implement -> /check -> /audit current -> /complete
```

---

### กรณีมี Codebase อยู่แล้ว? (Already have a codebase?)

หากคุณนำ DevFlow ไปใช้กับโปรเจกต์เดิมที่มีโค้ดและฟีเจอร์อยู่แล้ว ให้ใช้ `/adopt` แทน `/onboard`:

```text
/adopt
```

`/adopt` จะสำรวจโครงสร้างโค้ดเดิม, ปกป้องไฟล์ README เดิมของคุณ, ตรวจจับคำสั่ง Test และ CI ที่มีอยู่แล้ว และสร้างเอกสารแผนงานรวมถึงมาตรฐานโค้ดจากระบบจริงที่เป็นอยู่

---

### การอัปเดต DevFlow (Keep DevFlow current)

ตรวจสอบอัปเดตโดยไม่แตะต้องไฟล์:

```bash
npx @jakkrichm/create-nexus-devflow update --check
```

อัปเดตเวอร์ชันเวิร์กโฟลว์อย่างปลอดภัย:

```bash
npx @jakkrichm/create-nexus-devflow update
```

DevFlow จะอัปเดตเฉพาะไฟล์ Skill ภายใต้ `.agents/skills/` และ `.claude/skills/` เท่านั้น โดย **ไม่มีการเขียนทับ** แผนงาน, Living Spec, บริบทใน `devflow/`, ประวัติงาน หรือซอร์สโค้ดของแอปพลิเคชันคุณเด็ดขาด

---

### ตรวจสอบสถานะโปรเจกต์ (Check project status)

ตรวจสอบสถานะและขั้นตอนถัดไปผ่าน CLI ได้ทุกเมื่อ:

```bash
npx @jakkrichm/create-nexus-devflow status
```

หากต้องการนำไปใช้ต่อกับสคริปต์หรือเครื่องมืออื่น สามารถส่งออกเป็น JSON ได้:

```bash
npx @jakkrichm/create-nexus-devflow status --json
```

---

### เปิด Web Dashboard ในเครื่อง (Open the local dashboard)

เปิดใช้งาน Web Dashboard ความเร็วสูงในเครื่องของคุณ:

```bash
npx @jakkrichm/create-nexus-devflow dashboard
# หรือผ่าน package script:
npm run dashboard
```

แดชบอร์ดจะเปิดที่ `http://127.0.0.1:4318` แสดงสถานะ Living Spec, ความคืบหน้าของงาน, แผงควบคุม Multi-Agent Swarm และ Code Graph RAG แบบ Real-time

---

## เครื่องมือและ AI ที่รองรับ (Tool support)

Nexus-DevFlow รองรับ AI Coding Assistants ชั้นนำทุกค่ายผ่าน Native Adapters:

| เครื่องมือ / AI IDE | ตำแหน่ง Adapter และการรองรับ | วิธีการเรียกใช้งาน |
| :--- | :--- | :--- |
| **Google Antigravity** | Native project skills ใน `.agents/skills/` | Slash commands (เช่น `/feature`, `/implement`, `/devflow`) |
| **Claude Code** | Native project skills ใน `.claude/skills/` | Slash commands (เช่น `/feature`, `/implement`, `/devflow`) |
| **OpenAI Codex CLI** | Native project skills ใน `.agents/skills/` | Dollar invocation (เช่น `$feature`, `$implement`, `$devflow`) |
| **Cursor / Copilot** | `AGENTS.md` + โฟลเดอร์ `.agents/skills/` | เรียกชื่อคำสั่งตรงๆ หรือสั่งให้ปฏิบัติตาม `SKILL.md` |
| **OpenCode / Windsurf** | อ่านโฟลเดอร์ Adapter ร่วมกันได้ | เรียกใช้คำสั่ง Skill ได้โดยตรง |
| **Gemini CLI / Aider** | อ่านคำแนะนำผ่าน `AGENTS.md` | สั่งให้ปฏิบัติตามคำแนะนำใน `SKILL.md` |

---

## วงจรการทำงานร่วมกับ AI (The AI workflow)

Nexus-DevFlow จัดระเบียบการพัฒนาด้วย AI ให้เป็นวงจรวิศวกรรมที่ทำซ้ำได้ มีจุดตรวจโดยมนุษย์ (Human Review Gates) และมีประวัติบันทึกถาวร

### วงจรมาตรฐานสำหรับฟีเจอร์ (Standard Feature Loop)

```text
/feature ──▶ รีวิวสเปก ──▶ /implement ──▶ /check ──▶ /audit current ──▶ /complete
```

- **`/feature`**: ออกรหัสงาน (`xxx-slug`), กำหนดขอบเขต, ออกแบบ Data Contracts และสร้าง Single Living Spec (`devflow/context/current-feature.md`)
- **`/implement`**: พัฒนางานย่อยทีละข้อตามวินัย TDD (`[TDD-Red]`, `[TDD-Green]`, `[TDD-Refactor]`) พร้อมแสดงหลักฐาน Diff
- **`/check`**: ตรวจสอบคุณภาพรอบด้านโดย Senior QA ผ่าน Verification Matrix (Typecheck, Lint, Unit tests, การรันจริง)
- **`/audit current`**: ตรวจสอบความเปลี่ยนแปลงบน Git Branch ทั้งเรื่องความปลอดภัย, Performance และมาตรฐานโค้ด พร้อมบันทึกลง `findings.md`
- **`/complete`**: ตรวจสอบความปลอดภัยรอบสุดท้าย, บันทึก Release Digest, ย้ายสเปกไปเก็บใน `devflow/history/features/` และทำ Squash-Merge เมื่อได้รับอนุญาต

---

### วงจรการแก้บั๊ก (The Fix Loop)

สำหรับบั๊กที่เกิดขึ้นกะทันหันหรือการปรับปรุงแก้ไขขนาดเล็ก:

```text
/fix "รายละเอียดปัญหา" ──▶ รีวิวสเปก ──▶ /implement ──▶ /check ──▶ /complete
```

---

### วงจรการวิเคราะห์ปัญหา (The Debug Loop)

เมื่อไม่แน่ใจในสาเหตุที่แท้จริง สามารถตรวจหาสาเหตุโดยไม่แตะต้องไฟล์ซอร์สโค้ด:

```text
/debug "อาการที่พังหรือข้อผิดพลาด" ──▶ ดูหลักฐาน ──▶ /fix "สาเหตุที่ยืนยันแล้ว" ──▶ /implement
```

---

### วงจรการย้อนคืนฟีเจอร์อย่างปลอดภัย (The Rollback Loop)

เมื่อจำเป็นต้องถอดฟีเจอร์ที่เคยส่งมอบไปแล้วออก โดยยังคงเก็บประวัติการทำงานไว้ครบถ้วน:

```text
/rollback 054 ──▶ ตรวจสอบความเสี่ยงและสเปก ──▶ /implement ──▶ /check ──▶ /complete
```

ระบบจะจับคู่กับสเปกที่ถูกเก็บถาวรและ Commit ต้นทาง, ประเมินความเสี่ยงต่อโค้ดส่วนอื่น และ Revert เฉพาะส่วนของ Product โดยไม่ลบประวัติใน Git

---

## ตัวอย่างการทำงานจริง (See it in action)

DevFlow ทำให้ทุกขั้นตอนการส่งต่องานมีความชัดเจนและโปร่งใส:

```text
ผู้ใช้: เริ่มทำฟีเจอร์ถัดไป: ระบบยืนยันตัวตนผู้ใช้งาน (User authentication)
AI:   สร้าง Single Living Spec ที่ devflow/context/current-feature.md (001-user-authentication) เรียบร้อย
      กำหนด Acceptance Criteria 3 ข้อ และงาน TDD 4 ขั้นตอน หยุดรอการรีวิวจากเจ้านายครับ

ผู้ใช้: สเปกถูกต้องแล้ว ลงมือทำข้อ 1 ได้เลย
AI:   [TDD-Red] เพิ่ม Unit test ที่ล้มเหลวใน auth.test.ts
      [TDD-Green] สร้าง TokenValidator service จนผ่านการทดสอบ
      [TDD-Refactor] ปรับปรุงโค้ดแยก jwt verify helper ให้สะอาดขึ้น
      แนบ Diff และ Test logs ให้ตรวจสอบแล้วครับ

ผู้ใช้: รันการตรวจสอบ (/check)
AI:   ตรวจสอบ Multi-Lane Matrix เรียบร้อย: Typecheck ✔, Lint ✔, Vitest (14 passing) ✔
      บันทึกหลักฐานเชิงประจักษ์ลงใน Living Spec แล้วครับ

ผู้ใช้: ตรวจสอบคุณภาพโค้ดของฟีเจอร์นี้ (/audit current)
AI:   ตรวจสอบ Branch Delta เรียบร้อย: Quality ✔, Security ✔ (0 ช่องโหว่, 0 Secret leaks), Tests ✔
      สมุดบันทึก Findings สะอาด (0 Open blockers)

ผู้ใช้: ส่งมอบและปิดงานได้เลย (/complete)
AI:   บันทึก Release Digest ลงใน Living Spec
      ย้ายสเปกไปเก็บถาวรที่ devflow/history/features/001-user-authentication.md
      อัปเดตสมุดบันทึกหลัก devflow/history/HISTORY.md เรียบร้อย
      พร้อมทำ Squash-Merge บรันช์ 'feature/001-user-authentication' เข้าสู่ main ยืนยันดำเนินการหรือไม่ครับ? [Y/n]
```

---

## แผนภาพกระบวนการทำงานและผังสถาปัตยกรรม (Visual Overview & Interactive Maps)

สำรวจแผนผังสถาปัตยกรรมระบบและวงจรชีวิต Living Spec แบบ Interactive ที่สร้างขึ้นด้วย **Archify**:

- 🌐 **[แผนผังสถาปัตยกรรมระบบ Nexus-DevFlow (Interactive HTML)](docs/diagrams/nexus-devflow-architecture.html)** — ดูความเชื่อมโยงของ 3 เสาหลัก (3-Pillars), การผสาน Multi-Agent Adapters และ QA Gates
- ⚡ **[วงจรชีวิตและ State Machine ของ Living Spec (Interactive HTML)](docs/diagrams/nexus-devflow-lifecycle.html)** — แสดงขั้นตอนการส่งมอบ 4 ขั้นตอน (`/feature` ➔ `/implement` ➔ `/check` ➔ `/complete`), จุดตรวจ Blocker และการย้อนคืนระบบ

![Nexus-DevFlow Workflow](assets/nexus-devflow-workflow.png)

1. **Pre-Flight Discovery**: สำรวจไอเดีย (`/idea`), วิเคราะห์สถาปัตยกรรม (`/grill`) และค้นคว้าเชิงลึก (`/discovery`)
2. **Context Setup**: รัน `/onboard` (หรือ `/adopt`) ตามด้วย `/overview` เพื่อสร้าง Source of Truth หลัก
3. **Delivery Loop**: เริ่มงานด้วย `/feature` หรือ `/fix`, เขียนโค้ดด้วย `/implement`, ตรวจสอบด้วย `/check`, Audit ด้วย `/audit` และปิดงานด้วย `/complete`
4. **Permanent Archive**: สเปกและผลลัพธ์ที่เสร็จสมบูรณ์จะถูกจัดเก็บถาวรใน `devflow/history/` และ `devflow/decisions/`

---

## สถาปัตยกรรม 3 เสาหลัก (The 3-Pillars Workspace Architecture)

DevFlow จัดระเบียบบริบททั้งหมดของโปรเจกต์ออกเป็น 3 เสาหลักอย่างสะอาด ชัดเจน ได้แก่ **อนาคต**, **ปัจจุบัน**, และ **อดีต**:

```text
devflow/
│
├── 🔮 ideas.md                 # [1. อนาคต / Future] กล่องบันทึกไอเดียพร้อม AI Scoring (Idea Inbox)
│
├── ⚡ context/                  # [2. ปัจจุบัน / Present] ข้อมูลแกนกลางของระบบ & งานที่กำลังทำ
│   ├── project-overview.md     # Source of Truth สถาปัตยกรรมและ Tech Stack
│   ├── coding-standards.md     # มาตรฐานโค้ด, กฎ Strict TDD และ Test Gates
│   ├── ai-interaction.md       # กฎการทำงานร่วมกับ AI และการตอบภาษาไทย
│   ├── findings.md             # สมุดบันทึก Findings และจุดตรวจคุณภาพ (P0-P3)
│   ├── current-stage.md        # ตัวชี้สถานะของรอบงานปัจจุบัน
│   └── current-feature.md      # The Single Living Spec (สเปกมีชีวิตของงานปัจจุบัน / stub เมื่อว่าง)
│
├── 🏛️ decisions/                # คลังบันทึกการตัดสินใจสถาปัตยกรรม (ADRs: ADR-xxx-slug.md)
│
├── 📦 history/                  # [3. อดีต / Past] คลังประวัติการส่งมอบแยกตามหมวดหมู่ถาวร
│   ├── features/               # ประวัติฟีเจอร์, สถาปัตยกรรม, เครื่องมือ (xxx-slug.md)
│   ├── fixes/                  # ประวัติการแก้บั๊ก, Hotfix, Security patch (xxx-slug.md)
│   ├── rollbacks/              # ประวัติการย้อนคืนฟีเจอร์อย่างปลอดภัย (YYYY-MM-DD-xxx-slug.md)
│   └── HISTORY.md              # สมุดบันทึกประวัติการส่งมอบหลัก (Master Ledger)
│
└── 🔍 discoveries/              # บันทึกการสำรวจก่อนเริ่มงาน (DISC-YYYYMMDD-NNN-slug.md)
```

### จุดเด่นของสถาปัตยกรรม 3 เสาหลัก:
- **ประหยัด Token สูงสุด**: AI โหลดเฉพาะบริบทที่กำลังใช้งานใน `devflow/context/` ช่วยลดการใช้ Token ได้ถึง 80% ต่อครั้ง
- **ประวัติการทำงานถาวร**: งานที่เสร็จแล้วถูกจัดเก็บพร้อมข้อมูล Commit, บันทึกการทดสอบ และ Retrospective อย่างครบถ้วน
- **ทนทานต่อการรีเซ็ต Context**: แม้ Context Window ของ AI จะถูกล้าง งานที่ทำค้างอยู่สามารถโหลดกลับมาทำต่อได้ทันทีจาก `current-feature.md`

---

## โมเดลสเปกมีชีวิต (The Single Living Spec Model)

ทุกงานพัฒนาจะขับเคลื่อนผ่านไฟล์ `devflow/context/current-feature.md` ซึ่งแบ่งออกเป็น **6 ส่วนมาตรฐาน**:

1. **🎯 1. Define & Boundaries**: ปัญหาที่ต้องการแก้, ทางออกที่นำเสนอ, ขอบเขตของงาน และสิ่งที่ห้ามพังเด็ดขาด
2. **📐 2. Technical Spec & Contracts**: Data Contracts, API Schemas และ Acceptance Criteria ที่ทดสอบได้ (AC-1..AC-N)
3. **📋 3. Execution Plan & TDD Checklist**: รายการงานย่อยที่ระบุขั้นตอน `[TDD-Red]`, `[TDD-Green]`, และ `[TDD-Refactor]` ชัดเจน
4. **⚡ 4. Implementation Log & Evidence**: บันทึกการลงมือเขียนโค้ดและหลักฐาน Diff ในแต่ละขั้นตอน
5. **🧪 5. Multi-Lane Verification Matrix**: ตารางบันทึกผลการทดสอบเชิงประจักษ์, ข้อมูล Benchmark และผลตรวจระบบจริง
6. **📦 6. Release Digest & Retrospective**: บทสรุปการส่งมอบ, การตัดสินใจสถาปัตยกรรมสำคัญ และบทเรียนที่ได้รับ

---

## ชุดเครื่องมือ Pre-Flight Discovery & Architectural Alignment

ก่อนที่จะเริ่มลงมือเขียนโค้ดสำหรับงานที่มีความซับซ้อน สามารถใช้ Companion Skills ในการคิด วิเคราะห์ และจัดโครงสร้างล่วงหน้า:

```text
/idea (บันทึกไอเดีย) ──▶ /grill (เจาะลึก ADR) ──▶ /discovery (สำรวจระบบ) ──▶ /feature (เริ่มส่งมอบ)
```

- **`/idea`**: บันทึกไอเดียลงใน `devflow/ideas.md` พร้อมระบบ AI ประเมิน Feasibility, Effort, และ Business Value อัตโนมัติ
- **`/grill`** (หรือ **`/align`**): Socratic Alignment & Domain Modeling — ตั้งคำถามเจาะลึกเพื่อทดสอบสมมติฐาน, สกัดศัพท์เฉพาะทางลง `devflow/context/glossary.md`, และสร้าง Architecture Decision Records (`devflow/decisions/ADR-xxx.md`)
- **`/brainstorm`**: ระดมสมองแบบ Divergent และ Convergent เพื่อสร้าง 2–3 ทางเลือกพร้อมตารางเปรียบเทียบข้อดีข้อเสีย (Trade-offs)
- **`/discovery`**: การสำรวจเชิงลึกเพื่อวาง Roadmap หรือศึกษาความเป็นไปได้ก่อนเปิดงาน (`devflow/discoveries/DISC-xxx.md`)

---

## ไฟล์และอาร์ติแฟกต์ที่ระบบสร้างขึ้น (What gets generated)

| ไฟล์ / ตำแหน่ง | สร้างโดยคำสั่ง | หน้าที่และคำอธิบาย |
| :--- | :--- | :--- |
| `devflow/context/project-overview.md` | `/overview` | ข้อมูลแกนกลางของระบบ (Source of Truth) ควบคุมขนาดไม่เกิน 20,000 bytes |
| `devflow/context/{xxx-slug}/spec.md` | `/feature`, `/fix`, `/rollback` | Task-Isolated Living Spec สำหรับงานที่กำลังดำเนินการอยู่ในปัจจุบัน |
| `devflow/context/{xxx-slug}/findings.md` | `/audit` | สมุดบันทึกคุณภาพ, ความปลอดภัย และผลการตรวจโค้ดของ Task ปัจจุบัน |
| `devflow/context/{xxx-slug}/stage.md` | Stage Skills | ตัวชี้สถานะบอกว่างานปัจจุบันอยู่ในขั้นตอนใด (`implement`, `check`, `complete`) |
| `devflow/decisions/ADR-xxx.md` | `/grill` | บันทึกการตัดสินใจสถาปัตยกรรม (ADR) ระบุบริบท, ทางเลือก และผลกระทบ |
| `devflow/discoveries/DISC-xxx.md` | `/discovery` | เอกสารผลการสำรวจและศึกษาความเป็นไปได้ก่อนเปิดงานจริง |
| `devflow/history/features/xxx.md` | `/complete` | สเปกฟีเจอร์ที่ทำเสร็จแล้ว พร้อมบันทึกการทำงานและหลักฐานผลการทดสอบ |
| `devflow/history/fixes/xxx.md` | `/complete` | สเปกการแก้บั๊กที่ทำเสร็จแล้ว พร้อมหลักฐานการทดสอบป้องกัน Regression |
| `devflow/history/rollbacks/xxx.md` | `/complete` | บันทึกการย้อนคืนฟีเจอร์ พร้อมการประเมินความเสี่ยงต่อระบบส่วนอื่น |
| `devflow/history/HISTORY.md` | `/complete` | ตารางสรุปประวัติการส่งมอบงานและ Milestone ทั้งหมดของโปรเจกต์ |

---

## คู่มือการใช้งานเวิร์กโฟลว์ (Using the workflow)

### ขั้นตอนการส่งมอบงานมาตรฐาน
1. **ดูสรุปและสร้างสเปก**: สั่ง `/brief` เพื่อดูสรุปฟีเจอร์ถัดไป หรือสั่ง `/feature "ชื่อฟีเจอร์"` เพื่อสร้าง Task-Isolated Living Spec ใน `devflow/context/{xxx-slug}/spec.md`
2. **รีวิวสเปก**: ตรวจสอบขอบเขต, Acceptance Criteria และขั้นตอนงาน TDD ก่อนอนุมัติให้เขียนโค้ด
3. **ลงมือเขียนโค้ดตามสเปก**: สั่ง `/implement` โดย AI จะทำทีละข้อภายใต้วินัย Strict TDD พร้อมจังหวะการรีวิวตามโหมดที่กำหนดใน config (เช่น Efficient หรือ Guided)
4. **ตรวจสอบผลงาน**: สั่ง `/check` เพื่อให้ Senior QA รัน Verification Matrix บนระบบจริง
5. **คู่มือทดสอบด้วยตนเอง**: สั่ง `/try` เพื่อดูขั้นตอนการทดสอบด้วยมือ (URL, การคลิก, ผลลัพธ์ที่ถูกต้อง)
6. **Audit คุณภาพโค้ด**: สั่ง `/audit current` เพื่อตรวจสอบความปลอดภัย, Performance และมาตรฐานโค้ดบน Branch
7. **ส่งมอบและปิดงาน**: สั่ง `/complete` เพื่อตรวจความปลอดภัย, บันทึก Release Digest, เก็บสเปกเข้าประวัติ และทำ Squash-Merge

---

### สไตล์การทำงานและจังหวะการรีวิว (Implementation Style & Review Cadence)

Nexus-DevFlow ช่วยให้คุณกำหนดจังหวะการทำงานและการรีวิวโค้ดของ AI ได้อย่างยืดหยุ่นใน `devflow/config.json`:

```json
{
  "workflow": {
    "stepReview": "feature",
    "checkpointCommits": "disabled"
  }
}
```

คำสั่ง `/onboard` มีตัวเลือกสำเร็จรูป (Presets) 3 รูปแบบ:
- ⚡ **Efficient (Recommended - ค่าเริ่มต้น)**: AI ดำเนินการตามสเปกอย่างต่อเนื่องจนเสร็จครบทั้งฟีเจอร์ แล้วสรุป Review Packet ให้ตรวจทีเดียว และไม่มี Checkpoint commit ย่อยๆ กวนใจ ช่วยลดความล้าในการรีวิว (Review Fatigue) และประหยัด Token สูงสุด
- 🧭 **Guided**: AI หยุดขอการอนุมัติหลังจบทุกๆ สเต็ปย่อย (`stepReview: "every"`) และเสนอทำ Git Checkpoint Commit (`checkpointCommits: "enabled"`) เหมาะสำหรับการสอนงาน, การจับคู่เขียนโค้ด (Close Pairing), หรืองานสถาปัตยกรรมที่มีความเสี่ยงสูง
- 🛠️ **Custom**: แยกปรับแต่งความถี่การรีวิวและการสร้าง Checkpoint commit ได้อย่างอิสระ

#### 🛡️ การควบคุมขนาด Overview ไม่เกิน 20KB (Overview Compactness Guard)
เอกสารสรุปโครงการ `devflow/context/project-overview.md` จะถูกควบคุมขนาดให้อยู่ต่ำกว่า 20,000 bytes (~4,000–5,000 tokens) เสมอ เพื่อไม่ให้สิ้นเปลือง Token Window:
- คำสั่ง `/doctor` จะรายงานขนาดไบต์จริง และแจ้งเตือนสถานะ `oversized` หากมีขนาดเกิน
- คำสั่ง `/feature` มีระบบ Hard-Stop ป้องกันการดึง Overview ที่มีขนาดเกิน 20KB และมี Directive สั่งให้ AI Reuse Context เดิมที่มีอยู่แล้วในเซสชันโดยไม่อ่านซ้ำผ่าน Tool

#### 📌 Planning Baseline Commit
เมื่อรันคำสั่ง `/overview` ในโปรเจกต์ใหม่ ระบบจะมี Step 4 แนะนำให้สร้าง Git Commit เริ่มต้น:
```bash
git commit -m "chore: establish DevFlow project baseline"
```
เพื่อแยกไฟล์ Setup, Adapters, และ Planning Documents ออกจาก Feature Commit แรก ช่วยให้ประวัติ Git สะอาดและตรวจสอบย้อนหลังได้ง่าย


---

### การแก้บั๊ก (Fixes)

ใช้คำสั่ง `/fix` สำหรับการแก้บั๊กหรือ Patch ด่วน:

```text
/fix "แก้ไขปัญหา JWT token หมดอายุใน auth middleware"
```

AI จะสร้าง Fix Spec พร้อมขั้นตอนการจำลองปัญหา (Reproduction), ดำเนินการแก้ไขด้วย TDD, ยืนยันผล และจัดเก็บประวัติลงใน `devflow/history/fixes/`

---

### การย้อนคืนฟีเจอร์อย่างปลอดภัย (Rollbacks)

ใช้คำสั่ง `/rollback` เมื่อต้องการถอดฟีเจอร์ที่ส่งมอบไปแล้วออกอย่างปลอดภัย:

```text
/rollback 054 เนื่องจากพบปัญหา Snapshot latency สูงผิดปกติ
```

ระบบจะค้นหาสเปกและ Git Commit ต้นทาง, ตรวจสอบความเสี่ยงต่อฟีเจอร์อื่น และทำ Revert เฉพาะส่วนที่เกี่ยวข้องโดยไม่ทำลายประวัติใน Git

---

## ตารางอ้างอิงคำสั่งทั้งหมด (Command reference)

Nexus-DevFlow แจก **31 bundled Core Skills** ตาม canonical `core_skills`
inventory ใน `agent-bundle.manifest.json` ส่วน Local หรือ Personal Skills ที่เพิ่ม
เฉพาะ workspace จะไม่ถูกนับรวมเป็น Core และไม่ติดไปกับ package ที่เผยแพร่
จนกว่าจะได้รับการ promote อย่างชัดเจน

| ทักษะ (Skill) | การเรียกใช้งาน (Invocation) | หมวดหมู่ | หน้าที่และคำอธิบาย |
| :--- | :--- | :--- | :--- |
| **adopt** | `/adopt` / `$adopt` | Setup | นำ DevFlow ไปติดตั้งในโปรเจกต์เดิมที่มีโค้ดอยู่แล้ว |
| **audit** | `/audit` / `$audit` | Quality | ตรวจสอบคุณภาพโค้ด, ความปลอดภัย, ประสิทธิภาพ และชุดทดสอบ |
| **autopilot** | `/autopilot` / `$autopilot` | Delivery | โหมดส่งมอบงานแบบรอบเดียวจบ พร้อมตรวจสอบและแก้ปัญหาในตัว |
| **brainstorm** | `/brainstorm` | Companion | ระดมสมองและเปรียบเทียบข้อดีข้อเสียของทางเลือกสถาปัตยกรรม |
| **brief** | `/brief` / `$brief` | Planning | สรุปข้อมูลฟีเจอร์ถัดไปแบบอ่านอย่างเดียวก่อนเริ่มเขียนสเปก |
| **browser-tests** | `/browser-tests` / `$browser-tests` | Setup | ติดตั้งและกำหนดค่า Playwright สำหรับ browser testing พร้อมเชื่อมต่อ MCP browseros-neo |
| **bughunter** | `/bughunter` / `$bughunter` | Security | ค้นหาช่องโหว่ความปลอดภัยเชิงรุก 83 รูปแบบ พร้อม CVE Payloads และรายงานตัวอย่าง |
| **check** | `/check` / `$check` | QA | ตรวจแบบ Dual-Axis: ความตรงตามสเปกจากหลักฐานจริง และมาตรฐาน/สถาปัตยกรรม/Quality Gates |
| **ci** | `/ci` / `$ci` | DevOps | ตั้งค่าคำสั่ง Verify และสร้าง GitHub Actions Workflow สำหรับ CI |
| **complete** | `/complete` / `$complete` | Delivery | ตรวจความปลอดภัยรอบสุดท้าย, บันทึก Release Digest, จัดเก็บประวัติ และ Squash-Merge |
| **continuous** | `/continuous` / `$continuous` | Delivery | โหมดวนลูปส่งมอบงานหลายฟีเจอร์อัตโนมัติในเครื่อง Local พร้อม Quality Gates |
| **convert-any-to-md** | `/convert-any-to-md` | Utility | แปลงไฟล์ PDF, XLSX, DOCX, CSV, Logs ให้เป็น Markdown ใน `devflow/reference/` |
| **debug** | `/debug` / `$debug` | Diagnostics | วินิจฉัยเชิงวิทยาศาสตร์ 6 ระยะด้วย Red-capable feedback loop โดยไม่แก้ซอร์สโค้ด |
| **devflow** | `/devflow` / `$devflow` | Router | ตัวตรวจสถานะหลัก, เราเตอร์นำทางขั้นตอน และคู่มือช่วยทำงาน |
| **discovery** | `/discovery` / `$discovery` | Companion | สำรวจและค้นคว้าความต้องการของระบบเชิงลึกก่อนเริ่มพัฒนา |
| **doctor** | `/doctor` / `$doctor` | Health | ตรวจสุขภาพ Workspace, Adapters, และรายงานขนาดไบต์ Overview (เตือนเมื่อ >= 20KB) |
| **feature** | `/feature` / `$feature` | Delivery | สร้าง Living Spec ใน `devflow/context/{xxx-slug}/spec.md` พร้อม 20KB Overview Guard |
| **fix** | `/fix` / `$fix` | Delivery | กำหนดสเปกและขั้นตอนการแก้บั๊กหรือ Patch ขนาดเล็ก |
| **grill** | `/grill` / `/align` | Companion | Socratic Alignment, สกัดคำศัพท์เฉพาะ และสร้างเอกสาร ADR |
| **idea** | `/idea` | Companion | บันทึกไอเดียลงใน `devflow/ideas.md` พร้อม AI Scoring |
| **implement** | `/implement` / `$implement` | Delivery | ลงมือเขียนโค้ดตามสเปกทีละขั้นตอนด้วยวินัย Strict TDD ตาม Review Cadence |
| **onboard** | `/onboard` / `$onboard` | Setup | ตั้งค่าเริ่มต้นโปรเจกต์ใหม่ พร้อมเลือกสไตล์การพัฒนา (Efficient / Guided / Custom) |
| **overview** | `/overview` / `$overview` | Planning | สังเคราะห์ `project-overview.md` ไม่เกิน 20KB พร้อมเสนอทำ Planning Baseline Commit |
| **prototype** | `/prototype` / `$prototype` | UI/UX | สร้าง Mockup แบบ Static HTML/CSS ในโฟลเดอร์ `prototypes/` |
| **release** | `/release` / `$release` | DevOps | ตรวจสอบความพร้อมและสร้างไฟล์คอนฟิกสำหรับ Render หรือ Vercel |
| **report-html** | `/report-html` | Reporting | สร้างรายงานสรุปผลงานแบบ Standalone HTML Dashboard ตามสั่ง |
| **rollback** | `/rollback` / `$rollback` | Delivery | วางแผนและย้อนคืนฟีเจอร์ที่ส่งมอบไปแล้วอย่างปลอดภัย |
| **setup-tests** | `/setup-tests` / `$setup-tests` | Setup | ติดตั้งและตั้งค่า Unit Test Runner ให้ตรงกับ Stack ของโปรเจกต์ |
| **status** | `/status` / `$status` | Monitoring | แสดงสรุปความคืบหน้าของงานปัจจุบัน และข้อแนะนำขั้นตอนถัดไป |
| **test** | `/test` | Testing | รันชุดทดสอบ, สร้างเคสทดสอบที่ขาดหาย และวิเคราะห์ Coverage |
| **try** | `/try` / `$try` | QA | สร้างคู่มือสำหรับมนุษย์ในการทดสอบระบบด้วยตนเองแบบ Step-by-step |

---

### โหมดออโต้ไพลอต (Autopilot)

`/autopilot` เป็นโหมดการทำงานแบบ Bounded Pass สำหรับการส่งมอบงานรอบเดียว:
- ดึงงานปัจจุบันหรือเริ่มงานจากสเปกที่มี
- ร่าง Living Spec ให้อัตโนมัติหากยังไม่มี
- เขียนโค้ดตามขั้นตอน TDD และทำ Checkpoint Commit บน Branch
- รันการตรวจสอบและสั่ง `/audit current` อัตโนมัติ
- แก้ไขปัญหา P0/P1 ที่พบในขอบเขตงานและตรวจซ้ำ
- **หยุดรอการอนุมัติก่อนทำ `/complete`, Merge, Push, Deploy หรือคำสั่งที่มีความเสี่ยงเสมอ**

---

## การตรวจสอบอัตโนมัติบน GitHub (Automatic GitHub checks)

ตั้งค่าระบบ CI เพื่อให้ทั้งทีมและ AI มีมาตรฐานการตรวจสอบเดียวกัน:

```text
/ci
```

1. **Verify Recipe**: ตรวจจับคำสั่งใน Stack (Typecheck -> Test -> Build) และกำหนดเป็นคำสั่งเดียวใน `AGENTS.md` (เช่น `npm run verify`)
2. **GitHub Actions Worker**: สร้างไฟล์ `.github/workflows/verify.yml` ทำงานบน Pull Request และ Push บน Branch หลัก
3. **Zero Magic**: ใช้งานคำสั่งเดิมของโปรเจกต์ ไม่มีการติดตั้ง Dependency หนักๆ เพิ่มเติม

---

## การทดสอบและวินัย Strict TDD (Testing & Strict TDD Discipline)

การพัฒนาใน DevFlow ขับเคลื่อนด้วย **วินัย Strict TDD**:

```text
[TDD-Red] เขียน Test ที่ล้มเหลว ──▶ [TDD-Green] เขียนโค้ดขั้นต่ำให้ผ่าน ──▶ [TDD-Refactor] ปรับโค้ดให้สะอาด
```

ตั้งค่าระบบ Unit Testing ให้ตรงกับ Tech Stack ของโปรเจกต์:

```text
/setup-tests
```

ระบบจะเลือก Test Runner ที่เหมาะสม (Vitest, Jest, pytest, go test), เพิ่มเคสตัวอย่างเริ่มต้น และอัปเดตคำสั่งใน `AGENTS.md` ให้ทันที

การรีวิวสถาปัตยกรรมยึดหลัก **Deep Modules**: ทำ public interface ให้เล็ก,
ซ่อนความซับซ้อนไว้หลัง seam ที่เสถียร และหลีกเลี่ยงการกระจายการแก้ไขหนึ่งเรื่องไปหลาย caller
โดย `/check` จะตรวจแกนมาตรฐานนี้แยกจากแกนความตรงตาม Living Spec อย่างอิสระ

---

## การตรวจสอบคุณภาพโค้ดและสมุดบันทึก Findings (Code quality audits & Findings ledger)

`/audit` ทำหน้าที่ตรวจเช็กสุขภาพโค้ด, โครงสร้างสถาปัตยกรรม, ความปลอดภัย และคุณภาพของชุดทดสอบ:

```text
/audit current                  # ตรวจสอบทุกมิติบน Feature Branch ปัจจุบัน
/audit quality changed          # ตรวจสอบมาตรฐานและความสะอาดของโค้ดที่เพิ่งแก้
/audit security current         # ตรวจสอบความปลอดภัย, การตรวจสอบสิทธิ์ และ Secret leaks
/audit performance src/api      # ตรวจสอบประสิทธิภาพและจุดที่อาจเกิด Memory leaks
/audit tests src/auth           # ตรวจสอบ Coverage และเคสทดสอบ Edge cases
/audit full                     # ตรวจสอบโค้ดทั้งโปรเจกต์
```

### สมุดบันทึก Findings (`devflow/context/findings.md`)
ทุกข้อบกพร่องที่ยืนยันแล้วจะได้รับรหัสประจำตัวถาวร (`F-01`), ระดับความรุนแรง (P0-P3) และสถานะ:

| สถานะ (Status) | ความหมาย (Meaning) |
| :--- | :--- |
| `open` | พบปัญหาและยืนยันแล้ว กำลัรอการแก้ไข |
| `fixed` | แก้ไขโค้ดแล้ว กำลังรอการตรวจซ้ำ |
| `closed` | ตรวจสอบซ้ำแล้วว่าปัญหาได้รับการแก้ไขอย่างสมบูรณ์ |
| `accepted` | ได้รับการยกเว้นโดยมนุษย์พร้อมระบุเหตุผลอย่างเป็นทางการ |
| `invalid` | ตรวจสอบอย่างละเอียดแล้วพบว่าไม่ใช่ปัญหาจริง |

> [!IMPORTANT]
> **Blocker Gate**: คำสั่ง `/complete` จะ **ปฏิเสธการ Merge** ทันที หากยังมีปัญหา P0 หรือ P1 อยู่ในสถานะ `open` หรือ `fixed`

---

## คู่มือการทดสอบด้วยตนเอง (Manual try guides)

รันคำสั่ง `/try` เพื่อสร้างคู่มือทดสอบระบบสำหรับมนุษย์:

```text
/try
```

ระบบจะอ่าน Living Spec ปัจจุบัน และสรุปข้อมูลให้:
- คำสั่งเริ่ม Server และ URL ในเครื่อง
- ลำดับการคลิกและเส้นทางการทดสอบ
- ผลลัพธ์หน้าจอและการทำงานที่ถูกต้อง
- จุดสังเกตที่บ่งบอกว่าระบบทำงานผิดพลาด

---

## Enterprise Web Dashboard และ Real-Time Studio

เปิดใช้งาน Web Dashboard ความเร็วสูงในเครื่องของคุณ:

```bash
npm run dashboard
# หรือผ่าน CLI:
npx @jakkrichm/create-nexus-devflow dashboard [--port 4318]
```

```text
+----------------------------------------------------------------------------------------------------+
|  nexus-devflow                                                                                     |
|  D:\Projects\devtools\nexus-devflow                                                                |
|                                                                                                    |
|  [v2.X.X]  [HEALTH OK]  [✔ GATE PASSED]  [✔ IN SYNC]  [TRACK FAST]                                 |
+----------------------------------------------------------------------------------------------------+
|  [🔮 Pre-Flight Discovery]   [⚡ Living Spec · 4 steps]   [🤖 Multi-Agent Swarm]   [🗺️ Code Graph]   |
+----------------------------------------------------------------------------------------------------+
|  [ Card: Current Work ]        |  [ Card: Git & Branch ]                                           |
+--------------------------------+-------------------------------------------------------------------+
|  [ Card: Findings Ledger ]     |  [ Card: Completion & Gate ]                                      |
+----------------------------------------------------------------------------------------------------+
```

### จุดเด่นบนแดชบอร์ด:
- ⚡ **0ms First Paint**: Server-Side Hydration (`window.__INITIAL_SNAPSHOT__`) แสดงผลทันทีโดยไม่ต้องรอ API โหลดข้อมูล
- ⚡ **Single-Flight Git Cache**: รวมการอ่าน Git หลายตัวพร้อมกัน ทำให้เปิดติดเร็วใน **< 120 ms**
- 🤖 **Multi-Agent Swarm Visualizer**: แผงมอนิเตอร์ AI 4 บทบาทแบบ Real-time:
  - 👑 **Lead Architect**: ผู้วางขอบเขตสถาปัตยกรรมและ Data Contracts
  - 👨‍💻 **Core Coder**: ผู้เขียนโค้ดที่สะอาดและ Type-Safe ตามมาตรฐาน
  - 🕵️ **QA Verifier**: ผู้ทดสอบอิสระ (Red-Team) ที่เขียน Test ดัก Edge Cases
  - 🛡️ **Security Auditor**: ผู้สแกนหาช่องโหว่ความปลอดภัยและ Secret Leaks
- 🗺️ **Semantic Code Graph RAG**: วิเคราะห์ Dependency Graph และคำนวณผลกระทบการแก้ไขโค้ด (Blast Radius)
- 📋 **Live Kanban Studio**: แผงควบคุม Living Spec และความคืบหน้าของงานแบบ Real-time

---

## ชุดคำสั่งจัดการผ่าน CLI (CLI Management Commands)

Nexus-DevFlow มีชุดคำสั่ง CLI ครบวงจรสำหรับจัดการ Workspace:

```bash
# เปิด Web Dashboard
npx @jakkrichm/create-nexus-devflow dashboard [--port 4318]

# ตรวจสอบ Quality Gatekeeper และติดตั้ง Git Pre-commit Hooks
npx @jakkrichm/create-nexus-devflow check-gate [--strict]
npx @jakkrichm/create-nexus-devflow hook install pre-commit

# Model Context Protocol (MCP) Server Hub (12 Tools มาตรฐาน)
npx @jakkrichm/create-nexus-devflow mcp

# Just-In-Time (JIT) Dynamic Context Slicing (ตัดเฉพาะ Context ที่จำเป็น)
npx @jakkrichm/create-nexus-devflow slice --stage implement

# ตรวจจับและกู้คืนความคลาดเคลื่อนของไฟล์ใน Git (Git Drift Reconciler)
npx @jakkrichm/create-nexus-devflow drift
npx @jakkrichm/create-nexus-devflow reconcile

# ดูแผนผัง Multi-Agent Swarm และ Code Graph
npx @jakkrichm/create-nexus-devflow swarm
npx @jakkrichm/create-nexus-devflow graph --file src/index.ts

# สร้างรายงานสรุปผลงานแบบ Standalone HTML Dashboard
npm run report:html -- 054-optimize-dashboard-snapshot-latency

# ตรวจสอบและอัปเดตเวอร์ชัน DevFlow พร้อมระบบ Backup ปลอดภัย
npx @jakkrichm/create-nexus-devflow update [--check]
```

---

## สกิลเสริมและส่วนขยายแนะนำ (Recommended Third-Party Skills & Extensions)

Nexus-DevFlow ติดตั้งมาพร้อมกับ **31 Core Skills** มาตรฐาน คุณสามารถติดตั้งสกิลเฉพาะทางจาก Community เพิ่มเติมได้ง่ายๆ ด้วยคำสั่ง `nexus-devflow skill add`:

> [!TIP]
> **🚀 ติดตั้ง Recommended Skills ทั้ง 8 สกิลในคำสั่งเดียว**:
> ```bash
> npx @jakkrichm/create-nexus-devflow skill add --recommended
> ```
> **🔄 อัปเดต Recommended Skills ทั้งหมดให้เป็นเวอร์ชันล่าสุดจาก Upstream Git**:
> ```bash
> npx @jakkrichm/create-nexus-devflow skill update --recommended
> ```

| สกิล (Skill) | หมวดหมู่ | หน้าที่และความสามารถ | คำสั่งติดตั้ง |
| :--- | :--- | :--- | :--- |
| **archify** | Visual Architecture | แผนผังสถาปัตยกรรมระบบ Interactive HTML (สลับธีม Dark/Light, มี Animation, ตรวจสอบความถูกต้องได้) | `npx @jakkrichm/create-nexus-devflow skill add https://github.com/tt-a1i/archify` |
| **diagram-design** | Editorial Diagram | ไดอะแกรมสาย Editorial 39 รูปแบบ (Business Quadrant, Timeline, Mindmap, Radar) | `npx @jakkrichm/create-nexus-devflow skill add https://github.com/cathrynlavery/diagram-design` |
| **debug-mantra** | Diagnostics | วินัยการดีบักตามหลัก 4 มนต์ (Reproduce, Trace, Falsify, Cross-reference) | `npx @jakkrichm/create-nexus-devflow skill add https://github.com/thananon/9arm-skills --name debug-mantra` |
| **post-mortem** | Quality / RCA | เขียนบันทึกวิศวกรรมการแก้บั๊ก (Root Cause Analysis & Post-mortem) | `npx @jakkrichm/create-nexus-devflow skill add https://github.com/thananon/9arm-skills --name post-mortem` |
| **scrutinize** | Code Review | รีวิว Plan, PR และ Diff เชิงลึกจากมุมมองบุคคลภายนอก | `npx @jakkrichm/create-nexus-devflow skill add https://github.com/thananon/9arm-skills --name scrutinize` |
| **management-talk** | Communication | แปลงเนื้อหาทางเทคนิคให้เป็นข้อความสื่อสารกับผู้บริหาร (Slack/Jira/Email/Meetings) | `npx @jakkrichm/create-nexus-devflow skill add https://github.com/thananon/9arm-skills --name management-talk` |

> [!NOTE]
> **ติดตั้งชุด 9arm-skills ทั้งหมดในคำสั่งเดียว**:
> ```bash
> npx @jakkrichm/create-nexus-devflow skill add https://github.com/thananon/9arm-skills --all
> ```

---

## การเตรียมความพร้อมก่อน Deploy (Deployment readiness)

สั่ง `/release` เพื่อเตรียมความพร้อมในการนำแอปพลิเคชันขึ้นสู่ Production บน Render หรือ Vercel:

```text
/release render
/release vercel
```

ระบบจะตรวจสอบ Environment Variables, ตรวจเช็กไฟล์ `render.yaml` หรือ `vercel.json`, รัน Build ทดสอบในเครื่อง และเตรียม Checklist การทำ Smoke test โดยจะ **หยุดรอเสมอ** ก่อนมีการ Deploy หรือแตะต้องเซอร์วิสจริงบนคลาวด์

---

## การสานต่องานเดิมอย่างต่อเนื่อง (Picking up where you left off)

Nexus-DevFlow เก็บสถานะของงานไว้ในไฟล์ Markdown เสมอ ไม่ขึ้นอยู่กับ Context ของ AI:

- `devflow/context/project-overview.md` — Source of Truth ของสถาปัตยกรรม
- `devflow/context/current-feature.md` — Single Living Spec แสดงงานที่เสร็จแล้วและงานที่เหลือ
- `devflow/context/current-stage.md` — ตัวชี้บอกขั้นตอนปัจจุบัน
- `devflow/history/` + Git — คลังประวัติการส่งมอบงานถาวร

เมื่อเริ่มเซสชันใหม่หรือหลังจาก AI Context Window ถูกรีเซ็ต:
- สั่ง `/devflow` หรือ `/status` เพื่อตรวจดูสถานะปัจจุบัน
- สั่ง `/implement` เพื่อทำงานย่อยข้อถัดไปใน Living Spec ต่อได้ทันที

---

## แผนผังโครงสร้างไฟล์ (File map)

```text
.
├── AGENTS.md                  (คำแนะนำสำหรับ AI: Codex, Antigravity, Cursor, Copilot, OpenCode)
├── CLAUDE.md                  (จุดเริ่มต้นสำหรับ Claude Code; โหลด AGENTS.md)
├── .agents/
│   └── skills/                (โฟลเดอร์ Multi-Agent Skills สำหรับ Antigravity, Codex, Copilot, OpenCode)
│       ├── adopt/             ($adopt: ติดตั้งในโปรเจกต์เดิมที่มีโค้ดอยู่แล้ว)
│       ├── audit/             ($audit: ตรวจสอบคุณภาพโค้ด, ความปลอดภัย และการทดสอบ)
│       ├── autopilot/         ($autopilot: โหมดส่งมอบงานรอบเดียวจบ)
│       ├── brainstorm/        ($brainstorm: ระดมสมองและเปรียบเทียบทางเลือก)
│       ├── brief/             ($brief: ดูสรุปข้อมูลฟีเจอร์ก่อนเริ่มเขียนสเปก)
│       ├── check/             ($check: การตรวจสอบระบบจริงโดย Senior QA)
│       ├── ci/                ($ci: ตั้งค่าคำสั่ง Verify และ GitHub Actions)
│       ├── complete/          ($complete: ตรวจความปลอดภัย, เก็บประวัติ, Squash-Merge)
│       ├── convert-any-to-md/ ($convert-any-to-md: เครื่องมือแปลงเอกสารเป็น Markdown)
│       ├── debug/             ($debug: วินิจฉัยปัญหาโดยไม่แตะต้องซอร์สโค้ด)
│       ├── devflow/           ($devflow: ตัวตรวจสถานะและเราเตอร์นำทางหลัก)
│       ├── discovery/         ($discovery: การค้นคว้าและสำรวจเชิงลึก)
│       ├── doctor/            ($doctor: ตรวจสุขภาพของ Workspace)
│       ├── feature/           ($feature: สร้าง Single Living Spec)
│       ├── fix/               ($fix: สเปกการแก้บั๊กหรือ Patch)
│       ├── grill/             ($grill: Socratic ADR Alignment)
│       ├── idea/              ($idea: กล่องบันทึกไอเดียพร้อม AI Scoring)
│       ├── implement/         ($implement: ลงมือเขียนโค้ดตามวินัย Strict TDD)
│       ├── onboard/           ($onboard: ตั้งค่าเริ่มต้นสำหรับโปรเจกต์ใหม่)
│       ├── overview/          ($overview: สังเคราะห์ project-overview.md)
│       ├── prototype/         ($prototype: สร้าง Static Mockups)
│       ├── release/           ($release: เตรียมความพร้อม Render & Vercel)
│       ├── report-html/       ($report-html: สร้างรายงาน Standalone HTML)
│       ├── rollback/          ($rollback: ย้อนคืนฟีเจอร์อย่างปลอดภัย)
│       ├── setup-tests/       ($setup-tests: ติดตั้ง Stack-native Test Runner)
│       ├── status/            ($status: ตรวจสอบความคืบหน้าของงาน)
│       ├── test/              ($test: รันและสร้างเคสทดสอบ)
│       └── try/               ($try: คู่มือการทดสอบด้วยตนเองสำหรับมนุษย์)
├── .claude/
│   └── skills/                (โฟลเดอร์ Skill สำหรับ Claude Code)
└── devflow/
    ├── ideas.md               (เสาหลักที่ 1: อนาคต / Idea Inbox พร้อม AI Scoring)
    ├── context/               (เสาหลักที่ 2: ปัจจุบัน / Living Context ที่กำลังใช้งาน)
    │   ├── project-overview.md  (Source of Truth สร้างโดย /overview)
    │   ├── coding-standards.md  (มาตรฐานโค้ด และ TDD Gates)
    │   ├── ai-interaction.md    (กฎการทำงานและภาษาที่ใช้ร่วมกับ AI)
    │   ├── findings.md          (สมุดบันทึกคุณภาพและความปลอดภัย)
    │   ├── current-stage.md     (ตัวชี้บอกขั้นตอนปัจจุบัน)
    │   └── current-feature.md   (Single Living Spec / stub เมื่อว่าง)
    ├── decisions/             (คลังบันทึกการตัดสินใจสถาปัตยกรรม: ADR-xxx.md)
    ├── discoveries/           (เอกสารการสำรวจเชิงลึก: DISC-xxx.md)
    └── history/               (เสาหลักที่ 3: อดีต / คลังประวัติถาวร)
        ├── features/          (ประวัติฟีเจอร์ที่เสร็จแล้ว)
        ├── fixes/             (ประวัติการแก้บั๊กที่เสร็จแล้ว)
        ├── rollbacks/         (ประวัติการย้อนคืนฟีเจอร์)
        └── HISTORY.md         (ตารางประวัติการส่งมอบงานทั้งหมด)
```

---

## เอกสารอ้างอิงและกติกากำกับ (Documentation and governance)

- [คู่มือการใช้งานฉบับเต็ม](docs/USAGE.md) — วิธีปฏิบัติงานและ Core Skill inventory
- [แผนผัง Workflow Surface](docs/workflow-surface-map.md) — คำสั่ง หมวดหมู่ และอาร์ติแฟกต์มาตรฐาน
- [นโยบายเลือกใช้ Skill](docs/skill-selection-policy.md) — เลือก workflow หรือ companion skill ที่เล็กและตรงงาน
- [กติกา Governance](docs/governance-rules.md) — ขอบเขต public surface และตำแหน่งเอกสารสำหรับ maintainer
- [Markdown Metadata Contract](docs/markdown-metadata-contract.md) — ข้อกำหนด frontmatter และ semantic heading
- [Manual Review Workflow](docs/manual-review-workflow-spec.md) — Human review gates ตั้งแต่สเปกถึงการส่งมอบ
- [ตัวอย่าง Living Spec](docs/examples/living-spec/) — ตัวอย่าง spec, discovery, ADR และ idea artifacts

---

## การสนับสนุนและการมีส่วนร่วม (Support and contributing)

- อ่าน [SUPPORT.md](SUPPORT.md) สำหรับคำถามการใช้งาน, แจ้งบั๊ก หรือขอฟีเจอร์ใหม่
- อ่าน [CONTRIBUTING.md](CONTRIBUTING.md) ก่อนเปิด Pull Request
- อ่าน [SECURITY.md](SECURITY.md) สำหรับการรายงานช่องโหว่ความปลอดภัยแบบเป็นส่วนตัว
- ตรวจสอบ [CHANGELOG.md](CHANGELOG.md) สำหรับประวัติการอัปเดตเวอร์ชัน
- ปฏิบัติตาม [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

## สัญญาอนุญาต (License)

Nexus-DevFlow เป็นซอฟต์แวร์ Open Source ภายใต้สัญญาอนุญาต [MIT License](LICENSE)

---

## หมายเหตุและข้อควรทราบ (Notes)

### ไม่ใช่ App Skeleton หรือ Boilerplate
Nexus-DevFlow เป็น Workflow Overlay สำหรับการจัดการกระบวนการพัฒนา ไม่ใช่โครงสร้างเริ่มต้นของแอปพลิเคชัน คุณสามารถสร้างแอปพลิเคชันด้วยภาษาหรือเฟรมเวิร์กใดก็ได้ตามต้องการ แล้วจึงติดตั้ง DevFlow ทับลงไป

### การทำ Prototype แยกออกจากการส่งมอบงานจริง
การสร้าง Mockup หรือออกแบบ UI ในช่วงแรก (Figma, v0 หรือ Static HTML) ควรทำก่อนเริ่มวงจรการพัฒนาจริง โดยสามารถใช้ `/prototype` เพื่อสร้างโครงร่างหน้าตาใน `prototypes/` ก่อนกำหนดเป็น Living Spec ทางการ

### การทำงานข้ามเครื่องมือ AI ได้อย่างอิสระ
DevFlow รองรับการทำงานร่วมกับ Google Antigravity, Claude Code, OpenAI Codex, Cursor, GitHub Copilot, OpenCode และ Gemini CLI โดยบริบททั้งหมดถูกจัดเก็บเป็นไฟล์ Markdown ใน `devflow/` ทำให้คุณสามารถสลับใช้งานเครื่องมือต่างๆ ได้ทุกเมื่อโดยไม่สูญเสียประวัติหรือความต่อเนื่องของโปรเจกต์
