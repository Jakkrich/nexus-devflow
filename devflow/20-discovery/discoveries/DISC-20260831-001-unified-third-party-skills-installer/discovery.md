# Discovery Document: [DISC-20260831-001] Unified Third-Party Skills Installation Command

> **Discovery ID**: `DISC-20260831-001`  
> **Topic**: รวมคำสั่งติดตั้ง Third-Party Skills ทั้งหมดของ Nexus-DevFlow ให้เหลือคำสั่งเดียว (Unified Third-Party Skills Installer)  
> **Date**: 2026-08-31  
> **Status**: `Approved (Proceed to /feature)`  
> **Target Scope**: CLI Ecosystem (`create-nexus-devflow`), Skill Manager (`skill-manager.ts`), CLI Parser (`create-nexus-devflow.ts`), Documentation (`README.md`, `README.th.md`), and Developer Onboarding (`onboard`, `adopt`)

---

## 1. Executive Summary & Problem Statement

ปัจจุบัน Nexus-DevFlow มี **29 Core Skills** ที่ติดตั้งมาพร้อมกับ Framework ตั้งแต่เริ่มต้น และรองรับการติดตั้ง **Recommended Third-Party Skills** จาก Community เพิ่มเติมอีก 8 Skills (จาก 3 แหล่ง Repositories หลัก):
1. `archify` (`https://github.com/tt-a1i/archify`) — Visual Architecture & Interactive HTML/SVG
2. `diagram-design` (`https://github.com/cathrynlavery/diagram-design`) — Editorial Business & Multi-style Diagrams
3. `9arm-skills` (`https://github.com/thananon/9arm-skills`) — ชุด 6 Skills ได้แก่ `debug-mantra`, `post-mortem`, `qwen-agent`, `scrutinize`, `management-talk`, `qwenchance`

### ปัญหาที่พบ (Pain Points):
1. **หลายขั้นตอน (Fragmented Commands)**: ผู้ใช้ต้องรันคำสั่ง `skill add` แยกกันอย่างน้อย 3 คำสั่ง (หรือ 8 คำสั่งหากไม่ใช้ `--all` บน 9arm-skills)
2. **ความจำและภาระในการหาข้อมูล (Cognitive Load)**: ผู้ใช้ต้องจำ URL ยาวๆ ของแต่ละ GitHub Repository และสวิตช์ `--all`
3. **Onboarding Friction**: เมื่อขึ้นโปรเจกต์ใหม่ หรือแชร์โปรเจกต์ให้ทีมงาน ต้องคัดลอกคำสั่งติดตั้งหลายบรรทัด

### คำตอบสรุป (TL;DR):
- **สำหรับใช้งานทันทีในปัจจุบัน (Immediate One-Liner)**: ใช้คำสั่ง Chain Shell Command บรรทัดเดียว
- **สำหรับพัฒนายกระดับ CLI (Proposed Native Feature)**: เพิ่มฟีเจอร์ Preset/Bundle Flag ใน CLI เช่น `npx @jakkrichm/create-nexus-devflow skill add --recommended` เพื่อติดตั้งครบทั้ง 8 Skills ในคำสั่งเดียวโดยไม่ต้องระบุ URL

---

## 2. วิธีการติดตั้ง Third-Party Skills ทั้งหมดในคำสั่งเดียว

### 2.1 คำสั่งที่สามารถใช้งานได้ทันที ณ ปัจจุบัน (Immediate One-Liner)

ผู้ใช้สามารถรันคำสั่ง Chaining เพื่อติดตั้งครบทั้ง 8 Skills (3 Repositories) ได้ในคำสั่งเดียว:

#### สำหรับ Bash / Zsh / Linux / macOS / Git Bash:
```bash
npx @jakkrichm/create-nexus-devflow skill add https://github.com/tt-a1i/archify && npx @jakkrichm/create-nexus-devflow skill add https://github.com/cathrynlavery/diagram-design && npx @jakkrichm/create-nexus-devflow skill add https://github.com/thananon/9arm-skills --all
```

#### สำหรับ Windows PowerShell:
```powershell
npx @jakkrichm/create-nexus-devflow skill add https://github.com/tt-a1i/archify; npx @jakkrichm/create-nexus-devflow skill add https://github.com/cathrynlavery/diagram-design; npx @jakkrichm/create-nexus-devflow skill add https://github.com/thananon/9arm-skills --all
```

#### สำหรับ Windows Command Prompt (CMD):
```cmd
npx @jakkrichm/create-nexus-devflow skill add https://github.com/tt-a1i/archify & npx @jakkrichm/create-nexus-devflow skill add https://github.com/cathrynlavery/diagram-design & npx @jakkrichm/create-nexus-devflow skill add https://github.com/thananon/9arm-skills --all
```

---

