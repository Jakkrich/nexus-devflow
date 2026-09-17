import type { DocPage } from '../build-docs-site.js';

export const QUALITY_PAGES: DocPage[] = [
  // 1. Testing and CI
  {
    slug: 'testing',
    category: 'QUALITY',
    title: 'Testing and CI (การทดสอบและการรวมศูนย์ CI)',
    lead: 'เพิ่มการทดสอบอย่างมีจุดประสงค์, ใช้คำสั่ง Verify หนึ่งเดียวร่วมกันทุกที่, และรันการตรวจสอบชุดเดียวกันทั้งในเครื่อง Local และบน GitHub Actions',
    pills: ['Quality', 'Guide', 'Testing', 'UnitTests', 'BrowserTests', 'CI', 'Verify', 'GitHubActions'],
    sections: [
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
          <p>สกิลที่เกี่ยวข้องในการติดตั้งและตั้งค่า:</p>
          <ul>
            <li><strong><code>/setup-tests</code></strong> (หรือ <code>/tests</code>): ติดตั้งและกำหนดค่า Unit Testing ประจำสแตก</li>
            <li><strong><code>/browser-tests</code></strong> (หรือ <code>/tests browser</code>): ติดตั้งและกำหนดค่า Browser Test Harness เสริม</li>
            <li><strong><code>/ci</code></strong>: กำหนดค่าสูตรคำสั่ง Verify และไฟล์เวิร์กโฟลว์ GitHub Actions</li>
            <li><strong>GitHub ruleset</strong>: การตั้งค่า Remote Protection บนหน้าต่าง Settings ของ GitHub Repository</li>
          </ul>
        `
      },
      {
        id: 'testing-is-opt-in',
        title: 'การทดสอบเป็นแบบ Opt-in ตามความพร้อมของโปรเจกต์ (Testing is opt-in)',
        contentHtml: `
          <p>เนื่องจาก DevFlow ไม่สามารถคาดเดา Test Runner ที่เหมาะสมสำหรับทุกๆ เทคโนโลยีสแตก จึงไม่มีการติดตั้ง Test Runner มาให้ตั้งแต่เริ่มต้น</p>
          <p>เมื่อโปรเจกต์พร้อมที่จะผสานการทดสอบ Unit Tests เข้าสู่วงจรการทำงาน ให้รันคำสั่ง <strong><code>$tests</code></strong> ใน OpenAI Codex CLI หรือ <strong><code>/setup-tests</code></strong> / <strong><code>/tests</code></strong> ใน Claude Code, Google Antigravity และ Gemini CLI</p>
          <pre><code># ติดตั้งหรือจัดระเบียบ Unit Test Runner ประจำสแตก
/setup-tests
/tests</code></pre>
          <p>เมื่อมีคำสั่งทดสอบจริงระบุไว้ในหัวข้อ <code>Commands</code> ของ <code>AGENTS.md</code> การทดสอบจะกลายเป็น Gate บังคับทันที: ทุกสเต็ปการ Implement ที่มีการเปลี่ยน Logic จำเป็นต้องเพิ่ม Test Coverage เฉพาะจุดและดูแลให้ชุดการทดสอบผ่านเขียวเสมอ ส่วนงาน UI และ Integration ยังคงต้องมีหลักฐานตรงจาก Browser, Build, หรือ API เพิ่มเติม</p>
          <p>หากโปรเจกต์มีคำสั่ง Verify อยู่แล้ว สกิล <code>/setup-tests</code> จะแทรกคำสั่ง Test เข้าไประหว่างขั้นตอน Typecheck และ Build ให้อัตโนมัติ โดยจะไม่สร้างไฟล์ CI ขึ้นมาโดยพลการหากยังไม่ได้สั่ง</p>
        `
      },
      {
        id: 'browser-testing-is-also-opt-in',
        title: 'การทดสอบ Browser ก็เป็นแบบ Opt-in เช่นกัน (Browser testing is also opt-in)',
        contentHtml: `
          <p>รันคำสั่ง <strong><code>$tests browser</code></strong> ใน Codex หรือ <strong><code>/browser-tests</code></strong> / <strong><code>/tests browser</code></strong> ใน Claude Code, Google Antigravity และ Gemini CLI เมื่อโปรเจกต์ต้องการระบบตรวจสอบ Browser อัตโนมัติที่ทำซ้ำได้</p>
          <pre><code># ติดตั้ง Browser Test Harness
/browser-tests
/tests browser</code></pre>
          <p>สกิลจะเลือกใช้ Runner ที่มีอยู่แล้ว หรือติดตั้ง <strong>Playwright</strong> สำหรับโปรเจกต์เว็บและ Extension พร้อมสร้างตัวอย่าง Smoke Flow เริ่มต้น 1 ตัวอย่าง และบันทึกคำสั่ง <code>Browser tests: npm run test:browser</code> ลงใน <code>AGENTS.md</code></p>
          <p>คำสั่งนี้จะแยกต่างหากจากสูตร Verify/CI ปกติ โดยสเต็ป <code>/feature</code> และ <code>/implement</code> สามารถเขียน Browser Test เพิ่มเติมได้ ส่วน <code>/check</code> และ <strong>Continuous Mode</strong> สามารถเรียกใช้ Harness นี้ได้เมื่อต้องการหลักฐานการทำงานเชิงประจักษ์</p>
          <p>นอกจากนี้ยังรองรับสถาปัตยกรรม Hybrid ร่วมกับ <strong>MCP browseros-neo</strong> (<code>http://127.0.0.1:9010/mcp</code>) เพื่อให้ AI Agent สามารถตรวจสอบ Live DOM, Visual QA และบันทึกภาพหน้าจอจริงได้ในแบบ Interactive</p>
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
          <p>หากขั้นตอนใดไม่มีอยู่ จะถูกข้ามไปอย่างปลอดภัย สำหรับโปรเจกต์ JavaScript/TypeScript มักจะเป็น Script ชื่อ <code>npm run verify</code> หรือ <code>npm run check</code> ส่วนสแตกอื่นจะใช้ Task Runner ประจำภาษา</p>
          <div class="tip-box">
            <code>/onboard หรือ /adopt ➔ /ci ➔ Verify ในเครื่อง Local ➔ GitHub Actions รัน Verify เดียวกัน</code>
          </div>
          <p>การรัน Verify ในเครื่อง Local ยืนยันความถูกต้องของ Working Copy ปัจจุบัน และ CI จะได้รับการยืนยันสมบูรณ์เมื่อ GitHub รันสูตรเดียวกันนี้ผ่านบน Clean Checkout</p>
          <p>คำสั่ง <code>/implement</code>, <code>/complete</code>, <code>/autopilot</code> และทุกฟีเจอร์ใน <code>/continuous</code> จะใช้คำสั่ง Verify ที่บันทึกไว้ และคำสั่ง <code>/doctor</code> จะคอยแจ้งเตือนเมื่อเกิด Drift ระหว่าง <code>AGENTS.md</code>, Package Script และ GitHub Workflow</p>
        `
      },
      {
        id: 'existing-ci-stays-intact',
        title: 'คงสภาพ CI เดิมที่มีอยู่อย่างปลอดภัย (Existing CI stays intact)',
        contentHtml: `
          <p>สกิล <code>/ci</code> จะตรวจสอบเวิร์กโฟลว์ GitHub Actions เดิมและ CI ภายนอกทั้งหมดก่อนที่จะแก้ไขไฟล์ใดๆ โดยจะคงสภาพ Custom Checks เดิมไว้, แจ้งเตือนหากมีส่วนที่ทับซ้อนกัน, และถามการยืนยันจากผู้ใช้ก่อนที่จะแก้ไขไฟล์ <code>verify.yml</code> ที่มีอยู่</p>
          <p>โครงสร้างเริ่มต้นจะใช้ Runtime ที่ตรวจจับได้, คำสั่ง Install ที่ปลอดภัยตาม Lockfile, ตรวจจับ Default Branch, ทริกเกอร์ <code>pull_request</code> และ <code>push</code>, พร้อมกำหนดสิทธิ์ <code>contents: read</code></p>
          <p>การตั้งค่านี้จะไม่แอบใส่ Lint, Formatting, Test Coverage Threshold, Browser Tests, Security Scans, Dependency Audits, Version Matrices หรือ GitHub Rulesets โดยไม่ได้รับอนุญาต</p>
          <p>มีตัวเลือกเสริมให้เปิดใช้งาน <strong>Local Pre-push Hook</strong> ที่รันคำสั่ง Verify ก่อน Push ออกไป (สามารถใช้ <code>git push --no-verify</code> เพื่อข้ามได้หากจำเป็น) และสกิลจะหยุดก่อนทำ Git Push เสมอ เวิร์กโฟลว์ในเครื่องจะไม่มีผลกระทบต่อ GitHub จนกว่าคุณจะสั่งเผยแพร่</p>
        `
      },
      {
        id: 'match-proof-to-the-work',
        title: 'จับคู่หลักฐานให้ตรงกับประเภทของงาน (Match proof to the work)',
        contentHtml: `
          <p>เลือกใช้หลักฐานเชิงประจักษ์ให้เหมาะสมกับชนิดของโค้ดที่สร้างหรือแก้ไข:</p>
          <table>
            <thead><tr><th>ประเภทงาน (Work)</th><th>หลักฐานที่ดีที่สุด (Best Evidence)</th></tr></thead>
            <tbody>
              <tr><td><strong>Parser, Validator, Formatter หรือ Action</strong></td><td>Focused Unit Test พร้อมครอบคลุม Edge Cases</td></tr>
              <tr><td><strong>Responsive UI หรือ Visual Component</strong></td><td>Production Build สำเร็จ และบันทึก Screenshot จาก Browser</td></tr>
              <tr><td><strong>Form, Navigation หรือ Download Flow</strong></td><td>การทดสอบปฏิสัมพันธ์จริงบน Browser พร้อมตรวจสอบ Console Logs</td></tr>
              <tr><td><strong>API Endpoint</strong></td><td>ตัวอย่าง Request, Response Body และเส้นทาง Error Path</td></tr>
              <tr><td><strong>Repository-wide Automated Gate</strong></td><td>การรันคำสั่ง Verify เดียวกันที่ระบุไว้ในเอกสารผ่านฉลุย</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'browser-evidence',
        title: 'หลักฐานการทำงานบน Browser (Browser evidence)',
        contentHtml: `
          <p>การตรวจสอบ UI และ User Flow ต้องมีหลักฐานจาก Browser โดยตรง เมื่อ <code>AGENTS.md</code> มีการระบุคำสั่ง <code>Browser tests</code> สกิล <code>/check</code> จะรันคำสั่งดังกล่าวและตรวจสอบผลลัพธ์</p>
          <p>แต่สำหรับการประเมินที่ชุดทดสอบอัตโนมัติมองไม่เห็น เช่น ความถูกต้องของสีและสไตล์ (Visual Fidelity), Browser Chrome, หรือพฤติกรรมภายใต้ Authenticated Session ของผู้ใช้จริง AI จะใช้การสังเกตผ่าน Live Browser (เช่น ผ่าน MCP browseros-neo หรือเปิดหน้าจอจริง) เพื่อตรวจรับงาน</p>
        `
      },
      {
        id: 'avoid-false-confidence',
        title: 'หลีกเลี่ยงความมั่นใจแบบหลอกตา (Avoid false confidence)',
        contentHtml: `
          <p>อย่าหลงเชื่อความมั่นใจที่ปราศจากหลักฐานที่แท้จริง:</p>
          <ul>
            <li>ชุดทดสอบที่ว่างเปล่า (Empty Suite) ต้องไม่ถูกนับว่าเป็นการทดสอบที่ประสบความสำเร็จ</li>
            <li>การ Build ผ่าน ไม่ได้แปลว่าคลิกปุ่มแล้วจะทำงานได้ถูกต้อง</li>
            <li>รูป Screenshot ภาพเดียว ไม่ได้พิสูจน์ว่า Validator รองรับ Input ที่ผิดรูปแบบ (Malformed Data)</li>
            <li>การย้ายชุดทดสอบที่อ่อนแอขึ้นไปรันบน CI ไม่ได้ทำให้คุณภาพโค้ดดีขึ้น</li>
          </ul>
          <p>จงเลือกใช้หลักฐานที่กระชับและตรงจุดที่สุดในการพิสูจน์ข้อกล่าวอ้างแต่ละข้อเสมอ</p>
        `
      }
    ]
  },

  // 2. Manual Review With Try
  {
    slug: 'manual-review',
    category: 'QUALITY',
    title: 'Manual Review With Try (การตรวจรับด้วยตนเองผ่านคู่มือ Try)',
    lead: 'มอบแนวทางและขั้นตอนการตรวจรับงานอย่างแม่นยำให้แก่ผู้ตรวจทานที่เป็นมนุษย์ สำหรับงานปัจจุบันหรืองานที่เพิ่งเสร็จสมบูรณ์ โดยไม่ต้องเสียเวลาเปิดดูโค้ดก่อน',
    pills: ['Quality', 'Guide', 'Try', 'ManualReview', 'QA', 'UAT', 'Walkthrough'],
    sections: [
      {
        id: 'generate-the-path',
        title: 'สร้างเส้นทางการทดสอบ (Generate the path)',
        contentHtml: `
          <p>รันคำสั่ง <strong><code>$check guide</code></strong> ใน OpenAI Codex CLI หรือ <strong><code>/check guide</code></strong> / <strong><code>/try</code></strong> ใน Claude Code, Google Antigravity และ Gemini CLI ภายหลังการ Implement เสร็จสิ้น</p>
          <pre><code># สร้างคู่มือสำหรับงานปัจจุบัน
/check guide
/try

# สร้างคู่มือสำหรับงานล่าสุดที่ส่งมอบแล้ว
/try latest

# กำหนดเป้าหมายเฉพาะสเต็ปหรือเส้นทาง
/try step-2
/try src/api/auth</code></pre>
          <p>สกิลจะอ่านข้อมูลจากฟีเจอร์ปัจจุบัน, บั๊กฟิกซ์, หรือการ Rollback ใน <code>devflow/context/{xxx-slug}/spec.md</code> (หรือชิ้นงานล่าสุดใน <code>devflow/history/</code>) และดึงคำสั่งรันระบบจาก <code>AGENTS.md</code> มาสร้างเป็นแนวทางการทดสอบที่กระชับ</p>
          <p>สำหรับงาน <strong>Rollback</strong>: สกิลจะอธิบายขั้นตอนการพิสูจน์ว่าเส้นทางการทำงานที่ถูกถอดถอนนั้นหายไปจริง พร้อมชี้จุดตรวจสอบเพื่อยืนยันว่าจะไม่มีปัญหาถดถอย (Regression) ในฟังก์ชันส่วนอื่นที่ไม่เกี่ยวข้อง</p>
        `
      },
      {
        id: 'a-useful-review-guide-includes',
        title: 'คู่มือการตรวจทานที่มีประโยชน์ควรประกอบด้วย (A useful review guide includes)',
        contentHtml: `
          <p>คู่มือ Try Guide ที่สมบูรณ์จะจัดโครงสร้างเป็น 5 ขั้นตอนหลักที่กระชับและปฏิบัติได้จริง:</p>
          <ul>
            <li><strong>1. Start (คำสั่งเริ่มต้นระบบ)</strong>: คำสั่งรัน Dev Server, Backend หรือ CLI พร้อมตำแหน่งโฟลเดอร์ที่ต้องรัน</li>
            <li><strong>2. Open (จุดเข้าถึงระบบ)</strong>: URL, หน้าจอ, แท็บเมนู, API Endpoint หรือคำสั่ง CLI ที่ต้องเปิดใช้งาน</li>
            <li><strong>3. Do (ลำดับการกระทำ)</strong>: ลำดับขั้นตอนการป้อนข้อมูล การคลิกปุ่ม การเลือกอ็อปชัน หรือการส่งพารามิเตอร์</li>
            <li><strong>4. Expect (ผลลัพธ์ที่คาดหวัง)</strong>: สิ่งที่ต้องมองเห็นบนหน้าจอ การเปลี่ยนแปลงสถานะ โครงสร้าง Response หรือไฟล์ที่ถูกสร้างขึ้น</li>
            <li><strong>5. Watch For (สัญญาณข้อผิดพลาดที่ต้องระวัง)</strong>: ผลลัพธ์ที่ไม่ถูกต้อง ข้อผิดพลาดบน Console/Network ข้อมูลค้างไม่อัปเดต ฟิลด์ที่ขาดหาย สภาวะข้อมูลว่าง (Bad Empty State) หรือ Layout ที่ผิดเพี้ยน</li>
          </ul>
        `
      },
      {
        id: 'review-is-not-proof-theater',
        title: 'การรีวิวไม่ใช่แค่การแสดงหลักฐานซ้ำซ้อน (Review is not proof theater)',
        contentHtml: `
          <p>เป้าหมายของคู่มือ Try **ไม่ใช่การให้มนุษย์มานั่งคลิกทำซ้ำทุกข้อที่ Automated Test ตรวจไปแล้ว**</p>
          <p>แต่เป็นการมุ่งเน้นความใส่ใจของมนุษย์ไปยังจุดที่การทดสอบอัตโนมัติไม่สามารถประเมินได้ดี เช่น:</p>
          <ul>
            <li><strong>คุณภาพเชิงภาพและความประณีตของ UI (Visual Quality & Aesthetics)</strong></li>
            <li><strong>สำนวนและการใช้ภาษา (Wording & Copywriting)</strong></li>
            <li><strong>ความรู้สึกในการโต้ตอบและความลื่นไหล (Interaction Feel & Responsiveness)</strong></li>
            <li><strong>พฤติกรรมในมุมมองของผู้ใช้งานจริง (Holistic Product Behavior)</strong></li>
          </ul>
        `
      }
    ]
  },

  // 3. Code Quality With Audit
  {
    slug: 'code-quality',
    category: 'QUALITY',
    title: 'Code Quality With Audit (การควบคุมคุณภาพโค้ดด้วยการ Audit)',
    lead: 'ใช้การตรวจสอบแบบ Read-Only เพื่อดักจับความเบี่ยงเบนด้านความสามารถในการบำรุงรักษา (Maintainability Drift) ก่อนที่มันจะกลายเป็นรูปแบบเริ่มต้นของโปรเจกต์',
    pills: ['Quality', 'Guide', 'Audit', 'Maintainability', 'Security', 'Performance', 'IndependentReview'],
    sections: [
      {
        id: 'what-to-look-for',
        title: 'สิ่งที่ต้องมองหาในการตรวจสอบ (What to look for)',
        contentHtml: `
          <p>โค้ดที่พัฒนาด้วยความช่วยเหลือของ AI มีแนวโน้มที่จะสะสม Helper ซ้ำซ้อน, รูปแบบ Component ที่แตกต่างกันเล็กน้อย, ฟังก์ชัน Export ที่ไม่ได้ใช้งาน, ไฟล์ที่มีขนาดยาวเกินไป, และ Business Logic ที่ไม่มีชุดการทดสอบรองรับ</p>
          <p>สกิล <code>/audit</code> (หรือ <code>$audit</code>) ทำหน้าที่สแกนฐานโค้ดเพื่อตรวจจับแบบแผนเหล่านี้ในโหมด <strong>Read-Only</strong> โดยไม่มีการแก้ไขโค้ดจริง</p>
        `
      },
      {
        id: 'match-the-scope-and-lens-to-the-job',
        title: 'เลือกขอบเขตและมิติการตรวจสอบ (Lens) ให้เหมาะกับงาน (Match the scope and lens to the job)',
        contentHtml: `
          <p><strong>ขอบเขตการตรวจสอบ (Audit Scopes):</strong></p>
          <ul>
            <li><strong><code>/audit current</code></strong> (ค่าเริ่มต้น): สำหรับฟีเจอร์ที่กำลังพัฒนา ครอบคลุมงาน Checkpoint Commit ทั้งหมดตั้งแต่ Merge Base ของ Feature Branch จนถึง <code>HEAD</code> รวมถึงไฟล์ที่ยังไม่ Commit และโค้ดโดยรอบ</li>
            <li><strong><code>/audit changed</code></strong>: ตรวจสอบเฉพาะการเปลี่ยนแปลงของไฟล์ใน Working-tree ปัจจุบัน</li>
            <li><strong><code>/audit &lt;path&gt;</code></strong>: ตรวจสอบเฉพาะไดเรกทอรีหรือ Subsystem ที่ระบุ (เช่น <code>/audit src/api</code>)</li>
            <li><strong><code>/audit full</code></strong>: ตรวจสอบความแข็งแกร่งทั่วทั้งโปรเจกต์ (Project-wide hardening) โดยจะคัดแยกโค้ดที่สร้างขึ้นอัตโนมัติ (Generated) และ Third-party Dependencies ออก และระบุว่าการตรวจสอบครอบคลุมครบถ้วนหรือไม่ เพื่อป้องกันความเข้าใจผิดว่าโปรเจกต์สมบูรณ์หลังจากสแกนเพียงบางส่วน</li>
          </ul>
          <p><strong>มิติการตรวจสอบเฉพาะด้าน (Focused Lenses):</strong></p>
          <pre><code>/audit quality changed
/audit security current
/audit performance src/api
/audit tests src/auth</code></pre>
          <ul>
            <li><strong><code>quality</code></strong>: ตรวจสอบความสามารถในการบำรุงรักษา (Maintainability) และมาตรฐานโค้ด</li>
            <li><strong><code>security</code></strong>: ตรวจสอบขอบเขตความไว้วางใจ (Trust Boundaries), การเปิดเผยข้อมูล, และความปลอดภัย</li>
            <li><strong><code>performance</code></strong>: ตรวจสอบการทำงานซ้ำซ้อนที่ไม่จำกัดขอบเขต และความเสี่ยงใน Runtime</li>
            <li><strong><code>tests</code></strong>: ตรวจสอบช่องว่างความครอบคลุมของการทดสอบและความน่าเชื่อถือของ Test Suite</li>
          </ul>
        `
      },
      {
        id: 'handle-findings-deliberately',
        title: 'จัดการข้อค้นพบอย่างมีสติและรอบคอบ (Handle findings deliberately)',
        contentHtml: `
          <p>จัดหมวดหมู่ข้อค้นพบแต่ละรายการตามผลกระทบ (Impact) และระดับความมั่นใจ (Confidence)</p>
          <p>แก้ไขข้อบกพร่องที่ชัดเจนและการทำซ้ำที่เป็นอันตราย แต่อย่าเปลี่ยนทุกความพึงพอใจด้านสไตล์ให้กลายเป็นการ Refactor ใหญ่ โดยเฉพาะอย่างยิ่งหากมันจะทำให้ขอบเขตของฟีเจอร์ปัจจุบันบานปลาย</p>
          <p>ข้อค้นพบระดับร้ายแรงที่ยืนยันแล้วต้องมี <strong>หลักฐานที่เป็นรูปธรรม (Concrete Evidence)</strong> หากไม่สามารถยืนยันเส้นทางโค้ดหรือข้อผิดพลาดได้ ให้ระบุในรายงานเป็นความเสี่ยงที่ยังไม่ได้รับการยืนยัน (<code>unverified</code>) แทนการตัดสินว่าเป็น Blocker ทันที</p>
          <p>ข้อค้นพบจะถูกบันทึกลงใน <code>findings.md</code> พร้อมรหัส ID ถาวรและสถานะกำกับ โดยข้อค้นพบระดับ P0/P1 จะบล็อกการ Complete จนกว่าจะได้รับการซ่อมแซมและรีวิวซ้ำ ดูรายละเอียดที่หน้า <a href="../findings-ledger/">The Findings Ledger</a></p>
        `
      },
      {
        id: 'run-an-independent-review',
        title: 'รันการตรวจทานแบบอิสระ (Run an independent review)',
        contentHtml: `
          <p>เมื่อต้องการให้การตรวจทานเป็นไปอย่างเที่ยงธรรม โดยที่ผู้สร้าง (Builder) ไม่ควรเป็นผู้ตรวจรับงานของตนเอง ให้รันคำสั่ง:</p>
          <pre><code>/audit independent current</code></pre>
          <p>ฝั่งผู้สร้างจะเตรียม Code Checkpoint และสเปกที่ผ่านการ Verify สำหรับสเปกที่อยู่นอก Git จะใช้ Local Snapshot ที่ระบุตัวตนแน่นอน</p>
          <p>ด้วยการตั้งค่าแบบอัตโนมัติ (Automatic Execution) ระบบจะเริ่มต้น <strong>Subagent ผู้ตรวจสอบอิสระ (Isolated Reviewer)</strong> ที่มีบริบทสดใหม่ ระบุตัวตนโมเดลชัดเจน และออกใบรับรอง <strong>Review Receipt</strong> ใน <code>review.md</code> เมื่อตรวจเสร็จ หากสภาพแวดล้อมไม่รองรับการแยก Subagent ระบบจะสร้าง Request และส่งต่อให้เปิดเซสชันใหม่ (Manual Handoff)</p>
          <p>ผู้ตรวจสอบอิสระจะตรวจทานโค้ดส่วนต่าง (Delta) ทั้งหมด บันทึกใบรับรองถาวร และปล่อยให้หน้าที่ซ่อมแซมเป็นของผู้สร้าง โดยใช้เพียง Audit Skill และสัญญาการรีวิวในโปรเจกต์เท่านั้น</p>
          <p>การแก้ไขโค้ดใดๆ จะทำให้ Review Receipt เดิมกลายเป็นโมฆะ (Stale) และจำเป็นต้องได้รับการอนุมัติ Checkpoint ใหม่และรีวิวโค้ดส่วนต่างใหม่อย่างสดใหม่ทั้งหมด</p>
        `
      },
      {
        id: 'configure-automatic-quality-gates',
        title: 'การตั้งค่านโยบาย Quality Gates อัตโนมัติ (Configure automatic quality gates)',
        contentHtml: `
          <p>คุณสามารถเรียกใช้ <code>/audit</code> ได้ด้วยตนเองตลอดเวลา นอกจากนี้ ในไฟล์ <code>devflow/config.json</code> ยังสามารถตั้งค่านโยบายให้รัน Audit อัตโนมัติในโหมดปกติและโหมด Continuous ได้:</p>
          <ul>
            <li><code>review.independentExecution</code>: ค่าเริ่มต้น <code>"automatic"</code></li>
            <li><code>qualityGates.regular.independentReview</code>: ค่าเริ่มต้น <code>"when-sensitive"</code></li>
            <li><code>qualityGates.regular.audit</code>: ค่าเริ่มต้น <code>"manual"</code></li>
          </ul>
          <p>แนะนำให้ใช้ <code>when-sensitive</code> สำหรับงานที่แตะต้องเรื่องความปลอดภัย, ฐานข้อมูล, การชำระเงิน, Database Migrations, การทำงานที่มีผลทำลายข้อมูล หรือการเปลี่ยนแปลงขอบเขตกว้างผิดปกติ หรือใช้ <code>always</code> หากต้องการตรวจทุกชิ้นงาน</p>
          <p>โหมด <strong>Autopilot</strong> จะปฏิบัติตามนโยบาย Audit ปกติ ส่วน <strong>Continuous Mode</strong> จะรันตามนโยบาย Continuous ในทุกฟีเจอร์ และเมื่อมี Independent Review ผ่านแล้ว จะถือว่าผ่าน Audit โดยไม่ต้องตรวจซ้ำในเซสชันผู้สร้าง ดูรายละเอียดที่หน้า <a href="../project-configuration/">Project Configuration</a></p>
        `
      },
      {
        id: 'clean-up-a-vibe-coded-project',
        title: 'การจัดระเบียบโปรเจกต์ที่โค้ดแบบ Vibe-Coding (Clean up a vibe-coded project)',
        contentHtml: `
          <p>สำหรับโปรเจกต์ที่เริ่มต้นด้วยการ Prompt โค้ดอย่างรวดเร็ว (Vibe-Coding) ให้รันขั้นตอน <a href="../existing-codebase/">Adopt</a> เพื่อให้ DevFlow เรียนรู้มาตรฐานของโปรเจกต์จริงก่อน</p>
          <p>จากนั้นรัน <code>/audit full</code> เพื่อตรวจสอบระบบทั้งหมด จัดลำดับความสำคัญของข้อค้นพบ และแปลงงานที่ยอมรับแล้วให้เป็น Fix Spec ขนาดเล็ก</p>
          <p>ลำดับความสำคัญในการปรับปรุง: ให้แก้ไขเรื่อง <strong>ความปลอดภัย ➔ ความถูกต้องของข้อมูล ➔ บั๊กการทำงาน ➔ การตรวจสอบข้อมูลนำเข้า (Validation) ➔ ประเภทข้อมูลที่ไม่ปลอดภัย (Unsafe Types)</strong> ก่อนที่จะเริ่มจัดระเบียบความสะอาดของโค้ดในภาพรวม</p>
          <p>หลีกเลี่ยงการ Rewrite โครงสร้างใหม่ทั้งหมดในคราวเดียว ให้แก้ไขทีละจุดความเสี่ยง รันการทดสอบที่เกี่ยวข้อง และรัน Audit ซ้ำหลังจากการแก้ไขในแต่ละรอบ</p>
        `
      },
      {
        id: 'security-and-performance',
        title: 'ประเด็นด้านความปลอดภัยและประสิทธิภาพ (Security and performance)',
        contentHtml: `
          <p>มิติ Security และ Performance สามารถดักจับการจัดการ Input ที่ไม่ปลอดภัย, สิทธิ์การเข้าถึงที่ขาดหาย, การเปิดเผย Secret, การทำงานซ้ำซ้อนที่มีต้นทุนสูง หรือโค้ด Client-side ที่ไม่จำเป็น</p>
          <p>การ Audit ไม่ใช่สิ่งทดแทนการทำ Threat Modeling, Penetration Testing หรือ Production Profiling เต็มรูปแบบเมื่อระบบต้องการความปลอดภัยระดับสูง</p>
          <div class="note-box">
            <strong>นโยบายความปลอดภัยต่อ Secret:</strong> สกิล <code>/audit</code> จะ<strong>ไม่มีวันพิมพ์หรือแสดงผล Secret Values จริง</strong>ในรายงานเด็ดขาด โดยจะระบุเฉพาะประเภทที่ถูกเซ็นเซอร์ (Redacted Category), ตำแหน่งบรรทัดไฟล์, ความเสี่ยง และแนวทางแก้ไข
          </div>
        `
      }
    ]
  },

  // 4. The Findings Ledger
  {
    slug: 'findings-ledger',
    category: 'QUALITY',
    title: 'The Findings Ledger (สมุดบัญชีข้อค้นพบ)',
    lead: 'ข้อค้นพบจากการ Audit จะได้รับรหัส ID ถาวรและสถานะกำกับในไฟล์ที่บันทึกร่วมกับ Git โดยข้อค้นพบระดับร้ายแรงจะบล็อกการ Merge จนกว่าจะได้รับการรีวิวซ้ำ, ยอมรับเหตุผลอย่างชัดเจน หรือพิสูจน์ว่าเป็นข้อผิดพลาดเท็จ',
    pills: ['Quality', 'Guide', 'Findings', 'Audit', 'Ledger', 'Blockers', 'Review'],
    sections: [
      {
        id: 'why-findings-need-a-file',
        title: 'ทำไม Findings ถึงต้องบันทึกเป็นไฟล์ถาวร (Why findings need a file)',
        contentHtml: `
          <p>ในอดีต ข้อค้นพบจากการตรวจสอบโค้ดมักจะปรากฏอยู่เพียงในบทสนทนาของแชท เมื่อมีการเคลียร์บริบท (Context Clear) หรือเริ่มเซสชันใหม่ ข้อค้นพบเหล่านั้นก็จะสูญหายไป: ไม่มีรหัสอ้างอิง ไม่มีสถานะที่ติดตามได้ และไม่มีสิ่งใดคอยตรวจจับว่าข้อบกพร่องร้ายแรงที่ถูกรายงานได้รับการแก้ไขแล้วหรือไม่</p>
          <p>สมุดบัญชีใน <code>devflow/context/{xxx-slug}/findings.md</code> (หรือ <code>devflow/context/findings.md</code>) คือบันทึกที่คงทนถาวร เป็นไฟล์ Markdown ธรรมดาที่สกิลต่างๆ สามารถอ่านและเขียนได้โดยตรง โดยไม่ต้องพึ่งพาสคริปต์เสริม ภาระพึ่งพาภายนอก หรือคำสั่งใหม่ใดๆ</p>
        `
      },
      {
        id: 'entry-format',
        title: 'รูปแบบโครงสร้างของรายการ (Entry format)',
        contentHtml: `
          <p>บันทึกหนึ่งบล็อกต่อหนึ่งข้อค้นพบ โดยบรรทัดหัวข้อทำหน้าที่เป็น Machine-Readable Contract และเนื้อหาด้านล่างเป็นรายละเอียดสำหรับมนุษย์:</p>
          <pre><code>### F-03 [P1] open - Retained auth volumes carry the run label

**File:** ops/compose.yaml:86
**Found:** 2026-07-21 by /audit (scope: current)
**Why it matters:** Cleanup selects by label and now matches the credential volumes.
**Suggested fix:** Give retained volumes a label the cleanup selector excludes.
**Resolution:**</code></pre>
          <p>รหัส ID จะเรียงลำดับแบบ Sequential (<code>F-01</code>, <code>F-02</code>, ...) และจะไม่มีการนำกลับมาใช้ซ้ำหรือเปลี่ยนเลขในระหว่างที่บันทึกยังอยู่ในสมุดบัญชี เมื่อส่งมอบงานสำเร็จ บันทึกที่ได้รับการแก้ไขแล้วจะถูกย้ายเข้าสู่คลังประวัติ (Archive) พร้อมคำนำหน้าชื่อฟีเจอร์ เช่น <code>F-03</code> ของฟีเจอร์ 12 จะกลายเป็น <code>12/F-03</code> อย่างถาวร และหากเป็นการ Build รอบที่สองจะใช้ <code>12-build-2/F-03</code> เพื่อให้ข้อมูลประวัติแยกขาดจากกันชัดเจน ระดับความรุนแรงใช้สเกล <code>P0-P3</code> ของการ Audit</p>
        `
      },
      {
        id: 'statuses',
        title: 'สถานะของรายการและการบล็อกการ Merge (Statuses)',
        contentHtml: `
          <table>
            <thead>
              <tr>
                <th>สถานะ (Status)</th>
                <th>ความหมาย (Meaning)</th>
                <th>บล็อกการ Complete (P0/P1)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>unverified</code></td>
                <td>มีข้อสงสัย แต่ยังไม่มีหลักฐานยืนยันแน่ชัด</td>
                <td>❌ ไม่บล็อก</td>
              </tr>
              <tr>
                <td><code>open</code></td>
                <td>ยืนยันแล้วว่ามีปัญหาจริง และยังไม่ได้รับการแก้ไข</td>
                <td>🚫 <strong>บล็อก</strong></td>
              </tr>
              <tr>
                <td><code>fixed</code></td>
                <td>ได้รับการแก้ไขโค้ดแล้ว แต่ยังไม่ผ่านการรีวิวซ้ำ</td>
                <td>🚫 <strong>บล็อก</strong></td>
              </tr>
              <tr>
                <td><code>closed</code></td>
                <td>ได้รับการแก้ไขและผ่านการรีวิวซ้ำเทียบกับโค้ดใหม่แล้ว</td>
                <td>❌ ไม่บล็อก</td>
              </tr>
              <tr>
                <td><code>accepted</code></td>
                <td>ตัดสินใจไม่แก้ไข โดยเป็นการตัดสินใจอย่างชัดเจนของคุณพร้อมระบุเหตุผล</td>
                <td>❌ ไม่บล็อก</td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>การตรวจสอบซ้ำพิสูจน์แล้วว่าข้อค้นพบนี้ไม่ถูกต้อง พร้อมบันทึกหลักฐาน</td>
                <td>❌ ไม่บล็อก</td>
              </tr>
            </tbody>
          </table>
          <p><strong>ทำไมสถานะ <code>fixed</code> ถึงต้องบล็อกการ Merge?</strong> เพราะการซ่อมแซมไม่ได้สิ้นสุดลงเมื่อมีการแก้โค้ด แต่จะเสร็จสมบูรณ์เมื่อมีกระบวนการรีวิวเข้ามาตรวจสอบผลลัพธ์ของโค้ดใหม่ การแก้บั๊กจุดหนึ่งอาจสร้างข้อบกพร่องที่ร้ายแรงยิ่งกว่าเดิม และสิ่งเดียวที่จะดักจับปัญหานั้นได้คือการตรวจสอบโค้ดที่ได้รับการแก้ไขใหม่อย่างสดใหม่ (Fresh Look)</p>
        `
      },
      {
        id: 'the-lifecycle',
        title: 'วงจรชีวิตของ Findings ในแต่ละคำสั่ง (The lifecycle)',
        contentHtml: `
          <table>
            <thead>
              <tr>
                <th>คำสั่ง (Command)</th>
                <th>พฤติกรรมต่อสมุดบัญชี (Ledger behavior)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>audit</code> (<code>/audit</code>, <code>$audit</code>)</td>
                <td>เพิ่มข้อค้นพบใหม่พร้อมกำหนดรหัส ID, อัปเดตรายการที่ตรวจซ้ำ, และเปลี่ยนสถานะรายการที่เป็น <code>fixed</code> ให้เป็น <code>closed</code> หลังจากการรีวิวซ้ำสำเร็จ หากอยู่ใน Independent Mode จะบันทึกคำขอและใบรับรองลงใน <code>context/review.md</code> ด้วย</td>
              </tr>
              <tr>
                <td><code>implement</code> (<code>/implement</code>)</td>
                <td>ซ่อมแซมข้อค้นพบที่ <code>open</code> โดยเพิ่มเป็นขั้นตอนงานที่ผ่านการรีวิวในสเปก จากนั้นเปลี่ยนสถานะเป็น <code>fixed</code> (ไม่มีสิทธิ์เปลี่ยนเป็น <code>closed</code> เองเด็ดขาด)</td>
              </tr>
              <tr>
                <td><code>fix</code> (<code>/fix</code>)</td>
                <td>รันคำสั่ง <code>/fix F-03</code> ระหว่างรอบงาน เพื่อดึงปัญหาจากสมุดบัญชีมาสร้างสเปกแก้ไข พร้อมระบุ <code>Fixes: F-03</code> ลงในสเปก</td>
              </tr>
              <tr>
                <td><code>complete</code> (<code>/complete</code>)</td>
                <td>ปฏิเสธการ Merge หากมีข้อค้นพบระดับ P0 หรือ P1 ที่มีสถานะเป็น <code>open</code> หรือ <code>fixed</code> เมื่อผ่านจะย้ายข้อค้นพบที่เสร็จสิ้นเข้าคลังประวัติ และส่งต่อข้อค้นพบที่ยังไม่เสร็จสิ้นไปข้างหน้า</td>
              </tr>
              <tr>
                <td><code>status</code> / <code>doctor</code></td>
                <td>รายงานจำนวนและรายการข้อค้นพบที่กำลังบล็อกระบบ พร้อมแนะนำคำสั่งที่ถูกต้องในการแก้ไข</td>
              </tr>
              <tr>
                <td><code>autopilot</code> / <code>continuous</code></td>
                <td>บันทึกข้อค้นพบเมื่อถึงรอบ Audit Gate และจะไม่ส่งมอบงานว่าพร้อม (Ready) ตราบใดที่ยังมี P0 หรือ P1 บล็อกอยู่</td>
              </tr>
            </tbody>
          </table>
          <p>สำหรับ <strong>Independent Reviewer</strong>: ผู้ตรวจสอบอิสระจะใช้สมุดบัญชีเดียวกันนี้ โดยใบรับรอง (Receipt) จะบันทึกว่ามี Finding ID ใดถูกเปิดขึ้นมาบ้าง และหลังการซ่อมแซม ผู้ตรวจรอบถัดไปจะตรวจสอบความสมบูรณ์ของ Checkpoint ใหม่ทั้งหมด แทนที่จะมองแค่ลิสต์ข้อค้นพบเดิมเป็นขอบเขตจำกัด</p>
        `
      },
      {
        id: 'getting-past-the-gate-without-code',
        title: 'การผ่านด่านตรวจสอบโดยไม่ต้องแก้โค้ด (Getting past the gate without code)',
        contentHtml: `
          <p>หาก Quality Gate ไม่มีทางออกฉุกเฉิน (Escape hatch) ผู้ใช้อาจเลือกที่จะปิด Gate ทิ้ง DevFlow จึงออกแบบ 2 ช่องทางในการผ่านด่านที่โปร่งใสและตรวจสอบย้อนหลังได้:</p>
          <ul>
            <li><strong><code>accepted</code></strong>: ตัดสินใจไม่แก้ไขอย่างตั้งใจ การตัดสินใจนี้ทำได้โดยคุณเท่านั้น และต้องระบุเหตุผลประกอบที่จำเป็น ซึ่งข้อความเหตุผลนี้จะถูกจัดเก็บเข้าสู่คลังประวัติตลอดไป</li>
            <li><strong><code>invalid</code></strong>: การตรวจสอบซ้ำพิสูจน์ได้ว่าข้อค้นพบนั้นผิดพลาด สกิล Audit จะตั้งสถานะนี้หลังการรีวิวซ้ำพร้อมหลักฐานที่บันทึกไว้ หรือคุณสามารถระบุสถานะนี้ได้โดยตรง</li>
          </ul>
          <p>ทั้งสองวิธีมีความชัดเจนและได้รับการบันทึกหลักฐานเสมอ ไม่มีทางลัดที่เงียบงัน และ AI เอเจนต์จะไม่มีสิทธิ์ยกเว้นข้อค้นพบที่ตัวเองสร้างขึ้นได้โดยพลการ</p>
        `
      },
      {
        id: 'where-findings-end-up',
        title: 'ปลายทางในการจัดเก็บ Findings (Where findings end up)',
        contentHtml: `
          <p>เมื่อรันคำสั่ง <code>complete</code> สำเร็จ ระบบจะผนวกข้อค้นพบที่คลี่คลายแล้ว (<code>closed</code>, <code>accepted</code>, <code>invalid</code>) เข้าสู่ History Archive เดียวกันกับชิ้นงานนั้นใน <code>devflow/history/</code></p>
          <p>สเปก, หลักฐานการตรวจรับ, และทุกประเด็นที่ถูกทักท้วงจะรวมอยู่ในเอกสารฉบับเดียว ส่วนข้อค้นพบระดับรองที่ยังไม่คลี่คลายจะคงอยู่ในสมุดบัญชีปัจจุบันพร้อมรหัส ID เดิม ทำให้ไม่มีข้อค้นพบใดถูกทิ้งหายไปโดยไม่รู้ตัว</p>
        `
      },
      {
        id: 'the-rule-that-keeps-reviews-honest',
        title: 'กฎสำคัญที่ทำให้การรีวิวโปร่งใสและตรงไปตรงมา (The rule that keeps reviews honest)',
        contentHtml: `
          <p>สมุดบัญชี (Ledger) ทำหน้าที่รายงานสถานะ แต่จะไม่เป็นตัวกำหนดขอบเขตการมองเห็นของการรีวิว</p>
          <p>ทุกรอบของการรัน <code>/audit</code> จะทำการตรวจทานโค้ดอย่างสดใหม่ (Fresh Review) ทั่วทั้งขอบเขต จากนั้นจึงอัปเดตสมุดบัญชีตามสิ่งที่ค้นพบจริง</p>
          <div class="note-box">
            <strong>หลักการตรวจสอบ:</strong> การนำเฉพาะรายการข้อค้นพบที่เปิดอยู่มาเป็น Checklist แล้วตรวจเช็คเฉพาะจุดเหล่านั้น คือช่องโหว่ที่ทำให้บั๊กที่เกิดจากการแก้ไขโค้ดหลุดรอดสู่ Production ได้โดยไม่รู้ตัว
          </div>
        `
      },
      {
        id: 'older-installs',
        title: 'การรองรับโปรเจกต์เดิม (Older installs)',
        contentHtml: `
          <p>ไฟล์สมุดบัญชีเป็นไฟล์ที่ผู้ใช้เป็นเจ้าของและได้รับการปกป้องโดยตัวอัปเดต สกิล <code>/audit</code> และ <code>/complete</code> สามารถสร้างไฟล์นี้ขึ้นมาใหม่โดยอัตโนมัติในการเรียกใช้งานครั้งแรกสำหรับโปรเจกต์เวอร์ชันเก่า</p>
          <p>การไม่มีไฟล์สมุดบัญชีจะไม่บล็อกการ Complete แต่หากไฟล์มีรูปแบบที่เสียหาย (Malformed) หรือมี Path ที่ไม่ปลอดภัย จะบล็อกความพร้อมในการทำงานและนำทางไปที่คำสั่ง <code>/doctor</code> เพื่อวินิจฉัยแก้ไข</p>
        `
      }
    ]
  }
];
