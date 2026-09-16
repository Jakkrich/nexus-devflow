import type { DocPage } from '../build-docs-site.js';

export const COMMANDS_PAGES: DocPage[] = [
  // 1. Onboard
  {
    slug: 'commands/onboard',
    category: 'COMMANDS',
    title: 'Onboard (/onboard)',
    lead: 'ปรับแต่งเวิร์กโฟลว์ให้เข้ากับสภาพแวดล้อมจริง ตรวจสอบ tech stack, คำสั่ง verify/test, มาตรฐานโค้ด และกำหนด Review Cadence',
    pills: ['Command', 'Onboard', 'Setup', 'Config', 'Cadence', 'Preset', 'QualityGates'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>รันคำสั่ง <code>/onboard</code> (หรือ <code>$onboard</code>) ทันทีหลังจากติดตั้ง Nexus-DevFlow ลงในแอปพลิเคชันที่เพิ่ง Scaffold ขึ้นมาใหม่ หรือแอปพลิเคชันในระยะเริ่มต้น เพื่อให้ AI ทำการสำรวจสภาพแวดล้อมจริง ตรวจจับภาษา คำสั่ง Build/Test และปรับแต่งเวิร์กโฟลว์ให้เข้ากับสไตล์การพัฒนาของคุณ</p>
          <pre><code># สำหรับ Google Antigravity IDE, Claude Code, Gemini CLI
/onboard

# สำหรับ OpenAI Codex CLI
$onboard

# หรือสั่งการด้วยคำพูดทั่วไป
"ช่วยรัน onboard เพื่อตั้งค่าโปรเจกต์นี้"</code></pre>
        `
      },
      {
        id: 'what-it-inspects',
        title: 'สิ่งที่ระบบตรวจสอบ (What it inspects)',
        contentHtml: `
          <p>เมื่อเริ่มรัน Onboard ระบบจะทำการสแกนสภาพแวดล้อมของ Repository ในหลายมิติอย่างละเอียด:</p>
          <ul>
            <li><strong>Framework, Language & Package Manager</strong>: ตรวจสอบภาษาหลัก (TypeScript, JavaScript, Python, Go, Rust, PHP, Java) และ Package Manager ที่ใช้งาน (npm, pnpm, yarn, bun, pip, poetry, go modules, cargo)</li>
            <li><strong>Build, Dev, Lint & Test Scripts</strong>: ตรวจหาคำสั่งใน <code>package.json</code>, <code>Makefile</code>, <code>pyproject.toml</code> หรือ configuration files อื่นๆ</li>
            <li><strong>Automatic Checks & CI Workflows</strong>: ตรวจสอบว่ามีคำสั่ง Verify กลาง หรือมี GitHub Actions Workflows อยู่แล้วหรือไม่</li>
            <li><strong>Coding & Styling Conventions</strong>: ตรวจจับรูปแบบการเขียนโค้ด เช่น Linter configs, Prettier, Formatter เพื่อนำมากำหนดเป็น Coding Standards</li>
            <li><strong>Existing Configuration</strong>: ตรวจสอบความถูกต้องของ <code>devflow/config.json</code> หากมีอยู่เดิม</li>
            <li><strong>Tool Adapters & Ignore Rules</strong>: ตรวจสอบโฟลเดอร์ทักษะ <code>.agents/</code> หรือ <code>.claude/</code> และตั้งค่า <code>.gitignore</code> ให้เหมาะสม</li>
          </ul>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <p>Onboarding จะสร้างและปรับปรุงไฟล์ข้อตกลงสำคัญที่ AI ทุก Session ต้องใช้อ่านร่วมกัน:</p>
          <ul>
            <li><strong><code>devflow/config.json</code></strong>: บันทึกนโยบายเวิร์กโฟลว์, Review Cadence, Git branch prefixes และเกณฑ์ Quality Gates</li>
            <li><strong><code>devflow/context/coding-standards.md</code></strong>: รวบรวมมาตรฐานการเขียนโค้ดที่ตรวจจับได้จากโปรเจกต์จริง</li>
            <li><strong><code>devflow/context/ai-interaction.md</code></strong>: กฎการสื่อสารและการขออนุมัติระหว่างนักพัฒนากับ AI</li>
            <li><strong><code>devflow/project-plan.md</code> & <code>devflow/build-plan.md</code></strong>: เทมเพลตแผนงานเริ่มต้นสำหรับให้คุณกรอกเป้าหมายและรายการฟีเจอร์</li>
            <li><strong><code>AGENTS.md</code> & <code>CLAUDE.md</code></strong>: อัปเดตคำสั่งและข้อกำหนดของ Adapter ให้ตรงกับเครื่องมือที่ใช้งาน</li>
          </ul>
        `
      },
      {
        id: 'configuration-and-options',
        title: 'การเลือก Review Cadence และ Implementation Presets',
        contentHtml: `
          <p>Onboarding จะให้คุณเลือกรูปแบบการรีวิวและขออนุมัติโค้ด (Review Cadence) ผ่าน Presets สำเร็จรูป:</p>
          <table>
            <thead><tr><th>Preset</th><th>ค่าใน config.json</th><th>พฤติกรรมการทำงานและการขออนุมัติ</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Efficient (แนะนำ)</strong></td>
                <td><code>stepReview: "feature"</code><br><code>checkpointCommits: "disabled"</code></td>
                <td>ส่งมอบ Review Packet รวบยอดครั้งเดียวหลังจากเสร็จสิ้นทุกขั้นตอนในฟีเจอร์ ไม่หยุดถามคั่นกลางในแต่ละขั้นตอนย่อย และมีตัวเลือกทำ Code Walkthrough ท้ายรอบ</td>
              </tr>
              <tr>
                <td><strong>Guided</strong></td>
                <td><code>stepReview: "every"</code><br><code>checkpointCommits: "enabled"</code></td>
                <td>หยุดขออนุมัติในทุกๆ ขั้นตอนย่อย และถามเพื่อสร้าง Git Checkpoint Commit เหมาะสำหรับงานความเสี่ยงสูง การจับคู่เขียนโค้ด (Pair Programming) หรือการสอนงาน</td>
              </tr>
              <tr>
                <td><strong>Custom</strong></td>
                <td>กำหนดค่าแยกอิสระ</td>
                <td>เปิดให้กำหนด <code>stepReview</code>, <code>checkpointCommits</code> และ <code>qualityGates</code> แยกกันได้อย่างอิสระ</td>
              </tr>
            </tbody>
          </table>
          <div class="docs-callout tip">
            <div class="docs-callout-label">Independent Review Configuration</div>
            <p>Onboard จะตั้งค่า <code>qualityGates.regular.independentReview</code> เป็น <code>when-sensitive</code> โดยอัตโนมัติ เพื่อให้ฟีเจอร์ที่แตะต้องความปลอดภัยหรือสถาปัตยกรรมหลักได้รับการตรวจรับโดย AI Reviewer อิสระ ในขณะที่ฟีเจอร์ทั่วไปจะดำเนินไปอย่างรวดเร็ว</p>
          </div>
        `
      },
      {
        id: 'first-git-commit',
        title: 'การสร้าง Git Commit แรก (First Git Commit)',
        contentHtml: `
          <p>หาก Repository ของคุณยังไม่มี Commit มาก่อน Onboard จะแสดงรายการไฟล์ที่เป็นเฉพาะ Scaffold เริ่มต้น และขออนุญาตสร้าง Commit แรกในชื่อ <code>chore: scaffold application</code> เพื่อตั้ง Branch หลัก (<code>main</code>) อย่างถูกต้อง โดยระบบจะ<strong>ไม่รัน <code>git push</code></strong> เด็ดขาด</p>
        `
      },
      {
        id: 'what-it-never-does',
        title: 'สิ่งที่ไม่ทำโดยเด็ดขาด (What it never does)',
        contentHtml: `
          <div class="docs-callout note">
            <div class="docs-callout-label">Safety Guarantees</div>
            <ul>
              <li>จะไม่สร้างโครงร่างแอปพลิเคชันแทนคุณ (คุณต้องสร้างโครงร่างแอปก่อน)</li>
              <li>จะไม่คิดแผนผลิตภัณฑ์หรือเขียนฟีเจอร์เองโดยไม่ได้รับคำสั่ง</li>
              <li>จะไม่ทำ Git Commit ใดๆ โดยไม่แสดงรายการไฟล์และขออนุมัติล่วงหน้า</li>
              <li><strong>ไม่มีวันรันคำสั่ง <code>git push</code> ไปยัง Remote Repository โดยเด็ดขาด</strong></li>
            </ul>
          </div>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>1. หากต้องการตั้งค่า GitHub Actions CI ให้รันคำสั่ง <code>/ci</code></p>
          <p>2. กรอกเป้าหมายผลิตภัณฑ์ลงใน <code>devflow/project-plan.md</code> และรายการฟีเจอร์ใน <code>devflow/build-plan.md</code></p>
          <p>3. รันคำสั่ง <code>/overview</code> เพื่อคอมไพล์ Living Source of Truth สำหรับโปรเจกต์</p>
        `
      }
    ]
  },

  // 2. Adopt
  {
    slug: 'commands/adopt',
    category: 'COMMANDS',
    title: 'Adopt (/adopt)',
    lead: 'นำ Nexus-DevFlow เข้าสู่โปรเจกต์เดิมที่มีโค้ดเบสอยู่แล้ว (Brownfield Codebase) สำรวจฟังก์ชันจริง และสร้างแผนงานต่อเนื่อง',
    pills: ['Command', 'Adopt', 'Brownfield', 'Legacy', 'Survey', 'Reconcile', 'ZeroRegression'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/adopt</code> ทันทีหลังจากติดตั้ง Overlay ลงในโปรเจกต์เดิมที่มีโค้ดเบสอยู่แล้ว (Brownfield) แทนที่จะมองเป็นโปรเจกต์ว่างเปล่า AI จะทำหน้าที่เป็น Senior Architect สำรวจโค้ดจริง บันทึกความสามารถที่ส่งมอบไปแล้ว และสร้างแผนงานส่วนต่อขยายได้อย่างแม่นยำ</p>
          <pre><code>/adopt</code></pre>
        `
      },
      {
        id: 'what-it-inspects',
        title: 'สิ่งที่ระบบตรวจสอบในโค้ดเบสเดิม (Deep Codebase Survey)',
        contentHtml: `
          <p>คำสั่ง <code>/adopt</code> จะดำเนินการสำรวจอย่างครอบคลุม:</p>
          <ul>
            <li><strong>Architecture & Modules</strong>: สแกนโครงสร้างไดเรกทอรี เลเยอร์ข้อมูล API Controllers และ UI Views</li>
            <li><strong>Shipped Capabilities</strong>: ตรวจสอบความสามารถที่ใช้งานได้จริงในระบบ เพื่อไม่ให้ AI เข้าใจผิดว่าต้องสร้างซ้ำ</li>
            <li><strong>Existing Test Harness & CI</strong>: ตรวจสอบ Unit Tests, Integration Tests, และ CI configuration ที่มีอยู่เดิม</li>
            <li><strong>Dependencies & Configs</strong>: สำรวจไลบรารี ฐานข้อมูล และตัวแปร Environment Variables</li>
          </ul>
        `
      },
      {
        id: 'how-it-works',
        title: 'กระบวนการปรับสมดุลแผนงาน (Plan Reconciliation)',
        contentHtml: `
          <p>หลังจากการสำรวจโค้ดเบสเสร็จสิ้น AI จะสร้างเอกสารแผนงานที่สอดคล้องกับความเป็นจริง:</p>
          <ul>
            <li><strong><code>devflow/project-plan.md</code></strong>: บันทึกสถาปัตยกรรมและขอบเขตของระบบปัจจุบัน</li>
            <li><strong><code>devflow/build-plan.md</code></strong>: จัดทำ Checklist รายการฟีเจอร์ โดยฟังก์ชันที่มีอยู่แล้วจะถูกติ๊กถูก <code>- [x]</code> และฟังก์ชันส่วนขยายที่เสนอแนะจะถูกบันทึกเป็น <code>- [ ]</code></li>
            <li><strong><code>devflow/history/</code></strong>: บันทึกประวัติสถาปัตยกรรมและฟีเจอร์เดิมเป็น Baseline</li>
            <li><strong><code>devflow/context/project-overview.md</code></strong>: รันการคอมไพล์ <code>overview</code> เพื่อให้ AI เข้าใจบริบทเริ่มต้นในทันที</li>
          </ul>
        `
      },
      {
        id: 'what-it-never-does',
        title: 'สิ่งที่ไม่ทำโดยเด็ดขาด (What it never does)',
        contentHtml: `
          <div class="docs-callout note">
            <div class="docs-callout-label">Zero-Regression Guarantee</div>
            <p><code>/adopt</code> จะ<strong>ไม่</strong>แตะต้อง ลบ หรือแก้ไขซอร์สโค้ดเดิมของคุณ ไม่เปลี่ยนแปลงประวัติ Git เดิม และไม่บังคับปรับโครงสร้างโฟลเดอร์ของโปรเจกต์เดิมเด็ดขาด</p>
          </div>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>ตรวจดูรายการฟีเจอร์ใน <code>devflow/build-plan.md</code> และเริ่มพัฒนาฟีเจอร์แรกของโปรเจกต์เดิมด้วยคำสั่ง <code>/feature 1</code> หรือแก้บั๊กด้วย <code>/fix</code></p>
        `
      }
    ]
  },

  // 3. Discovery
  {
    slug: 'commands/discovery',
    category: 'COMMANDS',
    title: 'Discovery (/discovery)',
    lead: 'สำรวจและวางแผน Roadmap ระดับโปรเจกต์ หรือสำรวจความเป็นไปได้ของฟีเจอร์ก่อนเริ่มพัฒนาผ่าน 6 เลนส์การวิเคราะห์',
    pills: ['Command', 'Discovery', 'Research', 'PreFlight', '6-Lens', 'ADR', 'Archify'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/discovery</code> ก่อนเริ่มพัฒนาฟีเจอร์ที่มีความไม่แน่นอนสูง มีทางเลือกสถาปัตยกรรมหลายทาง หรือเมื่อเริ่มต้นโครงการใหม่และต้องการวาง Roadmap ทั้งหมด:</p>
          <pre><code># 1. โหมดสำรวจภาพรวมโปรเจกต์ (Macro Project Discovery)
/discovery
/discovery --project

# 2. โหมดสำรวจฟีเจอร์เฉพาะจุด (Micro Feature Exploration)
/discovery "ระบบจัดการสิทธิ์ผู้ใช้ RBAC และการเชื่อมต่อ LDAP"
/discovery IDEA-001
/discovery DISC-20260916-001</code></pre>
        `
      },
      {
        id: 'two-adaptive-modes',
        title: 'โหมดการทำงาน 2 รูปแบบ (Two Adaptive Modes)',
        contentHtml: `
          <p>Discovery ทำงานใน 2 โหมดหลักขึ้นอยู่กับขอบเขตของอินพุต:</p>
          <table>
            <thead><tr><th>โหมด</th><th>เป้าหมายหลัก</th><th>ผลลัพธ์ที่ได้</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>1. Macro Project Discovery</strong></td>
                <td>วาง Roadmap ผลิตภัณฑ์, Milestones และสถาปัตยกรรมภาพรวมตั้งแต่ต้นจนจบ</td>
                <td>สร้าง <code>devflow/project-plan.md</code> และ <code>devflow/build-plan.md</code> ฉบับสมบูรณ์</td>
              </tr>
              <tr>
                <td><strong>2. Micro Feature Exploration</strong></td>
                <td>สำรวจและลดความเสี่ยงของฟีเจอร์เฉพาะจุด เปรียบเทียบทางเลือกและท้าทายสมมติฐาน</td>
                <td>สร้างรายงาน <code>devflow/discoveries/{DISC-ID}/discovery.md</code> และ ADRs</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'the-6-lens-framework',
        title: 'กรอบการวิเคราะห์ 6 เลนส์ (The 6-Lens Framework)',
        contentHtml: `
          <pre><code>                     ┌─────────────────────────────────────────┐
                     │   DISCOVERY 6-LENS FRAMEWORK PIPELINE   │
                     └────────────────────┬────────────────────┘
                                          │
       ┌─────────────────┬────────────────┼─────────────────┬─────────────────┐
       ▼                 ▼                ▼                 ▼                 ▼
 ┌───────────┐    ┌─────────────┐   ┌───────────┐     ┌───────────┐     ┌───────────┐
 │1.Brain-   │    │ 2.Research  │   │ 3. PRD &  │     │ 4. Issue  │     │ 5. Socratic│
 │  storming │    │   Empirical │   │  Scoping  │     │   Triage  │     │    Grill  │
 │ (Options) │    │   (Spikes)  │   │  (Bound.) │     │  (Debug)  │     │   (ADR)   │
 └───────────┘    └─────────────┘   └───────────┘     └───────────┘     └───────────┘
                                          │
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │ 6. Visual Architecture (HTML / Archify) │
                     └────────────────────┬────────────────────┘
                                          │
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │  Decision Gate: [Proceed | Defer | Drop]│
                     └─────────────────────────────────────────┘</code></pre>
          <p>เมื่อเข้าสู่กระบวนการสำรวจฟีเจอร์ AI จะนำปัญหามาวิเคราะห์ผ่าน 6 เลนส์มาตรฐานอย่างเป็นระบบ:</p>
          <ol>
            <li><strong>Brainstorming Lens</strong>: แตกไอเดียและสร้างทางเลือกสถาปัตยกรรม 2-3 รูปแบบ พร้อมตาราง Trade-off Comparison (ข้อดี, ข้อเสีย, ความคุ้มค่า)</li>
            <li><strong>Research & Empirical Proof Lens</strong>: ค้นคว้าแนวทางปฏิบัติระดับสากล (Best Practices), ตรวจสอบความเสถียรของไลบรารีโอเพนซอร์ส และทดสอบความเป็นไปได้ทางเทคนิค</li>
            <li><strong>PRD & Scoping Lens</strong>: กำหนด User Stories, ขอบเขตความรับผิดชอบ (Scope Boundaries), ปัญหาที่ต้องแก้ และ Acceptance Criteria</li>
            <li><strong>Issue & Bug Triage Lens</strong>: จัดระดับความรุนแรง (Critical, Major, Minor) และประเมินว่าต้องใช้ Root-Cause Diagnosis (<code>/debug</code>) หรือไม่</li>
            <li><strong>Socratic Grilling & Domain Alignment Lens (<code>/grill</code>)</strong>: ซักถามท้าทายสมมติฐาน สกัดศัพท์เทคนิคลง <code>glossary.md</code> และบันทึกข้อตกลงสำคัญลง <code>devflow/decisions/ADR-xxx.md</code></li>
            <li><strong>Visual Architecture Lens (<code>/archify</code>)</strong>: สร้างแผนภาพสถาปัตยกรรมแบบ Interactive HTML Diagrams เพื่อแสดง Data Flow และ State Transitions</li>
          </ol>
        `
      },
      {
        id: 'decision-gate',
        title: 'ด่านตรวจการตัดสินใจ (Decision Gate)',
        contentHtml: `
          <p>เมื่อการสำรวจสิ้นสุดลง Discovery จะสรุปผลการประเมินเป็น 1 ใน 3 สถานะที่ชัดเจน:</p>
          <ul>
            <li><strong>Proceed</strong>: ฟีเจอร์มีความคุ้มค่า ชัดเจน และพร้อมส่งต่อให้ <code>/feature {DISC-ID}</code> เพื่อเปิด Living Spec</li>
            <li><strong>Defer</strong>: ไอเดียมีประโยชน์แต่ยังไม่ถึงเวลา หรือต้องรอปัจจัยอื่นก่อน</li>
            <li><strong>Reject</strong>: ไม่คุ้มค่าที่จะทำ หรือขัดกับเป้าหมายหลักของผลิตภัณฑ์</li>
          </ul>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <ul>
            <li><strong><code>devflow/discoveries/{DISC-ID}-{slug}/discovery.md</code></strong>: เอกสารสรุปผลการสำรวจและตารางเปรียบเทียบทางเลือก</li>
            <li><strong><code>devflow/decisions/ADR-{NNN}-{slug}.md</code></strong>: บันทึก Architecture Decision Records</li>
            <li><strong><code>devflow/context/glossary.md</code></strong>: คำศัพท์เฉพาะของโดเมนที่ตกลงกันแล้ว</li>
            <li><strong><code>devflow/build-plan.md</code></strong>: เพิ่มรายการฟีเจอร์พร้อมผูก Discovery ID (หากเลือก Proceed)</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>นำผลลัพธ์จากการสำรวจที่ได้รับอนุมัติ (Proceed) ไปเปิด Living Spec เพื่อเริ่มพัฒนาฟีเจอร์ด้วยคำสั่ง <code>/feature DISC-20260916-001</code></p>
        `
      }
    ]
  },

  // 4. Explore
  {
    slug: 'commands/explore',
    category: 'COMMANDS',
    title: 'Explore (/explore)',
    lead: 'สำรวจไอเดีย เปรียบเทียบข้อดีข้อเสีย และผลกระทบต่อโค้ดเบสโดยไม่มีการแก้ไขไฟล์ใดๆ (Zero-Touch Read-Only)',
    pills: ['Command', 'Explore', 'Idea', 'ReadOnly', 'ZeroTouch', 'Tradeoffs', 'BlastRadius'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/explore</code> เมื่อคุณต้องการปรึกษาทางเลือกทางเทคนิค วิเคราะห์ผลกระทบ หรือเปรียบเทียบไลบรารี โดย<strong>ไม่ต้องการให้ AI แก้ไขไฟล์ สร้าง Branch หรือบันทึกสถานะใดๆ ในโปรเจกต์</strong></p>
          <pre><code>/explore "ควรเปลี่ยนไปใช้ SQLite หรือ PostgreSQL สำหรับงานนี้?"
/explore "หากต้องการเพิ่มระบบ Multi-tenancy จะกระทบโมดูลใดบ้าง?"</code></pre>
        `
      },
      {
        id: 'what-it-inspects',
        title: 'สิ่งที่ระบบตรวจสอบ (Blast Radius Analysis)',
        contentHtml: `
          <p>การสำรวจในโหมด Explore มุ่งเน้นการวิเคราะห์เชิงลึก:</p>
          <ul>
            <li>อ่านโค้ดเบสปัจจุบันเพื่อคำนวณ <strong>Blast Radius</strong> (ขอบเขตไฟล์และโมดูลที่ได้รับผลกระทบ)</li>
            <li>ตรวจสอบ Dependency Graph และ Architecture Boundaries ที่เกี่ยวข้อง</li>
            <li>เปรียบเทียบ Trade-offs ด้านประสิทธิภาพ ความซับซ้อนในการดูแลรักษา และความคุ้มค่า</li>
          </ul>
        `
      },
      {
        id: 'what-it-never-does',
        title: 'การรับประกันความปลอดภัย (Zero-Touch Guarantee)',
        contentHtml: `
          <div class="docs-callout note">
            <div class="docs-callout-label">Zero-Touch Guarantee</div>
            <p><code>/explore</code> เป็นคำสั่ง Read-only 100% จะไม่มีการเขียนไฟล์ ไม่สร้าง Task Workspace และไม่แตะต้อง Git Branch ใดๆ ทั้งสิ้น</p>
          </div>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>หากได้ข้อสรุปที่ต้องการบันทึกเป็นไอเดีย ให้ใช้คำสั่ง <code>/idea</code> หรือหากพร้อมส่งมอบงานให้เพิ่มลงใน <code>build-plan.md</code> แล้วรัน <code>/feature</code></p>
        `
      }
    ]
  },

  // 5. Overview
  {
    slug: 'commands/overview',
    category: 'COMMANDS',
    title: 'Overview (/overview)',
    lead: 'คอมไพล์เอกสารแผนงานทั้งหมดให้กลายเป็น Living Source of Truth ใน devflow/context/project-overview.md (<20KB)',
    pills: ['Command', 'Overview', 'Compiler', 'Context', 'TokenBudget', 'LivingSourceOfTruth'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>รันคำสั่ง <code>/overview</code> หลังจากแก้ไข <code>project-plan.md</code>, <code>build-plan.md</code>, เพิ่ม ADR ใน <code>decisions/</code>, หรือเมื่อบริบทเริ่มบวมเกิน 20KB เพื่อคอมไพล์สรุปบริบทโปรเจกต์ให้กระชับและสดใหม่อยู่เสมอ</p>
          <pre><code>/overview</code></pre>
        `
      },
      {
        id: 'deterministic-compiler',
        title: 'หลักการทำงานแบบ Deterministic Markdown Compiler',
        contentHtml: `
          <p>คำสั่ง Overview ไม่ใช่การสรุปความแบบสุ่ม แต่ใช้กฎ Deterministic Translation ในการกลั่นกรองข้อมูล:</p>
          <ul>
            <li><strong>รวมข้อมูลแผนงานทั้งหมด</strong>: สกัดข้อมูลจาก <code>project-plan.md</code>, <code>build-plan.md</code>, <code>coding-standards.md</code> และ <code>decisions/*.md</code></li>
            <li><strong>จำกัดขนาดไม่เกิน 20,000 Bytes</strong>: รักษาขนาดเอกสารให้อยู่ในเกณฑ์ประหยัด Token สูงสุด เพื่อให้ AI ทุก Session โหลดบริบทได้เร็วและแม่นยำ</li>
            <li><strong>ตรวจจับข้อขัดแย้ง (Contradiction Detection)</strong>: หากพบเป้าหมายในแผนงานขัดแย้งกัน ระบบจะหยุดและแจ้งเตือนให้คุณแก้ไขก่อน</li>
          </ul>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <p>เขียนไฟล์ <strong><code>devflow/context/project-overview.md</code></strong> ซึ่งเป็นไฟล์กลางที่ Agent ทุกเครื่องมือ (Claude Code, Google Antigravity, OpenAI Codex, Cursor) ใช้โหลดเป็น System Context แรกเริ่มเสมอ</p>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>เริ่มพัฒนาฟีเจอร์แรกของโปรเจกต์ด้วยคำสั่ง <code>/feature 1</code></p>
        `
      }
    ]
  },

  // 6. Feature
  {
    slug: 'commands/feature',
    category: 'COMMANDS',
    title: 'Feature (/feature)',
    lead: 'ดึงรายการจาก Build Plan มาร่าง Task-Isolated Living Spec (devflow/context/{xxx-slug}/spec.md) พร้อมประเมินขนาดและสร้าง TDD Tasks Checklist',
    pills: ['Command', 'Feature', 'LivingSpec', 'Isolation', 'Sizing', 'TDD', 'SpecAhead'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/feature</code> เพื่อเริ่มต้นพัฒนาฟีเจอร์ใหม่ โดยระบุหมายเลข ชื่อฟีเจอร์ หรือ Discovery ID:</p>
          <pre><code># 1. พัฒนาฟีเจอร์ถัดไปที่ยังไม่ได้ทำใน Build Plan
/feature

# 2. พัฒนาฟีเจอร์ตามหมายเลขหรือชื่อ
/feature 1
/feature "ระบบชำระเงิน PromptPay QR"

# 3. พัฒนาต่อยอดจากการสำรวจ Discovery
/feature DISC-20260916-001</code></pre>
        `
      },
      {
        id: 'multi-run-spec-ahead',
        title: 'การสนับสนุน Multi-Run Spec-Ahead',
        contentHtml: `
          <p>Nexus-DevFlow รองรับการร่างสเปกล่วงหน้าได้หลายฟีเจอร์พร้อมกัน (Spec-Ahead) โดยแต่ละสเปกจะถูกแยกโฟลเดอร์บริบทเป็นอิสระ 100% อยู่ใน <code>devflow/context/{xxx-slug}/</code> ทำให้ทีมสามารถวางแผนหลายงานคู่ขนานได้โดยไม่รบกวนกัน</p>
        `
      },
      {
        id: 'sizing-and-splitting',
        title: 'การประเมินขนาดงานและการแตกบทย่อย (Sizing & Splitting)',
        contentHtml: `
          <p>ก่อนลงมือเขียนสเปก AI จะทำการประเมินความซับซ้อนของงาน:</p>
          <ul>
            <li><strong>Small / Medium</strong>: ขนาดพอเหมาะสำหรับการทำ TDD และการรีวิวในรอบเดียว จะดำเนินการร่าง Living Spec ทันที</li>
            <li><strong>Too Big (ขนาดใหญ่เกินไป)</strong>: AI จะเสนอแนวทางการแตกบทย่อยออกเป็น 2-3 ฟีเจอร์ย่อยใน <code>build-plan.md</code> เพื่อให้ส่งมอบงานได้ง่ายและปลอดภัย</li>
          </ul>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (Task Workspace)',
        contentHtml: `
          <p>สร้างโฟลเดอร์ Task Workspace เฉพาะฟีเจอร์:</p>
          <ul>
            <li><strong><code>devflow/context/{xxx-slug}/spec.md</code></strong>: Living Specification ฉบับสมบูรณ์ ประกอบด้วย Data Contracts, Verification Matrix และ TDD Tasks Checklist</li>
            <li><strong><code>devflow/context/{xxx-slug}/stage.md</code></strong>: ตัวชี้สถานะขั้นตอนปัจจุบัน (ตั้งค่าเป็น <code>feature</code>)</li>
            <li><strong><code>devflow/context/{xxx-slug}/findings.md</code></strong>: สมุดบันทึกประเด็นที่พบ (Findings Ledger) ประจำฟีเจอร์</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>หลังจากตรวจรับสเปกแล้ว ให้เริ่มพัฒนาโค้ดด้วยคำสั่ง <code>/implement {xxx-slug}</code></p>
        `
      }
    ]
  },

  // 7. Implement
  {
    slug: 'commands/implement',
    category: 'COMMANDS',
    title: 'Implement (/implement)',
    lead: 'พัฒนาฟีเจอร์ตาม Living Spec ด้วยวินัย Strict TDD (Red-Green-Refactor) บน Git Branch แยกเฉพาะงาน พร้อมบันทึก Diff Evidence',
    pills: ['Command', 'Implement', 'TDD', 'RedGreenRefactor', 'TracerBullet', 'BranchIsolation'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/implement</code> เพื่อลงมือเขียนโค้ดตามแผนงานใน Living Spec ที่ผ่านการอนุมัติแล้ว:</p>
          <pre><code># ทำงานกับฟีเจอร์ปัจจุบัน
/implement

# หรือระบุหมายเลขฟีเจอร์ / Ticket ที่ต้องการ
/implement 1
/implement 001-auth --ticket 02</code></pre>
        `
      },
      {
        id: 'strict-tdd-discipline',
        title: 'วินัยการพัฒนาแบบ Strict TDD (Red-Green-Refactor)',
        contentHtml: `
          <p>AI จะปฏิบัติตามวงจร TDD อย่างเคร่งครัดในทุก Checklist Task:</p>
          <ol>
            <li><strong>🔴 Red (เขียน Test ก่อน)</strong>: เขียน Unit Test หรือ Integration Test ที่ระบุพฤติกรรมที่คาดหวัง และรันเพื่อพิสูจน์ว่า Test ล้มเหลวอย่างถูกต้อง</li>
            <li><strong>🟢 Green (เขียนโค้ดให้ผ่าน)</strong>: เขียนโค้ดเฉพาะส่วนที่จำเป็นเพื่อให้ Test ผ่าน 100%</li>
            <li><strong>🔵 Refactor (ปรับปรุงคุณภาพโค้ด)</strong>: ขัดเกลาโครงสร้างโค้ดตาม <code>coding-standards.md</code> โดยที่ Test ยังคงผ่านทั้งหมด</li>
          </ol>
        `
      },
      {
        id: 'ticket-ingestion-frontier',
        title: 'การรองรับ Tracer-Bullet Tickets & Dependency Frontier',
        contentHtml: `
          <p>หากในฟีเจอร์มีไฟล์ Tickets ย่อยใน <code>devflow/context/{xxx-slug}/tickets/</code> หรือ <code>issues/</code> คำสั่ง Implement จะคำนวณ <strong>Dependency Frontier</strong> อัตโนมัติ โดยเลือกทำ Ticket ที่ไม่มีตัวบล็อก (<code>Blocked by: None</code>) ก่อนตามลำดับ</p>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <ul>
            <li>สลับไปยัง Git Branch <code>feature/{xxx-slug}</code> หรือ <code>fix/{xxx-slug}</code></li>
            <li>สร้างซอร์สโค้ดและชุดการทดสอบจริง</li>
            <li>อัปเดตสถานะ Checklist ใน <code>devflow/context/{xxx-slug}/spec.md</code></li>
            <li>บันทึก <strong>Diff Evidence</strong> สรุปการเปลี่ยนแปลงของแต่ละขั้นตอน</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>เมื่อ Implement ครบทุกขั้นตอน ให้รันคำสั่ง <code>/check</code> เพื่อเข้าสู่กระบวนการตรวจรับเชิงลึก</p>
        `
      }
    ]
  },

  // 8. Check
  {
    slug: 'commands/check',
    category: 'COMMANDS',
    title: 'Check (/check)',
    lead: 'ตรวจรับคุณภาพและทดสอบการทำงานจริงของฟีเจอร์ (Senior QA Verification) ผ่าน Multi-Lane Verification Matrix โดยไม่มีการแก้ไขโค้ด',
    pills: ['Command', 'Check', 'QA', 'Verification', 'ZeroTouch', 'ManualProof', 'TryGuide'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/check</code> หลังจาก Implement เสร็จสิ้น เพื่อทำการทดสอบเชิงลึกว่าฟีเจอร์ทำงานถูกต้องตาม Done-When Criteria ในสเปกหรือไม่:</p>
          <pre><code># 1. ตรวจรับฟีเจอร์ปัจจุบัน
/check

# 2. ตรวจรับฟีเจอร์ที่ระบุ
/check 1

# 3. สร้างคู่มือการทดสอบด้วยตนเอง (Manual Try Guide)
/check guide
/check guide latest</code></pre>
        `
      },
      {
        id: 'multi-lane-verification',
        title: 'ด่านตรวจคุณภาพหลายมิติ (Multi-Lane Verification Matrix)',
        contentHtml: `
          <p>คำสั่ง Check จะทำการรันและเก็บหลักฐานเชิงประจักษ์ (Observable Proof) ใน 5 มิติ:</p>
          <ul>
            <li><strong>Typecheck & Lint</strong>: ตรวจสอบความถูกต้องของ Type System และ Code Standards</li>
            <li><strong>Automated Test Suites</strong>: รัน Unit Tests, Integration Tests และ E2E Regression Tests</li>
            <li><strong>Runtime & CLI Behavior</strong>: ทดสอบรันแอปพลิเคชันหรือคำสั่ง CLI จริงเพื่อดู Output</li>
            <li><strong>Live Visual QA</strong>: (หากมี Playwright หรือ MCP BrowserOS Neo) เปิดหน้าเว็บจริงเพื่อตรวจสอบ UI</li>
            <li><strong>Boundary & Edge Cases</strong>: ทดสอบกรณีข้อมูลไม่ถูกต้องและกรณีข้อผิดพลาดของระบบ</li>
          </ul>
        `
      },
      {
        id: 'check-guide-mode',
        title: 'โหมดคู่มือการทดสอบด้วยมือ (/check guide)',
        contentHtml: `
          <p>หากคุณต้องการทดสอบฟังก์ชันด้วยตัวเองบนหน้าจอ ให้ใช้ <code>/check guide</code> AI จะสร้างคู่มือ Read-only อธิบายทีละสเต็ป: จุดที่ต้องคลิก, ข้อมูลที่ต้องกรอก, ผลลัพธ์ที่ถูกต้อง, และจุดสังเกตหากระบบทำงานผิดพลาด</p>
        `
      },
      {
        id: 'what-it-never-does',
        title: 'การรับประกันความปลอดภัย (Zero Source Code Mutation)',
        contentHtml: `
          <div class="docs-callout note">
            <div class="docs-callout-label">Zero Source Code Mutation</div>
            <p><code>/check</code> จะ<strong>ไม่แก้ไขซอร์สโค้ด</strong>โดยเด็ดขาด หากพบข้อผิดพลาด จะบันทึกเป็น Finding ลงใน <code>findings.md</code> เพื่อส่งต่อให้แก้ไขอย่างเป็นระบบ</p>
          </div>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>เมื่อผลการ Check ผ่าน 100% ให้รันคำสั่ง <code>/complete</code> เพื่อส่งมอบงานและรวมโค้ดเข้าสู่ Branch หลัก</p>
        `
      }
    ]
  },

  // 9. Complete
  {
    slug: 'commands/complete',
    category: 'COMMANDS',
    title: 'Complete (/complete)',
    lead: 'สรุปผลงาน จัดเก็บประวัติเข้า History Archive ทำความสะอาด Task Workspace และรวมโค้ดเข้าสู่ Branch หลัก (Squash-Merge)',
    pills: ['Command', 'Complete', 'Archive', 'ReleaseDigest', 'SquashMerge', 'HistorySync'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/complete</code> เป็นขั้นตอนสุดท้ายของการพัฒนา เมื่อฟีเจอร์ผ่านการ Implement และ Check ครบถ้วนแล้ว:</p>
          <pre><code>/complete
/complete 1</code></pre>
        `
      },
      {
        id: 'complete-execution-pipeline',
        title: 'ลำดับขั้นตอนการปิดงานอัตโนมัติ (Execution Pipeline)',
        contentHtml: `
          <p>เมื่อรัน Complete ระบบจะดำเนินการตามลำดับอย่างปลอดภัย:</p>
          <ol>
            <li><strong>Release Digest Synthesis</strong>: สรุปสิ่งที่ส่งมอบ การเปลี่ยนแปลงสำคัญ และผลการทดสอบทั้งหมด</li>
            <li><strong>Archive to History</strong>: บันทึก Living Spec และหลักฐานการตรวจรับไปเก็บถาวรที่ <code>devflow/history/features/{xxx-slug}.md</code></li>
            <li><strong>Clean Workspace</strong>: ลบโฟลเดอร์ <code>devflow/context/{xxx-slug}/</code> ออกอย่างหมดจด</li>
            <li><strong>Update Build Plan & History</strong>: ติ๊กถูก <code>- [x]</code> ใน <code>devflow/build-plan.md</code> และเพิ่มรายการใน <code>devflow/history/HISTORY.md</code></li>
            <li><strong>Mandatory User Gate (Git Merge)</strong>: ถามความประสงค์ของผู้ใช้ว่าจะทำ <strong>Git Squash-Merge เข้าสู่ branch main</strong> หรือต้องการเปิด Pull Request / Merge Request</li>
          </ol>
        `
      },
      {
        id: 'what-it-never-does',
        title: 'สิ่งที่ไม่ทำโดยเด็ดขาด (What it never does)',
        contentHtml: `
          <div class="docs-callout note">
            <div class="docs-callout-label">Zero-Push Safety</div>
            <p>ระบบจะ<strong>ไม่มีวันรัน <code>git push</code></strong> ไปยังเซิร์ฟเวอร์ปลายทางโดยเด็ดขาด คุณยังคงเป็นผู้ถือสิทธิ์ขาดในการ Push โค้ดขึ้น Remote เสมอ</p>
          </div>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>ดูสถานะภาพรวมของโปรเจกต์ด้วย <code>/status</code> หรือเริ่มฟีเจอร์ถัดไปด้วย <code>/feature</code></p>
        `
      }
    ]
  },

  // 10. Status
  {
    slug: 'commands/status',
    category: 'COMMANDS',
    title: 'Status (/status)',
    lead: 'แสดงสถานะความคืบหน้าของโปรเจกต์ ฟีเจอร์ที่กำลังทำอยู่ สถานะ Git และคำสั่งถัดไปที่แนะนำ (Read-Only)',
    pills: ['Command', 'Status', 'Dashboard', 'Read-Only', 'GitState', 'DriftCheck'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>รันคำสั่ง <code>/status</code> เมื่อคุณกลับเข้ามาทำงานหลังจากพัก หรือต้องการตรวจเช็กว่าโปรเจกต์อยู่ในสถานะใด มีงานอะไรค้างอยู่:</p>
          <pre><code>/status</code></pre>
        `
      },
      {
        id: 'what-it-inspects',
        title: 'สิ่งที่ระบบรายงาน (What it reports)',
        contentHtml: `
          <ul>
            <li><strong>Build Plan Progress</strong>: อัตราส่วนฟีเจอร์ที่เสร็จแล้วเทียบกับทั้งหมด (เช่น 4/10 features completed)</li>
            <li><strong>Active Task Status</strong>: รายละเอียดฟีเจอร์ที่กำลังดำเนินการใน <code>devflow/context/</code> และขั้นตอนปัจจุบันใน <code>stage.md</code></li>
            <li><strong>Git Working Tree</strong>: Branch ปัจจุบัน, Uncommitted changes, และสถานะการซิงค์</li>
            <li><strong>Workflow Drift Warnings</strong>: แจ้งเตือนหากพบความไม่สอดคล้องกันระหว่างสเปกกับโค้ดจริง</li>
            <li><strong>Exact Next Action</strong>: ระบุคำสั่งถัดไปที่ควรพิมพ์อย่างชัดเจน</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>พิมพ์คำสั่งถัดไปตามที่ระบบแนะนำ เช่น <code>/implement</code>, <code>/check</code> หรือ <code>/complete</code></p>
        `
      }
    ]
  },

  // 11. Doctor
  {
    slug: 'commands/doctor',
    category: 'COMMANDS',
    title: 'Doctor (/doctor)',
    lead: 'ตรวจสุขภาพเวิร์กโฟลว์ ความสมบูรณ์ของ Adapters ความสดใหม่ของ Context และล้างสถานะผิดปกติ',
    pills: ['Command', 'Doctor', 'HealthCheck', 'Adapters', 'SelfHealing', 'Integrity'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>รันคำสั่ง <code>/doctor</code> เมื่อรู้สึกว่า AI ทำงานผิดปกติ คำสั่ง Slash Commands ไม่ตอบสนอง หรือต้องการตรวจสุขภาพระบบ DevFlow:</p>
          <pre><code>/doctor</code></pre>
        `
      },
      {
        id: 'what-it-inspects',
        title: 'สิ่งที่ระบบตรวจสุขภาพ (Health Check Checklist)',
        contentHtml: `
          <p>Doctor จะทำการวิเคราะห์ 6 จุดตรวจสุขภาพหลัก:</p>
          <ul>
            <li><strong>Tool Adapters Integrity</strong>: ตรวจสอบความถูกต้องของโฟลเดอร์ <code>.agents/skills/</code> และ <code>.claude/skills/</code></li>
            <li><strong>Configuration Validity</strong>: ตรวจสอบ Syntax และ Schema ของ <code>devflow/config.json</code></li>
            <li><strong>Context Token Weight</strong>: ตรวจสอบว่า <code>project-overview.md</code> มีขนาดเกิน 20KB หรือไม่</li>
            <li><strong>Orphan Context Workspaces</strong>: ตรวจหาโฟลเดอร์ค้างใน <code>devflow/context/</code> ที่ไม่มีสเปกสมบูรณ์</li>
            <li><strong>Run State Health</strong>: ตรวจสอบความถูกต้องของ <code>devflow/.state/run.json</code> พร้อมตัวเลือกล้างสถานะที่ค้าง</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>หากพบปัญหา Doctor จะแสดงคำแนะนำในการแก้ไข เช่น รัน <code>/overview</code> เพื่อลดขนาดบริบท หรือรันคำสั่งแก้ไขสถานะอัตโนมัติ</p>
        `
      }
    ]
  },

  // 12. Debug
  {
    slug: 'commands/debug',
    category: 'COMMANDS',
    title: 'Debug (/debug)',
    lead: 'วินิจฉัยหาสาเหตุของบั๊ก อาการทดสอบตก หรือความผิดปกติของระบบตามหลักการทางวิทยาศาสตร์โดยไม่มีการแก้ไขโค้ด',
    pills: ['Command', 'Debug', 'RootCause', 'Hypothesis', 'ZeroTouch', 'Reproduction'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/debug</code> เมื่อพบข้อผิดพลาดในโค้ดเบส Test ไม่ผ่าน หรือเกิดข้อผิดพลาดในการรันแอปพลิเคชัน:</p>
          <pre><code>/debug "TypeError: Cannot read properties of undefined (reading 'userId')"
/debug "รัน npm test แล้วฟังก์ชันคำนวณภาษีทำงานผิดพลาด"</code></pre>
        `
      },
      {
        id: 'scientific-pipeline',
        title: 'กระบวนการวินิจฉัย 4 ขั้นตอน (Scientific Diagnosis Pipeline)',
        contentHtml: `
          <ol>
            <li><strong>Symptom Reproduction</strong>: สร้าง Reproduction Script หรือ Test Case ขั้นต่ำที่จำลองอาการบั๊กได้ 100%</li>
            <li><strong>Hypothesis Generation</strong>: ตั้งสมมติฐานทางเทคนิค 2-3 ข้อที่เป็นไปได้จาก Codebase Analysis</li>
            <li><strong>Empirical Testing</strong>: พิสูจน์และตัดสมมติฐานที่ไม่ถูกต้องออกด้วยหลักฐานเชิงประจักษ์</li>
            <li><strong>Root Cause Isolation & Repair Handoff</strong>: ระบุสาเหตุที่แท้จริง (Root Cause) พร้อมเสนอทางแก้ที่รัดกุม</li>
          </ol>
        `
      },
      {
        id: 'what-it-never-does',
        title: 'การรับประกันความปลอดภัย (Zero Source Editing)',
        contentHtml: `
          <div class="docs-callout note">
            <div class="docs-callout-label">Zero Source Code Editing</div>
            <p><code>/debug</code> จะ<strong>ไม่แก้ซอร์สโค้ด</strong>ในระหว่างการสืบค้น เพื่อป้องกันปัญหาแก้แบบเดาสุ่ม (Guess & Check) และป้องกันการเกิดบั๊กซ้ำซ้อน</p>
          </div>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>นำผลลัพธ์การวินิจฉัยไปสร้าง Living Spec แก้ไขบั๊กด้วยคำสั่ง <code>/fix</code></p>
        `
      }
    ]
  },

  // 13. Fix
  {
    slug: 'commands/fix',
    category: 'COMMANDS',
    title: 'Fix (/fix)',
    lead: 'สร้าง Task-Isolated Living Spec สำหรับแก้บั๊กหรือการปรับปรุงขนาดเล็ก โดยยังคงวินัย TDD และ Regression Safety',
    pills: ['Command', 'Fix', 'BugFix', 'LivingSpec', 'TDD', 'RegressionSafety'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/fix</code> สำหรับการแก้ไขบั๊ก ข้อผิดพลาดเฉพาะจุด หรืองานปรับปรุงขนาดเล็กที่ไม่ได้อยู่ใน Build Plan หลัก:</p>
          <pre><code>/fix "แก้ไขปัญหา token หมดอายุแล้วไม่ refresh อัตโนมัติ"
/fix "แก้บั๊กการปัดเศษทศนิยมในหน้า checkout"</code></pre>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <ul>
            <li>จัดสรรรหัสงานแยกเฉพาะ (เช่น <code>devflow/context/fix-001-token-refresh/</code>)</li>
            <li>สร้าง <strong><code>spec.md</code></strong> ที่ระบุ Root Cause, Regression Test Plan และขอบเขตการแก้ไขที่จำกัด</li>
            <li>สร้าง <code>stage.md</code> และ <code>findings.md</code> ประจำงาน</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>เริ่มเขียน Test และแก้ไขโค้ดด้วยคำสั่ง <code>/implement</code> ตามด้วย <code>/check</code> และ <code>/complete</code></p>
        `
      }
    ]
  },

  // 14. Brief
  {
    slug: 'commands/brief',
    category: 'COMMANDS',
    title: 'Brief (/brief)',
    lead: 'บรรยายสรุปขอบเขตงาน ความซับซ้อน พื้นที่ที่ได้รับผลกระทบ และความเสี่ยงของฟีเจอร์ใน Build Plan ก่อนลงมือทำ (Read-Only)',
    pills: ['Command', 'Brief', 'PreFlight', 'Sizing', 'ScopeAnalysis', 'ReadOnly'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/brief</code> เพื่อดูภาพรวมก่อนเริ่มฟีเจอร์ถัดไป หรือต้องการตัดสินใจจัดลำดับความสำคัญของงาน:</p>
          <pre><code>/brief
/brief 2
/brief "ระบบรายงาน PDF"</code></pre>
        `
      },
      {
        id: 'what-it-reports',
        title: 'สิ่งที่ระบบรายงาน (What it reports)',
        contentHtml: `
          <ul>
            <li><strong>Scope Definition</strong>: ขอบเขตงานและความรับผิดชอบของฟีเจอร์</li>
            <li><strong>Dependencies & Pre-requisites</strong>: ฟีเจอร์ก่อนหน้าที่ต้องมีก่อน</li>
            <li><strong>Affected Files & Modules</strong>: รายชื่อไฟล์และโมดูลที่จะต้องสร้างหรือแก้ไข</li>
            <li><strong>Sizing & Splitting Recommendation</strong>: คำแนะนำว่าควรสร้างเป็นชิ้นเดียวหรือควรแบ่งเป็นบทย่อย</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>เมื่อพร้อมเริ่มพัฒนา ให้สั่งรัน <code>/feature {number}</code></p>
        `
      }
    ]
  },

  // 15. Audit
  {
    slug: 'commands/audit',
    category: 'COMMANDS',
    title: 'Audit (/audit)',
    lead: 'ตรวจสอบคุณภาพโค้ด ความปลอดภัย ประสิทธิภาพ และการครอบคลุมของชุดการทดสอบ พร้อมบันทึกลง Findings Ledger',
    pills: ['Command', 'Audit', 'Security', 'Quality', 'Performance', 'IndependentReview', 'Findings'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/audit</code> เพื่อตรวจจับข้อบกพร่องของโค้ดที่เพิ่งแก้ไข หรือตรวจสอบทั้งโปรเจกต์ก่อน Release:</p>
          <pre><code># ตรวจสอบการเปลี่ยนแปลงปัจจุบัน
/audit

# ตรวจสอบเฉพาะโฟลเดอร์หรือไฟล์ที่ระบุ
/audit src/services/auth/

# รันในโหมด Independent Reviewer
/audit independent current</code></pre>
        `
      },
      {
        id: 'independent-reviewer-mode',
        title: 'โหมดผู้ตรวจรับอิสระ (Independent Reviewer Mode)',
        contentHtml: `
          <p>เมื่อตั้งค่า <code>qualityGates.regular.independentReview</code> เป็น <code>when-sensitive</code> หรือสั่ง <code>/audit independent</code> AI จะจำลองการทำงานเป็น AI Reviewer แยกคนละ Session เพื่อตรวจทานโค้ดและออกใบรับรอง <strong>Review Receipt</strong> ใน <code>review.md</code> อย่างเป็นกลางและเข้มงวด</p>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <ul>
            <li><strong><code>devflow/context/{xxx-slug}/findings.md</code></strong>: บันทึกข้อบกพร่องที่พบแยกตามระดับความรุนแรง (Blocker, Warning, Note)</li>
            <li><strong><code>devflow/context/{xxx-slug}/review.md</code></strong>: ใบรับรองผลการตรวจรับโดย AI Reviewer อิสระ</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>แก้ไขข้อบกพร่องใน Findings Ledger ก่อนดำเนินการ <code>/complete</code></p>
        `
      }
    ]
  },

  // 16. Tests
  {
    slug: 'commands/tests',
    category: 'COMMANDS',
    title: 'Tests (/test, /setup-tests, /browser-tests)',
    lead: 'จัดการชุดการทดสอบ รันการทดสอบ สร้าง Test Cases ที่ขาดหายไป และเชื่อมต่อ Browser E2E Automation',
    pills: ['Command', 'Test', 'SetupTests', 'BrowserTests', 'Playwright', 'BrowserOS', 'Coverage'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ชุดคำสั่งด้านการทดสอบครอบคลุมทั้ง Unit, Integration และ E2E Browser Testing:</p>
          <pre><code># 1. รันและวิเคราะห์ความครอบคลุมของ Test
/test

# 2. ติดตั้งและตั้งค่า Test Runner เริ่มต้นสำหรับโปรเจกต์ใหม่
/setup-tests

# 3. ติดตั้งและเชื่อมต่อ Playwright Browser Tests + BrowserOS Neo
/browser-tests</code></pre>
        `
      },
      {
        id: 'browser-tests-integration',
        title: 'การเชื่อมต่อ Playwright & BrowserOS Neo MCP',
        contentHtml: `
          <p>คำสั่ง <code>/browser-tests</code> จะติดตั้ง Playwright Test Harness และเชื่อมต่อกับ MCP <code>browseros-neo</code> เพื่อให้ AI สามารถเปิดเบราว์เซอร์จริง ทดสอบคลิกหน้าจอ กรอกฟอร์ม และบันทึก Screenshot เป็นหลักฐานการตรวจรับได้</p>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>รวมชุดคำสั่ง Verify เข้าสู่ CI ด้วยคำสั่ง <code>/ci</code></p>
        `
      }
    ]
  },

  // 17. CI
  {
    slug: 'commands/ci',
    category: 'COMMANDS',
    title: 'CI (/ci)',
    lead: 'รวมศูนย์คำสั่ง Verify กลางของโปรเจกต์ ตั้งค่า GitHub Actions Workflows และติดตั้ง Local Pre-push Hook',
    pills: ['Command', 'CI', 'GitHubActions', 'VerifyCommand', 'PrePushHook', 'Automation'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/ci</code> เพื่อตั้งค่าระบบ Continuous Integration ที่ตรงตามมาตรฐานของโปรเจกต์:</p>
          <pre><code>/ci</code></pre>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <ul>
            <li><strong>Single Verify Command</strong>: กำหนดคำสั่ง <code>npm run check</code> หรือ <code>make verify</code> ที่รัน Typecheck, Lint และ Tests รวดเดียวจบ</li>
            <li><strong><code>.github/workflows/ci.yml</code></strong>: ไฟล์ GitHub Actions Workflow ที่รันคำสั่ง Verify บนทุก Pull Request และ Push</li>
            <li><strong>Local Pre-push Hook</strong>: ติดตั้ง Git Hook ช่วยตรวจสอบโค้ดในเครื่องก่อนรัน push (เปิด/ปิดได้ตามต้องการ)</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>ทดสอบรันคำสั่ง Verify ในเครื่องด้วยตนเองก่อน Push งาน</p>
        `
      }
    ]
  },

  // 18. Prototype
  {
    slug: 'commands/prototype',
    category: 'COMMANDS',
    title: 'Prototype (/prototype)',
    lead: 'สร้างหน้าจำลอง Static HTML/CSS แบบ Throwaway พร้อม Design Tokens สำเร็จรูปเพื่อทดสอบ UX ก่อนเขียนโค้ดจริง',
    pills: ['Command', 'Prototype', 'DesignTokens', 'StaticHTML', 'UX', 'Wireframe'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/prototype</code> เมื่อต้องการทดลองจัด Layout สำรวจ Theme สี หรือสร้าง Mockup หน้าจอให้ผู้มีส่วนได้ส่วนเสียตรวจรับก่อนลงมือเขียน Component จริง:</p>
          <pre><code>/prototype "หน้า Dashboard แสดงยอดขายและกราฟแบบ Glassmorphism"</code></pre>
        `
      },
      {
        id: 'design-tokens-system',
        title: 'ระบบ Design Tokens แบบ Zero-Dependency',
        contentHtml: `
          <p>Prototype จะสร้างไฟล์ HTML/CSS แบบ Standalone 100% ในโฟลเดอร์ <code>devflow/prototypes/</code> พร้อมระบบ Design Tokens (Typography, Palettes, Spacing, Shadows, Micro-interactions) ที่สวยงามระดับพรีเมียมโดยไม่ต้องติดตั้งไลบรารีภายนอก</p>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>นำแบบร่างที่เห็นชอบไปสร้าง Living Spec ด้วยคำสั่ง <code>/feature</code></p>
        `
      }
    ]
  },

  // 19. Autopilot
  {
    slug: 'commands/autopilot',
    category: 'COMMANDS',
    title: 'Autopilot (/autopilot)',
    lead: 'รันการพัฒนาฟีเจอร์เดี่ยวแบบอัตโนมัติต่อเนื่องตั้งแต่ Feature -> Implement -> Check ผ่านทุก Quality Gates และหยุดรอคำสั่ง Complete',
    pills: ['Command', 'Autopilot', 'SingleFeature', 'Autonomous', 'QualityGates', 'ReviewGate'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/autopilot</code> เมื่อต้องการให้ AI จัดการพัฒนาฟีเจอร์ 1 รายการตั้งแต่ต้นจนจบอย่างรวดเร็วและปลอดภัย:</p>
          <pre><code>/autopilot 1
/autopilot "ระบบส่งอีเมลยืนยันการสมัครสมาชิก"</code></pre>
        `
      },
      {
        id: 'autopilot-pipeline',
        title: 'กระบวนการทำงานอัตโนมัติ (Execution Pipeline)',
        contentHtml: `
          <ol>
            <li><strong>Spec Formulation</strong>: ร่าง Living Spec ใน <code>devflow/context/{xxx-slug}/spec.md</code></li>
            <li><strong>TDD Implementation</strong>: สร้าง Branch, เขียน Test และพัฒนาโค้ดให้ผ่าน 100%</li>
            <li><strong>Verification Matrix</strong>: รัน Typecheck, Lint, Test suites และบันทึกหลักฐาน</li>
            <li><strong>Independent Review</strong>: รัน AI Reviewer ตรวจรับหากเป็นฟีเจอร์ที่มีความเสี่ยงสูง</li>
            <li><strong>Mandatory Pause</strong>: หยุดรอหน้าประตูส่งมอบเพื่อให้คุณตรวจรับผลลัพธ์ขั้นสุดท้ายก่อนรัน <code>/complete</code></li>
          </ol>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>ตรวจดูผลงาน แล้วสั่ง <code>/complete</code> เพื่อรวมโค้ดเข้าสู่ main</p>
        `
      }
    ]
  },

  // 20. Continuous
  {
    slug: 'commands/continuous',
    category: 'COMMANDS',
    title: 'Continuous (/continuous)',
    lead: 'วงจรการส่งมอบอัตโนมัติหลายฟีเจอร์ต่อเนื่อง พัฒนาฟีเจอร์จาก Build Plan ทีละรายการพร้อมทำ Squash-Merge เข้าสู่ main',
    pills: ['Command', 'Continuous', 'AutonomousLoop', 'MultiFeature', 'SafetyBoundary', 'CircuitBreaker'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/continuous</code> เพื่อให้ AI จัดการพัฒนาฟีเจอร์ทั้งหมดที่ยังค้างอยู่ใน <code>build-plan.md</code> แบบอัตโนมัติทีละรายการ:</p>
          <pre><code># รันฟีเจอร์ที่เหลือทั้งหมดตามลำดับ
/continuous

# หรือระบุจำนวนฟีเจอร์ที่ต้องการทำ
/continuous --limit 3</code></pre>
        `
      },
      {
        id: 'safety-boundaries-circuit-breakers',
        title: 'ขอบเขตความปลอดภัยและระบบตัดวงจรอัตโนมัติ (Circuit Breakers)',
        contentHtml: `
          <p>Continuous Mode มีระบบป้องกันความปลอดภัยที่เข้มงวด:</p>
          <ul>
            <li><strong>Serial Execution</strong>: ทำงานทีละ 1 ฟีเจอร์ผ่านวงจรเต็มรูปแบบ (Spec -> Implement -> Check -> Complete) เสมอ</li>
            <li><strong>Circuit Breaker</strong>: หากพบ Test ล้มเหลวที่ไม่สามารถแก้ได้ หรือข้อมูลในสเปกขัดแย้งกัน ระบบจะ<strong>หยุดทำงานทันที</strong>และแจ้งเตือนคุณ</li>
            <li><strong>Local Squash-merge Only</strong>: รวมโค้ดในเครื่องเท่านั้น ไม่มีการรัน <code>git push</code> เด็ดขาด</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>ตรวจเช็กสถานะการส่งมอบด้วย <code>/status</code> หรือดูประวัติใน <code>HISTORY.md</code></p>
        `
      }
    ]
  },

  // 21. Release
  {
    slug: 'commands/release',
    category: 'COMMANDS',
    title: 'Release (/release)',
    lead: 'ตรวจสอบความพร้อมก่อนส่งมอบสู่ Production (Render, Vercel, Docker) ตรวจสอบ Secrets, Health Check Probes และ Database Migrations',
    pills: ['Command', 'Release', 'ProductionReadiness', 'Vercel', 'Render', 'Docker', 'SecretAudit'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/release</code> ก่อนนำแอปพลิเคชันขึ้นเซิร์ฟเวอร์ Production จริง:</p>
          <pre><code>/release</code></pre>
        `
      },
      {
        id: 'release-checklist',
        title: 'จุดตรวจความพร้อม 5 ด้าน (Production Readiness Checklist)',
        contentHtml: `
          <ul>
            <li><strong>Build Artifact</strong>: คอมไพล์ Production Build ในเครื่องว่าผ่าน 100% ปราศจาก Error หรือ Warning ร้ายแรง</li>
            <li><strong>Platform Configs</strong>: ตรวจสอบความถูกต้องของ Configuration Files (<code>vercel.json</code>, <code>render.yaml</code>, <code>Dockerfile</code>)</li>
            <li><strong>Environment Variables & Secrets</strong>: ตรวจสอบความครบถ้วนของ <code>.env.example</code> และไม่มี Secret หรือ API Key รั่วไหลในโค้ด</li>
            <li><strong>Health Check Probes</strong>: ยืนยันการมีอยู่ของ Health Check Endpoint (เช่น <code>/healthz</code>)</li>
            <li><strong>Database Migrations</strong>: ตรวจสอบว่า Migration Scripts พร้อมรันและมี Rollback Plan</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>เมื่อผลการตรวจสอบผ่านครบถ้วน คุณสามารถดำเนินการ Deploy สู่ Production ตามขั้นตอนของแพลตฟอร์มได้ทันที</p>
        `
      }
    ]
  },

  // 22. Rollback
  {
    slug: 'commands/rollback',
    category: 'COMMANDS',
    title: 'Rollback (/rollback)',
    lead: 'วางแผนย้อนกลับฟีเจอร์ที่ส่งมอบไปแล้วอย่างปลอดภัยโดยยังคงรักษาประวัติ Git และประเมินความเสี่ยงต่อฟีเจอร์อื่น (Forward Dependency Risk)',
    pills: ['Command', 'Rollback', 'ReversalSpec', 'SafeUndo', 'ForwardDependency', 'HistoryPreserving'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/rollback</code> เมื่อต้องการยกเลิกฟีเจอร์ที่เคยส่งมอบและรวมเข้า main ไปแล้วอย่างปลอดภัย:</p>
          <pre><code>/rollback 3
/rollback "003-stripe-payment"</code></pre>
        `
      },
      {
        id: 'forward-dependency-scan',
        title: 'การวิเคราะห์ผลกระทบต่อฟีเจอร์ที่ทำตามหลัง (Forward Dependency Scan)',
        contentHtml: `
          <p>AI จะทำการสแกนประวัติว่ามีฟีเจอร์ใดที่สร้างขึ้นหลังจากนั้นและพึ่งพาโค้ดของฟีเจอร์ที่จะยกเลิกหรือไม่ พร้อมร่าง <strong>Rollback Living Spec</strong> เพื่อให้การย้อนกลับไม่ทำให้ระบบส่วนอื่นพัง</p>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>ตรวจรับ Rollback Spec แล้วสั่ง <code>/implement</code> เพื่อดำเนินการถอนโค้ดอย่างปลอดภัย</p>
        `
      }
    ]
  },

  // 23. Analyze (SA Suite)
  {
    slug: 'commands/analyze',
    category: 'COMMANDS',
    title: 'Analyze (/analyze) - SA Suite',
    lead: 'ชุดเครื่องมือสำหรับ System Analyst (SA) นำเข้าเอกสารความต้องการทุกรูปแบบ (PDF, Word, Excel, รูปภาพ, ข้อความแชต) และวิเคราะห์ Codebase Impact',
    pills: ['Command', 'Analyze', 'SA', 'DocIngestion', 'OCR', 'CodebaseImpact', 'Clarifications'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/analyze</code> เมื่อคุณได้รับเอกสารความต้องการจากลูกค้า, ฝ่ายธุรกิจ หรือทีมงานในรูปแบบไฟล์ต่างๆ เพื่อให้ AI ช่วยสกัด สรุป และวิเคราะห์ผลกระทบต่อระบบ:</p>
          <pre><code># 1. นำเข้าไฟล์เอกสารจากโฟลเดอร์ใดๆ (PDF, Word, Excel, รูปภาพ UI)
/analyze C:\\Users\\...\\Downloads\\customer-requirement.pdf
/analyze ./mockup.png ./schema.xlsx "ระบบสะสมแต้มสมาชิก"

# 2. นำเข้าข้อความความต้องการดิบจากหน้าต่างแชต
/analyze "ลูกค้าต้องการระบบผ่อนชำระ 0% เชื่อมต่อกับ KBank Payment Gateway"

# 3. สแกนไฟล์ที่วางไว้ใน devflow/inbox/ อัตโนมัติ
/analyze</code></pre>
        `
      },
      {
        id: 'the-4-step-pipeline',
        title: 'กระบวนการวิเคราะห์ 4 ขั้นตอน (4-Step SA Pipeline)',
        contentHtml: `
          <pre><code>  [Raw Files / Multi-format Docs / Prompts]
                     │
                     ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. Auto-Allocate & Ingest (devflow/inbox/{REQ-ID}/raw/)      │
  │    • Generates REQ-YYYYMMDD-NNN Workspace                   │
  │    • Safe isolated raw copy (PDF, XLSX, DOCX, Images)       │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 2. Parse & Normalize (Multimodal OCR -> parsed.md)          │
  │    • Executive Summary, User Stories, Scope Boundaries      │
  │    • Functional (FR) & Non-Functional (NFR) Requirements    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 3. Codebase Impact & Blast Radius (codebase-impact.md)       │
  │    • Scans affected API routes, services, schemas, and DB   │
  │    • Evaluates complexity level (Low / Med / High / Extreme)│
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 4. Socratic Gap Scan (clarifications.md)                    │
  │    • Detects ambiguities, missing edge-cases, assumptions   │
  │    • Generates meeting checklist for client alignment       │
  └─────────────────────────────────────────────────────────────┘</code></pre>
          <ol>
            <li><strong>Auto-Allocate & Ingest (สร้าง Workspace)</strong>: จัดสรรรหัส <code>REQ-YYYYMMDD-NNN</code> และสร้างโฟลเดอร์ <code>devflow/inbox/{REQ-ID}/raw/</code> เพื่อจัดเก็บไฟล์ต้นฉบับ</li>
            <li><strong>Parse & Normalize (สกัดเนื้อหาเป็น Markdown)</strong>: แปลงเนื้อหา ตาราง และรูปภาพ Wireframe (ผ่าน Multimodal OCR) ให้อยู่ในรูป <code>parsed.md</code> แบ่งหมวด Executive Summary, User Stories, Functional (FR) และ Non-Functional Requirements (NFR)</li>
            <li><strong>Codebase Impact & Blast Radius (สแกนผลกระทบต่อโค้ดเดิม)</strong>: ตรวจหาไฟล์ API และฐานข้อมูลที่ได้รับผลกระทบ ประเมินระดับความซับซ้อน (Low / Medium / High / Extreme) และบันทึกลง <code>codebase-impact.md</code></li>
            <li><strong>Socratic Gap Scan & Clarifications Checklist</strong>: ตรวจหาจุดที่ความต้องการยังคลุมเครือ Edge cases ที่ขาดหาย และสร้าง Checklist คำถามใน <code>clarifications.md</code> เพื่อนำไปประชุมกับ Stakeholder</li>
          </ol>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <table>
            <thead><tr><th>ไฟล์ผลลัพธ์</th><th>ตำแหน่ง</th><th>หน้าที่และประโยชน์</th></tr></thead>
            <tbody>
              <tr><td><code>raw/</code></td><td><code>devflow/inbox/{REQ-ID}/raw/</code></td><td>สำเนาไฟล์ต้นฉบับ (PDF, DOCX, XLSX, รูปภาพ) ปลอดภัย 100%</td></tr>
              <tr><td><code>parsed.md</code></td><td><code>devflow/inbox/{REQ-ID}/parsed.md</code></td><td>เอกสารความต้องการที่สกัดเป็น Clean Markdown พร้อมหัวข้อ FR/NFR</td></tr>
              <tr><td><code>codebase-impact.md</code></td><td><code>devflow/analysis/{REQ-ID}/codebase-impact.md</code></td><td>รายงานวิเคราะห์ขอบเขตผลกระทบ (Blast Radius) และจุดที่ต้องแก้ไขในระบบ</td></tr>
              <tr><td><code>clarifications.md</code></td><td><code>devflow/inbox/{REQ-ID}/clarifications.md</code></td><td>Checklist คำถามสำหรับ SA นำไปใช้สอบถามลูกค้าในที่ประชุม</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>นำประเด็นที่คลุมเครือไปซักถามผ่าน <code>/grill</code> หรือส่งต่อเข้าสู่กระบวนการสำรวจทางเลือกด้วย <code>/discovery</code></p>
        `
      }
    ]
  },

  // 24. Grill
  {
    slug: 'commands/grill',
    category: 'COMMANDS',
    title: 'Grill (/grill, /align)',
    lead: 'สัมภาษณ์เจาะลึกทางสถาปัตยกรรมแบบ Socratic เพื่อท้าทายสมมติฐาน สกัดคำศัพท์ลง Glossary และบันทึก ADR ก่อนเขียนสเปก',
    pills: ['Command', 'Grill', 'Align', 'Socratic', 'ADR', 'Glossary', 'DomainModeling'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/grill</code> (หรือ <code>/align</code>) เมื่อคุณกำลังจะออกแบบระบบที่มีความคลุมเครือ มีศัพท์เทคนิคหลายความหมาย หรือต้องตัดสินใจเรื่องสถาปัตยกรรมที่ย้อนกลับได้ยาก:</p>
          <pre><code>/grill "สถาปัตยกรรมการตัดสต็อกสินค้าในกรณีมี Flash Sale พร้อมกัน"
/grill "การแยกระหว่าง Entity User, Member, และ Customer ในระบบ Loyalty"</code></pre>
        `
      },
      {
        id: 'core-philosophy',
        title: 'หลักการสำคัญ: Align Before You Build',
        contentHtml: `
          <pre><code>  [Vague Requirements / Complex Architecture]
                         │
                         ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. Codebase-Grounded Inspection                             │
  │    • Inspects existing models, services, and APIs           │
  │    • Never asks questions already answered in code          │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 2. Socratic Interview (1-2 Focused Questions Rule)          │
  │    • Challenges assumptions & edge-cases                    │
  │    • Always provides Recommended Defaults                   │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 3. Lazy Inline Persistence                                  │
  │    • Glossary: devflow/context/glossary.md                  │
  │    • Architecture Decision Records: devflow/decisions/      │
  └─────────────────────────────────────────────────────────────┘</code></pre>
          <ul>
            <li><strong>Codebase-Grounded</strong>: AI จะอ่านโค้ดและบริบทที่มีอยู่ก่อนเสมอ จะ<strong>ไม่ถามคำถามที่โค้ดเบสมีคำตอบอยู่แล้ว</strong></li>
            <li><strong>1-2 Focused Questions Rule</strong>: ถามทีละ 1-2 คำถามที่ตรงจุดสำคัญที่สุด พร้อมเสนอค่า Recommended Default เสมอ เพื่อไม่ให้สร้างภาระทางความคิดแก่คุณ</li>
            <li><strong>Lazy Inline Persistence</strong>: บันทึกคำศัพท์ที่ตกลงกันลง <code>devflow/context/glossary.md</code> ทันที และบันทึกการตัดสินใจที่ย้อนกลับยากเป็น ADR ลง <code>devflow/decisions/</code></li>
          </ul>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <ul>
            <li><strong><code>devflow/context/glossary.md</code></strong>: พจนานุกรมคำศัพท์โดเมนและข้อจำกัดของแต่ละ Entity</li>
            <li><strong><code>devflow/decisions/ADR-{NNN}-{slug}.md</code></strong>: บันทึก Architecture Decision Records (Context, Decision, Alternatives, Consequences)</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>เริ่มพัฒนาฟีเจอร์ที่ผ่านการกลั่นกรองสถาปัตยกรรมแล้วด้วย <code>/feature</code></p>
        `
      }
    ]
  },

  // 25. Bughunter
  {
    slug: 'commands/bughunter',
    category: 'COMMANDS',
    title: 'Bughunter (/bughunter)',
    lead: 'ค้นหาช่องโหว่ความปลอดภัย ตรวจสอบ Trust Boundaries และล่าบั๊กลึกด้วยหลักฐานเชิงประจักษ์และการจำลองการโจมตี',
    pills: ['Command', 'Bughunter', 'Security', 'Vulnerability', 'OWASP', 'EmpiricalProof'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/bughunter</code> เพื่อตรวจสอบความปลอดภัยของโมดูลหรือ API Endpoint สำคัญก่อนขึ้นระบบจริง:</p>
          <pre><code>/bughunter src/api/payments/
/bughunter "ตรวจสอบช่องโหว่ IDOR และ SQL Injection ในระบบจัดการคำสั่งซื้อ"</code></pre>
        `
      },
      {
        id: 'empirical-security-inspection',
        title: 'การตรวจสอบความปลอดภัยด้วยหลักฐานเชิงประจักษ์',
        contentHtml: `
          <p>Bughunter จะตรวจสอบขอบเขตความปลอดภัยสำคัญ:</p>
          <ul>
            <li><strong>Authentication & Session Ownership</strong>: ตรวจสอบการเข้าถึงข้อมูลข้ามบัญชีผู้ใช้ (IDOR / BOLA)</li>
            <li><strong>Untrusted Input Sanitization</strong>: ตรวจสอบ SQL Injection, XSS, Remote Code Execution</li>
            <li><strong>Sensitive Data Exposure</strong>: ตรวจจับการรั่วไหลของรหัสผ่าน, API Keys, หรือข้อมูลส่วนบุคคล (PII)</li>
            <li><strong>Repro Proof Requirement</strong>: ทุกช่องโหว่ที่รายงานต้องมีโค้ดจำลองการทดสอบที่พิสูจน์ได้จริง</li>
          </ul>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก (What it writes)',
        contentHtml: `
          <ul>
            <li><strong><code>devflow/context/{xxx-slug}/findings.md</code></strong>: บันทึกช่องโหว่ความปลอดภัยพร้อมระดับความเสี่ยง (Critical / High / Medium)</li>
            <li>เสนอแนวทางการอุดช่องโหว่แบบรัดกุมที่สุดตามมาตรฐาน OWASP</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>นำช่องโหว่ที่พบไปเปิด Living Spec เพื่อแก้ไขด่วนด้วยคำสั่ง <code>/fix</code></p>
        `
      }
    ]
  },

  // 26. Archify
  {
    slug: 'commands/archify',
    category: 'COMMANDS',
    title: 'Archify (/archify)',
    lead: 'สร้างแผนภาพสถาปัตยกรรมระบบ Flow การทำงาน และ Data Pipeline แบบ Interactive Standalone HTML สวยงามระดับพรีเมียม',
    pills: ['Command', 'Archify', 'Architecture', 'InteractiveHTML', 'DataFlow', 'SequenceDiagram'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/archify</code> เมื่อคุณต้องการแผนภาพสถาปัตยกรรมที่สามารถคลิกสำรวจได้ (Explorable Architecture Map), Sequence Diagrams, State Machines หรือแปลง Mermaid ให้กลายเป็นหน้าเว็บ Interactive Standalone HTML:</p>
          <pre><code>/archify "สร้างแผนภาพแสดง Flow การชำระเงินตั้งแต่ Client -> Payment Gateway -> Webhook -> DB"
/archify --source ./devflow/context/001-auth/spec.md</code></pre>
        `
      },
      {
        id: 'core-capabilities',
        title: 'ความสามารถหลักของ Archify',
        contentHtml: `
          <ul>
            <li><strong>Interactive HTML Output</strong>: แผนภาพที่สร้างเป็น Standalone HTML ไฟล์เดียวจบ สามารถเปิดดูบนเบราว์เซอร์ได้ทันทีโดยไม่ต้องต่ออินเทอร์เน็ต</li>
            <li><strong>Theme & Motion Support</strong>: สลับ Dark/Light Theme ได้ในตัว พร้อม Animation เส้นทาง Data Flow</li>
            <li><strong>Route Probes & Inspection</strong>: คลิกที่แต่ละ Node หรือ Layer เพื่อดูรายละเอียด API Spec, Data Model หรือโค้ดที่เกี่ยวข้อง</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>นำแผนภาพที่ได้ไปแนบใน <code>devflow/discoveries/</code> หรือ <code>spec.md</code> เพื่อใช้เป็นภาพอ้างอิงในการพัฒนา</p>
        `
      }
    ]
  },

  // 27. Diagram Design
  {
    slug: 'commands/diagram-design',
    category: 'COMMANDS',
    title: 'Diagram Design (/diagram-design)',
    lead: 'ชุดเครื่องมือสร้างแผนภาพเชิงบรรณาธิการและแผนภาพธุรกิจกว่า 39 รูปแบบ ทั้ง HTML, SVG และ PNG พร้อมรองรับ draw.io และ Mermaid',
    pills: ['Command', 'DiagramDesign', 'Editorial', '39-Templates', 'SVG', 'Mermaid', 'DrawIO'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/diagram-design</code> เมื่อต้องการสร้างแผนภาพนำเสนอระดับมืออาชีพ เช่น Business Process, Mindmap, Cloud Topology, Comparison Matrix หรือ Quadrant Analysis:</p>
          <pre><code>/diagram-design "สร้างแผนภาพ 2x2 Matrix เปรียบเทียบความคุ้มค่าและความเสี่ยงของสถาปัตยกรรม Microservices"</code></pre>
        `
      },
      {
        id: 'supported-templates',
        title: 'เทมเพลตและรูปแบบที่รองรับ',
        contentHtml: `
          <p>รองรับกว่า 39 เทมเพลตมาตรฐานสากล ทั้ง Flowchart, C4 Model, Mindmap, Value Stream Map, และ Architecture Topology รองรับการ Export เป็น SVG และ Standalone HTML</p>
        `
      }
    ]
  },

  // 28. Convert Any to MD
  {
    slug: 'commands/convert-any-to-md',
    category: 'COMMANDS',
    title: 'Convert Any to MD (/convert-any-to-md)',
    lead: 'แปลงเอกสารทุกรูปแบบ (.pdf, .docx, .xlsx, .csv, .json, .yaml, รูปภาพ) ให้กลายเป็น Clean Markdown ภายใต้ devflow/reference/',
    pills: ['Command', 'Converter', 'Markdown', 'PDF', 'Word', 'Excel', 'DataExtraction'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/convert-any-to-md</code> เมื่อคุณมีเอกสารความต้องการจากลูกค้าหรือสเปกจากฝ่ายธุรกิจที่ต้องการแปลงเป็น Markdown เพื่อให้ AI อ่านเข้าใจง่ายและนำไปใช้วิเคราะห์:</p>
          <pre><code>/convert-any-to-md C:\\Users\\...\\Downloads\\requirements.pdf
/convert-any-to-md ./specs-folder/</code></pre>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก',
        contentHtml: `
          <p>ระบบจะสกัดข้อความ หัวข้อ และตาราง แล้วบันทึกเป็น Clean Markdown ใน <code>devflow/reference/{filename}.md</code></p>
        `
      }
    ]
  },

  // 29. Vendor
  {
    slug: 'commands/vendor',
    category: 'COMMANDS',
    title: 'Vendor (/vendor)',
    lead: 'ดึง External Git Repositories เข้าสู่ devflow/.vendor/ และสร้าง Custom Wrapper Skill อัตโนมัติพร้อมการป้องกัน Update Immunity',
    pills: ['Command', 'Vendor', 'Equip', 'GitSubtree', 'CustomSkill', 'UpdateImmunity'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/vendor</code> (หรือ <code>/equip</code>, <code>/skill-add</code>) เมื่อต้องการนำไลบรารีหรือ Repositories ภายนอกมาเป็นทักษะเสริมในโปรเจกต์:</p>
          <pre><code>/vendor https://github.com/example/special-toolkit.git</code></pre>
        `
      },
      {
        id: 'update-immunity',
        title: 'การป้องกัน Update Immunity',
        contentHtml: `
          <p>โฟลเดอร์ใน <code>devflow/.vendor/</code> จะได้รับการคุ้มครองด้วย Update Immunity ซึ่งหมายความว่าเมื่อมีการอัปเกรด DevFlow ไฟล์ที่ Vendor เข้ามาจะไม่ถูกเขียนทับหรือลบหายไป</p>
        `
      }
    ]
  },

  // 30. Ponytail
  {
    slug: 'commands/ponytail',
    category: 'COMMANDS',
    title: 'Ponytail (/ponytail)',
    lead: 'โหมด Senior Developer ขี้เกียจ ตรวจจับ Code Bloat ตัดความซับซ้อนส่วนเกิน (Over-engineering) และลดการใช้ LLM Tokens',
    pills: ['Command', 'Ponytail', 'Simplification', 'KISS', 'YAGNI', 'TokenSaver'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/ponytail</code> เมื่อรู้สึกว่าโค้ดเริ่มซับซ้อนเกินจำเป็น มี Abstraction หลายชั้น หรือมี Dependencies ที่ไม่ได้ใช้งาน:</p>
          <pre><code>/ponytail src/services/
/ponytail "ช่วยรีวิวว่าโค้ดส่วนนี้เขียนให้เรียบง่ายขึ้นได้อย่างไร"</code></pre>
        `
      },
      {
        id: 'philosophy',
        title: 'ปรัชญาความเรียบง่าย (KISS & YAGNI)',
        contentHtml: `
          <p>Ponytail จะช่วยเสนอทางเลือกในการเขียนโค้ดที่สั้นลง อ่านง่ายขึ้น โดยใช้ฟีเจอร์มาตรฐานของภาษาหรือ Native Platform APIs แทนการพึ่งพาไลบรารีขนาดใหญ่</p>
        `
      }
    ]
  },

  // 31. Report HTML
  {
    slug: 'commands/report-html',
    category: 'COMMANDS',
    title: 'Report HTML (/report-html)',
    lead: 'สังเคราะห์แดชบอร์ดรายงานผลการส่งมอบงานแบบ Standalone Interactive HTML จาก Living Spec หรือ History Archive',
    pills: ['Command', 'ReportHTML', 'Dashboard', 'Standalone', 'HistoryVisualizer', 'ExecutiveReport'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/report-html</code> เมื่อต้องการสร้างหน้าเว็บสรุปผลงานระดับบริหารจาก <code>spec.md</code> หรือจากประวัติใน <code>devflow/history/</code>:</p>
          <pre><code>/report-html
/report-html 090</code></pre>
        `
      },
      {
        id: 'what-it-writes',
        title: 'สิ่งที่ระบบสร้างและบันทึก',
        contentHtml: `
          <p>สร้างไฟล์ <code>devflow/reports/{task-id}-report.html</code> ที่เป็น Standalone Dashboard พร้อมสรุปผลการทดสอบ ตาราง Checklist และ Diff Metrics</p>
        `
      }
    ]
  }
];

