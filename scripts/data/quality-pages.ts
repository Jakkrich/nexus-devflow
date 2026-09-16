import type { DocPage } from '../build-docs-site.js';

export const QUALITY_PAGES: DocPage[] = [
  // 1. Testing and CI
  {
    slug: 'testing',
    category: 'QUALITY',
    title: 'Testing and CI (ปรัชญาการทดสอบและการรวมศูนย์ CI)',
    lead: 'ปรัชญาการทดสอบแบบ Multi-lane Verification, วินัย Strict TDD (Red-Green-Refactor), และการรวมคำสั่ง Verify เข้าสู่ GitHub Actions',
    pills: ['Quality', 'Testing', 'TDD', 'MultiLane', 'CI', 'GitHubActions', 'Verification'],
    sections: [
      {
        id: 'multi-lane-verification',
        title: 'เมทริกซ์การตรวจสอบหลายมิติ (Multi-Lane Verification Matrix)',
        contentHtml: `
          <p>ใน Nexus-DevFlow โค้ดทุกบรรทัดที่จะถูกส่งมอบต้องผ่านด่านการตรวจสอบ 4 มิติหลักอย่างเป็นรูปธรรม:</p>
          <table>
            <thead><tr><th>มิติการตรวจสอบ (Lane)</th><th>เครื่องมือตัวอย่าง</th><th>สิ่งที่ยืนยัน</th></tr></thead>
            <tbody>
              <tr><td><strong>1. Typecheck</strong></td><td><code>tsc --noEmit</code>, <code>mypy</code>, <code>go vet</code></td><td>ความถูกต้องของ Type System, Interface contracts, และ Function signatures</td></tr>
              <tr><td><strong>2. Lint & Formatting</strong></td><td><code>eslint</code>, <code>prettier</code>, <code>golangci-lint</code>, <code>ruff</code></td><td>ความสะอาด, กฎระเบียบของทีม, และมาตรฐานโค้ดสากล</td></tr>
              <tr><td><strong>3. Unit & Integration Tests</strong></td><td><code>vitest</code>, <code>jest</code>, <code>pytest</code>, <code>go test</code></td><td>ความถูกต้องของ Business Logic, Data Layer, และ Edge Case boundaries</td></tr>
              <tr><td><strong>4. Contract & Build Verification</strong></td><td><code>npm run build</code>, <code>npm run check</code></td><td>ความพร้อมในการคอมไพล์ Production Bundle ปราศจาก Error หรือ Warning ร้ายแรง</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'tdd-cycle',
        title: 'วงจร Strict TDD (Red-Green-Refactor)',
        contentHtml: `
          <p>เมื่อรัน <code>/implement</code> AI จะไม่เขียนโค้ดฟังก์ชันก่อนเขียน Test แต่จะปฏิบัติตามวินัยอย่างเคร่งครัด:</p>
          <ol>
            <li><strong>🔴 Red</strong>: เขียน Test ที่ล้มเหลวก่อนเพื่อระบุพฤติกรรมและเงื่อนไขที่ถูกต้อง</li>
            <li><strong>🟢 Green</strong>: เขียนโค้ดที่เรียบง่ายที่สุดเพื่อให้ชุดการทดสอบผ่าน 100%</li>
            <li><strong>🔵 Refactor</strong>: ปรับปรุงโครงสร้างโค้ดตาม <code>coding-standards.md</code> โดยที่ Test ยังคงผ่านทั้งหมด</li>
          </ol>
        `
      },
      {
        id: 'ci-alignment',
        title: 'การรวมศูนย์คำสั่ง Verify บน GitHub Actions CI',
        contentHtml: `
          <p>Nexus-DevFlow กำหนดให้มี <strong>Single Verify Command</strong> (เช่น <code>npm run check</code> หรือ <code>make verify</code>) ที่ทั้งนักพัฒนาและ GitHub Actions CI รันคำสั่งเดียวกันเป๊ะ เพื่อไม่ให้เกิดปัญหา "Works on my machine"</p>
        `
      }
    ]
  },

  // 2. Manual Review With Try
  {
    slug: 'manual-review',
    category: 'QUALITY',
    title: 'Manual Review With Try (การตรวจรับด้วยมือ)',
    lead: 'การสร้างคู่มือตรวจรับงานแบบ Manual Walkthrough ด้วยคำสั่ง /try สำหรับ Product Owner, Senior Developer, และ QA',
    pills: ['Quality', 'Try', 'ManualReview', 'QA', 'UAT', 'Walkthrough'],
    sections: [
      {
        id: 'overview',
        title: 'ทำไมการทดสอบด้วยมือยังคงสำคัญ?',
        contentHtml: `
          <p>แม้ว่า Automated Test จะผ่าน 100% แต่การทดสอบในฐานะผู้ใช้งานจริง (User Acceptance Testing - UAT) ยังคงจำเป็นสำหรับการยืนยัน User Experience (UX), การจัดวาง Layout, และความลื่นไหลของระบบ คำสั่ง <code>/try</code> หรือ <code>/check guide</code> จะสรุปขั้นตอนการตรวจรับงานให้อย่างเป็นรูปธรรม</p>
        `
      },
      {
        id: 'guide-anatomy',
        title: 'โครงสร้างของคู่มือ Manual Try Guide',
        contentHtml: `
          <ul>
            <li><strong>Prerequisites</strong>: คำสั่งเปิด Dev Server หรือเตรียมข้อมูลทดสอบ (Seed data)</li>
            <li><strong>Step-by-Step UI Actions</strong>: ขั้นตอนการคลิกหรือพิมพ์ข้อมูลทีละสเต็ปบนหน้าจอ</li>
            <li><strong>Expected Observable Proof</strong>: สิ่งที่ต้องปรากฏบนหน้าจอหรือใน API Response</li>
            <li><strong>Red Flags</strong>: ข้อผิดพลาดที่ต้องระวังหรือสัญญาณความผิดปกติที่ไม่ควรเกิดขึ้น</li>
          </ul>
        `
      }
    ]
  },

  // 3. Code Quality With Audit
  {
    slug: 'code-quality',
    category: 'QUALITY',
    title: 'Code Quality With Audit (การควบคุมคุณภาพโค้ด)',
    lead: 'การตรวจเช็กคุณภาพโค้ด สถาปัตยกรรม ความปลอดภัย และกระบวนการ Independent Review Checkpoint',
    pills: ['Quality', 'Audit', 'CodeQuality', 'Security', 'Review', 'IndependentReviewer'],
    sections: [
      {
        id: 'audit-pillars',
        title: '4 เสาหลักของการ Audit โค้ด',
        contentHtml: `
          <p>เมื่อรัน <code>/audit</code> ระบบจะทำการตรวจสอบโค้ดอย่างเข้มงวดตาม 4 เสาหลัก:</p>
          <ol>
            <li><strong>Architecture & Boundaries</strong>: การไม่ละเมิดขอบเขตระหว่างโมดูล ไม่สร้าง Dependency วนซ้ำ (Circular Dependency)</li>
            <li><strong>Security Vulnerabilities</strong>: การป้องกัน SQL Injection, XSS, Secret Hardcoding, และ Insecure Auth ตามมาตรฐาน OWASP</li>
            <li><strong>Performance & Resource Leaks</strong>: การไม่สร้าง Memory Leaks, N+1 Database Queries, หรือ Re-render ที่ไม่จำเป็น</li>
            <li><strong>Maintainability & Clean Code</strong>: ความเรียบง่าย (KISS/YAGNI), การตั้งชื่อที่สื่อความหมาย, และการไม่มี Dead Code</li>
          </ol>
        `
      },
      {
        id: 'two-stage-review',
        title: 'กระบวนการตรวจรับแบบ Two-Stage Independent Review',
        contentHtml: `
          <p>สำหรับงานที่มีความเสี่ยงสูง ระบบจะสร้าง Review Checkpoint เพื่อส่งต่อให้ AI Reviewer อิสระคนละ Session ทำการตรวจทานและออกใบรับรอง <strong>Review Receipt</strong> ใน <code>review.md</code> ก่อนส่งมอบ</p>
        `
      }
    ]
  },

  // 4. The Findings Ledger
  {
    slug: 'findings-ledger',
    category: 'QUALITY',
    title: 'The Findings Ledger (สมุดบัญชีข้อค้นพบ)',
    lead: 'สัญญาการบันทึกและจัดการข้อค้นพบใน devflow/context/{xxx-slug}/findings.md และการควบคุม Blocker Gates',
    pills: ['Quality', 'Findings', 'Ledger', 'Blockers', 'Compliance', 'AuditTrail'],
    sections: [
      {
        id: 'contract',
        title: 'สัญญาของ Findings Ledger',
        contentHtml: `
          <p>ในระหว่างการพัฒนาฟีเจอร์ ข้อค้นพบและบั๊กทั้งหมดจะถูกบันทึกลงใน <code>devflow/context/{xxx-slug}/findings.md</code> โดยแบ่งระดับความรุนแรง (Severity) ออกเป็น 4 ระดับ:</p>
          <table>
            <thead><tr><th>ระดับความรุนแรง</th><th>คำจำกัดความ</th><th>ผลกระทบต่อคำสั่ง /complete</th></tr></thead>
            <tbody>
              <tr><td><strong style="color:#d32f2f;">P0 (Blocker)</strong></td><td>ระบบล่ม, ข้อมูลสูญหาย, หรือช่องโหว่ความปลอดภัยร้ายแรง</td><td>❌ <strong>บล็อกการ Merge ทันที</strong> ต้องแก้ไขให้เสร็จสิ้น</td></tr>
              <tr><td><strong style="color:#ed6c02;">P1 (Major)</strong></td><td>ฟังก์ชันสำคัญทำงานผิดพลาด หรือไม่มีชุดการทดสอบรองรับ</td><td>❌ <strong>บล็อกการ Merge</strong> จนกว่าจะแก้ไขหรือได้รับการอนุมัติข้อยกเว้น</td></tr>
              <tr><td><strong style="color:#0288d1;">P2 (Minor)</strong></td><td>ปัญหาเรื่องความสะอาดของโค้ด หรือข้อบกพร่องเล็กน้อยที่ไม่กระทบผู้ใช้</td><td>⚠️ เตือนให้ปรับปรุง แต่ยอมให้ Merge ได้</td></tr>
              <tr><td><strong>P3 (Trivial)</strong></td><td>ข้อเสนอแนะการปรับปรุงในอนาคต (Suggestion)</td><td>ℹ️ บันทึกไว้เป็นไอเดียต่อยอดใน <code>ideas.md</code></td></tr>
            </tbody>
          </table>
        `
      }
    ]
  }
];