## 3. รายการ Third-Party Skills ที่จะได้รับการติดตั้ง (8 Skills Breakdown)

| Skill Name | Repository Source | Category | ความสามารถหลักใน Nexus-DevFlow |
| :--- | :--- | :--- | :--- |
| **archify** | `tt-a1i/archify` | Visual Architecture | ไดอะแกรมทางเทคนิคระดับโปร มี Dark/Light theme, Motion trace, Sequence flow, Dataflow และ Route probe |
| **diagram-design** | `cathrynlavery/diagram-design` | Editorial Diagram | ไดอะแกรมธุรกิจและการนำเสนอ 39 รูปแบบ (Business Quadrant, Radar, Mindmap, Timeline, ER Diagram) |
| **debug-mantra** | `thananon/9arm-skills` | Diagnostics | กระบวนการ Debug 4 สเต็ป (Reproduce, Trace fail path, Falsify hypothesis, Cross-reference) |
| **post-mortem** | `thananon/9arm-skills` | Quality / RCA | สร้างเอกสารสรุปการแก้บักเชิงวิศวกรรม (Root Cause Analysis & Prevention) |
| **qwen-agent** | `thananon/9arm-skills` | Cost Optimization | สั่งงาน Routine/Boilerplate ให้ Qwen Subagent (`claude-9arm`) ทำงานราคาประหยัด |
| **scrutinize** | `thananon/9arm-skills` | Code Review | ตรวจสอบโค้ดและสถาปัตยกรรมเชิงลึกจากมุมมองบุคคลภายนอก (Outsider review) |
| **management-talk** | `thananon/9arm-skills` | Communication | แปลงเนื้อหาเชิงเทคนิคให้เป็นภาษารายงานผู้บริหาร (Slack, Jira, Meeting) |
| **qwenchance** | `thananon/9arm-skills` | Guardrails | ระบบเฝ้าระวัง Context Budget และตัดวงจรการคิดวนลูป (Loop breaker) |

---

## 4. Trade-off Analysis: แนวทางพัฒนายกระดับ CLI (Architectural Options)

เพื่อประสบการณ์การใช้งานที่ดีที่สุด (Developer Experience - DX) เราได้เปรียบเทียบแนวทางการออกแบบ CLI ในอนาคต:

| มิติการประเมิน | **Option A: CLI Preset Flag (`--recommended`)** ⭐ (แนะนำ) | **Option B: Positional Multi-Source Arguments** | **Option C: Skill Registry / Alias Engine** | **Option D: Shell Chaining One-Liner (สถานะปัจจุบัน)** |
|---|---|---|---|---|
| **ตัวอย่างคำสั่ง** | `nexus-devflow skill add --recommended` | `nexus-devflow skill add <url1> <url2> <url3> --all` | `nexus-devflow skill add @recommended` หรือ `skill add @archify @9arm` | `npx ... skill add <url1> && npx ... skill add <url2> ...` |
| **ความสะดวกของผู้ใช้ (DX)** | **สูงที่สุด**: ไม่ต้องจำ URL หรือพิมพ์อะไรยาวๆ | **ปานกลาง**: คำสั่งยังคงยาวและต้องรู้ URL ครบทุกตัว | **สูงมาก**: สั้นและยืดหยุ่น สามารถเลือกผสม alias ได้ | **ต่ำ**: คำสั่งยาวมาก เสี่ยงต่อการพิมพ์ผิด |
| **ประสิทธิภาพการรัน** | **เร็วมาก**: รัน Node process เดียว ดาวน์โหลดและแตกไฟล์แบบขนาน/ชุดเดียว | **เร็ว**: รัน Node process เดียว | **เร็ว**: รัน Node process เดียว | **ช้า**: ต้องเรียก Node/npx ใหม่ 3 ครั้ง |
| **ความซับซ้อนของโค้ด** | **ต่ำมาก**: เพิ่มรายการ Preset ใน `skill-manager.ts` | **ปานกลาง**: ต้องปรับปรุง argument parser ให้รับ array | **ปานกลาง-สูง**: ต้องมี Alias resolution map | **ไม่ต้องแก้โค้ด** |
| **การดูแลรักษา (Maintenance)** | ง่าย: เพิ่ม/อัปเดต URL ใน Preset list เมื่อมี Skill ใหม่ | ปานกลาง: ผู้ใช้ต้องจัดการรายการเอง | ง่าย: จัดการผ่าน Catalog map | ผู้ใช้ต้องอัปเดตคำสั่งเอง |

---

## 5. Technical Implementation Plan สำหรับ CLI Native Support

เมื่อนำเข้าสู่รอบพัฒนา `/feature` รายละเอียดการแก้ไขจะมีดังนี้:

### 5.1 เพิ่ม Recommended Catalog ใน `packages/create-nexus-devflow/lib/skill-manager.ts`

