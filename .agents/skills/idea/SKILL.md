---
name: idea
description: "[Devflow] Quick idea capture and AI enrichment - analyze feasibility, value, key points, and record into devflow/ideas.md inbox."
argument-hint: "\"<idea text or description>\""
---

# idea - Quick Idea Capture & AI Enrichment

$ARGUMENTS

Use this skill to quickly capture feature ideas, improvements, or architectural thoughts before they are forgotten. The AI immediately enriches the idea with **Feasibility Assessment**, **Value & Impact Analysis**, and **Quick Seed Key Points** (to prevent forgetting the nuance), then stores it in the central idea inbox at `devflow/ideas.md`.

## Invocations & Aliases

- `/idea "<idea text>"`: Standard slash command in Claude Code / Antigravity
- `idea "<idea text>"`: Plain text invocation
- `$idea "<idea text>"`: Codex CLI invocation

## Behavior & Contract

When invoked:

### 1. Load Idea Inbox Hub
1. Check if `devflow/ideas.md` exists. If not, create it with the standard DevFlow Ideas template.
2. Read `devflow/ideas.md` and find the highest existing `IDEA-xxx` number.
3. Allocate the next sequential ID (e.g. `IDEA-001`, `IDEA-002`).

### 2. AI Feasibility & Value Analysis
Evaluate the user's raw idea and generate an enriched summary in **Thai (`th`)**:
- **ไอเดียตั้งต้น (Raw Idea)**: ข้อความที่ผู้ใช้ระบุ
- **AI Feasibility & Tech**: ประเมินความเป็นไปได้ (ง่าย / ปานกลาง / ซับซ้อน) พร้อมแนะนำ Library, API, หรือแนวทางเทคนิคเบื้องต้น
- **Value & Potential**: คุณค่า ประโยชน์ และความน่าสนใจของฟีเจอร์นี้
- **Quick Seed (สรุปประเด็นกันลืม)**: 2-3 ประเด็นทางเทคนิคหรือแนวทางการต่อยอด เพื่อให้กลับมาอ่านทีหลังแล้วจำบริบทได้ทันที

### 3. Append to `devflow/ideas.md`
Insert the new idea block directly under `## 📌 Pending Ideas` in `devflow/ideas.md`:

```markdown
### [IDEA-001] {หัวข้อไอเดียสั้นๆ}
- **บันทึกเมื่อ**: {YYYY-MM-DD}
- **ไอเดียตั้งต้น**: {ข้อความที่ผู้ใช้ป้อน}
- **AI Feasibility & Tech**: {บทวิเคราะห์ความเป็นไปได้และเครื่องมือ}
- **Value & Potential**: {บทวิเคราะห์คุณค่าและความน่าสนใจ}
- **Quick Seed (กันลืม)**:
  1. {ประเด็นสำคัญที่ 1}
  2. {ประเด็นสำคัญที่ 2}
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/spec IDEA-001` หรือ `/00-discover IDEA-001`)
```

*(หากมีข้อความ `*(ยังไม่มีไอเดียค้างอยู่...)*` ให้ลบออกเมื่อมีไอเดียแรก)*

### 4. Output Summary
Report to the user:
- Allocated Idea ID: `[IDEA-xxx]`
- Summary of Feasibility & Value analysis
- Seed points saved
- Instructions for promotion: "เมื่อพร้อมลงมือทำ สามารถพิมพ์ `/spec IDEA-xxx` หรือ `/00-discover IDEA-xxx` ได้ทันที"
