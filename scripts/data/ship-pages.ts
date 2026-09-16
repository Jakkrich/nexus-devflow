import type { DocPage } from '../build-docs-site.js';

export const SHIP_PAGES: DocPage[] = [
  // 1. Release Readiness
  {
    slug: 'release-readiness',
    category: 'SHIP',
    title: 'Release Readiness (ความพร้อมก่อนขึ้น Production)',
    lead: 'แนวปฏิบัติและชุดการตรวจสอบความพร้อมก่อนส่งมอบซอฟต์แวร์สู่ Production บนแพลตฟอร์ม Render, Vercel และ Docker',
    pills: ['Ship', 'Release', 'Production', 'Vercel', 'Render', 'Docker', 'HealthCheck'],
    sections: [
      {
        id: 'readiness-checklist',
        title: 'จุดตรวจความพร้อม 5 ด้าน (Production Readiness Checklist)',
        contentHtml: `
          <p>ก่อนนำแอปพลิเคชันขึ้นสู่สภาพแวดล้อม Production ให้รันคำสั่ง <code>/release</code> เพื่อตรวจความพร้อมใน 5 ด้านหลัก:</p>
          <ul>
            <li><strong>1. Production Build Validation</strong>: คอมไพล์ Production Bundle ในเครื่องเพื่อยืนยันว่าไม่มี Error หรือ Type mismatch</li>
            <li><strong>2. Platform Deployment Configs</strong>: ตรวจสอบความถูกต้องของ <code>vercel.json</code>, <code>render.yaml</code>, <code>Dockerfile</code>, หรือ <code>docker-compose.yml</code></li>
            <li><strong>3. Environment Variables & Secret Scanning</strong>: ตรวจสอบความครบถ้วนของ <code>.env.example</code> และยืนยันว่าไม่มี Secrets หรือ API Keys รั่วไหลในโค้ด</li>
            <li><strong>4. Health Check Probes</strong>: ยืนยันการมีอยู่ของ Health Endpoint (เช่น <code>/healthz</code> หรือ <code>/api/health</code>) สำหรับ Liveness / Readiness Probes</li>
            <li><strong>5. Database Migrations & Rollback Plans</strong>: ตรวจสอบว่า Migration Scripts ผ่านการทดสอบแล้วและมีแผนสำรองในกรณีฉุกเฉิน</li>
          </ul>
        `
      },
      {
        id: 'release-command',
        title: 'การใช้งานคำสั่ง /release',
        contentHtml: `
          <pre><code>/release</code></pre>
          <p>AI จะทำการจำลองการ Build ตรวจสอบ Configs และรายงานผลความพร้อมเป็น Checklist ให้คุณทราบก่อนทำการ Deploy จริง</p>
        `
      }
    ]
  },

  // 2. Troubleshooting
  {
    slug: 'troubleshooting',
    category: 'SHIP',
    title: 'Troubleshooting (การแก้ปัญหาและกู้คืนสถานะ)',
    lead: 'คู่มือการแก้ไขปัญหาเมื่อเกิดข้อผิดพลาดในการรันคำสั่ง DevFlow การกู้คืนจาก Workflow Drift และการตรวจสุขภาพระบบด้วย /doctor',
    pills: ['Ship', 'Troubleshoot', 'Doctor', 'Drift', 'Recovery', 'SelfHealing'],
    sections: [
      {
        id: 'common-issues',
        title: 'ปัญหาที่พบบ่อยและวิธีแก้ไข',
        contentHtml: `
          <table>
            <thead><tr><th>ปัญหาที่พบ</th><th>สาเหตุที่เป็นไปได้</th><th>วิธีแก้ไขที่แนะนำ</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>AI ตอบสนองช้า หรือลืมบริบท</strong></td>
                <td>ไฟล์ <code>project-overview.md</code> มีขนาดเกิน 20,000 Bytes (Context Bloat)</td>
                <td>รันคำสั่ง <code>/overview</code> เพื่อคอมไพล์สรุปบริบทให้กระชับใหม่อีกครั้ง</td>
              </tr>
              <tr>
                <td><strong>Slash Commands ไม่ทำงาน</strong></td>
                <td>Tool Adapters ใน <code>.agents/</code> หรือ <code>.claude/</code> สูญหายหรือดัดแปลง</td>
                <td>รันคำสั่ง <code>/doctor</code> หรือสั่ง <code>npx nexus-devflow -y</code> เพื่อซ่อมแซม Adapters</td>
              </tr>
              <tr>
                <td><strong>พบข้อความแจ้งเตือน Workflow Drift</strong></td>
                <td>มีการสลับ Branch หรือแก้ไขไฟล์นอกรอบโดยไม่ได้รันตาม Stage</td>
                <td>รันคำสั่ง <code>/status</code> เพื่อดูสถานะ และใช้ <code>/check</code> หรือ <code>/doctor</code> เพื่อปรับสมดุล</td>
              </tr>
              <tr>
                <td><strong>Test ล้มเหลวและแก้ไม่ผ่าน</strong></td>
                <td>สมมติฐานทางเทคนิคผิด หรือเกิด Bug ซ่อนเร้น</td>
                <td>ใช้คำสั่ง <code>/debug</code> เพื่อทำการวินิจฉัย Root Cause อย่างเป็นวิทยาศาสตร์</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'doctor-healing',
        title: 'การฟื้นฟูระบบอัตโนมัติด้วย /doctor',
        contentHtml: `
          <p>หากพบความผิดปกติใดๆ ให้เริ่มจากการรันคำสั่ง <code>/doctor</code> เสมอ AI จะทำการสแกนและเสนอทางแก้ปัญหาแบบ 1-Click Fix ทันที</p>
          <pre><code>/doctor</code></pre>
        `
      }
    ]
  }
];
