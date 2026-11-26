import type { DocPage } from '../build-docs-site.js';

export const COMMANDS_PAGES: DocPage[] = [
  // 1. Onboard (Fresh + Auto Brownfield --adopt)
  {
    slug: 'commands/onboard',
    category: 'COMMANDS',
    title: 'Onboard (/onboard, /onboard --adopt)',
    lead: 'ปรับแต่งเวิร์กโฟลว์ทั้งโปรเจกต์ใหม่และโปรเจกต์เดิมที่มีโค้ดเบสอยู่แล้ว (auto-detect brownfield / --adopt) พร้อมตั้งค่า Review Cadence',
    pills: ['Command', 'Onboard', 'Adopt', 'Brownfield', 'Config', 'Cadence', 'Preset', 'QualityGates'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>รันคำสั่ง <code>/onboard</code> (หรือ <code>$onboard</code>) ทันทีหลังจากติดตั้ง Nexus-DevFlow ทั้งโปรเจกต์เปล่าที่เพิ่งเริ่มต้น และโปรเจกต์เดิมที่มีโค้ดเบสทำงานอยู่แล้ว (ระบบจะตรวจจับ brownfield อัตโนมัติหรือใส่ <code>--adopt</code>):</p>
          <pre><code># สำหรับโปรเจกต์ใหม่ (หรือตรวจจับ brownfield อัตโนมัติ)
/onboard

# บังคับโหมดสำรวจโค้ดเบสเดิม (legacy /adopt)
/onboard --adopt

# สำหรับ OpenAI Codex CLI
$onboard</code></pre>
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
          <p>1. หากต้องการตั้งค่า GitHub Actions CI ให้ติดตั้งส่วนเสริม <code>npx nexus-devflow skill add ci</code></p>
          <p>2. กรอกเป้าหมายผลิตภัณฑ์ลงใน <code>devflow/project-plan.md</code> และรายการฟีเจอร์ใน <code>devflow/build-plan.md</code></p>
          <p>3. รันคำสั่ง <code>/overview</code> เพื่อคอมไพล์ Living Source of Truth สำหรับโปรเจกต์</p>
        `
      }
    ]
  },

  // 2. Discovery (incl. SA Intake & Socratic Grill)
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
            <li><strong>SA Intake &amp; Socratic Grilling Lens (<code>/discovery --grill</code> / <code>REQ-ID</code>)</strong>: นำเข้าเอกสารความต้องการหลายฟอร์แมต, สแกน Codebase Impact, สัมภาษณ์ 1–2 คำถามต่อรอบ, สกัดศัพท์ลง <code>glossary.md</code> และบันทึก <code>devflow/decisions/ADR-xxx.md</code></li>
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
          <p>ใช้คำสั่ง <code>/feature</code> เพื่อพรีวิวขอบเขต (<code>--preview</code>), ถามเสริมเฉพาะจุดที่ขาดอัตโนมัติ (Adaptive Pre-Flight Clarification) และร่าง Living Spec:</p>
          <pre><code># 1. พรีวิวขอบเขตและความเสี่ยงของฟีเจอร์ถัดไป (Read-Only)
/feature --preview

# 2. สร้าง Living Spec สำหรับฟีเจอร์ถัดไปหรือตามหมายเลข/ชื่อ
/feature
/feature 1
/feature "ระบบชำระเงิน PromptPay QR"

# 3. พัฒนาต่อยอดจาก Discovery / REQ หรือรัน Spec Check Gate
/feature DISC-20260916-001
/feature 1 --check</code></pre>
          <p>เมื่อใส่แฟล็ก <code>--check</code> หรือตั้งค่า <code>qualityGates.regular.specCheck: "always"</code> ระบบจะตรวจความถูกต้องของพาธไฟล์ คำสั่ง และ AC traceability เทียบกับโค้ดจริงก่อนหยุดรอให้ผู้ใช้ทบทวนสเปก (และหากข้อมูลไม่ครบจะถาม Socratic 1–2 ข้อ/รอบอัตโนมัติก่อนเขียน <code>spec.md</code>)</p>
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
            <li>เมื่อตั้งค่า <code>workflow.stepReview: "every"</code> จะแสดงเมนู 3 ตัวเลือกหลังทุกสเต็ป (<code>Continue to next step</code>, <code>Walk me through this step</code>, <code>Request changes on this step</code>) และเมื่อ <code>tryGuide</code> เป็น <code>when-testable</code> / <code>always</code> จะแนบบล็อก <code>## Try it now</code> ในแพ็กเก็ตสุดท้าย</li>
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
          <p>หากคุณต้องการทดสอบฟังก์ชันด้วยตัวเองบนหน้าจอ ให้ใช้ <code>/check guide</code> โดยอ้างอิงแนวทางแบบ On-Demand จาก <code>check/reference/try-it-now.md</code> ซึ่งใช้สร้างทั้งคู่มือฉบับเต็มและบล็อก <code>## Try it now</code> 1–3 ขั้นตอนสำหรับนโยบาย <code>tryGuide: "when-testable"</code> ด้วย</p>
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
            <li><strong>Archive to History</strong>: คัดกรองสถานะและบันทึกสเปกที่ผ่านการรับรอง (พร้อม <code>## Try it now</code> proof เมื่อ <code>tryGuide</code> ทำงาน) เข้าคลังถาวร <code>devflow/history/features/{xxx-slug}.md</code> ตามมาตรฐาน On-Demand <code>completion-screen.md</code> และ <code>completion-archive.md</code></li>
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
          <p>ดูสถานะภาพรวมของโปรเจกต์ด้วย <code>/devflow-help</code> หรือเริ่มฟีเจอร์ถัดไปด้วย <code>/feature</code></p>
        `
      }
    ]
  },

  // 10. DevFlow Help (Interactive Guide + Prompt Builder + Status + Doctor + Legacy Router)
  {
    slug: 'commands/devflow-help',
    category: 'COMMANDS',
    title: 'DevFlow Help (/devflow-help, /devflow-help doctor)',
    lead: 'ศูนย์รวม Interactive Guide & Prompt Builder, รายงานสถานะงาน (--exec), ตรวจสุขภาพ Adapters/Verify/pstack (/devflow-help doctor) และตารางนำทางคำสั่งเดิม (Legacy /devflow)',
    pills: ['Command', 'DevFlowHelp', 'Status', 'Doctor', 'PromptBuilder', 'HealthCheck', 'Router', 'Read-Only'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>รันคำสั่ง <code>/devflow-help</code> (รองรับ alias เดิม <code>/devflow</code>) เพื่อเปิด Interactive Guide &amp; Prompt Builder, ดูภาพรวมสถานะปัจจุบัน, สรุปผู้บริหาร (<code>--exec</code>) หรือตรวจสุขภาพระบบ (<code>doctor</code>):</p>
          <pre><code># รายงานสถานะปัจจุบัน, Interactive Guide & Prompt Builder
/devflow-help

# รายงานสรุปผู้บริหารแบบไม่เปิดเผย path โค้ด
/devflow-help --exec

# ตรวจสุขภาพ Adapters, Config, Execution Engine (pstack), Verify Driver และ Overview 20KB Guard
/devflow-help doctor</code></pre>
        `
      },
      {
        id: 'what-it-inspects',
        title: 'สิ่งที่ระบบรายงานและตรวจสุขภาพ (Status & Diagnostics)',
        contentHtml: `
          <ul>
            <li><strong>Interactive Guide &amp; Prompt Builder</strong>: อ่านสถานะปัจจุบันจาก <code>devflow/</code> แล้วสร้างคำสั่งและ prompt พร้อมส่งสำหรับขั้นตอนถัดไป</li>
            <li><strong>Build Plan &amp; Active Context</strong>: ความคืบหน้า Build Plan, Spec/Findings/Review Gate ใน <code>devflow/context/</code>, และ Exact Next Action</li>
            <li><strong>Adapters, Verify &amp; Engine Health (Doctor Mode)</strong>: ตรวจสอบ <code>.agents/skills/</code>, <code>.claude/skills/</code>, Schema ของ <code>devflow/config.json</code>, <code>execution_engine_pstack</code>, <code>verification_driver_skill</code>, และขนาด <code>project-overview.md</code> (&lt; 20KB)</li>
            <li><strong>Legacy Command Routing</strong>: แปลคำสั่งเดิม (เช่น <code>/autopilot</code>, <code>/devflow</code>, <code>/adopt</code>, <code>/brief</code>, <code>/continuous</code>, <code>/try</code>, <code>/grill</code>) ไปยัง 15 Core Skills</li>
          </ul>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>ทำตามคำสั่งถัดไปที่ระบบแนะนำ เช่น <code>/overview</code>, <code>/implement</code>, <code>/check</code> หรือ <code>/complete</code></p>
        `
      }
    ]
  },

  // 12. Debug
  {
    slug: 'commands/debug',
    category: 'COMMANDS',
    title: 'Debug (/debug - 2-Track Protocol)',
    lead: 'วินิจฉัยแบบ 2-Track (Track A สืบเร็วจาก deterministic stacktrace และ Track B 6-phase scientific isolation) โดยไม่แก้โค้ดล่วงหน้า',
    pills: ['Command', 'Debug', '2-Track', 'RootCause', 'Hypothesis', 'ZeroTouch'],
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
          <p>เมื่อตั้งค่า <code>qualityGates.regular.independentReview</code> เป็น <code>when-sensitive</code> หรือสั่ง <code>/audit independent</code> AI จะโหลดขั้นตอน Phase A/B แบบ On-Demand จาก <code>audit/reference/independent-review.md</code> เพื่อส่งต่อให้ AI Reviewer อิสระ (Fresh Session หรือ Isolated Subagent) ตรวจทานโค้ดและออกใบรับรอง <strong>Review Receipt</strong> ใน <code>review.md</code> อย่างเป็นกลางและเข้มงวด</p>
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

  // 16. Setup Tests (Opt-in Extension)
  {
    slug: 'commands/tests',
    category: 'COMMANDS',
    title: 'Setup Tests (/setup-tests - Opt-in Extension)',
    lead: 'ส่วนเสริม Opt-in สำหรับติดตั้งและกำหนดค่า Test Runner (Unit/Integration และ Playwright Browser Testing) เข้าสู่โปรเจกต์',
    pills: ['Command', 'SetupTests', 'OptIn', 'Playwright', 'Testing'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ติดตั้งส่วนเสริม <code>setup-tests</code> ด้วย CLI จากนั้นเรียกใช้งานเมื่อต้องการวางโครงสร้าง Test Harness หรือ Playwright Browser Tests:</p>
          <pre><code># 1. ติดตั้งส่วนเสริมเข้าโปรเจกต์
npx nexus-devflow skill add setup-tests

# 2. ตั้งค่า Unit/Integration Test Runner หรือ Browser Testing
/setup-tests
/setup-tests browser</code></pre>
        `
      },
      {
        id: 'browser-tests-integration',
        title: 'การตั้งค่า Playwright &amp; Browser Verification',
        contentHtml: `
          <p>โหมด <code>/setup-tests browser</code> จะช่วยติดตั้ง Playwright Test Harness และสคริปต์ <code>npm run test:browser</code> เพื่อให้ <code>/check</code> สามารถตรวจรับ UI ผ่านเบราว์เซอร์จริงและ Active Browser MCP ได้</p>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>รวมชุดคำสั่ง Verify เข้าสู่ CI ด้วยส่วนเสริม <code>npx nexus-devflow skill add ci</code></p>
        `
      }
    ]
  },

  // 17. CI
  {
    slug: 'commands/ci',
    category: 'COMMANDS',
    title: 'CI (/ci - Opt-in Extension)',
    lead: 'ส่วนเสริม Opt-in สำหรับรวมศูนย์คำสั่ง Verify กลางของโปรเจกต์ ตั้งค่า GitHub Actions Workflows และติดตั้ง Local Pre-push Hook',
    pills: ['Command', 'CI', 'GitHubActions', 'VerifyCommand', 'PrePushHook', 'Automation'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ติดตั้งส่วนเสริม Opt-in แล้วใช้คำสั่ง <code>/ci</code> เพื่อตั้งค่าระบบ Continuous Integration ที่ตรงตามมาตรฐานของโปรเจกต์:</p>
          <pre><code>npx nexus-devflow skill add ci
/ci</code></pre>
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

  // 19. DevFlow Mode (Coordinator + Playbooks + Autonomous Queue)
  {
    slug: 'commands/devflow-mode',
    category: 'COMMANDS',
    title: 'DevFlow Mode (/devflow-mode, /devflow-mode --all)',
    lead: 'Lead-Coordinator และ Playbook Router (feature, bug-fix, refactor, discovery, autonomous-queue) พร้อม Isolated Worktree Subagents, pstack integration และ Option A Evidence Packet (แทน /autopilot)',
    pills: ['Command', 'DevFlowMode', 'Coordinator', 'Playbooks', 'Subagents', 'pstack', 'Autonomous'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ใช้คำสั่ง <code>/devflow-mode</code> (รองรับ alias เดิม <code>/autopilot</code>) สำหรับรันงานแบบ Lead-Coordinator + Isolated Worktree Subagents หรือเพิ่ม <code>--all</code> / <code>--max &lt;N&gt;</code> เพื่อรันทั้งคิวใน Build Plan:</p>
          <pre><code># รันฟีเจอร์ถัดไปด้วย Coordinator + Worktree Subagents
/devflow-mode 1

# รันทั้งคิวใน build-plan.md ต่อเนื่องบน feature/rework branch
/devflow-mode --all
/devflow-mode --max 3 --merge</code></pre>
        `
      },
      {
        id: 'autopilot-pipeline',
        title: 'กระบวนการทำงานอัตโนมัติ (Coordinator Execution Pipeline)',
        contentHtml: `
          <ol>
            <li><strong>Coordinator Planning</strong>: จัดทำ Living Spec ใน <code>devflow/context/{xxx-slug}/spec.md</code> (เดินหน้าอัตโนมัติบน branch เมื่อ <code>execution.autoApproveSpec: true</code>)</li>
            <li><strong>Isolated TDD Subagents</strong>: ให้ worker subagents พัฒนาและทดสอบแบบ TDD บน isolated worktree/branch</li>
            <li><strong>3-Layer Evidence Verification</strong>: รัน <code>verify-layers</code>, project <code>verify</code> driver, และ <code>pstack:interrogate</code> / <code>audit</code> แบบ Prove-by-Run บันทึกหลักฐานลง <code>devflow/reports/{run-id}/</code></li>
            <li><strong>Bounded Auto-Repair</strong>: แก้ไข Confirmed P0/P1 findings ที่รันซ้ำได้จริงและตรวจซ้ำอัตโนมัติ</li>
            <li><strong>Option A Final Human Gate</strong>: หยุดบนสาขา feature พร้อม <strong>Evidence Packet</strong> ให้มนุษย์ตัดสินใจ Merge / PR / Push เสมอ</li>
          </ol>
        `
      },
      {
        id: 'next-steps',
        title: 'ขั้นตอนถัดไป (Next steps)',
        contentHtml: `
          <p>ตรวจเช็กสถานะด้วย <code>/devflow-help</code> หรือดูประวัติการส่งมอบใน <code>devflow/history/HISTORY.md</code></p>
        `
      }
    ]
  },

  // 21. Release (Opt-in Extension)
  {
    slug: 'commands/release',
    category: 'COMMANDS',
    title: 'Release (/release - Opt-in Extension)',
    lead: 'ส่วนเสริม Opt-in สำหรับตรวจสอบความพร้อมก่อนส่งมอบสู่ Production (Render, Vercel, Docker) ตรวจสอบ Secrets, Health Check Probes และ Database Migrations',
    pills: ['Command', 'Release', 'ProductionReadiness', 'Vercel', 'Render', 'Docker', 'SecretAudit'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ติดตั้งส่วนเสริม Opt-in แล้วใช้คำสั่ง <code>/release</code> ก่อนนำแอปพลิเคชันขึ้นเซิร์ฟเวอร์ Production จริง:</p>
          <pre><code>npx nexus-devflow skill add release
/release</code></pre>
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
    title: 'Rollback (/rollback - Opt-in Extension)',
    lead: 'ส่วนเสริม Opt-in สำหรับวางแผนย้อนกลับฟีเจอร์ที่ส่งมอบไปแล้วอย่างปลอดภัยโดยยังคงรักษาประวัติ Git และประเมินความเสี่ยงต่อฟีเจอร์อื่น (Forward Dependency Risk)',
    pills: ['Command', 'Rollback', 'ReversalSpec', 'SafeUndo', 'ForwardDependency', 'HistoryPreserving'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ติดตั้งส่วนเสริม Opt-in แล้วใช้คำสั่ง <code>/rollback</code> เมื่อต้องการยกเลิกฟีเจอร์ที่เคยส่งมอบและรวมเข้า main ไปแล้วอย่างปลอดภัย:</p>
          <pre><code>npx nexus-devflow skill add rollback
/rollback 3
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
    title: 'Convert Any to MD (/convert-any-to-md - Opt-in Extension)',
    lead: 'ส่วนเสริม Opt-in สำหรับแปลงเอกสารทุกรูปแบบ (.pdf, .docx, .xlsx, .csv, .json, .yaml, รูปภาพ) ให้กลายเป็น Clean Markdown ภายใต้ devflow/reference/',
    pills: ['Command', 'Converter', 'Markdown', 'PDF', 'Word', 'Excel', 'DataExtraction'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ติดตั้งส่วนเสริม Opt-in แล้วใช้คำสั่ง <code>/convert-any-to-md</code> เมื่อคุณมีเอกสารความต้องการจากลูกค้าหรือสเปกจากฝ่ายธุรกิจที่ต้องการแปลงเป็น Markdown เพื่อให้ AI อ่านเข้าใจง่ายและนำไปใช้วิเคราะห์:</p>
          <pre><code>npx nexus-devflow skill add convert-any-to-md
/convert-any-to-md C:\\Users\\...\\Downloads\\requirements.pdf
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
    title: 'Vendor (/vendor - Opt-in Extension)',
    lead: 'ส่วนเสริม Opt-in สำหรับดึง External Git Repositories เข้าสู่ devflow/.vendor/ และสร้าง Custom Wrapper Skill อัตโนมัติพร้อมการป้องกัน Update Immunity',
    pills: ['Command', 'Vendor', 'Equip', 'GitSubtree', 'CustomSkill', 'UpdateImmunity'],
    sections: [
      {
        id: 'when-to-use-it',
        title: 'เมื่อไหร่ที่ควรใช้ (When to use it)',
        contentHtml: `
          <p>ติดตั้งส่วนเสริม Opt-in แล้วใช้คำสั่ง <code>/vendor</code> (หรือ <code>/equip</code>, <code>/skill-add</code>) เมื่อต้องการนำไลบรารีหรือ Repositories ภายนอกมาเป็นทักษะเสริมในโปรเจกต์:</p>
          <pre><code>npx nexus-devflow skill add vendor
/vendor https://github.com/example/special-toolkit.git</code></pre>
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

  // 30. BrowserOS neo
  {
    slug: 'commands/browseros-neo',
    category: 'COMMANDS',
    title: 'BrowserOS neo (/browseros-neo - Opt-in Extension)',
    lead: 'ส่วนเสริม Opt-in ของทีม (ต่อยอดจาก browserclaw) สำหรับทดสอบและแก้ปัญหา E2E ผ่าน BrowserOS neo MCP พร้อม Test Plan, Evidence รายเคส และการผูก Session ย้อนดูวิดีโอตาม DevFlow ID',
    pills: ['Command', 'OptIn', 'BrowserOS', 'MCP', 'E2E', 'Testing', 'Debugging', 'Evidence'],
    sections: [
      {
        id: 'install-and-modes',
        title: 'การติดตั้งและ 2 โหมดการทำงาน E2E',
        contentHtml: `
          <p>ติดตั้งส่วนเสริม Opt-in เข้าโปรเจกต์ด้วย CLI จากนั้นเรียกใช้งานผ่าน AI IDE ที่เชื่อมต่อ <strong>BrowserOS neo MCP</strong> ไว้แล้ว:</p>
          <pre><code># ติดตั้งสกิลลง .agents/skills/browseros-neo/ และ .claude/skills/browseros-neo/
npx nexus-devflow skill add browseros-neo

# Mode A: วางแผนทดสอบและรันยืนยัน E2E (ใช้เดี่ยวๆ หรือคู่กับ /check)
/browseros-neo --verify --id 126

# Mode B: เข้าไป reproduce และแก้ปัญหา E2E บน session ที่ล็อกอินค้างไว้
/browseros-neo --debug "Checkout submit returns 500"</code></pre>
          <ul>
            <li><strong>Mode A (E2E Test &amp; Verify)</strong>: แปลง <code>AC-N</code> / <code>Done When</code> ใน <code>spec.md</code> (หรือเป้าหมายที่ระบุ) เป็นเคสทดสอบ, รันผ่าน MCP (<code>run</code>, <code>snapshot</code>, <code>act</code>, <code>screenshot</code>, <code>pdf</code>, <code>read</code>, <code>grep</code>) และตรวจ console errors / network failures (<code>4xx</code>/<code>5xx</code>)</li>
            <li><strong>Mode B (E2E Debug &amp; Fix Verification)</strong>: reproduce ปัญหาบน browser session จริงที่มี cookie/login เดิม, เก็บหลักฐาน DOM/console/network/screenshot เพื่อหาต้นตอ และรันยืนยันซ้ำหลังแก้โค้ด</li>
          </ul>
        `
      },
      {
        id: 'test-plan-and-evidence',
        title: 'แผนการทดสอบ, หลักฐาน และ Traceability ตาม DevFlow ID',
        contentHtml: `
          <p>เพื่อแก้ปัญหาการรันทดสอบแล้วไม่มีบันทึกสม่ำเสมอ สกิลนี้บังคับผูกทุกอย่างด้วย <code>{run-id}</code> (จาก <code>--id</code>, active <code>devflow/context/{xxx-slug}/</code>, หรือ <code>adhoc-YYYYMMDD-HHMMSS</code>):</p>
          <table>
            <thead><tr><th>สิ่งที่ระบบบันทึก / ผูก</th><th>ตำแหน่ง / กลไก</th><th>นโยบาย Git &amp; การย้อนดู</th></tr></thead>
            <tbody>
              <tr><td><code>browser-test-plan.md</code></td><td><code>devflow/reports/{run-id}/browser-test-plan.md</code></td><td>สร้างก่อนเริ่มรัน browser ทุกครั้ง (gitignored ภายใต้ <code>devflow/reports/*</code>)</td></tr>
              <tr><td><code>evidence.md</code> + <code>screenshots/</code></td><td><code>devflow/reports/{run-id}/evidence.md</code></td><td>บันทึก/ต่อท้ายผลรายเคส (<code>[pass]</code>/<code>[fail]</code>/<code>[blocked]</code>), console/network และภาพหน้าจอ</td></tr>
              <tr><td>Video / Session Replay</td><td><code>name_session</code> ขึ้นต้นด้วย <code>{run-id}</code></td><td>เก็บและเปิดดูวิดีโอบน BrowserOS neo cockpit โดยตรง (ไม่เก็บไฟล์วิดีโอใน <code>devflow/</code>)</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'failure-guard',
        title: 'ข้อกำหนด MCP และ Failure Guard',
        contentHtml: `
          <p>ตัวไฟล์สกิลเป็นคู่มือปฏิบัติการของ Agent และไม่รวมตัว MCP Server หากยังไม่ได้เชื่อมต่อ BrowserOS neo MCP หรือได้รับ <code>browser session not connected</code> สกิลจะหยุดแจ้งให้เปิด/เชื่อม BrowserOS neo cockpit โดย<strong>ไม่ silently fallback</strong> ไปยัง browser tool อื่น</p>
        `
      }
    ]
  },

  // 32. Code Modernization
  {
    slug: 'commands/code-modernization',
    category: 'COMMANDS',
    title: 'Code Modernization (/code-modernization, /modernize)',
    lead: 'ปรับปรุง Legacy Codebase ขนานใหญ่ด้วยขุมพลัง Anthropic Code Modernization Plugin พร้อมระบบ Master Orchestrator นำทาง State Machine อัตโนมัติและเอกสารภาษาไทย (Thai First)',
    pills: ['Command', 'Modernize', 'Legacy', 'Uplift', 'Transform', 'Reimagine', 'ThaiFirst', 'EquivalenceProof'],
    sections: [
      {
        id: 'overview',
        title: 'ภาพรวมของ Code Modernization',
        contentHtml: `
          <p>Nexus-DevFlow ผสานพลังของ Official Code Modernization Plugin จาก Anthropic เข้าสู่ระบบ ทำให้ทีมพัฒนาสามารถชุบชีวิตระบบเก่า (Legacy Codebase) ได้โดยไม่ต้องจดจำ 13 คำสั่งย่อยด้วยตนเอง สกิลนี้ทำหน้าที่เป็น Front-Door Orchestrator ที่คอยตรวจจับสถานะของระบบ นำทางขั้นตอน และสอบถามการตัดสินใจผ่าน 6 Human Decision Gates</p>
          <pre><code># ติดตั้งสกิลเข้าสู่โปรเจกต์
npx nexus-devflow skill add code-modernization

# เรียกใช้งาน Master Orchestrator ใน AI IDE
/code-modernization
# หรือใช้ชื่อย่อ
/modernize</code></pre>
        `
      },
      {
        id: 'thai-first-artifacts',
        title: 'มาตรฐานเอกสารภาษาไทย (Thai First Artifacts)',
        contentHtml: `
          <p>เอกสารผลลัพธ์ (Artifacts) ทั้งหมดที่ถูกสร้างขึ้นใน <code>analysis/&lt;system&gt;/</code> จะถูกสร้างเป็น<strong>ภาษาไทย</strong>โดยค่าเริ่มต้น เพื่อให้ทีมงานและผู้บริหารอ่านเข้าใจได้ทันที:</p>
          <ul>
            <li><code>INTENT.md</code>: เป้าหมายหลัก, ขอบเขต และข้อจำกัดทางธุรกิจ</li>
            <li><code>PREFLIGHT.md</code>: ผลการตรวจสภาพแวดล้อมก่อนเริ่ม และสรุป 5 คำถามมนุษย์</li>
            <li><code>ASSESSMENT.md</code>: การประเมินโค้ดเบสเดิม, หนี้ทางเทคนิค (Technical Debt) และความซับซ้อน</li>
            <li><code>MAP.md</code>: แผนผังสถาปัตยกรรมและกระแสข้อมูล (Dataflows)</li>
            <li><code>RULES.md</code>: กฎทางธุรกิจพร้อมเงื่อนไข <code>Given / When / Then</code> และคำอธิบายภาษาไทย</li>
            <li><code>BRIEF.md</code>: แผนงาน Modernization แบบแบ่งระยะ (Phased Milestone Plan)</li>
            <li><code>PROOF.md</code>: ผลการพิสูจน์ความถูกต้องและความเทียบเคียงแบบ Byte-for-byte</li>
            <li><code>DELTA_CATALOG.md</code>: แคตตาล็อกความแตกต่างพฤติกรรมเดิม vs ใหม่</li>
            <li><code>SECURITY_FINDINGS.md</code>: รายการข้อตรวจพบความปลอดภัยและคำแนะนำแก้ไข</li>
            <li><code>REPORT.html</code>: แดชบอร์ดสรุปผลภาพรวมแบบ Interactive สวยงามในไฟล์เดียว</li>
          </ul>
          <p><em>หมายเหตุ: หากตรวจพบว่ามีไฟล์เดิมที่เป็นภาษาอังกฤษอยู่แล้ว เมื่อสั่ง <code>/modernize</code> ระบบจะเสนอแปลและแปลงโครงสร้างให้เป็นภาษาไทยให้อัตโนมัติ พร้อมรัน <code>build_report.py</code> ซ้ำเพื่ออัปเดตหน้า HTML ให้เป็นภาษาไทย</em></p>
        `
      },
      {
        id: 'devflow-lifecycle-integration',
        title: 'การควบคุมขั้นตอนการแก้ไขโค้ดด้วย DevFlow (Build Governance)',
        contentHtml: `
          <p>ขั้นตอนการปรับปรุงแบ่งออกเป็น 2 ท่อนชัดเจนเพื่อความปลอดภัยสูงสุดของโค้ดในองค์กร:</p>
          <ol>
            <li><strong>ท่อนที่ 1: การสำรวจและสกัดกฎธุรกิจ (Phase 0–5)</strong>: ใช้ความสามารถของ <code>code-modernization</code> ในการทำ Reverse-Engineering ขุดคุ้ยโค้ดเก่า สกัดกฎทางธุรกิจ และเขียนแผนงาน <code>BRIEF.md</code></li>
            <li><strong>ท่อนที่ 2: การลงมือแก้ไขโค้ดจริง (Phase 6–8)</strong>: เมื่อแผนงานผ่านการอนุมัติ แผนงานจะถูกย่อยเข้า <code>devflow/build-plan.md</code> และส่งให้ <strong>DevFlow Core Lifecycle</strong> เข้าควบคุมการแก้โค้ดทีละโมดูลด้วย <code>/feature</code> &rarr; <code>/implement</code> (TDD Red-Green-Refactor บน Git Branch แยก) &rarr; <code>/check</code> (รัน Unit Tests ร่วมกับ <code>proof_pack.py</code>) &rarr; <code>/complete</code> ทำให้ระบบเดิมไม่มีวันพังและมีความปลอดภัยสูงสุด</li>
          </ol>
        `
      },
      {
        id: 'python-automation-engine',
        title: 'ชุดคำสั่ง Python Verification Engine',
        contentHtml: `
          <p>สกิลนี้เชื่อมโยงกับ Python 3 Standard Library Scripts เพื่อยืนยันความถูกต้องทางวิศวกรรมแบบ Empirical Proof:</p>
          <pre><code># สร้าง Single-page Interactive Report (REPORT.html)
python devflow/.vendor/code-modernization/scripts/build_report.py analysis/&lt;system&gt;

# เปรียบเทียบความแตกต่างระดับไบต์ระหว่างระบบเดิมและระบบใหม่
python devflow/.vendor/code-modernization/scripts/compare.py --old &lt;legacy_out&gt; --new &lt;modern_out&gt;

# คำนวณผลการพิสูจน์ความถูกต้อง (PROVEN / PARTLY PROVEN / NOT PROVEN)
python devflow/.vendor/code-modernization/scripts/proof_pack.py --analysis analysis/&lt;system&gt;

# เรนเดอร์การ์ดกฎธุรกิจ (Business Rules Cards)
python devflow/.vendor/code-modernization/scripts/render_rules.py analysis/&lt;system&gt;/RULES.md</code></pre>
        `
      }
    ]
  }
];

