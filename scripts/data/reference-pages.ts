import type { DocPage } from '../build-docs-site.js';

export const REFERENCE_PAGES: DocPage[] = [
  // 1. File Reference
  {
    slug: 'file-reference',
    category: 'REFERENCE',
    title: 'File Reference (โครงสร้างไฟล์และหน้าที่)',
    lead: 'เอกสารอธิบายโครงสร้างไฟล์และโฟลเดอร์ทั้งหมดภายใต้ devflow/ และหน้าที่ของแต่ละไฟล์ในระบบอย่างละเอียด',
    pills: ['Reference', 'Files', 'Structure', 'Pillars', 'Architecture', 'Schema'],
    sections: [
      {
        id: 'directory-tree',
        title: 'โครงสร้างไดเรกทอรี devflow/ ทั้งหมด',
        contentHtml: `
          <p>Nexus-DevFlow จัดเก็บไฟล์การวางแผน บริบท และประวัติทั้งหมดไว้ในโฟลเดอร์ <code>devflow/</code> ที่ Root ของโปรเจกต์:</p>
          <pre><code>devflow/
├── config.json              # นโยบายเวิร์กโฟลว์, Review Cadence และ Quality Gates
├── project-plan.md          # เป้าหมายผลิตภัณฑ์, สถาปัตยกรรม, Non-functional Requirements
├── build-plan.md            # รายการฟีเจอร์ตามลำดับการสร้างจริง (Checklist)
├── ideas.md                 # กล่องรับไอเดียและการประเมินคะแนนความเป็นไปได้
├── context/                 # Living Source of Truth และ Task Workspaces
│   ├── project-overview.md  # สรุปบริบทโปรเจกต์ที่คอมไพล์แล้ว (<20KB)
│   ├── coding-standards.md  # มาตรฐานและข้อตกลงในการเขียนโค้ด
│   ├── ai-interaction.md    # กฎการสื่อสารและการรีวิวของ AI
│   ├── glossary.md          # พจนานุกรมศัพท์เฉพาะทางและโมเดลข้อมูล
│   └── {xxx-slug}/          # Task-Isolated Workspace ปัจจุบัน (ถูกลบเมื่อปิดงาน)
│       ├── spec.md          # Living Spec ประจำฟีเจอร์
│       ├── stage.md         # ตัวชี้ขั้นตอนการทำงาน (feature, implement, check, complete)
│       └── findings.md      # Findings Ledger สำหรับบันทึกข้อค้นพบ
├── discoveries/             # รายงานการสำรวจระดับ Pre-Flight (DISC-ID)
├── decisions/               # Architecture Decision Records (ADR-NNN)
├── inbox/                   # เอกสารความต้องการและสเปกดิบ (PDF, Word, Excel, Images)
├── analysis/                # ผลการแปลงเอกสารและการสแกนผลกระทบต่อโค้ดเบส
├── history/                 # คลังประวัติการส่งมอบงานถาวร
│   ├── features/            # เอกสารสรุปฟีเจอร์ที่ส่งมอบแล้ว ({xxx-slug}.md)
│   ├── fixes/               # เอกสารสรุปบั๊กที่แก้ไขแล้ว
│   ├── rollbacks/           # เอกสารการย้อนคืนฟีเจอร์
│   └── HISTORY.md           # Release Changelog ภาพรวมทั้งหมด
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
            </tbody>
          </table>
        `
      }
    ]
  },

  // 2. Tool Adapters
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

  // 3. Local-Only Mode
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

  // 4. Project Configuration
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

  // 5. Try migration
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

  // 6. Browser Tests migration
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
