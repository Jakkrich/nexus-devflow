import type { DocPage } from '../build-docs-site.js';

export const SHIP_PAGES: DocPage[] = [
  // 1. Release Readiness
  {
    slug: 'release-readiness',
    category: 'SHIP',
    title: 'Release Readiness & Framework Process (การเตรียมความพร้อมและการ Release)',
    lead: 'เตรียมความพร้อมของโปรเจกต์สำหรับ Render / Vercel และคู่มือขั้นตอนการ Release สำหรับ Framework Maintainers ตามหลัก Semver',
    pills: ['Ship', 'Guide', 'Release', 'Maintainers', 'Validation', 'Render', 'Vercel', 'Production'],
    sections: [
      {
        id: 'framework-release-process',
        title: 'Framework Release Process (ขั้นตอนการ Release สำหรับ Maintainers)',
        contentHtml: `
          <p>คู่มือสำหรับ Maintainer ในการตรวจสอบและเตรียม Release เวอร์ชันใหม่ของ Nexus-DevFlow:</p>
          <pre><code># 1. รันชุดการทดสอบและตรวจสอบความสมบูรณ์ 100% จาก Root
npm run check
npm run check:static
npm test
npm run test:package

# 2. ทดสอบความสะอาดของการอัปเดต Overlay Package
npx @jakkrichm/create-nexus-devflow update --dry-run</code></pre>
          <table>
            <thead><tr><th>ประเภทการ Release (Semver)</th><th>นโยบายการ Commit & Git Tags</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Internal Maintenance / Doc Tweaks</strong></td>
                <td>Commit ตรงเข้า <code>main</code> โดย<strong>ไม่ต้องสร้าง Git Tag</strong></td>
              </tr>
              <tr>
                <td><strong>Package Release (<code>v2.x.x</code>)</strong></td>
                <td>สร้าง Annotated Git Tag (เช่น <code>git tag -a v2.17.6 -m "Release v2.17.6"</code>) และ Push ขึ้น <code>origin main --tags</code> เพื่อทริกเกอร์ GitHub Actions NPM Publishing</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'start-from-a-green-project',
        title: 'เริ่มต้นจากสถานะโปรเจกต์ที่ผ่านการทดสอบสมบูรณ์ (Start from a green project)',
        contentHtml: `
          <p>ทำฟีเจอร์ที่เกี่ยวข้องให้เสร็จสมบูรณ์และแก้ไขข้อผิดพลาดจากการตรวจสอบ (Check Failures) ที่ทราบทั้งหมดก่อนเริ่มจัดเตรียมการตั้งค่าสำหรับ Cloud Provider</p>
          <p>รันคำสั่ง Verify มาตรฐานที่บันทึกไว้ในโปรเจกต์ (เช่น <code>npm run check</code> หรือ <code>npm test</code>) เพื่อยืนยันว่าโปรเจกต์อยู่ในสถานะสีเขียว (Green)</p>
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
        `
      },
      {
        id: 'review-the-readiness-packet',
        title: 'ตรวจทานแพ็กเกจความพร้อม (Review the readiness packet)',
        contentHtml: `
          <p>เมื่อรันคำสั่งสำเร็จ AI จะสรุปรายงาน <strong>Readiness Packet</strong> ให้คุณตรวจทานความถูกต้องในประเด็นสำคัญก่อนส่งมอบ:</p>
          <ul>
            <li><strong>คำสั่ง Production Build และ Start</strong>: ตรวจสอบความถูกต้องของคำสั่ง Build (เช่น <code>npm run build</code>) และ Start</li>
            <li><strong>Output Directory หรือ Runtime Type</strong>: ตรวจสอบไดเรกทอรีผลลัพธ์ (เช่น <code>dist/</code>, <code>build/</code>, <code>out/</code>, <code>public/</code>)</li>
            <li><strong>Environment Variable Names</strong>: ตรวจสอบรายชื่อตัวแปรสภาพแวดล้อมที่จำเป็นทั้งหมด (โดยจะไม่มีการบันทึก Secret Values เด็ดขาด)</li>
            <li><strong>Health Checks</strong>: ตรวจสอบเส้นทาง Health Path (เช่น <code>/healthz</code>, <code>/api/health</code>)</li>
          </ul>
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
            <li><strong>OpenCode</strong>: สามารถเรียกใช้ไฟล์ทักษะที่เข้ากันได้จาก <code>.agents/skills/</code> หรือ <code>.claude/skills/</code> ได้โดยตรง</li>
          </ul>
          <p>หากคุณเพิ่งติดตั้งหรืออัปเดตชุดทักษะในขณะที่เซสชันของ AI เอเจนต์เปิดอยู่แล้ว ให้ทำการ <strong>Restart เซสชันของ AI เอเจนต์</strong> ในโปรเจกต์นั้น</p>
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
      }
    ]
  }
];
