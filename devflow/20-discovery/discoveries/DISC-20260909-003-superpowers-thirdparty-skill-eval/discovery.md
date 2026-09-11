# Discovery Document: [DISC-20260909-003] obra/superpowers Third-Party Skill Evaluation & Conflict Analysis

> **Discovery ID**: `DISC-20260909-003`  
> **Topic**: การวิเคราะห์ความเข้ากันได้ และผลกระทบต่อ Nexus-DevFlow หากนำ `obra/superpowers` มาติดตั้งเป็น Third-Party Skills  
> **Date**: 2026-09-09  
> **Status**: `Reject as Global Plugin / Proceed with Selective Heuristics (Cherry-pick techniques only)`  
> **Target Scope**: Nexus-DevFlow Ecosystem, Workflow Orchestration, Git Lifecycle, Spec Contracts (`devflow/context/`), and Third-Party Registry Engine

---

## 1. Executive Summary & บทสรุปผู้บริหาร (TL;DR)

**คำถามหลัก**: นำ skill `https://github.com/obra/superpowers` มาเป็น Third-Party Skills จะขัดแย้งกับการทำงานของ DevFlow ไหม?

**คำตอบสรุป**:
> **"ขัดแย้งอย่างรุนแรง (Critical Conflict) หากติดตั้งทั้งชุดเป็น Plugin หรือ Global Skills"**  
> แต่ **"มีประโยชน์และนำมาต่อยอดได้ดีเยี่ยม หากใช้วิธี Cherry-pick เฉพาะเทคนิค/Heuristics ย่อย"** มาเสริมให้กับคำสั่งของ DevFlow ที่มีอยู่แล้ว

### เหตุผลหลักที่เกิดการขัดแย้ง (The Core Conflict):
1. **Superpowers ไม่ใช่ Utility Skill แต่เป็น "Full Lifecycle Meta-Framework"**: Superpowers ถูกออกแบบมาให้เป็นระบบบริหารการพัฒนาซอฟต์แวร์แบบครบวงจร (ตั้งแต่ Brainstorming -> Git Worktrees -> Writing Plans -> Subagent Execution -> TDD -> Code Review -> Branch Finishing) ซึ่งอยู่ในระดับ (Tier) เดียวกับ **Nexus-DevFlow** โดยตรง
2. **ศึกชิงการควบคุม Agent (Dual-Orchestrator Clash)**: Superpowers ใช้ Session-Start Hook (`using-superpowers`) และ System Instructions บังคับว่า *"The agent checks for relevant skills before any task. Mandatory workflows, not suggestions."* หากติดตั้งลงไป Agent จะถูกดึงเข้า Workflow ของ Superpowers ทันที ทำให้ละเลยวงจรของ DevFlow (`/feature` ──▶ `/implement` ──▶ `/check` ──▶ `/complete`)
3. **ชนกับ Living Spec Contract ของ DevFlow**: DevFlow มีหัวใจหลักคือ **The 3-Pillars & Task-Isolated Living Spec Model** (`devflow/context/{xxx-slug}/spec.md`, `stage.md`, `findings.md`, `devflow/.state/run.json`) ในขณะที่ Superpowers จะสร้าง Markdown Plan และ Design Doc แบบ Ad-hoc นอกระบบ ทำให้ Dashboard และ State Tracking เสียหาย
4. **Git Workspace Collision**: Superpowers บังคับใช้ `using-git-worktrees` และ `finishing-a-development-branch` ซึ่งจะไปตีกับ Git Branching Strategy (`feature/{xxx-slug}`) และการทำ Automated Squash-merge / History Archiving ของ `/complete` ใน DevFlow

---

## 2. เจาะลึก obra/superpowers คืออะไร? (Profile & Architecture)

