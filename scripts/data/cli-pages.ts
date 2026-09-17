import type { DocPage } from '../build-docs-site.js';

export const CLI_PAGES: DocPage[] = [
  // 1. CLI Overview
  {
    slug: 'cli',
    category: 'CLI',
    title: 'CLI Overview (ภาพรวมเครื่องมือ CLI)',
    lead: 'ชุดเครื่องมือคำสั่งบรรทัด (CLI) สำหรับติดตั้ง ตรวจสอบสถานะ เปิด Live Dashboard และจัดการ DevFlow ในเครื่อง',
    pills: ['CLI', 'Overview', 'Terminal', 'ZeroLatency', 'Dashboard', 'Commands'],
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

# เปิด Live Web Dashboard สำหรับมอนิเตอร์สถานะและ Run Activity
npx nexus-devflow dashboard

# วิเคราะห์การใช้งานและต้นทุน Token (Session Token Analytics)
npm run analyze:tokens

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
              <tr><td><code>--port &lt;number&gt;</code></td><td>กำหนดหมายเลข Port สำหรับ Live Dashboard (ค่าเริ่มต้น: 4173)</td><td><code>npx nexus-devflow dashboard --port 3000</code></td></tr>
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
            <li><strong>Drift Warnings</strong>: แจ้งเตือนความคลาดเคลื่อนหากโค้ดไม่ตรงกับสเปก</li>
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
  },

  // 3. Dashboard CLI
  {
    slug: 'cli/dashboard',
    category: 'CLI',
    title: 'CLI Dashboard (Live Web Dashboard)',
    lead: 'เปิดแดชบอร์ดเว็บมอนิเตอร์สถานะแบบ Real-time เชื่อมต่อผ่าน Local WebSocket พร้อมการตอบสนองความเร็วสูงและใช้ Token 0 หน่วย',
    pills: ['CLI', 'Dashboard', 'RealTime', 'WebSockets', 'ZeroTokens', 'VisualUI'],
    sections: [
      {
        id: 'dashboard-launch',
        title: 'การเปิด Live Dashboard',
        contentHtml: `
          <p>เปิดแดชบอร์ดในเบราว์เซอร์ด้วยคำสั่ง:</p>
          <pre><code>npx nexus-devflow dashboard</code></pre>
          <p>ระบบจะเปิดเบราว์เซอร์อัตโนมัติที่ <code>http://localhost:4173</code> เพื่อแสดงหน้าแดชบอร์ดควบคุมที่สวยงามระดับพรีเมียม</p>
        `
      },
      {
        id: 'dashboard-features',
        title: 'ความสามารถหลักของ Live Dashboard',
        contentHtml: `
          <ul>
            <li><strong>Real-time Stage Tracking</strong>: ติดตามการทำงานของ AI ในแต่ละขั้นตอนแบบวินาทีต่อวินาทีผ่าน WebSocket</li>
            <li><strong>Living Spec Inspector</strong>: เปิดดูและอ่าน <code>spec.md</code>, <code>findings.md</code>, และ <code>stage.md</code> ได้แบบ Interactive</li>
            <li><strong>Quality Gate Visualizer</strong>: แสดงผลสถานะด่านตรวจคุณภาพ (Typecheck, Lint, Tests, Independent Review)</li>
            <li><strong>Zero Token Overhead</strong>: ทำงานบน Local Engine ทั้งหมด ไม่มีการเรียกใช้ LLM Token ใดๆ เพิ่มเติม</li>
          </ul>
        `
      }
    ]
  },

  // 4. Token Analytics CLI (New - Feature 107)
  {
    slug: 'cli/tokens',
    category: 'CLI',
    title: 'Token & Cost Analytics CLI (เครื่องมือวิเคราะห์ต้นทุน Token)',
    lead: 'คำสั่งวิเคราะห์ปริมาณการใช้งาน Token 4 มิติหลัก (Fresh Input, Prompt Cache Write, Cache Read, Output) พร้อมประเมินต้นทุนค่าใช้จ่ายจริง ($ USD) ต่อโมเดล',
    pills: ['CLI', 'TokenAnalytics', 'Cost', 'PromptCaching', 'ROI', 'Pricing', 'Feature107'],
    sections: [
      {
        id: 'token-analytics-usage',
        title: 'การเรียกใช้งาน Token Analytics CLI',
        contentHtml: `
          <p>สามารถรันเครื่องมือวิเคราะห์ Token ได้ทันทีจากโปรเจกต์:</p>
          <pre><code># วิเคราะห์ Session ล่าสุดและแสดงผลตาราง Terminal
npm run analyze:tokens

# ระบุโมเดลเฉพาะเจาะจง (เช่น Claude 3.7 Sonnet, Gemini 2.5 Pro, GPT-4o)
npm run analyze:tokens -- --model claude-3-7-sonnet

# ส่งออกผลลัพธ์เป็น JSON สำหรับรายงานและ CI Analytics
npm run analyze:tokens -- --json</code></pre>
        `
      },
      {
        id: 'token-dimensions',
        title: 'มิติการแจกแจง Token 4 มิติ และการคำนวณ Cache Savings',
        contentHtml: `
          <p>เครื่องมือจะแจกแจง Token ออกเป็น 4 ประเภทที่มีอัตราค่าบริการต่างกันอย่างสิ้นเชิง:</p>
          <table>
            <thead><tr><th>ประเภท Token</th><th>น้ำหนักต้นทุน</th><th>คำอธิบาย</th></tr></thead>
            <tbody>
              <tr><td><strong>Fresh Input Tokens</strong></td><td>1.0x (เต็มราคา)</td><td>Token คำสั่งและบริบทใหม่ที่ยังไม่มีใน Cache</td></tr>
              <tr><td><strong>Prompt Cache Write</strong></td><td>1.25x (ค่าเขียน)</td><td>Token ข้อมูลที่ถูกนำไปสร้างแคชสำหรับการใช้งานซ้ำ</td></tr>
              <tr><td><strong>Prompt Cache Read (Hits)</strong></td><td>0.1x (ประหยัด 90%)</td><td>Token ที่อ่านซ้ำจากแคชเดิม ช่วยประหยัดต้นทุนมหาศาล</td></tr>
              <tr><td><strong>Output Tokens</strong></td><td>5.0x</td><td>Token ผลลัพธ์ที่ AI สร้างและส่งกลับมา</td></tr>
            </tbody>
          </table>
          <div class="note-box">
            <strong>Prompt Caching ROI:</strong> DevFlow ออกแบบให้มีอัตรา <strong>Cache Hit Rate สูงกว่า 85%</strong> ด้วยสถาปัตยกรรม Living Source of Truth (<code>project-overview.md</code>) และ Task-Isolated Contexts ทำให้ประหยัดค่าใช้จ่าย API ได้ถึง 60–80% เมื่อเทียบกับการส่งไฟล์ทั้งหมดซ้ำๆ
          </div>
        `
      },
      {
        id: 'pricing-catalog',
        title: 'ตารางราคาเปรียบเทียบใน Model Pricing Catalog',
        contentHtml: `
          <table>
            <thead><tr><th>โมเดล</th><th>Input ($/M)</th><th>Cache Write ($/M)</th><th>Cache Read ($/M)</th><th>Output ($/M)</th></tr></thead>
            <tbody>
              <tr><td><strong>Claude 3.7 / 3.5 Sonnet</strong></td><td>$3.00</td><td>$3.75</td><td>$0.30</td><td>$15.00</td></tr>
              <tr><td><strong>Claude 3.5 Haiku</strong></td><td>$0.80</td><td>$1.00</td><td>$0.08</td><td>$4.00</td></tr>
              <tr><td><strong>Gemini 2.5 Pro</strong></td><td>$1.25</td><td>$1.25</td><td>$0.31</td><td>$5.00</td></tr>
              <tr><td><strong>Gemini 2.5 Flash</strong></td><td>$0.075</td><td>$0.075</td><td>$0.01875</td><td>$0.30</td></tr>
              <tr><td><strong>GPT-4o</strong></td><td>$2.50</td><td>$2.50</td><td>$1.25</td><td>$10.00</td></tr>
              <tr><td><strong>DeepSeek V3</strong></td><td>$0.14</td><td>$0.14</td><td>$0.014</td><td>$0.28</td></tr>
            </tbody>
          </table>
        `
      }
    ]
  }
];
