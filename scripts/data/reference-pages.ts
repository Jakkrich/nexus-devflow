import type { DocPage } from '../build-docs-site.js';

export const REFERENCE_PAGES: DocPage[] = [
  // 1. File Reference
  {
    slug: 'file-reference',
    category: 'REFERENCE',
    title: 'File Reference (โครงสร้างไฟล์และหน้าที่)',
    lead: 'เอกสารอธิบายโครงสร้างไฟล์และโฟลเดอร์ทั้งหมดภายใต้ devflow/ และหน้าที่ของแต่ละไฟล์ในระบบอย่างละเอียดตามหลัก The 3-Pillars Model',
    pills: ['Reference', 'Files', 'Structure', 'Pillars', 'Architecture', 'Schema'],
    sections: [
      {
        id: 'directory-tree',
        title: 'โครงสร้างไดเรกทอรี devflow/ ทั้งหมด (The 3-Pillars Workspace)',
        contentHtml: `
          <p>Nexus-DevFlow จัดเก็บไฟล์การวางแผน บริบท และประวัติทั้งหมดไว้ในโฟลเดอร์ <code>devflow/</code> ที่ Root ของโปรเจกต์อย่างเป็นระเบียบ:</p>
          <pre><code>devflow/
├── config.json              # นโยบายเวิร์กโฟลว์, Review Cadence และ Quality Gates
├── project-plan.md          # 🔮 Future (Backlog): เป้าหมายผลิตภัณฑ์, สถาปัตยกรรม
├── build-plan.md            # 🔮 Future (Backlog): รายการฟีเจอร์ตามลำดับการสร้างจริง (Checklist)
├── ideas.md                 # 🔮 Future (Backlog): กล่องรับไอเดียและการประเมินคะแนนความเป็นไปได้
├── context/                 # ⚡ Present (Active Context): Global Truth และ Task Workspaces
│   ├── project-overview.md  # สรุปบริบทโปรเจกต์ที่คอมไพล์แล้ว (<20KB)
│   ├── coding-standards.md  # มาตรฐานและข้อตกลงในการเขียนโค้ด (รวม Section 15 & 16)
│   ├── ai-interaction.md    # กฎการสื่อสารและการรีวิวของ AI
│   ├── glossary.md          # พจนานุกรมศัพท์เฉพาะทางและโมเดลข้อมูล
│   └── {xxx-slug}/          # Task-Isolated Workspace ปัจจุบัน (ถูกลบเมื่อปิดงาน)
│       ├── spec.md          # Living Spec ประจำฟีเจอร์
│       ├── stage.md         # ตัวชี้ขั้นตอนการทำงาน (feature, implement, check, complete)
│       └── findings.md      # Findings Ledger สำหรับบันทึกข้อค้นพบ
├── discoveries/             # 🔍 Discoveries: รายงานการสำรวจระดับ Pre-Flight (DISC-ID)
├── decisions/               # 🏛️ Decisions: Architecture Decision Records (ADR-NNN)
├── inbox/                   # เอกสารความต้องการและสเปกดิบ (PDF, Word, Excel, Images)
├── analysis/                # ผลการแปลงเอกสารและการสแกนผลกระทบต่อโค้ดเบส
├── reference/               # 📑 Templates และ System Protocols ภายในสำหรับ AI Runtime
│   ├── slicing-archetypes.md # คู่มือ 4 Slicing Archetypes Framework
│   ├── feature-spec-template.md # แม่แบบ Living Spec พร้อม Input Coverage & AC Matrix
│   └── help-playbook-protocol.md # กฎการสร้าง Contextual Help Playbooks
├── history/                 # 📦 Past (History Archive): คลังประวัติการส่งมอบงานถาวร
│   ├── features/            # เอกสารสรุปฟีเจอร์ที่ส่งมอบแล้ว ({xxx-slug}.md)
│   ├── fixes/               # เอกสารสรุปบั๊กที่แก้ไขแล้ว
│   ├── rollbacks/           # เอกสารการย้อนคืนฟีเจอร์
│   └── HISTORY.md           # Master Release History Ledger
└── .state/                  # Generated Local State (ไม่ commit ขึ้น Git)
    ├── run.json             # แดชบอร์ด Activity State
    └── manifest.json        # ตัวติดตามเวอร์ชันของ DevFlow</code></pre>
        `
      },
      {
        id: 'file-purposes',
        title: 'รายละเอียดและหน้าที่ของไฟล์หลัก',
        contentHtml: `
          <table>
            <thead><tr><th>ไฟล์</th><th>บทบาทหน้าที่</th><th>ใครเป็นผู้แก้ไขหลัก</th></tr></thead>
            <tbody>
              <tr><td><code>devflow/project-plan.md</code></td><td>กำหนดขอบเขต วิสัยทัศน์ และ Tech Stack</td><td>ผู้ใช้ (Developer / PO)</td></tr>
              <tr><td><code>devflow/build-plan.md</code></td><td>Checklist ฟีเจอร์ที่ต้องพัฒนาตามลำดับ</td><td>ผู้ใช้และ AI ร่วมกัน</td></tr>
              <tr><td><code>devflow/config.json</code></td><td>นโยบายเวิร์กโฟลว์และประตูด่านตรวจคุณภาพ (Quality Gates)</td><td>ผู้ใช้และคำสั่ง <code>/onboard</code></td></tr>
              <tr><td><code>devflow/context/project-overview.md</code></td><td>สรุปบริบทหลักให้ AI ทุกตัวอ่านตรงกัน (<20KB)</td><td>คำสั่ง <code>/overview</code></td></tr>
              <tr><td><code>devflow/context/{id}/spec.md</code></td><td>Living Spec ประจำฟีเจอร์ แยกขาดตาม Task</td><td>คำสั่ง <code>/feature</code> และ <code>/implement</code></td></tr>
              <tr><td><code>devflow/history/HISTORY.md</code></td><td>บันทึก Release Log รวมทุกฟีเจอร์พร้อม Commit Hash</td><td>คำสั่ง <code>/complete</code></td></tr>
            </tbody>
          </table>
        `
      }
    ]
  },

  // 2. Governance Rules (New)
  {
    slug: 'governance-rules',
    category: 'REFERENCE',
    title: 'Governance Rules (กฎการกำกับดูแลและพัฒนา Framework)',
    lead: 'กฎและข้อตกลงในการพัฒนา ดูแล และขยายขีดความสามารถของ Nexus-DevFlow สำหรับ Maintainers และ Developers',
    pills: ['Reference', 'Governance', 'Rules', 'Architecture', 'Maintainers', 'Policy'],
    sections: [
      {
        id: 'public-surface-rule',
        title: '1. กฎการควบคุม Public Surface (Public Surface Rule)',
        contentHtml: `
          <ul>
            <li><strong>ขอบเขตของ Public Surface</strong>: ประกอบด้วยวงจรชีวิตหลัก 4 ขั้นตอน (<code>/feature</code>, <code>/implement</code>, <code>/check</code>, <code>/complete</code>) บวกกับชุดทักษะสนับสนุน (Companion Skills เช่น <code>/idea</code>, <code>/grill</code>, <code>/discovery</code>, <code>/devflow</code>, <code>/doctor</code>, <code>/audit</code>, <code>/rollback</code>)</li>
            <li><strong>ห้ามเพิ่มคำสั่งสาธารณะโดยไม่จำเป็น</strong>: หากฟังก์ชันใหม่สามารถทำเป็น Internal Helper หรือต่อยอดจากคำสั่งเดิมได้ ให้เลือกทำภายในก่อน จนกว่าจะมีการอนุมัติและเลื่อนขั้น (Promotion) เข้าสู่ <code>agent-bundle.manifest.json#core_skills</code> อย่างเป็นทางการ</li>
          </ul>
        `
      },
      {
        id: 'placement-rules',
        title: '2. กฎการวางตำแหน่งโค้ดและส่วนประกอบ (Placement Rules)',
        contentHtml: `
          <table>
            <thead><tr><th>ประเภทส่วนประกอบ</th><th>ตำแหน่งที่ต้องบันทึก</th><th>เกณฑ์การพิจารณา</th></tr></thead>
            <tbody>
              <tr><td><strong>Workflow Stage</strong></td><td><code>devflow/context/{xxx-slug}/</code></td><td>เมื่อพฤติกรรมนั้นมีสถานะ State Machine ของตนเอง หรือต้องบันทึกอาร์ติแฟกต์ใน Living Spec</td></tr>
              <tr><td><strong>Reusable Skill</strong></td><td><code>.agents/skills/</code> และ <code>.claude/skills/</code></td><td>เมื่อเป็นทักษะที่สามารถนำไปใช้ซ้ำข้าม AI Assistant หลายค่ายได้</td></tr>
              <tr><td><strong>Utility Script</strong></td><td><code>scripts/</code></td><td>เมื่อเป็นการลดความซ้ำซ้อน งานตรวจสอบ หรือคำสั่งเสริมที่ไม่เปลี่ยนโมเดลเวิร์กโฟลว์</td></tr>
              <tr><td><strong>Static Validation</strong></td><td><code>scripts/validate-framework.ts</code></td><td>เมื่อเป็นกฎข้อบังคับที่ต้องป้องกันการ Drift ใน CI</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'assumed-decision-debt',
        title: '3. Assumed Decision Debt Governance (การควบคุมหนี้การตัดสินใจ)',
        contentHtml: `
          <p>เมื่อต้องทำการตัดสินใจเชิงสถาปัตยกรรมในสภาวะที่มีความไม่แน่นอน แต่ต้องการให้งานเดินหน้าต่อได้โดยไม่สะดุด:</p>
          <ul>
            <li>สามารถบันทึก ADR ใน <code>devflow/decisions/ADR-xxx.md</code> ด้วยสถานะ <code>Status: Assumed</code></li>
            <li>ต้องระบุ 3 หัวข้อบังคับ: <strong>Assumption</strong> (สมมติฐาน), <strong>Risk Level & Blast Radius</strong> (ระดับความเสี่ยงและผลกระทบ), และ <strong>Ratification Plan</strong> (แผนการทวนสอบยืนยัน)</li>
            <li>ขั้นตอน <code>/audit</code> และ <code>/complete</code> มีด่านตรวจเช็ค Assumed Decision Debt เสมอเพื่อเตือนให้มีการ Ratify ให้เป็น <code>Accepted</code> หรือ <code>Rejected</code> ก่อนส่งมอบงานจริง</li>
          </ul>
        `
      }
    ]
  },

  // 3. Markdown Metadata Contract (New)
  {
    slug: 'markdown-metadata-contract',
    category: 'REFERENCE',
    title: 'Markdown Metadata Contract (สัญญาโครงสร้าง Markdown)',
    lead: 'ข้อกำหนดมาตรฐาน Frontmatter และ Heading Tags สำหรับไฟล์ Markdown ทุกไฟล์ที่สร้างโดย Nexus-DevFlow เพื่อรองรับ Obsidian และ Agent Indexing',
    pills: ['Reference', 'Markdown', 'Metadata', 'Frontmatter', 'Obsidian', 'YAML', 'Schema'],
    sections: [
      {
        id: 'core-yaml-frontmatter',
        title: '1. Shared YAML Frontmatter Core',
        contentHtml: `
          <p>ไฟล์ Markdown ที่สร้างขึ้นทุกไฟล์จะต้องมี YAML Frontmatter ส่วนหัวที่เป็นมาตรฐานเดียวกัน:</p>
          <pre><code>---
id: "001-user-auth"
title: "User Authentication & Session Management"
doc_type: "spec"
category: "planning"
status: "in-progress"
created: "2026-09-17"
updated: "2026-09-17"
owner: "DevFlow Core Framework Team & AI"
source_workflow: "/feature"
related_task: "001"
related_files:
  - "src/auth/session.ts"
  - "src/auth/jwt.ts"
tags:
  - nexus-devflow
  - authentication
  - security
aliases: []
summary: "Living Spec สำหรับระบบพิสูจน์ตัวตนผู้ใช้งานด้วย JWT Session"
metadata_version: 1
---</code></pre>
        `
      },
      {
        id: 'heading-tags-contract',
        title: '2. Obsidian-Compatible Heading Tags Contract',
        contentHtml: `
          <p>เพื่อรองรับการสืบค้นและทำความเข้าใจแบบเชิงความหมาย (Semantic Heading Tags) ใน Obsidian และ AI Search ให้ใส่ Tag ไว้ท้ายหัวข้อบรรทัด:</p>
          <pre><code># Living Spec: User Authentication #doc/spec

## 🎯 1. Define & Boundaries #section/scope

## 📐 2. Technical Spec & Contracts #section/contracts

## 📋 3. Execution Plan & TDD Checklist #section/tasks

## ⚡ 4. Implementation Log & Evidence #section/evidence

## 🧪 5. Multi-Lane Verification Matrix #section/verification

## 📦 6. Release Digest & Retrospective #section/summary</code></pre>
        `
      }
    ]
  },

  // 4. Living Spec Examples (New)
  {
    slug: 'living-spec-examples',
    category: 'REFERENCE',
    title: 'Living Spec Examples (ตัวอย่างเอกสารมาตรฐาน)',
    lead: 'รวมตัวอย่างไฟล์ Living Spec, Discovery Record, Architecture Decision Record (ADR) และ Idea Inbox ของจริง',
    pills: ['Reference', 'Examples', 'LivingSpec', 'Discovery', 'ADR', 'Ideas', 'Templates'],
    sections: [
      {
        id: 'living-spec-example',
        title: '1. ตัวอย่าง Task-Isolated Living Spec (spec.md)',
        contentHtml: `
          <p>โครงสร้างของ <code>devflow/context/{xxx-slug}/spec.md</code> แบบสมบูรณ์ 6 ส่วนหลัก:</p>
          <pre><code># Feature: 001-user-auth

**From build-plan:** feature 1
**Build attempt:** 1
**Branch:** feature/001-user-auth
**Quality Gates Policy:** qualityGates.regular.independentReview = when-sensitive
**Status:** In-Progress

## 🎯 1. Specification & Scope
### 1.1 Problem Statement
ผู้ใช้ต้องการระบบ Login ด้วย Email/Password พร้อม Session Token

### 1.2 Acceptance Criteria
- [ ] **AC-1**: POST /api/auth/login คืนค่า JWT token เมื่อข้อมูลถูกต้อง
- [ ] **AC-2**: คืนค่า HTTP 401 เมื่อรหัสผ่านไม่ถูกต้อง

## 📐 2. Technical Spec & Data Contracts
### 2.1 Mechanical Input Coverage Test
| Target Field | Named Data Source | Pre-condition |
| :--- | :--- | :--- |
| email, password | Request Body | Settled: User Form Input |
| token | Generated JWT | Settled: HMAC-SHA256 |

## 📋 3. Implementation Checklist (Strict TDD)
- [ ] **Task 1: JWT Session Signer**
  - [ ] 1.1 [TDD-Red]: เขียน test คาดหวัง token จาก payload
  - [ ] 1.2 [TDD-Green]: สร้างฟังก์ชัน signSessionToken()
  - [ ] 1.3 [TDD-Refactor]: ปรับปรุง security parameters

## 🧪 5. Multi-Lane Verification Matrix
| Lane | Command / Verification | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| Typecheck | npm run typecheck | 0 errors | ⏳ Pending |
| Unit Tests | npm test | 100% tests passing | ⏳ Pending |</code></pre>
        `
      },
      {
        id: 'adr-example',
        title: '2. ตัวอย่าง Architecture Decision Record (ADR)',
        contentHtml: `
          <p>ตัวอย่างการบันทึกการตัดสินใจทางสถาปัตยกรรมใน <code>devflow/decisions/ADR-001.md</code>:</p>
          <pre><code># ADR-001: Use SQLite with WAL Mode for Local Storage

- **Status**: Accepted
- **Date**: 2026-09-17
- **Deciders**: Lead Architect, Full-Stack Developer

## Context & Problem Statement
ต้องการระบบจัดเก็บข้อมูลแบบ Local-First ที่รวดเร็ว ไร้ Dependency ภายนอก และรองรับ Concurrent Reads

## Considered Options
1. SQLite (better-sqlite3) with WAL mode (Recommended)
2. JSON Flat Files
3. Embedded LevelDB

## Decision Outcome
เลือกตัวเลือกที่ 1 เพราะมี Transaction Integrity และ Performance สูงสุดในสภาพแวดล้อม Local-Only</code></pre>
        `
      }
    ]
  },

  // 5. Tool Adapters
  {
    slug: 'tool-adapters',
    category: 'REFERENCE',
    title: 'Tool Adapters (การรองรับ AI Assistants)',
    lead: 'การรองรับเครื่องมือ AI Coding Assistant หลักทุกตัว: Google Antigravity, Claude Code, Codex, Copilot, OpenCode',
    pills: ['Reference', 'Adapters', 'Antigravity', 'ClaudeCode', 'Codex', 'Copilot', 'OpenCode'],
    sections: [
      {
        id: 'supported-adapters',
        title: 'เครื่องมือและรูปแบบคำสั่งที่รองรับ (Universal Invocation)',
        contentHtml: `
          <p>Nexus-DevFlow ออกแบบมาเพื่อทำงานร่วมกับเครื่องมือ AI ยอดนิยมอย่างไร้รอยต่อ:</p>
          <table>
            <thead><tr><th>เครื่องมือ AI</th><th>ตำแหน่งทักษะ (Skill Path)</th><th>รูปแบบคำสั่งที่แนะนำ</th></tr></thead>
            <tbody>
              <tr><td><strong>Google Antigravity IDE</strong></td><td><code>.agents/skills/</code></td><td>Slash Command เช่น <code>/feature</code>, <code>/implement</code>, <code>/check</code></td></tr>
              <tr><td><strong>Claude Code</strong></td><td><code>.claude/skills/</code></td><td>Slash Command เช่น <code>/feature</code>, <code>/implement</code>, <code>/complete</code></td></tr>
              <tr><td><strong>OpenAI Codex CLI</strong></td><td><code>.agents/skills/</code></td><td>Dollar Prefix เช่น <code>$feature</code>, <code>$continuous</code></td></tr>
              <tr><td><strong>GitHub Copilot</strong></td><td><code>.agents/skills/</code></td><td>Plain Command เช่น <code>feature 1</code>, <code>implement 1</code></td></tr>
              <tr><td><strong>OpenCode / Aider</strong></td><td><code>.agents/skills/</code> / <code>AGENTS.md</code></td><td>Slash หรือ Plain Command</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'adapter-synchronization',
        title: 'การซิงค์ทักษะข้าม Adapters แบบ Dual-Tree',
        contentHtml: `
          <p>Nexus-DevFlow จัดการทักษะทั้งใน <code>.agents/skills/</code> และ <code>.claude/skills/</code> ให้มี Schema และพฤติกรรมที่สอดคล้องกัน 100% เพื่อให้นักพัฒนาสามารถสลับใช้เครื่องมือ AI ตัวใดก็ได้ตามความถนัดโดยไม่ต้องตั้งค่าใหม่</p>
        `
      }
    ]
  },

  // 6. Local-Only Mode
  {
    slug: 'local-only-mode',
    category: 'REFERENCE',
    title: 'Local-Only Mode (ความเป็นส่วนตัว 100%)',
    lead: 'การใช้งาน Nexus-DevFlow ในสภาพแวดล้อมที่ปิดกั้นอินเทอร์เน็ต (Air-Gapped) หรือต้องการความเป็นส่วนตัวสูงสุด',
    pills: ['Reference', 'LocalOnly', 'Privacy', 'Offline', 'AirGapped', 'ZeroDataLeak'],
    sections: [
      {
        id: 'privacy-guarantee',
        title: 'การรักษาความลับและความเป็นส่วนตัว 100%',
        contentHtml: `
          <p>Nexus-DevFlow ยึดมั่นในปรัชญา <strong>Local-First & Zero-Data-Leak</strong>:</p>
          <ul>
            <li><strong>ไม่มีการส่งโค้ด แผนงาน หรือข้อมูลของโปรเจกต์</strong>ออกไปยังเซิร์ฟเวอร์ภายนอกของ DevFlow ใดๆ ทั้งสิ้น</li>
            <li>ไฟล์สถานะและ Living Specs ทั้งหมดเก็บเป็น Local Markdown บนเครื่องของคุณ 100%</li>
            <li>รองรับการทำงานในสภาพแวดล้อมปิด (Air-Gapped / Corporate Network) ร่วมกับ Local LLM (เช่น Ollama, vLLM) ได้อย่างสมบูรณ์แบบ</li>
            <li>ไม่มีการรัน <code>git push</code> อัตโนมัติในทุกกรณี</li>
          </ul>
        `
      }
    ]
  },

  // 7. Project Configuration
  {
    slug: 'project-configuration',
    category: 'REFERENCE',
    title: 'Project Configuration (config.json)',
    lead: 'คู่มือการตั้งค่า devflow/config.json เพื่อควบคุม Quality Gates, Git Prefixes, และ Review Policies',
    pills: ['Reference', 'Config', 'QualityGates', 'Policies', 'JSONSchema'],
    sections: [
      {
        id: 'schema-breakdown',
        title: 'โครงสร้างและพารามิเตอร์ของ devflow/config.json',
        contentHtml: `
          <pre><code>{
  "$schema": "https://raw.githubusercontent.com/Jakkrich/nexus-devflow/main/schemas/config.schema.json",
  "schemaVersion": 1,
  "workflow": {
    "stepReview": "feature",          // "feature" (Efficient) หรือ "every" (Guided)
    "checkpointCommits": "disabled"   // "disabled" หรือ "enabled"
  },
  "git": {
    "featureBranchPrefix": "feature/",
    "fixBranchPrefix": "fix/",
    "rollbackBranchPrefix": "rollback/"
  },
  "qualityGates": {
    "regular": {
      "audit": "manual",              // "manual", "when-sensitive", "always"
      "independentReview": "when-sensitive",
      "check": "manual",
      "tryGuide": "manual"
    },
    "continuous": {
      "audit": "when-sensitive",
      "independentReview": "when-sensitive",
      "check": "when-behavioral",
      "tryGuide": "manual"
    }
  },
  "review": {
    "independentExecution": "automatic" // "automatic" (Fresh subagent) หรือ "manual" (Fresh session)
  }
}</code></pre>
        `
      },
      {
        id: 'quality-gate-options',
        title: 'ความหมายของค่าใน Quality Gates',
        contentHtml: `
          <ul>
            <li><strong><code>manual</code></strong>: รันเฉพาะเมื่อผู้ใช้สั่งการด้วยตนเอง (เช่น <code>/audit</code>)</li>
            <li><strong><code>when-sensitive</code> (แนะนำ)</strong>: รันอัตโนมัติเฉพาะฟีเจอร์ที่แตะต้องความปลอดภัย, Auth, ข้อมูลผู้ใช้ หรือสถาปัตยกรรมหลัก</li>
            <li><strong><code>always</code></strong>: บังคับรันในทุกๆ ฟีเจอร์ก่อนปิดงาน</li>
            <li><strong><code>when-behavioral</code></strong>: รันเฉพาะฟีเจอร์ที่มีการเปลี่ยนแปลง Logic การทำงาน</li>
          </ul>
        `
      }
    ]
  },

  // 8. Try migration
  {
    slug: 'commands/try',
    category: 'REFERENCE',
    title: 'Manual Review With Try (/try)',
    lead: 'คู่มือการใช้งานคำสั่ง /try เพื่อสร้าง Manual Walkthrough สำหรับการตรวจรับระบบด้วยตนเอง (UAT)',
    pills: ['Reference', 'Try', 'ManualReview', 'Walkthrough', 'QA', 'UAT'],
    sections: [
      {
        id: 'try-usage',
        title: 'การเรียกใช้คำสั่ง /try',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/try</code> เมื่อต้องการคำแนะนำว่าต้องทดสอบฟีเจอร์ที่เพิ่งพัฒนาอย่างไรบนหน้าจอ:</p>
          <pre><code># สร้างคู่มือสำหรับงานปัจจุบัน
/try

# หรือสร้างสำหรับฟีเจอร์ที่ระบุ
/try 1</code></pre>
        `
      },
      {
        id: 'try-structure',
        title: 'โครงสร้างของ Manual Try Guide',
        contentHtml: `
          <ul>
            <li><strong>Environment Preparation</strong>: คำสั่งรัน Dev Server และเตรียมบัญชีทดสอบ</li>
            <li><strong>Step-by-Step UI Actions</strong>: รายการคลิก กรอกข้อมูล และกดปุ่มตามลำดับ</li>
            <li><strong>Expected Observable Proof</strong>: ภาพหรือข้อความที่ควรปรากฏบนหน้าจอ</li>
            <li><strong>Failure Signs</strong>: อาการผิดปกติที่บ่งชี้ว่าระบบมีบั๊ก</li>
          </ul>
        `
      }
    ]
  },

  // 9. Browser Tests migration
  {
    slug: 'commands/browser-tests',
    category: 'REFERENCE',
    title: 'Browser Tests (/browser-tests)',
    lead: 'การติดตั้ง Playwright Test Harness และเชื่อมต่อ MCP BrowserOS Neo สำหรับการทดสอบหน้าเว็บและ UI อัตโนมัติ',
    pills: ['Reference', 'BrowserTests', 'Playwright', 'BrowserOS', 'E2E', 'VisualQA'],
    sections: [
      {
        id: 'browser-tests-usage',
        title: 'การตั้งค่าและใช้งาน Browser Tests',
        contentHtml: `
          <p>ติดตั้ง Test Harness สำหรับการทดสอบเบราว์เซอร์ด้วยคำสั่ง:</p>
          <pre><code>/browser-tests</code></pre>
          <p>ระบบจะทำการติดตั้ง Playwright, สร้างไฟล์ Config, เพิ่มคำสั่ง <code>npm run test:browser</code> และเชื่อมต่อกับ BrowserOS Neo MCP (<code>http://127.0.0.1:9010/mcp</code>) เพื่อให้ AI สามารถเปิดหน้าเว็บจริงและบันทึกภาพหน้าจอได้</p>
        `
      }
    ]
  }
];
