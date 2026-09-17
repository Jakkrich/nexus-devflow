import type { DocPage } from '../build-docs-site.js';

export const QUALITY_PAGES: DocPage[] = [
  // 1. Testing and CI
  {
    slug: 'testing',
    category: 'QUALITY',
    title: 'Testing and CI (การทดสอบและการรวมศูนย์ CI)',
    lead: 'เพิ่มการทดสอบอย่างมีจุดประสงค์ตาม 5-Tier File Classification, ตรวจสอบความสอดคล้องด้วย AC Traceability Matrix และรันคำสั่ง Verify หนึ่งเดียวร่วมกันทั้งในเครื่องและบน CI',
    pills: ['Quality', 'Guide', 'Testing', 'UnitTests', '5Tier', 'ACTraceability', 'BrowserTests', 'CI', 'Verify'],
    sections: [
      {
        id: 'five-tier-classification',
        title: '5-Tier Test File Classification Standard (มาตรฐานการทดสอบตามประเภทไฟล์)',
        contentHtml: `
          <p>เพื่อป้องกันการเขียน Unit Tests ที่รกและไม่เกิดประโยชน์ (Artificial Tests) Nexus-DevFlow กำหนดมาตรฐานการทดสอบตามประเภทไฟล์ออกเป็น 5 ระดับ (Tiers):</p>
          <table>
            <thead><tr><th>ระดับ (Tier)</th><th>สัญลักษณ์</th><th>ประเภทไฟล์ (File Scope)</th><th>กลยุทธ์และระดับการทดสอบที่จำเป็น (Testing Strategy)</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Tier 1: Pure Logic & Algorithms</strong></td>
                <td>🧠</td>
                <td>Core business logic, Parsers, Tokenizers, State machines, Calculators, Pure utility functions</td>
                <td><strong>Unit Tests 100%</strong> พร้อมครอบคลุม Happy path, Boundary, และ Error edge cases อย่างละเอียด</td>
              </tr>
              <tr>
                <td><strong>Tier 2: UI & Visual Components</strong></td>
                <td>🎨</td>
                <td>Components, Layouts, CSS styles, Screen templates, Design tokens</td>
                <td><strong>Visual & Interaction QA</strong>: Component rendering, User flow interaction, และ Browser screenshot proof (ผ่าน Playwright / BrowserOS Neo)</td>
              </tr>
              <tr>
                <td><strong>Tier 3: API & Data Integration</strong></td>
                <td>🔌</td>
                <td>API routes, Database queries, Server actions, External SDK clients</td>
                <td><strong>Contract & Integration Tests</strong>: HTTP status codes, Schema validation (Zod), Payload responses, Error handling</td>
              </tr>
              <tr>
                <td><strong>Tier 4: Configuration & Tooling</strong></td>
                <td>⚙️</td>
                <td>Build scripts, Package configs, Bundlers, Environment configs</td>
                <td><strong>Static Contract & Smoke Tests</strong>: Contract verification, Typecheck, CLI smoke tests</td>
              </tr>
              <tr>
                <td><strong>Tier 5: Documentation & Prose</strong></td>
                <td>📝</td>
                <td>Markdown documentation, Prompts, Specification templates</td>
                <td><strong>Lint & Integrity Scans</strong>: Markdown metadata validation, Link integrity, YAML frontmatter syntax check</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'ac-traceability-matrix',
        title: 'Acceptance Criteria Traceability Matrix Protocol (การสืบย้อนผลการทดสอบ)',
        contentHtml: `
          <p>ทุก Acceptance Criteria (<code>AC-1</code>, <code>AC-2</code>, ...) ที่กำหนดไว้ใน Living Spec (<code>spec.md</code>) จะต้องถูกเชื่อมโยง (Traceable) เข้ากับชื่อของ Automated Test Cases อย่างเป็นรูปธรรม:</p>
          <pre><code>describe('Session Token Analytics Engine', () => {
  it('AC-1: calculates token breakdown and costs accurately', () => {
    // Assert AC-1 requirement
  });

  it('AC-2: formats table and json outputs according to contract', () => {
    // Assert AC-2 requirement
  });
});</code></pre>
          <p>ในขั้นตอน <code>/check</code> และ <code>/complete</code> ระบบจะประเมินผลผ่านตาราง <strong>AC-to-Test Traceability Matrix</strong> เพื่อยืนยันว่าไม่มีข้อกำหนดใดตกหล่นก่อนส่งมอบงานจริง</p>
        `
      },
      {
        id: 'five-separate-layers',
        title: 'ห้าเลเยอร์ที่แยกจากกันอย่างชัดเจน (Five separate layers)',
        contentHtml: `
          <p>Nexus-DevFlow กำหนดให้การทดสอบและการตรวจสอบอัตโนมัติมีความชัดเจนและโปร่งใส โดยแบ่งแยกหน้าที่ออกเป็น 5 เลเยอร์หลัก:</p>
          <table>
            <thead><tr><th>เลเยอร์ (Layer)</th><th>หน้าที่และจุดประสงค์ (Purpose)</th></tr></thead>
            <tbody>
              <tr><td><strong>Unit test command</strong></td><td>ทดสอบ Business Logic และ Pure Functions ของโปรเจกต์ด้วย Test Runner ประจำภาษา/สแตก</td></tr>
              <tr><td><strong>Browser test command</strong></td><td>ทดสอบพฤติกรรม UI และ User Flow ซ้ำๆ บน Browser แบบอัตโนมัติ (เช่น ผ่าน Playwright)</td></tr>
              <tr><td><strong>Verify command</strong></td><td>รันสูตรผสมคำสั่ง Typecheck, Tests, และ Production Build ในเครื่อง Local เป็นขั้นตอนเดียว</td></tr>
              <tr><td><strong>GitHub Actions workflow</strong></td><td>รันสูตร Verify เดียวกันเป๊ะบนคลาวด์สำหรับ Pull Request และ Push ไปยัง Default Branch</td></tr>
              <tr><td><strong>GitHub ruleset</strong></td><td>(ตัวเลือกเสริมบน GitHub) ป้องกันการ Merge โค้ดจนกว่าผลการตรวจสอบบน GitHub Actions จะผ่านเขียว</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'one-shared-verify-recipe',
        title: 'สูตรการ Verify หนึ่งเดียวที่ใช้ร่วมกันทุกที่ (One shared Verify recipe)',
        contentHtml: `
          <p>รันคำสั่ง <strong><code>$ci</code></strong> หรือ <strong><code>/ci</code></strong> ภายหลังขั้นตอน Onboard หรือ Adopt เมื่อต้องการเปิดใช้งาน GitHub Actions Checks อัตโนมัติ</p>
          <pre><code># ตรวจจับโปรเจกต์และสร้างสูตร Verify + GitHub Actions
/ci</code></pre>
          <p>สกิล <code>/ci</code> จะตรวจจับโครงสร้างโปรเจกต์และรวมคำสั่งตรวจสอบที่มีอยู่จริงเข้าด้วยกันตามลำดับ:</p>
          <ol>
            <li><strong>Typecheck</strong></li>
            <li><strong>Tests</strong> (เมื่อมีการตั้งค่า Runner และคำสั่งที่ใช้งานได้จริง)</li>
            <li><strong>Build</strong></li>
          </ol>
        `
      },
      {
        id: 'browser-evidence',
        title: 'หลักฐานการทำงานบน Browser (Browser evidence)',
        contentHtml: `
          <p>การตรวจสอบ UI และ User Flow ต้องมีหลักฐานจาก Browser โดยตรง เมื่อ <code>AGENTS.md</code> มีการระบุคำสั่ง <code>Browser tests</code> สกิล <code>/check</code> จะรันคำสั่งดังกล่าวและตรวจสอบผลลัพธ์</p>
          <p>นอกจากนี้ยังรองรับสถาปัตยกรรม Hybrid ร่วมกับ <strong>MCP browseros-neo</strong> (<code>http://127.0.0.1:9010/mcp</code>) เพื่อให้ AI Agent สามารถตรวจสอบ Live DOM, Visual QA และบันทึกภาพหน้าจอจริงได้ในแบบ Interactive</p>
        `
      }
    ]
  },

  // 2. Manual Review With Try
  {
    slug: 'manual-review',
    category: 'QUALITY',
    title: 'Manual Review & Quality Gates (การตรวจทานและ 4 Human Review Gates)',
    lead: 'ทำความเข้าใจประตูด่านตรวจทั้ง 4 ระดับ (Human Review Gates) ที่โปร่งใส และการสร้างคู่มือตรวจรับระบบด้วยตนเอง (Try Guide)',
    pills: ['Quality', 'Guide', 'Try', 'ManualReview', 'HumanGates', 'QA', 'UAT', 'Walkthrough'],
    sections: [
      {
        id: 'four-human-review-gates',
        title: 'The 4 Essential Human Review Gates (ด่านตรวจคุณภาพโดยมนุษย์ 4 ระดับ)',
        contentHtml: `
          <p>ในสถาปัตยกรรม Living Spec ของ Nexus-DevFlow การควบคุมคุณภาพไม่ใช่เรื่องของการปล่อยให้ AI เขียนโค้ดไปเรื่อยๆ แต่มีประตูด่านตรวจของมนุษย์ (Non-bypassable Gates) กำกับไว้ 4 จุดสำคัญ:</p>
          <pre><code>/feature (or /fix) ──▶ [🚪 Gate 1: Spec Gate] ──▶ /implement ──▶ [🚪 Gate 2: TDD Checkpoint] 
                    ──▶ /check ──▶ [🚪 Gate 3: Senior QA Gate] ──▶ /complete ──▶ [🚪 Gate 4: Delivery Gate]</code></pre>
          <table>
            <thead><tr><th>ประตูด่านตรวจ</th><th>จุดที่ทริกเกอร์</th><th>เกณฑ์การตรวจสอบของมนุษย์ (Verification Checklist)</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>🚪 Gate 1: The Spec Review Gate</strong></td>
                <td>หลังรัน <code>/feature</code> หรือ <code>/fix</code> ทันที</td>
                <td>• ขอบเขตชัดเจน ไม่เกินตัว (Scope Boundaries)<br>• ระบุสิ่งที่ห้ามพัง (Invariants Protected)<br>• ผ่าน Mechanical Input Coverage Test (มี Data Source ทุกค่า)</td>
              </tr>
              <tr>
                <td><strong>🚪 Gate 2: TDD Implementation Checkpoint</strong></td>
                <td>ระหว่างรัน <code>/implement</code> ในแต่ละ Task</td>
                <td>• มี failing test ก่อนเขียน logic (Red-Green-Refactor)<br>• โค้ดส่วนต่าง (Diff) กระชับ ตรงตาม coding-standards.md</td>
              </tr>
              <tr>
                <td><strong>🚪 Gate 3: Senior QA Verification Gate</strong></td>
                <td>เมื่อรัน <code>/check</code> จบทุก Task</td>
                <td>• ผลการทดสอบทุก Lane ใน Verification Matrix เป็น PASS<br>• มีหลักฐานพฤติกรรมจริง (Behavioral proof) จาก Browser/Terminal</td>
              </tr>
              <tr>
                <td><strong>🚪 Gate 4: Findings & Git Delivery Gate</strong></td>
                <td>ก่อนการรัน <code>/complete</code> ปิดงาน</td>
                <td>• ข้อค้นพบระดับ P0/P1 ใน <code>findings.md</code> ได้รับการแก้ไข (closed) หรือยอมรับเหตุผล (accepted)<br>• ยืนยันการ Squash-Merge เข้าสู่ <code>main</code></td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'generate-the-path',
        title: 'การสร้างคู่มือตรวจรับด้วยตนเอง (Generate Try Guide)',
        contentHtml: `
          <p>รันคำสั่ง <strong><code>/try</code></strong> (หรือ <code>/check guide</code>) เพื่อให้ AI สร้างคู่มือคลิกทดสอบหน้าจอทีละขั้นตอน:</p>
          <pre><code># สร้างคู่มือสำหรับงานปัจจุบัน
/try

# หรือสร้างสำหรับฟีเจอร์ที่ระบุ
/try 1</code></pre>
          <p>คู่มือจะสรุป 5 ขั้นตอนหลัก: <strong>1. Start (คำสั่งรัน)</strong> ➔ <strong>2. Open (หน้าจอ/URL)</strong> ➔ <strong>3. Do (ลำดับการคลิก/กรอก)</strong> ➔ <strong>4. Expect (ผลลัพธ์ที่ต้องเห็น)</strong> ➔ <strong>5. Watch For (จุดที่ต้องระวังบั๊ก)</strong></p>
        `
      }
    ]
  },

  // 3. Code Quality With Audit
  {
    slug: 'code-quality',
    category: 'QUALITY',
    title: 'Code Quality With Audit (การควบคุมคุณภาพโค้ดและ Token Budgets)',
    lead: 'ใช้การตรวจสอบแบบ Read-Only, การกำกับขนาด Token Budgets ของ Skill และระบบ Independent Review เพื่อรักษาคุณภาพสถาปัตยกรรมอย่างยั่งยืน',
    pills: ['Quality', 'Guide', 'Audit', 'Maintainability', 'Security', 'TokenBudgets', 'IndependentReview'],
    sections: [
      {
        id: 'skill-token-budgets',
        title: 'Skill Token-Budget Guard Linter (การควบคุมขนาด Skill ในคลัง - Feature 104)',
        contentHtml: `
          <p>เพื่อป้องกันไม่ให้ Prompt และไฟล์คำแนะนำในคลังทักษะบวมจนเปลือง Token และทำให้บริบทเต็มเร็ว DevFlow มีระบบตรวจสอบ Byte Budget อัตโนมัติ:</p>
          <pre><code># ตรวจสอบขนาดของ Skill ทุกตัวในคลัง
npm run check:budgets</code></pre>
          <table>
            <thead><tr><th>ชนิดของไฟล์</th><th>เพดานขนาดสูงสุด (Byte Ceiling)</th><th>เกณฑ์การแจ้งเตือน (Warning Threshold)</th></tr></thead>
            <tbody>
              <tr><td><strong><code>SKILL.md</code> ทุกไฟล์</strong></td><td>32 KB (32,768 Bytes)</td><td>เตือนเมื่อแตะ 90% (28.8 KB)</td></tr>
              <tr><td><strong>ไฟล์ Support/Reference Markdown</strong></td><td>24 KB (24,576 Bytes)</td><td>เตือนเมื่อแตะ 90% (21.6 KB)</td></tr>
              <tr><td><strong>Frontmatter <code>description</code></strong></td><td>400 ตัวอักษร (Characters)</td><td>แจ้ง Error ทันทีหากเกิน เพื่อประหยัด Token ใน Discovery</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'what-to-look-for',
        title: 'สิ่งที่ต้องมองหาในการตรวจสอบโค้ด (What to look for)',
        contentHtml: `
          <p>สกิล <code>/audit</code> (หรือ <code>$audit</code>) ทำหน้าที่สแกนฐานโค้ดเพื่อตรวจจับความเบี่ยงเบนด้านความสามารถในการบำรุงรักษา (Maintainability Drift), ช่องโหว่ความปลอดภัย, และปัญหาด้านประสิทธิภาพในโหมด <strong>Read-Only</strong> โดยไม่มีการแก้ไขโค้ดจริง</p>
          <pre><code>/audit current         # ตรวจสอบการเปลี่ยนแปลงของ Branch ปัจจุบัน
/audit security current # ตรวจสอบเฉพาะมิติความปลอดภัย
/audit independent current # เริ่มกระบวนการ Independent Review ด้วย Subagent แยกขาด</code></pre>
        `
      },
      {
        id: 'run-an-independent-review',
        title: 'รันการตรวจทานแบบอิสระ (Run an independent review)',
        contentHtml: `
          <p>เมื่อต้องการให้การตรวจทานเป็นไปอย่างเที่ยงธรรม โดยที่ผู้สร้าง (Builder) ไม่ควรเป็นผู้ตรวจรับงานของตนเอง ให้รันคำสั่ง <code>/audit independent current</code></p>
          <p>ด้วยการตั้งค่าแบบอัตโนมัติ (Automatic Execution) ระบบจะเริ่มต้น <strong>Subagent ผู้ตรวจสอบอิสระ (Isolated Reviewer)</strong> ที่มีบริบทสดใหม่ ระบุตัวตนโมเดลชัดเจน และออกใบรับรอง <strong>Review Receipt</strong> ใน <code>review.md</code></p>
        `
      }
    ]
  },

  // 4. The Findings Ledger
  {
    slug: 'findings-ledger',
    category: 'QUALITY',
    title: 'The Findings Ledger (สมุดบัญชีข้อค้นพบ)',
    lead: 'ข้อค้นพบจากการ Audit จะได้รับรหัส ID ถาวรและสถานะกำกับในไฟล์ที่บันทึกร่วมกับ Git โดยข้อค้นพบระดับร้ายแรงจะบล็อกการ Merge จนกว่าจะได้รับการแก้ไขอย่างถูกต้อง',
    pills: ['Quality', 'Guide', 'Findings', 'Audit', 'Ledger', 'Blockers', 'Review'],
    sections: [
      {
        id: 'why-findings-need-a-file',
        title: 'ทำไม Findings ถึงต้องบันทึกเป็นไฟล์ถาวร (Why findings need a file)',
        contentHtml: `
          <p>สมุดบัญชีใน <code>devflow/context/{xxx-slug}/findings.md</code> คือบันทึกที่คงทนถาวร เป็นไฟล์ Markdown ธรรมดาที่ติดตามสถานะข้อค้นพบได้อย่างโปร่งใส และป้องกันไม่ให้ข้อบกพร่องระดับร้ายแรง (P0/P1) หลุดรอดเข้าสู่ Branch หลัก</p>
          <pre><code>### F-01 [P1] open - Missing authentication check on admin route

**File:** src/routes/admin.ts:42
**Found:** 2026-09-17 by /audit (scope: current)
**Why it matters:** Unauthenticated users can access internal metrics.
**Suggested fix:** Add requireAuth middleware before handler.
**Resolution:**</code></pre>
        `
      },
      {
        id: 'statuses',
        title: 'สถานะของรายการและการบล็อกการ Merge (Statuses)',
        contentHtml: `
          <table>
            <thead><tr><th>สถานะ (Status)</th><th>ความหมาย (Meaning)</th><th>บล็อกการ Complete (P0/P1)</th></tr></thead>
            <tbody>
              <tr><td><code>open</code></td><td>ยืนยันแล้วว่ามีปัญหาจริง และยังไม่ได้รับการแก้ไข</td><td>🚫 <strong>บล็อก</strong></td></tr>
              <tr><td><code>fixed</code></td><td>ได้รับการแก้ไขโค้ดแล้ว แต่ยังไม่ผ่านการรีวิวซ้ำ</td><td>🚫 <strong>บล็อก</strong></td></tr>
              <tr><td><code>closed</code></td><td>ได้รับการแก้ไขและผ่านการรีวิวซ้ำเทียบกับโค้ดใหม่แล้ว</td><td>❌ ไม่บล็อก</td></tr>
              <tr><td><code>accepted</code></td><td>ตัดสินใจไม่แก้ไข โดยเป็นการตัดสินใจอย่างชัดเจนของคุณพร้อมระบุเหตุผล</td><td>❌ ไม่บล็อก</td></tr>
              <tr><td><code>invalid</code></td><td>การตรวจสอบซ้ำพิสูจน์แล้วว่าข้อค้นพบนี้ไม่ถูกต้อง</td><td>❌ ไม่บล็อก</td></tr>
            </tbody>
          </table>
        `
      }
    ]
  }
];
