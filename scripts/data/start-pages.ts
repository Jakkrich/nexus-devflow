import type { DocPage } from '../build-docs-site.js';

export const START_PAGES: DocPage[] = [
  // 1. Getting Started
  {
    slug: 'getting-started',
    category: 'START',
    title: 'เริ่มต้นใช้งาน (Getting Started)',
    lead: 'ติดตั้งเลเยอร์เวิร์กโฟลว์ Nexus-DevFlow ลงในโปรเจกต์ที่สร้างโครงร่างไว้แล้ว และเตรียมพร้อมสำหรับการพัฒนาฟีเจอร์แรกผ่านวงจร Task-Isolated Living Spec',
    pills: ['Start', 'Guide', 'Install', 'Onboard', 'Zero-Lock-in', '3-Pillars', 'LivingSpec'],
    sections: [
      {
        id: 'what-devflow-adds',
        title: 'สิ่งที่ Nexus-DevFlow เพิ่มเข้ามา (What DevFlow Adds)',
        contentHtml: `
          <p>Nexus-DevFlow เป็นเฟรมเวิร์กจัดการเวิร์กโฟลว์การเขียนโค้ดด้วย AI สำหรับแอปพลิเคชันที่คุณได้สร้างโครงร่างไว้แล้ว โดยจะติดตั้งไฟล์วางแผนที่ทนทาน, Agent Skills ที่มีความเชี่ยวชาญเฉพาะทาง 38+ ทักษะ, และประตูด่านตรวจคุณภาพ (Quality Gates) เข้าไปในโฟลเดอร์ <code>devflow/</code> โดยไม่ดัดแปลงสถาปัตยกรรมแอปพลิเคชันเดิมและไม่มีภาระ Runtime เพิ่มเติม</p>
          <table>
            <thead>
              <tr><th>เลเยอร์ (Layer)</th><th>ตำแหน่งโฟลเดอร์ / ไฟล์</th><th>หน้าที่และความสำคัญ</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>1. Plans (แผนงาน)</strong></td><td><code>devflow/project-plan.md</code><br><code>devflow/build-plan.md</code></td><td>กำหนดทิศทางผลิตภัณฑ์และลำดับความสำคัญของฟีเจอร์ที่คุณเป็นเจ้าของ 100%</td></tr>
              <tr><td><strong>2. Configuration</strong></td><td><code>devflow/config.json</code></td><td>แชร์นโยบายเวิร์กโฟลว์และเกณฑ์ Quality Gates ให้ AI ทุกเครื่องมืออ่านตรงกัน</td></tr>
              <tr><td><strong>3. Living Context</strong></td><td><code>devflow/context/project-overview.md</code></td><td>ให้ AI Agent ในทุก Session เข้าใจบริบทโปรเจกต์ตรงกันแบบ Living Source of Truth (<20KB)</td></tr>
              <tr><td><strong>4. Task Workspace</strong></td><td><code>devflow/context/{xxx-slug}/spec.md</code></td><td>แยกพื้นที่พัฒนาแต่ละฟีเจอร์อย่างเป็นอิสระ มี Living Spec และ Findings Ledger ประจำงาน</td></tr>
              <tr><td><strong>5. History Archive</strong></td><td><code>devflow/history/</code></td><td>เก็บบันทึกประวัติการตัดสินใจและผลลัพธ์ของฟีเจอร์ที่ส่งมอบแล้วอย่างถาวร</td></tr>
            </tbody>
          </table>
          <div class="docs-callout success">
            <div class="docs-callout-label">Zero-Lock-In & Pure Standalone</div>
            <p>Nexus-DevFlow ไม่ใช่ App Starter Boilerplate คุณสามารถเลือกภาษา เฟรมเวิร์ก สถาปัตยกรรม (TypeScript, Go, Python, Rust, PHP, Java) และโครงสร้างพื้นฐานที่ต้องการได้ก่อนอย่างอิสระ 100%</p>
          </div>
        `
      },
      {
        id: 'fresh-project-setup',
        title: 'ขั้นตอนการติดตั้งโปรเจกต์ใหม่ (5-Step Setup Loop)',
        contentHtml: `<p>ปฏิบัติตาม 5 ขั้นตอนมาตรฐานเพื่อติดตั้งและเริ่มใช้งานเวิร์กโฟลว์เข้าสู่โปรเจกต์ของคุณ:</p>`,
        subsections: [
          {
            id: 'step-1-scaffold',
            title: '1. สร้างโครงร่างแอปพลิเคชัน (Scaffold the application)',
            contentHtml: `
              <p>เริ่มต้นสร้างโฟลเดอร์โปรเจกต์และสร้างแอปพลิเคชันด้วยเครื่องมือที่คุณต้องการตามปกติ จากนั้นทำการกำหนด Git Repository:</p>
              <pre><code><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> create</span><span style="color:#A5D6FF"> vite@latest</span><span style="color:#A5D6FF"> my-app</span>
<span style="color:#79C0FF">cd</span><span style="color:#A5D6FF"> my-app</span>
<span style="color:#FFA657">git</span><span style="color:#A5D6FF"> init</span></code></pre>
            `
          },
          {
            id: 'step-2-install',
            title: '2. ติดตั้ง Nexus-DevFlow Overlay',
            contentHtml: `
              <p>รันตัวติดตั้งเพื่อ Overlay โครงสร้างโฟลเดอร์ <code>devflow/</code> และ AI Agent Skills เข้าสู่โปรเจกต์:</p>
              <pre><code><span style="color:#FFA657">npx</span><span style="color:#A5D6FF"> -y</span><span style="color:#A5D6FF"> nexus-devflow</span><span style="color:#A5D6FF"> -y</span></code></pre>
              <p>หรือสามารถใช้ <code>npm create @jakkrichm/nexus-devflow</code> ก็ได้ผลลัพธ์เหมือนกัน</p>
            `
          },
          {
            id: 'step-3-onboard',
            title: '3. ปรับแต่งเวิร์กโฟลว์ด้วย /onboard',
            contentHtml: `
              <p>ในหน้าต่างแชตของ AI assistant (เช่น Google Antigravity, Claude Code, Cursor) ให้รันคำสั่ง <code>/onboard</code>:</p>
              <pre><code>/onboard</code></pre>
              <p>AI จะทำการตรวจสอบ dependencies, คำสั่ง build/test และถามระดับการตรวจรับ (Review Cadence) ที่คุณต้องการ</p>
            `
          },
          {
            id: 'step-4-plans',
            title: '4. เขียนแผนงานที่คุณเป็นเจ้าของ (Write the two plans you own)',
            contentHtml: `
              <p>กรอกเป้าหมายผลิตภัณฑ์ใน <code>devflow/project-plan.md</code> และเขียนรายการฟีเจอร์ใน <code>devflow/build-plan.md</code>:</p>
              <pre><code>## 🚀 Phase 1: MVP Core
- [ ] 1. โครงสร้าง Database Schema และ Migrations
- [ ] 2. ระบบยืนยันตัวตนผู้ใช้ (Auth & Session)
- [ ] 3. แดชบอร์ดสรุปผลแบบเรียลไทม์</code></pre>
            `
          },
          {
            id: 'step-5-overview',
            title: '5. คอมไพล์บริบทด้วย /overview',
            contentHtml: `
              <p>รันคำสั่ง <code>/overview</code> เพื่อคอมไพล์สรุปบริบทลงใน <code>devflow/context/project-overview.md</code>:</p>
              <pre><code>/overview</code></pre>
            `
          }
        ]
      },
      {
        id: 'the-shortest-successful-loop',
        title: 'วงจรการพัฒนาที่สั้นและปลอดภัยที่สุด (The Shortest Successful Loop)',
        contentHtml: `
          <p>หลังจากติดตั้งเสร็จสิ้น ทุกฟีเจอร์จะพัฒนาผ่านวงจร 4 ขั้นตอนที่รัดกุม:</p>
          <pre><code><span style="color:#76a8ff;">/feature</span> ──▶ <span style="color:#e8bd72;">review</span> ──▶ <span style="color:#70d5a9;">/implement</span> ──▶ <span style="color:#76a8ff;">/check</span> ──▶ <span style="color:#0b7a53;">/complete</span></code></pre>
          <table>
            <thead><tr><th>คำสั่ง</th><th>คำอธิบายหน้าที่</th></tr></thead>
            <tbody>
              <tr><td><code>/feature 1</code></td><td>ดึงรายการที่ 1 มาร่าง Living Spec เฉพาะงาน (<code>devflow/context/001-xxx/spec.md</code>)</td></tr>
              <tr><td><code>/implement 1</code></td><td>พัฒนาโค้ดด้วยวินัย Strict TDD บน branch <code>feature/001-xxx</code></td></tr>
              <tr><td><code>/check 1</code></td><td>ตรวจรับคุณภาพหลายมิติและทดสอบฟังก์ชันจริง</td></tr>
              <tr><td><code>/complete 1</code></td><td>จัดเก็บประวัติเข้า History Archive และทำ Git Squash-Merge เข้า main</td></tr>
            </tbody>
          </table>
        `
      }
    ]
  },

  // 2. Existing Codebase Adoption
  {
    slug: 'existing-codebase',
    category: 'START',
    title: 'Existing Codebase Adoption (Brownfield)',
    lead: 'ติดตั้งและประยุกต์ใช้ Nexus-DevFlow เข้ากับโปรเจกต์เดิมที่มีโค้ดเบสอยู่แล้วผ่านคำสั่ง /adopt โดยไม่รบกวนประวัติ Git เดิม',
    pills: ['Adopt', 'Brownfield', 'Legacy', 'Survey', 'Migration', 'Reconciliation'],
    sections: [
      {
        id: 'why-adopt',
        title: 'ทำไมต้องใช้ /adopt กับโค้ดเบสเดิม?',
        contentHtml: `
          <p>สำหรับโปรเจกต์ที่กำลังพัฒนาอยู่แล้วหรือมีโค้ดเบสเดิม การ Onboard แบบโปรเจกต์ใหม่อาจทำให้ AI สับสนว่าฟังก์ชันใดสร้างไปแล้ว คำสั่ง <code>/adopt</code> ถูกออกแบบมาเพื่อทำหน้าที่สำรวจ (Survey) โค้ดเบสที่มีอยู่จริง ระบุความสามารถที่ส่งมอบไปแล้ว และสร้างแผนงานส่วนต่อขยายได้อย่างแม่นยำ</p>
          <div class="docs-callout note">
            <div class="docs-callout-label">สิ่งที่ /adopt แตกต่างจาก /onboard</div>
            <p><code>/onboard</code> จะมองโปรเจกต์เป็นผ้าขาวและเตรียมสร้างฟีเจอร์ที่ 1 ในขณะที่ <code>/adopt</code> จะอ่านโค้ดจริง วิเคราะห์ Endpoint/UI ที่มีอยู่ และสร้าง Build Plan เฉพาะส่วนที่ยังขาดอยู่</p>
          </div>
        `
      },
      {
        id: 'adoption-lifecycle',
        title: 'ขั้นตอน 4 สเต็ปในการ Adopt โค้ดเบสเดิม',
        contentHtml: `<p>ปฏิบัติตาม 4 สเต็ปด้านล่าง:</p>`,
        subsections: [
          {
            id: 'adopt-step-1',
            title: '1. ติดตั้ง Overlay ลงใน Repository เดิม',
            contentHtml: `
              <p>รันตัวติดตั้งใน Root directory ของโปรเจกต์เดิมของคุณ:</p>
              <pre><code>npx -y nexus-devflow -y</code></pre>
              <p>ตัวติดตั้งจะสร้างโฟลเดอร์ <code>devflow/</code> และ <code>.agents/</code> หรือ <code>.claude/</code> โดยไม่แตะต้องไฟล์โค้ดต้นฉบับใดๆ</p>
            `
          },
          {
            id: 'adopt-step-2',
            title: '2. รันคำสั่ง /adopt',
            contentHtml: `
              <p>สั่งการ AI ด้วยคำสั่ง:</p>
              <pre><code>/adopt</code></pre>
              <p>AI จะทำการสำรวจ Dependencies, Directory Tree, API Endpoints, สถาปัตยกรรม Database, และชุดคำสั่ง Test/Lint ทั้งหมด</p>
            `
          },
          {
            id: 'adopt-step-3',
            title: '3. ปรับสมดุลแผนงาน (Reconcile Plans)',
            contentHtml: `
              <p>AI จะสร้างร่างเอกสาร <code>devflow/project-plan.md</code> อธิบายสถานะปัจจุบันของระบบ และร่าง <code>devflow/build-plan.md</code> พร้อมทำเครื่องหมายฟังก์ชันเดิมที่เสร็จแล้ว <code>- [x]</code></p>
            `
          },
          {
            id: 'adopt-step-4',
            title: '4. คอมไพล์บริบทด้วย /overview',
            contentHtml: `
              <p>รันคำสั่ง <code>/overview</code> เพื่อสร้าง Source of Truth สำหรับโปรเจกต์:</p>
              <pre><code>/overview</code></pre>
            `
          }
        ]
      },
      {
        id: 'zero-regression',
        title: 'การรับประกัน Zero-Regression & Non-Destructive Survey',
        contentHtml: `
          <p>การรัน <code>/adopt</code> มีการรับประกันความปลอดภัยระดับองค์กร:</p>
          <ul>
            <li><strong>ไม่มีการลบหรือดัดแปลงซอร์สโค้ดเดิม</strong>: <code>/adopt</code> อ่านเพื่อวิเคราะห์เท่านั้น</li>
            <li><strong>รักษาโครงสร้างโฟลเดอร์เดิม</strong>: ไม่บังคับย้ายไฟล์หรือเปลี่ยนรูปแบบโปรเจกต์เดิม</li>
            <li><strong>ไม่แตะต้อง Git History</strong>: ประวัติ commit เดิมยังคงเดิม 100%</li>
          </ul>
        `
      }
    ]
  },

  // 3. Command Guide
  {
    slug: 'command-guide',
    category: 'START',
    title: 'Command Guide (คู่มือรวมชุดคำสั่ง)',
    lead: 'คู่มือสรุปชุดคำสั่งทั้งหมดกว่า 38+ คำสั่งของ Nexus-DevFlow จัดกลุ่มตามหมวดหมู่งานและความรับผิดชอบอย่างละเอียด',
    pills: ['Commands', 'Matrix', 'Reference', 'CheatSheet', 'Skills', '38-Skills'],
    sections: [
      {
        id: 'commands-matrix',
        title: 'ตารางสรุปชุดคำสั่งแยกตามหมวดหมู่ (Complete Command Matrix)',
        contentHtml: `
          <p>Nexus-DevFlow แบ่งทักษะออกเป็น 6 กลุ่มการทำงานหลัก ครอบคลุมตั้งแต่การวางแผนความต้องการจนถึงการส่งมอบขึ้น Production:</p>
          <table>
            <thead>
              <tr><th>หมวดหมู่</th><th>คำสั่ง (Slash / Plain)</th><th>หน้าที่ความรับผิดชอบ</th><th>ผลลัพธ์ที่สร้าง</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Core Lifecycle</strong></td>
                <td><code>/feature</code>, <code>/implement</code>, <code>/check</code>, <code>/complete</code></td>
                <td>วงจรพัฒนา 4 ขั้นตอน Task-Isolated Living Spec พร้อม TDD และ Squash-Merge</td>
                <td><code>spec.md</code>, Source Code, Test Proof, <code>history/</code></td>
              </tr>
              <tr>
                <td><strong>2. Pre-Flight & SA</strong></td>
                <td><code>/analyze</code>, <code>/discovery</code>, <code>/explore</code>, <code>/grill</code>, <code>/brainstorm</code>, <code>/idea</code></td>
                <td>วิเคราะห์เอกสารความต้องการ (PDF/Word/Excel), สำรวจ Roadmap, Domain Modeling, ADRs</td>
                <td><code>parsed.md</code>, <code>discovery.md</code>, <code>ADR-xxx.md</code>, <code>glossary.md</code></td>
              </tr>
              <tr>
                <td><strong>3. Health & Diagnostics</strong></td>
                <td><code>/status</code>, <code>/doctor</code>, <code>/debug</code>, <code>/fix</code>, <code>/brief</code></td>
                <td>ตรวจสุขภาพโปรเจกต์ วินิจฉัยหาสาเหตุของบั๊ก และสร้าง Living Spec สำหรับแก้ไขงานด่วน</td>
                <td>Health Report, Hypothesis Tests, Fix Specs</td>
              </tr>
              <tr>
                <td><strong>4. Quality & Review</strong></td>
                <td><code>/audit</code>, <code>/tests</code>, <code>/setup-tests</code>, <code>/browser-tests</code>, <code>/ci</code>, <code>/try</code>, <code>/bughunter</code></td>
                <td>ตรวจคุณภาพโค้ด ความปลอดภัย OWASP ระบบทดสอบ Unit/E2E และ GitHub Actions CI</td>
                <td><code>findings.md</code>, <code>review.md</code>, <code>ci.yml</code>, Try Guide</td>
              </tr>
              <tr>
                <td><strong>5. Automation & Ship</strong></td>
                <td><code>/autopilot</code>, <code>/continuous</code>, <code>/release</code>, <code>/rollback</code>, <code>/prototype</code></td>
                <td>รันลูปพัฒนาฟีเจอร์เดี่ยว/หลายฟีเจอร์อัตโนมัติ ตรวจสอบความพร้อม Production และแผนถอนโค้ด</td>
                <td>Automated Merges, Prototypes, Rollback Specs</td>
              </tr>
              <tr>
                <td><strong>6. Architecture & Utility</strong></td>
                <td><code>/overview</code>, <code>/archify</code>, <code>/diagram-design</code>, <code>/convert-any-to-md</code>, <code>/vendor</code>, <code>/ponytail</code>, <code>/report-html</code></td>
                <td>คอมไพล์บริบท สังเคราะห์แผนภาพสถาปัตยกรรม แปลงเอกสารดิบ และจัดการ Third-Party Repos</td>
                <td><code>project-overview.md</code>, Interactive HTML Diagrams, Clean Markdown</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'invocation-styles',
        title: 'รูปแบบการเรียกใช้คำสั่งในเครื่องมือต่างๆ (Universal Invocation)',
        contentHtml: `
          <p>คุณสามารถเรียกใช้คำสั่งได้ตามรูปแบบที่เครื่องมือ AI ของคุณรองรับ:</p>
          <ul>
            <li><strong>Slash Prefix (<code>/</code>)</strong>: แนะนำสำหรับ Google Antigravity IDE, Claude Code, Gemini CLI (เช่น <code>/feature</code>, <code>/implement</code>, <code>/check</code>)</li>
            <li><strong>Dollar Prefix (<code>$</code>)</strong>: สำหรับ OpenAI Codex CLI หรือเครื่องมือ Skill-invocation (เช่น <code>$feature</code>, <code>$continuous</code>)</li>
            <li><strong>Plain English / Thai</strong>: พิมพ์ชื่อคำสั่งหรือความต้องการได้โดยตรง (เช่น <code>feature 1</code>, <code>ช่วยรัน check ให้หน่อย</code>)</li>
          </ul>
        `
      }
    ]
  },

  // 4. Writing Your Plans
  {
    slug: 'writing-your-plans',
    category: 'START',
    title: 'Writing Your Plans (การเขียนแผนงาน)',
    lead: 'วิธีเขียน devflow/project-plan.md และ devflow/build-plan.md ให้มีประสิทธิภาพและช่วยให้ AI ทำงานได้อย่างแม่นยำ',
    pills: ['Plans', 'ProjectPlan', 'BuildPlan', 'Strategy', 'Roadmap', 'SpecWriter'],
    sections: [
      {
        id: 'two-plans-model',
        title: 'แนวคิดเอกสารสองฉบับที่คุณเป็นเจ้าของ (The Two Plans You Own)',
        contentHtml: `
          <p>ใน Nexus-DevFlow คุณควบคุมทิศทางของโปรเจกต์ผ่านไฟล์ Markdown สองไฟล์ที่อยู่ในโฟลเดอร์ <code>devflow/</code>:</p>
          <table>
            <thead><tr><th>ไฟล์</th><th>หน้าที่</th><th>สิ่งที่ควรระบุ</th></tr></thead>
            <tbody>
              <tr>
                <td><strong><code>devflow/project-plan.md</code></strong></td>
                <td>วิสัยทัศน์ สถาปัตยกรรม และขอบเขต</td>
                <td>ปัญหาที่ต้องการแก้, กลุ่มเป้าหมาย, Non-functional Requirements, Tech Stack, ขอบเขตระบบ</td>
              </tr>
              <tr>
                <td><strong><code>devflow/build-plan.md</code></strong></td>
                <td>รายการฟีเจอร์ตามลำดับการสร้าง</td>
                <td>Checklist รายการเดียวจบ เรียงจากรากฐาน (Foundation) ไปสู่ฟีเจอร์ระดับสูง</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'build-plan-best-practices',
        title: 'เทคนิคการจัดเรียงและแบ่งฟีเจอร์ใน Build Plan',
        contentHtml: `
          <p>ควรเขียนแต่ละข้อเป็นฟีเจอร์ขนาดกระชับที่สามารถพัฒนาและทดสอบได้ใน 1 รอบการทำงาน:</p>
          <pre><code>## 🚀 Phase 1: MVP Foundation
- [ ] 1. โครงสร้าง Database Schema และ SQLite Connection
- [ ] 2. Authentication API (JWT & Session Tokens)
- [ ] 3. Dashboard UI Component

## ⚡ Phase 2: Advanced Features
- [ ] 4. Realtime WebSockets Notification
- [ ] 5. CSV Data Export Service</code></pre>
          <div class="docs-callout tip">
            <div class="docs-callout-label">การแตกข้อย่อย (Sub-splits)</div>
            <p>หากฟีเจอร์มีขอบเขตใหญ่เกินไป สามารถแตกเป็น <code>2a</code>, <code>2b</code>, <code>2c</code> เพื่อให้การพัฒนาและการรีวิวทำได้อย่างแม่นยำและไม่เสียบริบท</p>
          </div>
        `
      },
      {
        id: 'ideas-inbox',
        title: 'กล่องรับไอเดีย (Ideas Inbox: devflow/ideas.md)',
        contentHtml: `
          <p>สำหรับไอเดียที่ยังไม่พร้อมนำเข้า Build Plan ให้บันทึกไว้ใน <code>devflow/ideas.md</code> ด้วยคำสั่ง <code>/idea "รายละเอียดไอเดีย"</code> AI จะทำการประเมินคะแนนความเป็นไปได้ คุณค่าทางธุรกิจ และจุดสังเกตทางเทคนิคให้อัตโนมัติ</p>
        `
      }
    ]
  },

  // 5. Updating DevFlow
  {
    slug: 'updating-devflow',
    category: 'START',
    title: 'Updating DevFlow (การอัปเดตเวอร์ชัน)',
    lead: 'วิธีอัปเกรดเวอร์ชันของ Nexus-DevFlow ให้ทันสมัยอยู่เสมอ โดยไม่สูญเสียประวัติหรือบริบทของโปรเจกต์',
    pills: ['Update', 'Upgrade', 'Version', 'Sync', 'Manifest', 'Compatibility'],
    sections: [
      {
        id: 'how-to-update',
        title: 'วิธีการอัปเดตเวอร์ชัน (1-Command Upgrade)',
        contentHtml: `
          <p>เมื่อมีเวอร์ชันใหม่ของ Nexus-DevFlow ปล่อยออกมา คุณสามารถอัปเดตโปรเจกต์ของคุณได้ง่ายๆ ด้วยคำสั่งเดียวใน Root Directory:</p>
          <pre><code>npx -y nexus-devflow@latest -y</code></pre>
          <p>ตัวติดตั้งจะตรวจสอบ <code>devflow/.state/manifest.json</code> เพื่ออัปเดตเฉพาะทักษะและเอกสารของ DevFlow โดยจะ<strong>ไม่แตะต้อง</strong>ไฟล์ <code>project-plan.md</code>, <code>build-plan.md</code>, <code>context/</code>, หรือโค้ดแอปพลิเคชันของคุณเลย</p>
        `
      },
      {
        id: 'update-safety-guarantees',
        title: 'การรับประกันความปลอดภัยในการอัปเดต (Safety Guarantees)',
        contentHtml: `
          <table>
            <thead><tr><th>สิ่งที่ระบบจะอัปเดต</th><th>สิ่งที่ไม่ถูกแตะต้อง 100%</th></tr></thead>
            <tbody>
              <tr><td>โฟลเดอร์ทักษะ <code>.agents/skills/</code> และ <code>.claude/skills/</code></td><td>โค้ดแอปพลิเคชันของคุณทุกบรรทัด</td></tr>
              <tr><td>เอกสารอ้างอิงของ DevFlow</td><td><code>devflow/project-plan.md</code> และ <code>devflow/build-plan.md</code></td></tr>
              <tr><td>CLI Helper Scripts</td><td><code>devflow/context/</code> และ Living Specs ที่กำลังทำงานอยู่</td></tr>
              <tr><td>Manifest state <code>devflow/.state/manifest.json</code></td><td>ประวัติการส่งมอบงานทั้งหมดใน <code>devflow/history/</code></td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'managing-skills',
        title: 'การจัดการ Companion Skills เพิ่มเติม',
        contentHtml: `
          <p>คุณสามารถติดตั้งหรืออัปเดต Companion Skills ได้ตามต้องการ:</p>
          <pre><code># ติดตั้ง Recommended Skills ทั้งหมดพร้อมกัน
npx nexus-devflow skill add --recommended

# อัปเดต Skills ทั้งหมดให้เป็นเวอร์ชันล่าสุด
npx nexus-devflow skill update --recommended

# หรือจัดการเฉพาะทักษะที่ต้องการ
npx nexus-devflow skill add archify        # แผนภาพสถาปัตยกรรมแบบ Interactive HTML
npx nexus-devflow skill add diagram-design # 39 เทมเพลตแผนภาพระดับพรีเมียม
npx nexus-devflow skill add bughunter      # ล่าบั๊กลึกและตรวจสอบความปลอดภัย OWASP
npx nexus-devflow skill add ponytail       # ปรับโค้ดให้เรียบง่าย ตัดความซับซ้อนส่วนเกิน</code></pre>
        `
      }
    ]
  }
];
