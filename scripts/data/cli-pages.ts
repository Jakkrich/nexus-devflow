import type { DocPage } from '../build-docs-site.js';

export const CLI_PAGES: DocPage[] = [
  // 1. CLI Overview
  {
    slug: 'cli',
    category: 'CLI',
    title: 'CLI Overview (ภาพรวมเครื่องมือ CLI)',
    lead: 'ชุดเครื่องมือคำสั่งบรรทัด (CLI) สำหรับติดตั้ง ตรวจสอบสถานะ และจัดการ DevFlow ในเครื่อง',
    pills: ['CLI', 'Overview', 'Terminal', 'ZeroLatency', 'Commands'],
    sections: [
      {
        id: 'overview',
        title: 'ภาพรวมคำสั่ง CLI ทั้งหมด',
        contentHtml: `
          <p>Nexus-DevFlow มาพร้อมกับ CLI Helper ในตัวที่คุณสามารถเรียกใช้งานได้ผ่าน <code>npx nexus-devflow</code> หรือคำสั่งในโปรเจกต์:</p>
          <pre><code># ติดตั้งหรือ Overlay DevFlow เข้าสู่โปรเจกต์
npx nexus-devflow

# ดูสถานะความคืบหน้าของงานปัจจุบันผ่าน Terminal
npx nexus-devflow status

# ตรวจสอบขนาด Byte-budget ของ Skill ทุกตัว
npm run check:budgets

# ตรวจสอบความสมบูรณ์ของโครงสร้าง DevFlow ในโปรเจกต์
npm run check</code></pre>
        `
      },
      {
        id: 'cli-flags',
        title: 'Options และ Flags ที่รองรับ',
        contentHtml: `
          <table>
            <thead><tr><th>Flag</th><th>ความหมาย</th><th>ตัวอย่างการใช้งาน</th></tr></thead>
            <tbody>
              <tr><td><code>-y, --yes</code></td><td>ตอบรับการยืนยันอัตโนมัติ (Non-interactive mode)</td><td><code>npx nexus-devflow -y</code></td></tr>
              <tr><td><code>--json</code></td><td>ส่งออกผลลัพธ์ของคำสั่งในรูปแบบ JSON สำหรับ CI/CD</td><td><code>npx nexus-devflow status --json</code></td></tr>
            </tbody>
          </table>
        `
      }
    ]
  },

  // 2. Status CLI
  {
    slug: 'cli/status',
    category: 'CLI',
    title: 'CLI Status (การตรวจเช็กสถานะผ่าน Terminal)',
    lead: 'เรียกดูสรุปความคืบหน้าของ Build Plan, งานที่กำลังดำเนินการใน Task Context, และสถานะ Git ผ่าน Terminal โดยใช้เวลา 0ms',
    pills: ['CLI', 'Status', 'Terminal', 'GitState', 'Progress', 'ZeroTokenOverhead'],
    sections: [
      {
        id: 'status-command',
        title: 'การเรียกใช้งานคำสั่ง Status',
        contentHtml: `
          <p>รันคำสั่งตรวจสอบสถานะผ่าน Terminal:</p>
          <pre><code>npx nexus-devflow status</code></pre>
          <p>ผลลัพธ์จะแสดงตารางสรุปที่อ่านง่าย ประกอบด้วย:</p>
          <ul>
            <li><strong>Build Plan Progress</strong>: ความคืบหน้าของฟีเจอร์ทั้งหมด (เช่น 4 / 10 Completed - 40%)</li>
            <li><strong>Active Task</strong>: ฟีเจอร์ที่กำลังทำอยู่, รหัสงาน, และสถานะขั้นตอน (<code>feature</code>, <code>implement</code>, <code>check</code>)</li>
            <li><strong>Git Branch & Working Tree</strong>: Branch ปัจจุบันและสถานะการเปลี่ยนแปลงที่ยังไม่ได้ Commit</li>
          </ul>
        `
      },
      {
        id: 'json-output',
        title: 'การส่งออกสถานะแบบ JSON สำหรับ Scripting',
        contentHtml: `
          <p>สามารถส่งออกข้อมูลเป็น JSON เพื่อนำไปเขียนสคริปต์หรือเชื่อมต่อกับเครื่องมือภายนอกได้:</p>
          <pre><code>npx nexus-devflow status --json</code></pre>
        `
      }
    ]
  }
];
