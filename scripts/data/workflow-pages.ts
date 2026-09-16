import type { DocPage } from '../build-docs-site.js';

export const WORKFLOW_PAGES: DocPage[] = [
  {
    slug: 'core-workflow',
    category: 'WORKFLOW',
    title: 'Core Workflow (วงจร 4 ขั้นตอนการพัฒนา)',
    lead: 'สถาปัตยกรรม The 3-Pillars Workspace และวงจร Pure Task-Isolated Living Spec Model สำหรับการพัฒนาซอฟต์แวร์ด้วย AI อย่างเป็นระบบ',
    pills: ['Workflow', '3-Pillars', 'LivingSpec', 'TDD', 'SquashMerge', 'TaskIsolation', 'VerificationMatrix', 'Diagrams'],
    sections: [
      {
        id: 'the-3-pillars',
        title: 'สถาปัตยกรรม 3 เสาหลัก (The 3-Pillars Workspace Architecture)',
        contentHtml: `
          <p>ปัญหาคลาสสิกของการใช้ AI ในการเขียนโค้ดคือ AI มักจะจำประวัติเก่าจนเกิด Context Bloat หรือลืมบริบทสำคัญของโปรเจกต์ Nexus-DevFlow แก้ไขปัญหานี้ด้วยการแบ่งเวลาและพื้นที่ของ Workspace ออกเป็น 3 เสาหลักที่ตัดขาดจากกันอย่างชัดเจน:</p>
          <pre><code>┌─────────────────────────────────────────────────────────────────────────┐
│                    NEXUS-DEVFLOW 3-PILLARS MODEL                        │
└─────────────────────────────────────────────────────────────────────────┘

  1. 🔮 FUTURE (Backlog)
     ├── devflow/ideas.md          (Idea Inbox & Feasibility Scoring)
     ├── devflow/project-plan.md   (High-level System Vision & NFRs)
     └── devflow/build-plan.md     (Master Linear Feature Checklist)
                 │
                 ▼
  2. ⚡ PRESENT (Active Workspace)
     ├── devflow/context/project-overview.md  (Compiled Living Source of Truth <20KB)
     ├── devflow/context/coding-standards.md  (Project Coding Standards)
     ├── devflow/context/glossary.md          (Settled Domain Terminology)
     └── devflow/context/{xxx-slug}/          (Task-Isolated Workspace)
         ├── spec.md                          (Living Spec & TDD Tasks)
         ├── stage.md                         (Current Stage Pointer)
         └── findings.md                      (Isolated Findings Ledger)
                 │
                 ▼
  3. 📦 PAST (History Archive)
     ├── devflow/history/features/{xxx-slug}.md
     ├── devflow/history/fixes/{xxx-slug}.md
     ├── devflow/history/rollbacks/{xxx-slug}.md
     └── devflow/history/HISTORY.md           (Release Changelog)</code></pre>
          <table>
            <thead><tr><th>เสาหลัก (Pillar)</th><th>โฟลเดอร์ / ไฟล์</th><th>ความหมายและหน้าที่</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>1. 🔮 Future (อนาคต)</strong></td>
                <td><code>devflow/ideas.md</code><br><code>devflow/project-plan.md</code><br><code>devflow/build-plan.md</code></td>
                <td>กล่องรับไอเดีย แผนงานระดับผลิตภัณฑ์ และรายการฟีเจอร์ที่รอการพัฒนาในอนาคต</td>
              </tr>
              <tr>
                <td><strong>2. ⚡ Present (ปัจจุบัน)</strong></td>
                <td><code>devflow/context/project-overview.md</code><br><code>devflow/context/{xxx-slug}/</code></td>
                <td>Living Source of Truth ร่วมกัน และพื้นที่พัฒนาฟีเจอร์ปัจจุบันที่แยกเอกเทศ (Task-Isolated Workspace)</td>
              </tr>
              <tr>
                <td><strong>3. 📦 Past (อดีต)</strong></td>
                <td><code>devflow/history/features/</code><br><code>devflow/history/fixes/</code><br><code>devflow/history/rollbacks/</code><br><code>devflow/history/HISTORY.md</code></td>
                <td>คลังจัดเก็บประวัติการตัดสินใจและผลลัพธ์ของฟีเจอร์ที่ส่งมอบแล้วอย่างถาวร</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: '4-stage-lifecycle',
        title: 'วงจร 4 ขั้นตอนการพัฒนา (The 4-Stage Living Spec Lifecycle)',
        contentHtml: `
          <p>ทุกงานพัฒนา ไม่ว่าจะเป็นฟีเจอร์ใหม่หรือการแก้บั๊ก จะดำเนินผ่านวงจร 4 ขั้นตอนแบบต่อเนื่อง:</p>
          <pre><code> [Build Plan Item]
        │
        ▼
 ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
 │   /feature   │ ──▶  │  /implement  │ ──▶  │    /check    │ ──▶  │  /complete   │
 │   or /fix    │      │ (Strict TDD) │      │  (Senior QA) │      │ (SquashMerge)│
 └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
        │                     │                     │                     │
        ▼                     ▼                     ▼                     ▼
 • Allocates Task ID   • Red: Failing Test   • 5-Lane Verification • Release Digest
 • Generates spec.md   • Green: Code to pass • Typecheck & Lint    • Archive to history
 • Sets stage: feature • Refactor: Clean     • Tests & Manual Proof• Remove context/xxx
 • findings.md ledger  • Collects Diff Proof • findings.md check   • Squash-merge main</code></pre>
          <table>
            <thead><tr><th>ขั้นตอน</th><th>คำสั่ง</th><th>คำอธิบายกระบวนการ</th><th>ผลลัพธ์ (Artifact)</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>1. Feature / Fix (Spec)</strong></td>
                <td><code>/feature [id]</code> หรือ <code>/fix</code></td>
                <td>วิเคราะห์ขอบเขต จัดสรร Task ID (เช่น <code>001-user-auth</code>), สลับ branch และร่าง Living Spec พร้อม Data Contracts และ TDD Tasks</td>
                <td><code>devflow/context/{id}/spec.md</code><br><code>stage.md</code>, <code>findings.md</code></td>
              </tr>
              <tr>
                <td><strong>2. Implement</strong></td>
                <td><code>/implement [id]</code></td>
                <td>ดำเนินการเขียนโค้ดตาม Task Checklist ด้วยวินัย Strict TDD (Red-Green-Refactor) และบันทึกผลการทดสอบและ Diff Evidence</td>
                <td>Code diffs + Test Evidence</td>
              </tr>
              <tr>
                <td><strong>3. Check</strong></td>
                <td><code>/check [id]</code></td>
                <td>ตรวจรับระดับ Senior QA รัน Verification Matrix (Typecheck, Lint, Test, Manual Proof) และบันทึกลง findings.md</td>
                <td>Empirical Proof + Manual Try Guide</td>
              </tr>
              <tr>
                <td><strong>4. Complete</strong></td>
                <td><code>/complete [id]</code></td>
                <td>สรุป Release Digest ย้ายเอกสารเข้า History Archive อัปเดต Build Plan และทำ Git Squash-Merge เข้าสู่ main</td>
                <td><code>devflow/history/{type}/{id}.md</code><br><code>HISTORY.md</code></td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'branch-isolation-and-tdd',
        title: 'การแยก Branch และวินัย Strict TDD',
        contentHtml: `
          <div class="docs-callout note">
            <div class="docs-callout-label">Branch Isolation Guarantee</div>
            <p>Nexus-DevFlow บังคับให้งานทุกชิ้นถูกพัฒนาบน Branch เฉพาะงาน (เช่น <code>feature/001-auth</code>) เสมอ เพื่อป้องกันไม่ให้โค้ดที่ยังไม่ผ่านการตรวจรับรั่วไหลเข้าสู่ branch หลัก (<code>main</code>)</p>
          </div>
          <p>ในขั้นตอน <code>/implement</code> AI จะยึดหลักการ Red-Green-Refactor อย่างเคร่งครัด:</p>
          <ol>
            <li><strong>Red</strong>: เขียนชุดการทดสอบ (Unit Test) ที่ล้มเหลวก่อนเพื่อยืนยันเงื่อนไขที่ถูกต้อง</li>
            <li><strong>Green</strong>: เขียนโค้ดการทำงานจริงที่เรียบง่ายที่สุดเพื่อให้ชุดการทดสอบผ่าน 100%</li>
            <li><strong>Refactor</strong>: ปรับปรุงโครงสร้างโค้ดให้สะอาด ปลอดภัย และตรงตาม Coding Standards โดยที่ Test ยังคงผ่านทั้งหมด</li>
          </ol>
        `
      },
      {
        id: 'multi-run-support',
        title: 'การสนับสนุนการวางแผนคู่ขนาน (Multi-Run Spec-Ahead)',
        contentHtml: `
          <p>คุณสามารถร่างสเปกล่วงหน้าได้หลายฟีเจอร์พร้อมกัน เช่น รัน <code>/feature 1</code>, <code>/feature 2</code>, <code>/feature 3</code> ระบบจะสร้าง Workspace แยกโฟลเดอร์กันใน <code>devflow/context/</code> โดยไม่รบกวนกัน ทำให้การส่งต่องานในทีมทำได้อย่างลื่นไหล</p>
        `
      },
      {
        id: 'zero-push-safety',
        title: 'หลักการความปลอดภัย Zero-Push',
        contentHtml: `
          <div class="docs-callout success">
            <div class="docs-callout-label">Zero-Push Safety Guarantee</div>
            <p>Nexus-DevFlow จะ<strong>ไม่มีวันรันคำสั่ง <code>git push</code></strong> ไปยัง Remote Server โดยอัตโนมัติ การตัดสินใจ Push โค้ดขึ้นสู่ GitHub, GitLab หรือ Production เป็นสิทธิ์ขาดของนักพัฒนาเสมอ</p>
          </div>
        `
      }
    ]
  }
];