- **Repository**: [obra/superpowers](https://github.com/obra/superpowers) (โดย Jesse Vincent / Prime Radiant)
- **นิยาม**: *"An agentic skills framework & software development methodology that works."*
- **รูปแบบการทำงาน**: เป็น Framework ที่ทำงานแบบ Hook-driven & Autonomous Subagent Development สำหรับ Harness ต่างๆ (Claude Code, Antigravity, Codex, Cursor, Gemini CLI, OpenCode ฯลฯ)

### 2.1 The 7-Stage Workflow ของ Superpowers
1. `brainstorming`: บังคับถามคำถามแบบ Socratic สกัด Spec สั้นๆ ย่อยง่าย ก่อนเขียนโค้ด
2. `using-git-worktrees`: สั่งสร้าง Git Worktree แยกโฟลเดอร์สำหรับงานใหม่
3. `writing-plans`: ซอย Task ย่อยขนาด 2-5 นาที ระบุ path และโค้ดละเอียด
4. `subagent-driven-development` / `executing-plans`: ส่ง Task ให้ Subagent ทำทีละข้อ มี 2-stage review (Spec compliance ตามด้วย Code quality)
5. `test-driven-development`: บังคับ Red-Green-Refactor ลบโค้ดทิ้งหากเขียนก่อนเทสต์
6. `requesting-code-review` / `receiving-code-review`: ตรวจสอบความถูกต้องระหว่าง Task
7. `finishing-a-development-branch`: ถามผู้ใช้ว่าจะ Merge / PR / Discard และเคลียร์ Worktree

### 2.2 ชุด Skills ทั้งหมดใน Superpowers
| หมวดหมู่ | รายชื่อ Skills ใน Superpowers | เทียบเคียงใน Nexus-DevFlow |
| :--- | :--- | :--- |
| **Lifecycle & Planning** | `brainstorming`, `writing-plans` | `/discovery`, `/brainstorm`, `/grill`, `/feature`, `/fix` |
| **Execution** | `subagent-driven-development`, `executing-plans` | `/implement`, `/autopilot`, `/continuous` |
| **Quality & TDD** | `test-driven-development` | `/implement` (TDD cycle), `/test` |
| **Debugging** | `systematic-debugging`, `verification-before-completion` | `/debug`, `/bughunter`, `/check` |
| **Review & Handoff** | `requesting-code-review`, `receiving-code-review` | `/check`, `/audit`, Independent Review (`review.md`) |
| **Git Management** | `using-git-worktrees`, `finishing-a-development-branch` | `/implement` (Branch checkout), `/complete` (Squash & Archive) |
| **Meta** | `writing-skills`, `using-superpowers` | DevFlow Skill Engine, `agy-customizations` |

---

## 3. มิติความขัดแย้งอย่างละเอียด (Detailed Conflict Matrix)

| ประเด็นการเปรียบเทียบ | Nexus-DevFlow | obra/superpowers | ระดับความขัดแย้ง | ผลกระทบหากติดตั้งร่วมกัน |
| :--- | :--- | :--- | :---: | :--- |
| **1. Orchestration Model** | คำสั่งชัดเจนตาม Stage: `/feature`, `/implement`, `/check`, `/complete` ควบคุมผ่าน `AGENTS.md` | Session-start Hook ดักจับทุกข้อความ บังคับ flow อัตโนมัติ (`Mandatory workflows`) | 🔴 **Critical** | Agent สับสน เกิดการแย่งสิทธิ์สั่งการ (Prompt Fighting) ไม่รู้จะฟังข้อกำหนดของใคร |
| **2. Spec & State Contract** | Task-Isolated Living Spec ใน `devflow/context/{xxx-slug}/spec.md` บันทึก State ใน `devflow/.state/run.json` | สร้างไฟล์ Markdown วางแผนแบบกระจาย (ไม่มี standard path ชัดเจน) | 🔴 **Critical** | แฟ้ม Context ของ DevFlow ขาดหาย, Dashboard ใน DevFlow แสดงสถานะไม่ตรง |
| **3. Git Lifecycle** | สร้าง Branch `feature/{xxx-slug}`, จบงานด้วย `/complete` (Squash-merge, เก็บประวัติเข้า `devflow/history/`, ลบ context) | บังคับสร้าง `git worktree` แยก path และสั่ง cleanup เองผ่าน skill | 🔴 **Critical** | เกิด Orphan Worktrees, Git refs สับสน และทำลายระบบเก็บบันทึกประวัติของ DevFlow |
| **4. Subagent Architecture** | Generic Subagent Spawning อิงตาม Contract ใน `review.md` และ `config.json` (Local isolated context) | Dispatch subagent พร้อม two-stage review เฉพาะตัวของ Superpowers | 🟡 **Medium** | ซ้ำซ้อนกับ Independent Review Gate ของ DevFlow สิ้นเปลือง token ซ้ำสอง |
| **5. TDD & Debugging** | Red-Green-Refactor ใน `/implement` และ 4-phase root cause ใน `/debug` | Red-Green-Refactor พร้อมกฎลบโค้ดที่เขียนก่อนเทสต์, `systematic-debugging` | 🟢 **Low / Compatible** | เนื้อหาเป็นเทคนิคการเขียนโค้ด (Coding heuristics) ไม่ขัดแย้งเชิงโครงสร้าง สามารถนำมาใช้ได้ |

---

## 4. แนะนำแนวทางการนำมาใช้งาน (Recommendation & Strategic Options)

### ❌ Option 1: ติดตั้งทั้ง Repo ตรงๆ (Direct Install / Plugin) — **"ห้ามทำเด็ดขาด"**
- สั่ง `agy plugin install https://github.com/obra/superpowers` หรือก็อปปี้โฟลเดอร์ `skills/` ทั้งหมดลงใน `.agents/skills/`
- **ผลลัพธ์**: ระบบรวนทันที เพราะ Hook ของ Superpowers จะแย่งอำนาจจาก `AGENTS.md` ทำให้ Agent ปฏิเสธการรันตาม DevFlow lifecycle

---

### ⚠️ Option 2: คัดลอกเฉพาะบาง Skill มาลงตรงๆ (Selective Skill Installation) — **"มีความเสี่ยง"**
- หากเลือกลงเฉพาะบางตัว เช่น `using-git-worktrees` หรือ `subagent-driven-development`
- **ผลลัพธ์**: ตัว Skills ของ Superpowers มีการอ้างอิงข้ามกันเอง (Cross-references) เช่น `subagent-driven-development` พึ่งพา `writing-plans` และ `using-git-worktrees` หากลงไม่ครบ Agent จะแจ้งเตือนหาไฟล์ไม่เจอ

---

### ✅ Option 3: เทคนิค "JIT Reference / Heuristic Extraction" (แนวทางที่ถูกต้องและแนะนำสูงสุด) — **"Recommended"**
รูปแบบเดียวกับที่ DevFlow ทำสำเร็จกับ `bughunter` (`devflow/.vendor/bughunter/`) และ `ponytail` (`devflow/.vendor/ponytail/`):
1. **ดึงเทคนิค Debugging ขั้นเทพมาใส่ใน `/debug`**:
   - Superpowers มีเทคนิคเจาะลึก 3 เรื่องที่โดดเด่นมาก:
     - `root-cause-tracing` (การสืบสายเรียกย้อนกลับ)
     - `defense-in-depth` (การวางเกราะป้องกันหลายชั้น ไม่แก้แค่จุดที่พัง)
     - `condition-based-waiting` (การแก้ Flaky Tests ใน Async/Integration tests)
   - นำเทคนิคเหล่านี้มาเพิ่มเป็น Reference Guide ใน `.agents/skills/debug/`
2. **เสริม TDD Anti-Patterns Reference ลงใน `/implement`**:
   - นำกฎ "Testing Anti-Patterns" ของ Superpowers มาใส่เป็น Checklist เสริมใน TDD discipline ของ DevFlow
3. **ยกระดับ Independent Review Gate (`/audit independent`)**:
   - นำตรรกะ Two-stage Review (แยกตรวจความถูกต้องตาม Spec 1 รอบ และตรวจ Code Quality 1 รอบ) มาเป็น Prompt Template ให้กับ Subagent Reviewer ของ DevFlow

---

## 5. การตัดสินใจ (Decision Gate)

- [x] **Reject**: การนำ `obra/superpowers` มาติดตั้งแบบเต็มรูปแบบ (Direct Plugin/Skill Integration) **ไม่ผ่านการอนุมัติ** เนื่องจากขัดแย้งกับสถาปัตยกรรมหลักของ Nexus-DevFlow อย่างสิ้นเชิง
- [x] **Proceed with Extraction (Optional Idea)**: เสนอสร้าง Idea/Ticket เพื่อดึงเฉพาะ **Heuristic Knowledge (Debugging sub-techniques & TDD anti-patterns)** มาเสริมทัพใน Skills เดิมของ DevFlow (`/debug`, `/implement`, `/audit`) โดยไม่ต้องติดตั้ง Superpowers framework
