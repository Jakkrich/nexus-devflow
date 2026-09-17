import type { DocPage } from '../build-docs-site.js';

export const SHIP_PAGES: DocPage[] = [
  // 1. Release Readiness
  {
    slug: 'release-readiness',
    category: 'SHIP',
    title: 'Release Readiness (การเตรียมความพร้อมก่อนขึ้น Production)',
    lead: 'เตรียมความพร้อมของโปรเจกต์ที่เสร็จสมบูรณ์สำหรับ Render หรือ Vercel โดยยังคงรักษาขอบเขตการอนุมัติความปลอดภัยก่อนการ Deployment ไว้อย่างเคร่งครัด',
    pills: ['Ship', 'Guide', 'Release', 'Render', 'Vercel', 'Production', 'HealthCheck'],
    sections: [
      {
        id: 'start-from-a-green-project',
        title: 'เริ่มต้นจากสถานะโปรเจกต์ที่ผ่านการทดสอบสมบูรณ์ (Start from a green project)',
        contentHtml: `
          <p>ทำฟีเจอร์ที่เกี่ยวข้องให้เสร็จสมบูรณ์และแก้ไขข้อผิดพลาดจากการตรวจสอบ (Check Failures) ที่ทราบทั้งหมดก่อนเริ่มจัดเตรียมการตั้งค่าสำหรับ Cloud Provider</p>
          <p>รันคำสั่ง Verify มาตรฐานที่บันทึกไว้ในโปรเจกต์ (เช่น <code>npm run check</code> หรือ <code>npm test</code>) หากโปรเจกต์ยังไม่ได้ตั้งค่า Verify ไว้ ให้รัน Production Build และชุดการทดสอบที่กำหนดค่าไว้แยกต่างหากเพื่อยืนยันว่าโปรเจกต์อยู่ในสถานะสีเขียว (Green)</p>
        `
      },
      {
        id: 'run-release-locally',
        title: 'รันคำสั่ง Release ในเครื่อง (Run release locally)',
        contentHtml: `
          <p>เรียกใช้คำสั่งผ่านสัญลักษณ์ที่รองรับตามเครื่องมือ AI ของคุณ:</p>
          <pre><code># Claude Code / Antigravity / Gemini CLI
/release render
/release vercel

# OpenAI Codex CLI
$release render
$release vercel</code></pre>
          <p>เวิร์กโฟลว์ของสกิล <code>/release</code> จะสแกนและตรวจสอบโครงสร้างโปรเจกต์ (Tech Stack, Framework, Runtime, Dependencies) และสร้างหรือปรับแต่งเฉพาะไฟล์ Configuration ในเครื่อง (Local Configuration) ที่ Provider นั้นต้องการ เช่น <code>render.yaml</code> หรือ <code>vercel.json</code> โดยไม่ส่งผลกระทบต่อสภาพแวดล้อมจริง</p>
          <p><strong>ขอบเขตและอ็อปชันของคำสั่ง (Command Scopes):</strong></p>
          <ul>
            <li><strong>ไม่ระบุอาร์กิวเมนต์ (<code>/release</code>)</strong>: AI จะสแกนโปรเจกต์และแนะนำ Provider ที่เหมาะสมที่สุด (Render หรือ Vercel) หรือสอบถามความต้องการหากรูปแบบไม่ชัดเจน</li>
            <li><strong><code>/release render</code></strong>: จัดเตรียมความพร้อมและสร้างคอนฟิกสำหรับ Render (รองรับ Static Site, Web Service, Background Worker, Cron Job และ Database Pair)</li>
            <li><strong><code>/release vercel</code></strong>: จัดเตรียมความพร้อมและสร้างคอนฟิกสำหรับ Vercel (รองรับ Frontend Framework, Serverless Functions, Static Output และ Monorepo)</li>
            <li><strong><code>/release check</code></strong>: ออกรายงานประเมินความพร้อมในการ Deploy แบบ Read-Only โดยไม่แก้ไขไฟล์</li>
            <li><strong><code>/release config</code></strong>: มุ่งเน้นการสร้างหรืออัปเดตไฟล์คอนฟิกในเครื่องโดยเฉพาะ</li>
          </ul>
        `
      },
      {
        id: 'review-the-readiness-packet',
        title: 'ตรวจทานแพ็กเกจความพร้อม (Review the readiness packet)',
        contentHtml: `
          <p>เมื่อรันคำสั่งสำเร็จ AI จะสรุปรายงาน <strong>Readiness Packet</strong> ให้คุณตรวจทานความถูกต้องในประเด็นสำคัญก่อนส่งมอบ:</p>
          <ul>
            <li><strong>คำสั่ง Production Build และ Start</strong>: ตรวจสอบความถูกต้องของคำสั่ง Build (เช่น <code>npm run build</code>) และ Start (เช่น <code>npm start</code>, Node หรือ Docker entrypoint)</li>
            <li><strong>Output Directory หรือ Runtime Type</strong>: ตรวจสอบไดเรกทอรีผลลัพธ์ (เช่น <code>dist/</code>, <code>build/</code>, <code>out/</code>, <code>public/</code>) หรือเวอร์ชันของ Node/Python ที่ระบุ</li>
            <li><strong>Environment Variable Names</strong>: ตรวจสอบรายชื่อตัวแปรสภาพแวดล้อมที่จำเป็นทั้งหมด (โดยจะระบุเฉพาะชื่อตัวแปร และไม่มีการพิมพ์หรือบันทึก Secret Values เด็ดขาด)</li>
            <li><strong>Database Migration หรือ Release-Phase Commands</strong>: ตรวจสอบคำสั่ง Migration ฐานข้อมูลในขั้นตอน Release Phase เมื่อมีฐานข้อมูลเชื่อมต่อ</li>
            <li><strong>Health Checks และ Routing Probes</strong>: ตรวจสอบเส้นทาง Health Path (เช่น <code>/healthz</code>, <code>/api/health</code>) และพฤติกรรมการทำงานของเซอร์วิส</li>
            <li><strong>Manual Remote Setup</strong>: รายการขั้นตอนการตั้งค่าบน Cloud Dashboard ที่ยังคงต้องดำเนินการด้วยตนเอง</li>
          </ul>
        `
      },
      {
        id: 'deployment-stays-separate',
        title: 'การ Deploy ยังคงแยกออกจากการเตรียมความพร้อม (Deployment stays separate)',
        contentHtml: `
          <div class="note-box">
            <strong>หลักการความปลอดภัย Zero-Deploy อัตโนมัติ:</strong> การเตรียมความพร้อม (Readiness) <strong>ไม่ได้เป็นการอนุญาตให้ทำการ Deploy</strong> แต่อย่างใด
          </div>
          <p>การสร้าง Cloud Services บนรีโมต, การเชื่อมโยง Git Repository กับ Provider, การตั้งค่าค่า Secret และ Environment Variables จริง และการสั่ง Publish โค้ดขึ้นสู่ Production จะต้องผ่านการตัดสินใจและอนุมัติอย่างชัดเจนจากนักพัฒนาเสมอ</p>
        `
      }
    ]
  },

  // 2. Troubleshooting
  {
    slug: 'troubleshooting',
    category: 'SHIP',
    title: 'Troubleshooting (การแก้ไขปัญหาและข้อผิดพลาด)',
    lead: 'วินิจฉัยและแก้ไขปัญหาที่พบบ่อยในการติดตั้ง, การค้นหา (Discovery), การวางแผน, ปัญหา Git Branch และข้อผิดพลาดในขั้นตอน Verification',
    pills: ['Troubleshoot', 'Doctor', 'Diagnostics', 'Errors', 'Recovery', 'Git', 'Verification'],
    sections: [
      {
        id: 'a-skill-does-not-appear',
        title: 'ทักษะ (Skill) ไม่ปรากฏในรายการคำสั่ง (A skill does not appear)',
        contentHtml: `
          <p>ตรวจสอบว่าโปรเจกต์ของคุณมีโฟลเดอร์ Tool Adapter ที่ตรงกับ AI Tool ที่กำลังใช้งานอยู่หรือไม่:</p>
          <ul>
            <li><strong>OpenAI Codex, Google Antigravity และ GitHub Copilot</strong>: ใช้โฟลเดอร์ทักษะ <code>.agents/skills/</code></li>
            <li><strong>Claude Code</strong>: ใช้โฟลเดอร์ทักษะ <code>.claude/skills/</code></li>
            <li><strong>OpenCode</strong>: สามารถเรียกใช้ไฟล์ทักษะที่เข้ากันได้จาก <code>.agents/skills/</code> หรือ <code>.claude/skills/</code> ได้โดยตรง จึงไม่จำเป็นต้องสร้างโฟลเดอร์ <code>.opencode/skills/</code> ซ้ำซ้อน</li>
          </ul>
          <p>หากคุณเพิ่งติดตั้งหรืออัปเดตชุดทักษะในขณะที่เซสชันของ AI เอเจนต์เปิดอยู่แล้ว ให้ทำการ <strong>Restart เซสชันของ AI เอเจนต์</strong> ในโปรเจกต์นั้น เพื่อให้ตัวโปรแกรมโหลดแค็ตตาล็อกคำสั่งและบริบทเริ่มต้นใหม่อีกครั้ง</p>
        `
      },
      {
        id: 'update-reports-managed-file-conflicts',
        title: 'คำสั่ง Update รายงานข้อขัดแย้งของไฟล์ Managed (Update reports managed file conflicts)',
        contentHtml: `
          <p>ให้รันคำสั่งจำลองล่วงหน้าเพื่อตรวจสอบรายการเส้นทางไฟล์ที่มีข้อขัดแย้ง:</p>
          <pre><code>npx nexus-devflow@latest update --dry-run</code></pre>
          <p>ข้อขัดแย้ง (Conflict) หมายความว่าไฟล์ทักษะที่ DevFlow ดูแลมีเนื้อหาแตกต่างจากเวอร์ชันที่บันทึกไว้ใน <code>devflow/.state/manifest.json</code> (เช่น มีการแก้ไขโค้ดทักษะเอง) หรือโปรเจกต์เดิมไม่มีข้อมูล Baseline ใน Manifest</p>
          <p>วิธีแก้ปัญหาคือให้รันคำสั่ง <code>update</code> ปกติใน Interactive Terminal เพื่อให้ระบบถามยืนยันการสำรองข้อมูลเก่าและแทนที่ด้วยเวอร์ชันใหม่ หรือหากรันในระบบอัตโนมัติ (Non-interactive) ให้ระบุแฟล็ก <code>--force</code> เฉพาะเมื่อคุณตั้งใจจะสำรองและเขียนทับไฟล์เหล่านั้นจริงๆ</p>
          <div class="note-box">
            <strong>ขอบเขตความปลอดภัย:</strong> ไฟล์แผนงาน (<code>project-plan.md</code>, <code>build-plan.md</code>), บริบท (<code>devflow/context/</code>), ประวัติ (<code>devflow/history/</code>), <code>AGENTS.md</code> และ <code>CLAUDE.md</code> อยู่นอกขอบเขตของตัวอัปเดตและจะไม่ถูกแตะต้อง 100%
          </div>
        `
      },
      {
        id: 'overview-refuses-to-run',
        title: 'คำสั่ง Overview ปฏิเสธการทำงาน (Overview refuses to run)',
        contentHtml: `
          <p>คำสั่ง <code>/overview</code> ทำหน้าที่เป็น Deterministic Compiler ที่เข้มงวด หากปฏิเสธการรัน ให้ตรวจสอบและแทนที่ข้อความตัวอย่าง (Template Placeholders) ใน <code>devflow/project-plan.md</code> ด้วยการตัดสินใจทางสถาปัตยกรรมและผลลัพธ์ฟีเจอร์จริงของโปรเจกต์</p>
          <p>สกิล <code>/overview</code> จะจัดรูปแบบรายการฟีเจอร์ที่ชัดเจนให้กลายเป็น Checkbox ใน <code>devflow/build-plan.md</code> โดยอัตโนมัติ ทั้งนี้หากไฟล์ Build Plan ยังไม่มีอยู่หรือมีเพียงโครงสร้างว่าง ให้ตรวจสอบและอนุมัติร่าง Checklist ที่คำสั่งเสนอจาก Project Plan ก่อนดำเนินการต่อ</p>
        `
      },
      {
        id: 'implement-says-there-is-no-spec',
        title: 'คำสั่ง Implement แจ้งว่าไม่พบไฟล์สเปก (Implement says there is no spec)',
        contentHtml: `
          <p>คำสั่ง <code>/implement</code> ต้องการ Living Spec ที่ผ่านการอนุมัติแล้วก่อนลงมือเขียนโค้ดเสมอ หากพบข้อผิดพลาดนี้ ให้รันคำสั่งสร้างสเปกที่ตรงกับประเภทของงานก่อน:</p>
          <ul>
            <li><strong><code>/feature [id]</code></strong>: สำหรับฟีเจอร์ใหม่ตามแผนงานใน Build Plan (เช่น <code>/feature 1</code>)</li>
            <li><strong><code>/fix</code></strong>: สำหรับงานแก้ไขบั๊กเร่งด่วนหรือการเปลี่ยนแปลงย่อยที่ไม่ได้อยู่ในแผนงาน</li>
            <li><strong><code>/rollback &lt;id&gt;</code></strong>: สำหรับการย้อนกลับฟีเจอร์ที่เคยส่งมอบไปแล้ว</li>
          </ul>
          <p>เมื่อรันคำสั่งดังกล่าว AI จะสร้างไฟล์ <code>devflow/context/{xxx-slug}/spec.md</code> พร้อมเกณฑ์ Done-when และ Task Checklist ให้คุณตรวจสอบ เมื่ออนุมัติแล้วจึงค่อยรัน <code>/implement</code></p>
        `
      },
      {
        id: 'git-blocks-the-workflow',
        title: 'Git ขัดขวางหรือบล็อกการทำงานของเวิร์กโฟลว์ (Git blocks the workflow)',
        contentHtml: `
          <p>Nexus-DevFlow กำหนดให้การพัฒนาทำงานอยู่บน Git Repository และต้องอยู่บน Branch เฉพาะงาน เช่น <code>feature/{xxx-slug}</code>, <code>fix/{xxx-slug}</code> หรือ <code>rollback/{xxx-slug}</code></p>
          <p>หากมี Working-tree changes ที่ไม่เกี่ยวข้องค้างอยู่ ให้ Commit, Stash หรือจัดการให้เรียบร้อยก่อนเริ่มรันงานเวิร์กโฟลว์อัตโนมัติ และ<strong>ห้ามสั่ง Discard หรือล้างการเปลี่ยนแปลงทิ้งเพียงเพื่อให้เวิร์กโฟลว์ทำงานได้เด็ดขาด</strong> เพื่อป้องกันการสูญหายของโค้ดที่มีค่า</p>
        `
      },
      {
        id: 'rollback-reports-a-dependency-or-patch-conflict',
        title: 'คำสั่ง Rollback รายงานข้อขัดแย้งเรื่อง Dependency หรือ Patch (Rollback reports a dependency or patch conflict)',
        contentHtml: `
          <p>เมื่อคำสั่ง <code>/rollback</code> รายงานข้อขัดแย้ง ให้อ่านรายละเอียดของ Commit หลังจากนั้นและเส้นทางไฟล์ที่แชร์ร่วมกันตามที่ระบุในรายงานอย่างละเอียด</p>
          <p><strong>ข้อควรระวัง:</strong> ห้ามบังคับ Force Patch, ห้ามสั่ง Git Reset และห้ามแอบรวบเอาฟีเจอร์อื่นเข้ามาร่วมใน Rollback โดยไม่ผ่านการวางแผน</p>
          <p>แนวทางแก้ไขที่ถูกต้องคือ: ให้ตรวจสอบว่าการแก้ไขเพื่อความเข้ากันได้ (Compatibility Edit) มีระบุไว้ใน Rollback Spec แล้วหรือไม่ หากมีให้อนุมัติ แต่หากเป็นข้อขัดแย้งเชิงโครงสร้าง ให้หยุดการทำงานและวางแผนย้อนกลับฟีเจอร์ที่เกี่ยวเนื่องกันแยกต่างหาก</p>
        `
      },
      {
        id: 'build-passes-but-behavior-is-wrong',
        title: 'โค้ด Build ผ่านแต่พฤติกรรมการทำงานไม่ถูกต้อง (Build passes but behavior is wrong)',
        contentHtml: `
          <p>การที่โค้ดคอมไพล์หรือ Build ผ่าน ไม่ได้เป็นเครื่องยืนยันว่าฟีเจอร์ทำงานถูกต้องตาม Business Logic ที่ต้องการ</p>
          <p>ให้รันคำสั่ง <strong><code>/check</code></strong> เพื่อทดสอบแอปพลิเคชันจริงเทียบกับเกณฑ์ Done-when ในสเปก โดยใช้หลักฐานเชิงประจักษ์ (Empirical Evidence) เช่น:</p>
          <ul>
            <li>การทดสอบบน Browser จริงผ่าน Playwright หรือ MCP <code>browseros-neo</code> (<code>/tests browser</code>)</li>
            <li>การทดสอบเรียกคำสั่ง CLI หรือ API Endpoints จริง</li>
          </ul>
          <p>หากต้องการคู่มือสำหรับมนุษย์คลิกทดสอบทีละสเต็ป สามารถรัน <code>/check guide</code> (หรือ <code>/check guide latest</code>) เพื่อดูขั้นตอนการทดสอบอย่างละเอียด</p>
        `
      },
      {
        id: 'verify-and-github-run-different-checks',
        title: 'คำสั่ง Verify ในเครื่องกับ GitHub Actions รันการทดสอบไม่ตรงกัน (Verify and GitHub run different checks)',
        contentHtml: `
          <p>ให้รันคำสั่ง <strong><code>/doctor</code></strong> เพื่อตรวจสอบความสอดคล้องระหว่าง <code>AGENTS.md</code>, คำสั่ง Verify ของโปรเจกต์ และไฟล์ <code>.github/workflows/verify.yml</code></p>
          <p>จากนั้นรันคำสั่ง <strong><code>/ci</code></strong> (หรือ <code>$ci</code>) เพื่อตรวจสอบและปรับให้คำสั่ง Verify ในเครื่องกับ GitHub Actions รันชุดการตรวจสอบเดียวกัน (Typecheck ➔ Tests ➔ Build) ทั้งนี้เวิร์กโฟลว์เดิมจะได้รับการปกป้อง และการเปลี่ยนแปลง CI จะต้องผ่านการรีวิวเสมอ</p>
          <p>หากคำสั่ง Verify ล้มเหลวในเครื่อง ให้แก้ไข Typecheck, Unit Test หรือ Build ที่ผิดพลาด <strong>ห้ามลบคำสั่งตรวจสอบที่ถูกต้องออกเพียงเพื่อให้ CI บน GitHub เป็นสีเขียวเด็ดขาด</strong></p>
        `
      },
      {
        id: 'the-github-check-is-not-required-before-merge',
        title: 'การตรวจสอบบน GitHub ไม่ได้ถูกบังคับก่อนการ Merge (The GitHub check is not required before merge)',
        contentHtml: `
          <p>คำสั่ง <code>/ci</code> ทำหน้าที่สร้างและจัดระเบียบไฟล์ GitHub Actions Workflow ในเครื่องเท่านั้น แต่จะ<strong>ไม่ Push ขึ้นรีโมตและไม่แก้ไขการตั้งค่า Repository บน GitHub</strong> โดยอัตโนมัติ</p>
          <p>การนำ Workflow ขึ้นสู่ GitHub ต้องผ่านการอนุมัติและ Push โดยมนุษย์ และการตั้งค่าให้ระบบต้องผ่านการตรวจสอบ CI ก่อนอนุญาตให้ Merge (Required Status Checks) เป็นสิทธิ์ในการเลือกตั้งค่าผ่าน <strong>GitHub Rulesets</strong> หรือ <strong>Branch Protection Rules</strong> บนหน้าเว็บ GitHub ของคุณ</p>
        `
      },
      {
        id: 'setup-still-feels-wrong',
        title: 'ยังรู้สึกว่าการตั้งค่าระบบมีความผิดปกติ (Setup still feels wrong)',
        contentHtml: `
          <p>หากรู้สึกว่ามีบางอย่างผิดปกติหรือไม่แน่ใจในความสมบูรณ์ของระบบ ให้รันคำสั่ง <strong><code>/doctor</code></strong> เพื่อขอรับรายงานการตรวจสุขภาพระบบแบบ Read-Only:</p>
          <pre><code>/doctor</code></pre>
          <p>สกิล <code>/doctor</code> จะทำการสแกนไฟล์ทั้งหมด, ตรวจสอบความสมบูรณ์ของ Adapters, ตรวจสอบคำสั่งใน <code>AGENTS.md</code>, ยืนยันความสอดคล้องของ CI, ตรวจสอบความพร้อมของแผนงาน, ประเมินความสดใหม่และขนาดของ Overview (< 20KB) และแจ้งเตือน Workflow Drift พร้อมเสนอแนวทางแก้ไขที่ปลอดภัย</p>
        `
      },
      {
        id: 'npm-reports-ebaddevengines-in-a-pnpm-project',
        title: 'คำสั่ง npm แจ้งเตือนข้อผิดพลาด EBADDEVENGINES ในโปรเจกต์ pnpm (npm reports EBADDEVENGINES in a pnpm project)',
        contentHtml: `
          <p>หากคุณพบข้อผิดพลาดที่ระบุว่าโปรเจกต์บังคับใช้ <code>pnpm</code> แต่คำสั่งปัจจุบันคือ <code>npm</code> หรือ <code>npx</code> แสดงว่าโครงสร้างโปรเจกต์ของคุณมีนโยบาย Dev Engines ปฏิเสธการทำงานของ <code>npx</code> ก่อนที่ DevFlow จะเริ่มทำงาน</p>
          <p>วิธีแก้ปัญหาคือให้รันคำสั่งผ่านตัวรันของ pnpm แทน:</p>
          <pre><code>pnpm dlx nexus-devflow@latest update</code></pre>
          <p>คำสั่งและแฟล็กทั้งหมดสามารถใช้งานร่วมกับ <code>pnpm dlx</code> ได้อย่างสมบูรณ์แบบเช่นเดียวกับ <code>npx</code></p>
        `
      },
      {
        id: 'the-update-runs-an-older-version-or-has-no-adapter-picker',
        title: 'คำสั่ง Update รันเวอร์ชันเก่าหรือไม่มีหน้าต่างเลือก Adapter (The update runs an older version or has no adapter picker)',
        contentHtml: `
          <p>ให้เปรียบเทียบเลขเวอร์ชันที่แสดงในเทอร์มินัลกับ <a href="https://github.com/jakkrichm/nexus-devflow/releases" target="_blank" rel="noopener">GitHub Releases</a> ล่าสุด บางครั้งแคชของ Package Resolution อาจรันเวอร์ชันเก่าแม้จะระบุ <code>@latest</code></p>
          <p>วิธีแก้ไขคือให้ระบุเลขเวอร์ชันที่แน่นอน (Pinned Version) เช่น:</p>
          <pre><code># npm
npx nexus-devflow@1.9.0 update

# pnpm
pnpm dlx nexus-devflow@1.9.0 update</code></pre>
          <p>หน้าต่างเลือก Adapter (Interactive Adapter Picker) จะแสดงผลเมื่อรันใน Interactive Terminal โดยไม่ระบุแฟล็กและไม่มี <code>--yes</code> และหากตัวอัปเดตเวอร์ชันเก่าเสนอให้ Downgrade Global CLI ให้ตอบ <strong>No</strong> เสมอ</p>
        `
      }
    ]
  }
];