```typescript
export interface RecommendedSkillPreset {
  source: string;
  name?: string;
  all?: boolean;
  description?: string;
}

export const RECOMMENDED_THIRD_PARTY_SKILLS: readonly RecommendedSkillPreset[] = Object.freeze([
  {
    source: "https://github.com/tt-a1i/archify",
    description: "Interactive system architecture and sequence diagrams"
  },
  {
    source: "https://github.com/cathrynlavery/diagram-design",
    description: "Editorial business, mindmap, and timeline diagrams"
  },
  {
    source: "https://github.com/thananon/9arm-skills",
    all: true,
    description: "6 specialized skills (debug-mantra, post-mortem, qwen-agent, scrutinize, management-talk, qwenchance)"
  }
]);

export async function installRecommendedSkills(
  projectRoot: string,
  options?: { force?: boolean }
): Promise<SkillDetail[]> {
  const installed: SkillDetail[] = [];
  for (const preset of RECOMMENDED_THIRD_PARTY_SKILLS) {
    const result = await installThirdPartySkill(projectRoot, preset.source, {
      name: preset.name,
      all: preset.all,
      force: options?.force
    });
    if (Array.isArray(result)) {
      installed.push(...result);
    } else {
      installed.push(result);
    }
  }
  return installed;
}

export async function updateRecommendedSkills(
  projectRoot: string
): Promise<SkillUpdateResult> {
  const updatedSkills: SkillDetail[] = [];
  const failedSkills: Array<{ name: string; reason: string }> = [];

  for (const preset of RECOMMENDED_THIRD_PARTY_SKILLS) {
    try {
      const result = await installThirdPartySkill(projectRoot, preset.source, {
        name: preset.name,
        all: preset.all,
        force: true
      });
      if (Array.isArray(result)) {
        updatedSkills.push(...result);
      } else {
        updatedSkills.push(result);
      }
    } catch (err: unknown) {
      failedSkills.push({
        name: preset.name || preset.source,
        reason: err instanceof Error ? err.message : String(err)
      });
    }
  }

  return {
    updatedSkills,
    failedSkills,
    totalUpdated: updatedSkills.length
  };
}
```

### 5.2 ปรับปรุง CLI Argument Parser ใน `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`

- **รองรับการติดตั้ง (Install)**:
  - `nexus-devflow skill add --recommended`
  - `nexus-devflow skill add --preset recommended`
  - `nexus-devflow skill add-recommended`
- **รองรับการอัปเดตเวอร์ชันล่าสุด (Update to Latest Version)**:
  - `nexus-devflow skill update --recommended`
  - `nexus-devflow skill upgrade --recommended`
- แสดง Progress Spinner ชัดเจน พร้อมรายงานจำนวน Skill ทั้งหมดที่ติดตั้ง/อัปเดตสำเร็จ (8 skills)

### 5.3 อัปเดต Documentation ใน `README.md` และ `README.th.md`

อัปเดตส่วน **Recommended Third-Party Skills & Extensions** ให้มีคำสั่งติดตั้งแบบ One-Shot:
```bash
# ติดตั้ง Third-Party Skills แนะนำทั้งหมดในคำสั่งเดียว
npx @jakkrichm/create-nexus-devflow skill add --recommended
```

---

## 6. PRD & Scoping Lens

### Scope Boundaries:
- **In-Scope**:
  - รองรับการติดตั้งแบบ Batch ในคำสั่งเดียวผ่าน Flag `--recommended`
  - ทำงานร่วมกับ Multi-Agent Adapters (`.agents/skills/` และ `.claude/skills/`) โดยอัตโนมัติ
  - ลงทะเบียนใน Manifest `.nexus/nexus-devflow.json` ภายใต้ `thirdPartySkills` อย่างถูกต้อง
  - รองรับการอัปเดตอัตโนมัติผ่าน `nexus-devflow skill update --all`
- **Out-of-Scope**:
  - ไม่ดัดแปลง Core Skills (29 Core Skills ยังคงเป็นค่ามาตรฐานที่ล็อคไว้)
  - ไม่บังคับติดตั้ง Third-Party Skills โดยที่ผู้ใช้ไม่ได้สั่ง (Opt-in by user)

---

## 7. Decision & Approval Gate

- **Decision**: **`Proceed` (อนุมัติเพื่อเข้าสู่กระบวนการสร้าง Living Spec ด้วย `/feature`)**
- **Next Step Recommendation**:
  1. หากต้องการใช้งานทันที: คัดลอกคำสั่ง **Immediate One-Liner (Section 2.1)** ไปรันใน Terminal
  2. หากต้องการพัฒนาฟีเจอร์ `skill add --recommended` เข้าสู่ CLI ของ Nexus-DevFlow: รันคำสั่ง `/feature 055-unified-third-party-skills-installer`
