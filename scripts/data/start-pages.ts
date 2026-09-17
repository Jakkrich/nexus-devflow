import type { DocPage } from '../build-docs-site.js';

export const START_PAGES: DocPage[] = [
  // 1. Getting Started
  {
    slug: 'getting-started',
    category: 'START',
    title: 'เริ่มต้นใช้งาน (Getting Started)',
    lead: 'ติดตั้งเลเยอร์เวิร์กโฟลว์ Nexus-DevFlow ลงในโปรเจกต์ที่สร้างโครงร่างไว้แล้ว และเตรียมพร้อมสำหรับการพัฒนาฟีเจอร์แรกผ่านวงจร Task-Isolated Living Spec',
    pills: ['เริ่มต้น', 'คู่มือ', 'ติดตั้ง', 'Onboard'],
    sections: [
      {
        id: 'what-blueprint-adds',
        title: 'สิ่งที่ Nexus-DevFlow เพิ่มเข้ามา (What Blueprint adds)',
        contentHtml: `
          <p>Nexus-DevFlow เป็นเฟรมเวิร์กจัดการเวิร์กโฟลว์การเขียนโค้ดด้วย AI สำหรับแอปพลิเคชันที่คุณได้สร้างโครงร่างไว้แล้ว โดยจะเพิ่มไฟล์วางแผนที่ทนทาน (Durable Plans), Agent Skills ที่มีความเชี่ยวชาญเฉพาะทาง (38+ ทักษะ), และประตูด่านตรวจคุณภาพ (Review Gates) โดยไม่เพิ่มโค้ดแอปพลิเคชันหรือแทนที่แอปพลิเคชันเฟรมเวิร์กของคุณ</p>
          <table>
            <thead>
              <tr>
                <th>เลเยอร์ (Layer)</th>
                <th>หน้าที่และความสำคัญ (Purpose)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Plans (แผนงาน)</strong></td>
                <td>กำหนดสิ่งที่คุณกำลังสร้างและลำดับขั้นตอนการทำงาน (<code>devflow/project-plan.md</code>, <code>devflow/build-plan.md</code>)</td>
              </tr>
              <tr>
                <td><strong>Configuration (การตั้งค่า)</strong></td>
                <td>แชร์นโยบายเวิร์กโฟลว์ที่แน่นอนไปยังทุก Agent Adapter (<code>devflow/config.json</code>)</td>
              </tr>
              <tr>
                <td><strong>Context (บริบทโปรเจกต์)</strong></td>
                <td>ให้ AI Agent ทุกเซสชันเข้าใจบริบทตรงกันแบบ Living Source of Truth (<code>devflow/context/project-overview.md</code>)</td>
              </tr>
              <tr>
                <td><strong>Current feature (ฟีเจอร์ปัจจุบัน)</strong></td>
                <td>รักษาขอบเขตการทำงานที่สร้างได้จริงให้ Active ทีละหนึ่งฟีเจอร์ (<code>devflow/context/{xxx-slug}/</code>)</td>
              </tr>
              <tr>
                <td><strong>History (ประวัติการพัฒนา)</strong></td>
                <td>บันทึกการตัดสินใจและผลลัพธ์ของฟีเจอร์ที่ส่งมอบแล้วอย่างถาวร (<code>devflow/history/</code>)</td>
              </tr>
            </tbody>
          </table>
          <blockquote>
            <p>DevFlow ไม่ใช่ App Starter คุณสามารถเลือกภาษา เฟรมเวิร์ก สถาปัตยกรรม (TypeScript, Go, Python, Rust, PHP, Java) และโครงสร้างพื้นฐานที่ต้องการได้ก่อนอย่างอิสระ 100%</p>
          </blockquote>
        `
      },
      {
        id: 'fresh-project-setup',
        title: 'ขั้นตอนการติดตั้งโปรเจกต์ใหม่ (Fresh project setup)',
        contentHtml: `<p>ปฏิบัติตามขั้นตอนมาตรฐานเพื่อติดตั้งและเริ่มใช้งานเวิร์กโฟลว์เข้าสู่โปรเจกต์ของคุณ:</p>`,
        subsections: [
          {
            id: '1-scaffold-the-application',
            title: '1. สร้างโครงร่างแอปพลิเคชัน (Scaffold the application)',
            contentHtml: `
              <p>ใช้ Stack ที่เหมาะสมกับโปรเจกต์ของคุณ (Astro/Vite เป็นเพียงตัวอย่าง):</p>
              <pre><code><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> create</span><span style="color:#A5D6FF"> astro@latest</span><span style="color:#A5D6FF"> my-app</span>
<span style="color:#79C0FF">cd</span><span style="color:#A5D6FF"> my-app</span>
<span style="color:#FFA657">git</span><span style="color:#A5D6FF"> init</span><span style="color:#8B949E"> # if the scaffolder did not create a repository</span></code></pre>
            `
          },
          {
            id: '2-install-blueprint',
            title: '2. ติดตั้ง Nexus-DevFlow (Install Blueprint)',
            contentHtml: `
              <p>รันตัวติดตั้งในไดเรกทอรีของแอปพลิเคชัน โดยเลือกคำสั่งตาม Package Manager ของโปรเจกต์คุณ:</p>
              <pre><code><span style="color:#8B949E"># npm</span>
<span style="color:#FFA657">npx</span><span style="color:#A5D6FF"> nexus-devflow</span>

<span style="color:#8B949E"># pnpm</span>
<span style="color:#FFA657">pnpm</span><span style="color:#A5D6FF"> dlx</span><span style="color:#A5D6FF"> nexus-devflow</span></code></pre>
              <p>โปรเจกต์ที่บังคับใช้ pnpm ผ่าน <code>devEngines.packageManager</code> สามารถปฏิเสธ <code>npx</code> ด้วย <code>EBADDEVENGINES</code> ก่อนที่ DevFlow จะเริ่ม ให้ใช้ <code>pnpm dlx</code> ในโปรเจกต์ดังกล่าว โดยไม่ต้องลบข้อกำหนด package-manager ออก</p>
              <p>ตัวอย่างคำสั่ง <code>npx nexus-devflow</code> ทั้งหมดยังใช้งานได้กับ <code>pnpm dlx nexus-devflow</code> เช่นกัน</p>
              <p>ตัวติดตั้งแบบโต้ตอบ (Interactive Installer) จะแสดง OpenAI Codex, Claude Code, Google Antigravity, GitHub Copilot และ OpenCode เป็นรายการ Checkbox โดยเลือก Codex และ Claude Code/Antigravity เป็นค่าเริ่มต้น ตัวติดตั้งจะเพิ่มเฉพาะ Adapter Files ที่เข้ากันได้กับเครื่องมือที่คุณเลือก</p>
              <p>ตัวติดตั้งจะสร้าง <code>devflow/.state/manifest.json</code> เพื่อให้การอัปเดตเวอร์ชันในภายหลังสามารถแยกแยะไฟล์ของ DevFlow ออกจากการปรับแต่งของโปรเจกต์ได้</p>
              <p>ก่อนคัดลอกไฟล์ ตัวติดตั้งจะตรวจสอบโฟลเดอร์ปลายทางและหยุดทำงานหากพบ Symbolic Links, ประเภทไฟล์ที่ไม่เข้ากัน หรือเป้าหมายที่อยู่ใต้ไฟล์ปกติ เพื่อความปลอดภัยสูงสุด</p>
              <p>การติดตั้งยังมีตัวเลือกติดตั้ง DevFlow CLI ซึ่งมีคำสั่ง <code>nexus-devflow</code> สำหรับตรวจสอบสถานะโปรเจกต์และเปิด Live Dashboard</p>
            `
          },
          {
            id: '3-onboard-the-project',
            title: '3. ปรับแต่งโปรเจกต์ด้วย Onboard (Onboard the project)',
            contentHtml: `
              <p>รัน <code>$onboard</code> ใน Codex, <code>/onboard</code> ใน Claude Code / Antigravity หรือสั่งให้ Copilot / OpenCode รัน Onboard Skill</p>
              <p>คำสั่งจะตรวจสอบ Stack จริง, คำสั่ง Build/Test, Coding Conventions, Adapters, Ignore rules, Project Configuration และระบบ CI ที่มีอยู่เดิม โดยจะรายงานการตรวจสอบปัจจุบันโดยไม่สร้าง CI ใหม่หรือเปิดใช้ Quality Gates อัตโนมัติโดยพลการ</p>
              <p>การติดตั้งใหม่มีค่าเริ่มต้นเป็นการรีวิวระดับฟีเจอร์ 1 ครั้งและไม่มี Checkpoint Prompt หากต้องการการรีวิวทุกขั้นตอนย่อย ให้ตั้งค่า <code>workflow.stepReview</code> เป็น <code>every</code> และ <code>workflow.checkpointCommits</code> เป็น <code>enabled</code> ใน <code>devflow/config.json</code></p>
              <p>Onboarding จะแสดงตัวเลือกนี้เป็น <strong>Efficient</strong> หรือ <strong>Guided</strong> พร้อมตัวเลือก <strong>Custom</strong> สำหรับปรับแต่งแยกกัน แต่ละรูปแบบยังคงมีตัวเลือก Read-only Code Walkthrough เมื่อพัฒนาเสร็จสิ้นเสมอ</p>
            `
          },
          {
            id: 'optional-add-automatic-github-checks',
            title: 'ทางเลือกเสริม: เพิ่มการตรวจสอบอัตโนมัติบน GitHub (Optional: add automatic GitHub checks)',
            contentHtml: `
              <p>รัน <code>$ci</code> ใน Codex หรือ <code>/ci</code> ใน Claude Code / Antigravity เมื่อคุณต้องการคำสั่ง Verify หนึ่งคำสั่งเฉพาะสำหรับโปรเจกต์และ GitHub Actions Workflow ที่ตรงกัน</p>
              <p>Skill นี้จะใช้เฉพาะการตรวจสอบที่มีอยู่จริงในโปรเจกต์ พิสูจน์สูตรการรันในเครื่องให้ผ่านก่อน และหยุดก่อนที่จะ push หรือแก้ไขกฎบน Remote Repository</p>
              <p>คุณสามารถข้ามขั้นตอนนี้และดำเนินการวางแผนต่อได้ทันที ดูรายละเอียดระบบตรวจสอบทั้งหมดได้ที่ <a href="../testing/">Testing and CI</a></p>
            `
          },
          {
            id: '4-write-the-two-plans-you-own',
            title: '4. เขียนแผนงานที่คุณเป็นเจ้าของ (Write the two plans you own)',
            contentHtml: `
              <p>กรอกข้อมูลใน <code>devflow/project-plan.md</code> ตามรายละเอียดผลิตภัณฑ์ที่โปรเจกต์ต้องการ จากนั้นเขียน <code>devflow/build-plan.md</code> เป็นรายการฟีเจอร์สั้นๆ ตามลำดับความสำคัญ (สามารถใช้ Plain Bullets หรือ Numbered Lines ได้ โดย Overview จะเพิ่ม Checkbox ให้อัตโนมัติ) ดูตัวอย่างได้ที่ <a href="../writing-your-plans/">Writing Your Plans</a></p>
              <p>คุณสามารถเขียนแผนได้โดยตรงหรือพูดคุยผ่านการสนทนากับ AI หากต้องการความช่วยเหลือแบบมีคำแนะนำ ให้รัน <code>$discovery</code> ใน Codex หรือ <code>/discovery</code> ใน Claude Code / Antigravity ซึ่ง Discovery เป็นตัวเลือกเสริมและจะบันทึกไฟล์หลังจากคุณตรวจสอบและอนุมัติอย่างชัดเจนเท่านั้น</p>
            `
          },
          {
            id: '5-generate-project-context',
            title: '5. สร้างบริบทโปรเจกต์ด้วย Overview (Generate project context)',
            contentHtml: `
              <p>รัน <code>$overview</code> ใน Codex หรือ <code>/overview</code> ใน Claude Code / Antigravity โดยคำสั่งจะจัดรูปแบบรายการฟีเจอร์ให้ชัดเจน รักษารายการและสถานะ และขออนุมัติก่อนแก้ไขแผน</p>
              <p>ตรวจสอบ <code>devflow/context/project-overview.md</code> ที่ถูกสร้างขึ้นก่อนเริ่มสร้าง Overview จะรักษาขนาดบริบทให้ต่ำกว่า 20,000 ไบต์ เพื่อให้ AI โหลดได้รวดเร็วโดยไม่ต้องพกสำเนาแผนงานทั้งฉบับ ในการรันครั้งแรก Overview จะเสนอทำ Reviewed Local Commit สำหรับ DevFlow setup และแผนงานก่อนเริ่ม Feature 1</p>
            `
          }
        ]
      },
      {
        id: 'the-shortest-successful-loop',
        title: 'วงจรการพัฒนาที่สั้นและมีประสิทธิภาพที่สุด (The shortest successful loop)',
        contentHtml: `
          <p>หลังจากติดตั้งเสร็จสิ้น ให้ทำตามลำดับนี้ในแต่ละฟีเจอร์:</p>
          <pre><code>/feature -> review -> /implement -> /check -> /complete</code></pre>
          <p>Agent Skills จะหยุดที่ขอบเขตสำคัญเสมอ จะไม่มีการ merge, push, deploy หรือส่งข้อมูลใดๆ โดยไม่ได้รับการอนุมัติตามข้อกำหนดของเวิร์กโฟลว์</p>
          <p>เมื่อคุณต้องการให้ DevFlow ดำเนินการต่อจนจบ Build Plan ที่เหลือโดยอัตโนมัติ ให้รัน <code>$continuous</code> หรือ <code>/continuous</code> ซึ่งจะรันตามวงจรฟีเจอร์ด้วย 1 branch และ 1 local main commit ต่อฟีเจอร์ และไม่มีการ push อัตโนมัติ ดูรายละเอียดได้ที่ <a href="../commands/continuous/">Continuous</a> และ <a href="../project-configuration/">Project Configuration</a></p>
          <p>เมื่อมีการตั้งค่าคำสั่ง Verify ไว้ ขั้นตอน implementation และ completion จะใช้สูตรเดียวกัน และ GitHub Actions จะรันโดยอัตโนมัติเมื่อเวิร์กโฟลว์ถูกเผยแพร่</p>
          <p>หากต้องการนำฟีเจอร์ที่เสร็จสมบูรณ์แล้วออกในภายหลัง ให้ทำตามคำแนะนำของคำสั่ง <a href="../commands/rollback/">Rollback</a> แทนการเขียน Git History ใหม่หรือลบฟีเจอร์ด้วยตนเอง</p>
        `
      },
      {
        id: 'already-have-a-codebase',
        title: 'มีโค้ดเบสเดิมอยู่แล้วใช่หรือไม่? (Already have a codebase?)',
        contentHtml: `
          <p>ใช้คู่มือ <a href="../existing-codebase/">Existing Codebase Adoption</a> แทนการ Onboard โปรเจกต์ใหม่ การ Adopt จะสำรวจ Repository ที่กำลังทำงานอยู่จริง และนับรวมฟีเจอร์ที่ถูกส่งมอบไปแล้วให้อัตโนมัติโดยไม่รบกวนประวัติเดิม</p>
        `
      },
      {
        id: 'keep-the-workflow-current',
        title: 'รักษาเวิร์กโฟลว์ให้ทันสมัยอยู่เสมอ (Keep the workflow current)',
        contentHtml: `
          <p>ใช้คู่มือ <a href="../updating-devflow/">Updating DevFlow</a> เมื่อคุณต้องการอัปเกรด Skills และเอกสารเวิร์กโฟลว์เวอร์ชันใหม่ ตัวอัปเดตจะรักษา Plans, Project Context, History และ Entry Files ของโปรเจกต์ไว้ 100%</p>
        `
      },
      {
        id: 'learn-the-everyday-loop',
        title: 'เรียนรู้วงจรการทำงานประจำวัน (Learn the everyday loop)',
        contentHtml: `
          <pre><code>/feature -> /implement -> /check -> /audit current -> /complete</code></pre>
          <p>รันคำสั่งเหล่านี้ใน AI Chat (ใช้ <code>$</code> ใน Codex หรือ <code>/</code> ใน Claude Code / Antigravity) ให้รีวิว Feature Spec ก่อนเริ่ม Implement, คำสั่ง Check จะทดสอบพฤติกรรมที่สัญญาไว้ และ Audit จะรีวิวคุณภาพโค้ด การแสดง Audit ที่นี่ไม่ได้เปลี่ยนเกณฑ์ Review Gates ที่คุณตั้งค่าไว้</p>
          <p>ไม่แน่ใจว่าไอเดียควรอยู่ในแผนงานหรือไม่? เริ่มต้นด้วย <code>/explore</code>, ใช้ <code>/status</code> เพื่อกลับมาทำงานต่อ และใช้ <code>/fix</code> สำหรับการแก้ไขงานด่วนขนาดเล็กที่ไม่ได้อยู่ในแผนงาน ดูรายละเอียดคำสั่งทั้งหมดจัดกลุ่มตามหมวดหมู่ได้ที่ <a href="../command-guide/">Command Guide</a></p>
        `
      }
    ]
  },

  // 2. Existing Codebase Adoption
  {
    slug: 'existing-codebase',
    category: 'START',
    title: 'นำไปใช้กับโค้ดเบสเดิม (Existing Codebase Adoption)',
    lead: 'ติดตั้งและประยุกต์ใช้ Nexus-DevFlow เข้ากับโปรเจกต์ที่มีโค้ดเบสอยู่แล้วผ่านคำสั่ง /adopt โดยไม่รบกวนประวัติ Git เดิม และเตรียมความพร้อมสำหรับการพัฒนาฟีเจอร์ถัดไป',
    pills: ['Adopt', 'Brownfield', 'Legacy', 'Survey', 'Migration', 'Reconciliation'],
    sections: [
      {
        id: 'when-to-adopt',
        title: 'เมื่อใดที่ควรใช้การ Adopt เข้าสู่โค้ดเบสเดิม (When to adopt)',
        contentHtml: `
          <p>ใช้คู่มือนี้แทน <a href="../getting-started/">เริ่มต้นใช้งาน (Getting Started)</a> เมื่อคุณมีแอปพลิเคชันที่ทำงานได้จริงอยู่แล้ว (Working Application) และต้องการนำเลเยอร์เวิร์กโฟลว์ของ Nexus-DevFlow เข้ามาช่วยวางแผนและพัฒนาฟีเจอร์ถัดไปอย่างเป็นระบบ</p>
          <p>การ Adopt จะทำการสำรวจโค้ดเบสจริง (Codebase Survey) สร้างโครงร่างแผนงาน (Scaffold Plans) และบันทึกฟังก์ชันที่ส่งมอบไปแล้วให้อัตโนมัติ โดยไม่ส่งผลกระทบต่อ Git History เดิมและไม่แตะต้องซอร์สโค้ดเดิมของคุณเลยแม้แต่บรรทัดเดียว</p>
          <blockquote>
            <p><strong>ข้อแตกต่างหลักระหว่าง Onboard กับ Adopt:</strong> คำสั่ง <code>/onboard</code> มีไว้สำหรับโปรเจกต์เปล่าที่เพิ่งเริ่มต้นสร้างโครงร่าง (Fresh Scaffold) ในขณะที่ <code>/adopt</code> มีไว้สำหรับโปรเจกต์เดิมที่มีซอร์สโค้ดทำงานอยู่แล้ว (Brownfield Codebase) โดยจะอ่านโค้ดจริงเพื่อสรุปฟังก์ชันเดิมและวางแผนเฉพาะสิ่งที่ต้องทำต่อ</p>
          </blockquote>
        `
      },
      {
        id: 'install-the-overlay',
        title: 'ติดตั้ง Overlay เข้าสู่โปรเจกต์เดิม (Install the overlay)',
        contentHtml: `
          <p>รันตัวติดตั้งใน Root Directory ของโปรเจกต์เดิม โดยเลือกคำสั่งตาม Package Manager ที่โปรเจกต์ของคุณใช้งาน:</p>
          <pre><code><span style="color:#8B949E"># npm</span>
<span style="color:#FFA657">npx</span><span style="color:#A5D6FF"> nexus-devflow</span>

<span style="color:#8B949E"># pnpm (แนะนำสำหรับโปรเจกต์ที่ใช้ pnpm เพื่อเลี่ยง EBADDEVENGINES)</span>
<span style="color:#FFA657">pnpm</span><span style="color:#A5D6FF"> dlx</span><span style="color:#A5D6FF"> nexus-devflow</span>

<span style="color:#8B949E"># yarn / bun</span>
<span style="color:#FFA657">yarn</span><span style="color:#A5D6FF"> dlx</span><span style="color:#A5D6FF"> nexus-devflow</span>
<span style="color:#FFA657">bunx</span><span style="color:#A5D6FF"> nexus-devflow</span></code></pre>
          <p>ตัวติดตั้งแบบโต้ตอบ (Interactive Installer) จะให้คุณเลือก AI Adapters ที่ต้องการใช้งาน เช่น OpenAI Codex, Claude Code, Google Antigravity, GitHub Copilot หรือ OpenCode โดยจะคัดลอกเฉพาะโฟลเดอร์ทักษะที่เข้ากันได้ (<code>.agents/</code> หรือ <code>.claude/</code>) และโฟลเดอร์เวิร์กโฟลว์ <code>devflow/</code></p>
          <p>ตัวติดตั้งจะสร้าง <code>devflow/.state/manifest.json</code> เพื่อให้ระบบสามารถอัปเดตเวอร์ชันของ DevFlow ในอนาคตได้อย่างปลอดภัยโดยไม่กระทบต่อไฟล์ที่คุณปรับแต่งเอง</p>
        `
      },
      {
        id: 'run-the-adoption-survey',
        title: 'รันการสำรวจโค้ดเบสด้วย /adopt (Run the adoption survey)',
        contentHtml: `
          <p>สั่งการ AI ด้วยคำสั่ง <code>$adopt</code> ใน Codex, <code>/adopt</code> ใน Claude Code / Google Antigravity หรือสั่งให้ Copilot / OpenCode รัน Adopt Skill:</p>
          <pre><code>/adopt</code></pre>
          
          <h4>กลไกการทำงานเชิงลึกของ Skill /adopt</h4>
          <p>Skill <code>/adopt</code> ทำงานแบบ Read-Only และดำเนินการสำรวจโปรเจกต์อย่างเป็นระบบผ่าน 5 ขั้นตอนหลัก:</p>
          <ol>
            <li>
              <strong>การตรวจสอบความปลอดภัยเบื้องต้น (Safety & Baseline Check)</strong>: ตรวจสอบว่า <code>devflow/project-plan.md</code> มีอยู่แล้วหรือไม่ หากมีข้อมูลจริงอยู่แล้วจะหยุดเพื่อป้องกันการเขียนทับ พร้อมทั้งปกป้องไฟล์ <code>README.md</code> หลักของโปรเจกต์ไม่ให้ถูกแก้ไข
            </li>
            <li>
              <strong>การสำรวจโค้ดเบสจริง (Deep Read-Only Survey)</strong>:
              <ul>
                <li><strong>Stack & Tooling</strong>: ตรวจจับภาษา โปรแกรมแปลภาษา เฟรมเวิร์ก และเวอร์ชันจาก <code>package.json</code>, <code>go.mod</code>, <code>Cargo.toml</code>, <code>pyproject.toml</code> ฯลฯ</li>
                <li><strong>Architecture & Public Surface</strong>: สแกนโครงสร้างโฟลเดอร์, API Routes, Controller, Data Models, UI Components และ Entrypoints ทั้งหมด</li>
                <li><strong>Shipped Features</strong>: ระบุฟีเจอร์และความสามารถที่พัฒนาเสร็จสมบูรณ์แล้วในระบบปัจจุบัน</li>
                <li><strong>Coding Conventions</strong>: สกัดรูปแบบการเขียนโค้ดที่มีอยู่จริง เช่น การตั้งชื่อ สไตล์ฟังก์ชัน การจัดการข้อผิดพลาด</li>
                <li><strong>Tests & CI</strong>: สำรวจชุดทดสอบเดิม (Jest, Vitest, Pytest, Go test, PHPUnit) และระบบ CI/CD ที่มีอยู่</li>
              </ul>
            </li>
            <li>
              <strong>การสัมภาษณ์แบบ Socratic (Interactive Clarification)</strong>: AI จะถามเจาะจงเฉพาะข้อมูลที่โค้ดไม่สามารถบอกได้ เช่น วัตถุประสงค์ทางธุรกิจ (Business Purpose), กลุ่มผู้ใช้งานเป้าหมาย (Target Audience), ข้อจำกัดด้านสถาปัตยกรรม และแผนงานที่กำลังจะทำถัดไป (Upcoming Roadmap)
            </li>
            <li>
              <strong>การสร้างไฟล์เวิร์กโฟลว์อัตโนมัติ (Workflow Scaffolding)</strong>:
              <ul>
                <li>สร้าง <code>devflow/project-plan.md</code> ที่บันทึกสถาปัตยกรรมและบริบทระบบปัจจุบัน</li>
                <li>สร้าง <code>devflow/build-plan.md</code> โดยใส่ฟังก์ชันเดิมที่ทำงานอยู่แล้วเป็น Checklist ที่เสร็จแล้ว <code>- [x]</code> และร่างรายการฟีเจอร์ใหม่ที่ต้องทำต่อ <code>- [ ]</code></li>
                <li>สร้าง <code>devflow/context/coding-standards.md</code> ตามธรรมเนียมการเขียนโค้ดของโปรเจกต์เดิม</li>
                <li>สร้าง <code>devflow/config.json</code> กำหนดนโยบาย Quality Gates ให้สอดคล้องกับขนาดของโปรเจกต์</li>
              </ul>
            </li>
            <li>
              <strong>การส่งมอบงานอย่างปลอดภัย (Clean Handoff)</strong>: สรุปผลการสำรวจและแนะนำให้รันคำสั่ง <code>/overview</code> เพื่อคอมไพล์บริบทต่อไป
            </li>
          </ol>
        `
      },
      {
        id: 'choose-workflow-visibility',
        title: 'เลือกรูปแบบการจัดเก็บเวิร์กโฟลว์ (Choose workflow visibility)',
        contentHtml: `
          <p>ในระหว่างการสำรวจหรือตั้งค่า คุณสามารถเลือกรูปแบบการจัดเก็บไฟล์ DevFlow ได้ 2 รูปแบบตามความต้องการของทีม:</p>
          <table>
            <thead>
              <tr>
                <th>รูปแบบ (Mode)</th>
                <th>คำอธิบายและการใช้งาน</th>
                <th>ไฟล์ที่จัดเก็บ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Committed Workflow (แนะนำ)</strong></td>
                <td>บันทึกไฟล์ DevFlow ทั้งหมดลงใน Git Repository เพื่อให้สมาชิกทุกคนในทีมและ CI ใช้ Agent Instructions, Plans, Standards และประวัติการพัฒนาชุดเดียวกัน</td>
                <td>เก็บ <code>devflow/</code>, <code>.agents/</code>, <code>.claude/</code> และ <code>AGENTS.md</code> ใน Git</td>
              </tr>
              <tr>
                <td><strong>Local-Only Workflow</strong></td>
                <td>เหมาะสำหรับกรณีที่คุณต้องการใช้ DevFlow ช่วยทำงานส่วนตัวโดยไม่ส่งผลกระทบต่อเพื่อนร่วมทีม หรือไม่ต้องการให้มีไฟล์ AI ปรากฏใน Git Repository หลัก</td>
                <td>เพิ่ม <code>devflow/</code>, <code>.agents/</code>, <code>.claude/</code> และ <code>AGENTS.md</code> ลงใน <code>.git/info/exclude</code> หรือ <code>.gitignore</code></td>
              </tr>
            </tbody>
          </table>
          <p>คุณสามารถสลับรูปแบบการจัดเก็บได้ตลอดเวลาผ่านการแก้ไขการละเว้นใน Git</p>
        `
      },
      {
        id: 'align-automatic-checks-when-needed',
        title: 'ปรับปรุงระบบตรวจสอบอัตโนมัติเมื่อจำเป็น (Align automatic checks when needed)',
        contentHtml: `
          <p>หากโปรเจกต์เดิมมีชุดทดสอบหรือระบบ Lint อยู่แล้ว คุณสามารถใช้ Skill <code>/ci</code> เพื่อเชื่อมโยงการตรวจสอบเข้ากับเวิร์กโฟลว์อัตโนมัติ:</p>
          <pre><code>/ci</code></pre>
          
          <h4>กลไกการทำงานเชิงลึกของ Skill /ci</h4>
          <ul>
            <li><strong>ตรวจจับคำสั่งทดสอบจริง</strong>: สแกนหาคำสั่ง Typecheck, Linter, Unit Test และ Build Script ที่ใช้งานได้จริงในโปรเจกต์</li>
            <li><strong>สร้างคำสั่ง Verify มาตรฐาน 1 คำสั่ง</strong>: กำหนดคำสั่งเดียวที่รันการตรวจสอบสำคัญทั้งหมด เช่น <code>npm run verify</code> หรือ <code>npm test</code></li>
            <li><strong>สร้าง GitHub Actions Workflow</strong>: สร้างไฟล์ <code>.github/workflows/devflow-verify.yml</code> ที่ใช้สูตรการรันเดียวกันกับการตรวจสอบในเครื่อง</li>
            <li><strong>ทดสอบรันจริงในเครื่อง (Empirical Execution)</strong>: รันคำสั่ง Verify ในเครื่องให้ผ่านจริงก่อนบันทึกการตั้งค่า</li>
            <li><strong>หยุดที่ขอบเขตปลอดภัย (Safe Boundary)</strong>: Skill จะหยุดก่อนทำการ <code>git push</code> หรือแก้ไขกฎ Branch Protection บน GitHub เสมอ</li>
          </ul>
        `
      },
      {
        id: 'generate-the-overview',
        title: 'สร้างบริบทโปรเจกต์ด้วย /overview (Generate the overview)',
        contentHtml: `
          <p>หลังจากตรวจสอบ <code>devflow/project-plan.md</code> และ <code>devflow/build-plan.md</code> เรียบร้อยแล้ว ให้รันคำสั่ง <code>/overview</code> เพื่อคอมไพล์บริบทเข้าสู่ Living Source of Truth:</p>
          <pre><code>/overview</code></pre>
          
          <h4>กลไกการทำงานเชิงลึกของ Skill /overview</h4>
          <ul>
            <li><strong>คอมไพล์แบบ Deterministic</strong>: อ่านไฟล์แผนงานทั้งสองฉบับ จัดโครงสร้างและหมายเลขข้อของ Build Plan ให้เป็นลำดับที่ถูกต้อง พร้อมรักษาเครื่องหมาย <code>- [x]</code> ของฟังก์ชันเดิมไว้อย่างครบถ้วน</li>
            <li><strong>จำกัดขนาดบริบทให้กะทัดรัด (Context Budget &lt; 20KB)</strong>: สังเคราะห์เป็น <code>devflow/context/project-overview.md</code> ซึ่งถูกออกแบบให้มีขนาดเล็กและกระชับ เพื่อให้ AI Agent ทุกตัวในทุกเซสชันโหลดอ่านได้ทันทีโดยไม่เปลือง Context Window</li>
            <li><strong>ข้อเสนอ Reviewed Local Commit</strong>: ในการรันครั้งแรก Overview จะเสนอทำ Local Git Commit สำหรับการตั้งค่า DevFlow และแผนงานที่ผ่านการตรวจสอบแล้ว ก่อนที่จะเริ่มพัฒนาฟีเจอร์ถัดไป</li>
          </ul>
        `
      },
      {
        id: 'audit-before-extending-when-needed',
        title: 'ตรวจสอบคุณภาพโค้ดก่อนเริ่มขยายฟีเจอร์ (Audit before extending when needed)',
        contentHtml: `
          <p>ก่อนที่จะเริ่มพัฒนาฟีเจอร์ใหม่ลงบนโค้ดเบสเดิม แนะนำให้รันการตรวจสอบคุณภาพและความปลอดภัยแบบครอบคลุม (Full Baseline Audit):</p>
          <pre><code>/audit full</code></pre>
          
          <h4>กลไกการทำงานเชิงลึกของ Skill /audit</h4>
          <ul>
            <li><strong>การสแกน 5 มิติสำคัญ</strong>:
              <ol>
                <li><strong>Code Quality & Complexity</strong>: ตรวจหาโค้ดที่มีความซับซ้อนสูง ฟังก์ชันยาวเกินจำเป็น หรือปัญหา Dead Code</li>
                <li><strong>Security & OWASP Top 10</strong>: ตรวจสอบช่องโหว่ด้านความปลอดภัย เช่น การตรวจสอบ Input, Injection, ช่องโหว่การยืนยันตัวตน และการจัดการ Secrets</li>
                <li><strong>Performance & Bottlenecks</strong>: ตรวจหาจุดคอขวด เช่น N+1 Queries, Memory Leaks, การเรียก API ซ้ำซ้อน หรือการ Render ที่ไม่จำเป็น</li>
                <li><strong>Architecture & Convention Drift</strong>: ตรวจสอบความสอดคล้องกับมาตรฐานการเขียนโค้ดและโครงสร้างสถาปัตยกรรม</li>
                <li><strong>Test Integrity & Coverage</strong>: ตรวจสอบความครอบคลุมของการทดสอบและตรวจหาการทดสอบที่ไม่สะท้อนพฤติกรรมจริง (Flaky / False-positive tests)</li>
              </ol>
            </li>
            <li><strong>บันทึกลงใน Durable Ledger</strong>: บันทึกรายการปัญหาพร้อมระดับความสำคัญ (P1 Blocker, P2 Critical, P3 Polish) ลงใน <code>devflow/findings.md</code></li>
            <li><strong>เชื่อมโยงเข้ากับวงจรแก้ไข</strong>: หากพบข้อบกพร่องที่ต้องแก้ไขเร่งด่วน สามารถนำรายการจาก Findings ไปเปิดเป็นงานแก้ไขด้วยคำสั่ง <code>/fix</code> ได้ทันทีก่อนเริ่มฟีเจอร์ใหม่</li>
          </ul>
        `
      },
      {
        id: 'continue-normally',
        title: 'ดำเนินวงจรการพัฒนาตามปกติ (Continue normally)',
        contentHtml: `
          <p>เมื่อกระบวนการ Adopt เสร็จสมบูรณ์ โค้ดเบสเดิมของคุณจะมีความพร้อมเต็มที่สำหรับการพัฒนาฟีเจอร์ใหม่ตามวงจรมาตรฐาน 4 ขั้นตอน:</p>
          <pre><code>/feature -> review -> /implement -> /check -> /complete</code></pre>
          <p>หรือหากคุณต้องการให้ระบบพัฒนาฟีเจอร์ใน Build Plan ต่อเนื่องแบบอัตโนมัติ สามารถสั่งรันด้วยโหมด Continuous:</p>
          <pre><code>/continuous</code></pre>
          <p>ดูรายละเอียดและแนวทางปฏิบัติเพิ่มเติมได้ที่:</p>
          <ul>
            <li><a href="../command-guide/">Command Guide</a> — คู่มือสรุปชุดคำสั่งทั้งหมดกว่า 38+ ทักษะ</li>
            <li><a href="../writing-your-plans/">Writing Your Plans</a> — เทคนิคการเขียนและจัดระเบียบแผนงาน</li>
            <li><a href="../commands/continuous/">Continuous Mode</a> — การรันลูปพัฒนาฟีเจอร์แบบอัตโนมัติ</li>
          </ul>
        `
      }
    ]
  },

  // 3. Command Guide
  {
    slug: 'command-guide',
    category: 'START',
    title: 'คู่มือรวมชุดคำสั่ง (Command Guide)',
    lead: 'เลือกคำสั่งของ Nexus-DevFlow ตามลักษณะงานที่คุณต้องการทำ พร้อมคำอธิบายกลไกการทำงานและหน้าที่ความรับผิดชอบของแต่ละ Skill อย่างละเอียด',
    pills: ['Commands', 'Matrix', 'Reference', 'CheatSheet', 'Skills', '38-Skills'],
    sections: [
      {
        id: 'pick-a-starting-point',
        title: 'เลือกจุดเริ่มต้นตามประเภทงาน (Pick a starting point)',
        contentHtml: `
          <p>เริ่มต้นจากงานที่คุณต้องการทำ แล้วเลือกคำสั่ง Skill ที่ตรงจุด ทุกคำสั่งด้านล่างนี้สามารถรันได้โดยตรงใน AI Chat ของคุณ (ส่วนคำสั่ง Terminal เช่น <code>npx nexus-devflow status</code> หรือ <code>npx nexus-devflow dashboard</code> ใช้สำหรับจัดการเครื่องมือและเปิด Live Dashboard):</p>
          <table>
            <thead>
              <tr>
                <th>สิ่งที่คุณต้องการทำ</th>
                <th>คำสั่งที่แนะนำ</th>
                <th>หน้าที่และความรับผิดชอบ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>มีไอเดียใหม่แต่ยังไม่แน่ใจว่าจะทำดีไหม</td>
                <td><code>/explore</code></td>
                <td>สำรวจโค้ดเบสจริง เปรียบเทียบทางเลือกและข้อดีข้อเสียโดยไม่แก้ไขไฟล์ใดๆ</td>
              </tr>
              <tr>
                <td>อยากรู้ขอบเขตของฟีเจอร์ถัดไปในแผนงาน</td>
                <td><code>/brief</code></td>
                <td>สรุปขนาด ความเสี่ยง ผลกระทบ และแนวทางการแบ่งฟีเจอร์โดยไม่อ่านไฟล์เกินจำเป็น</td>
              </tr>
              <tr>
                <td>พร้อมเริ่มพัฒนาฟีเจอร์ใหม่ตามแผนงาน</td>
                <td><code>/feature</code></td>
                <td>สร้าง Task-Isolated Living Spec และจัดเตรียมสภาพแวดล้อมสำหรับพัฒนา</td>
              </tr>
              <tr>
                <td>เกิดข้อผิดพลาด บั๊ก หรือระบบไม่ทำงาน</td>
                <td><code>/debug</code></td>
                <td>วินิจฉัยหาสาเหตุที่แท้จริง (Root Cause) ผ่านการตั้งสมมติฐานและทดสอบจริง</td>
              </tr>
              <tr>
                <td>ต้องการแก้บั๊กเล็กหรืองานด่วนนอกแผน</td>
                <td><code>/fix</code></td>
                <td>สร้าง Spec สำหรับการแก้ไขบั๊กโดยเฉพาะ พร้อมวงจร TDD</td>
              </tr>
              <tr>
                <td>ต้องการทดสอบระบบตาม Living Spec</td>
                <td><code>/check</code></td>
                <td>รันชุดตรวจสอบพฤติกรรมจริง (Multi-lane verification) ตามเกณฑ์ Done-when</td>
              </tr>
              <tr>
                <td>ต้องการคู่มือขั้นตอนสำหรับทดสอบด้วยตนเอง</td>
                <td><code>/check guide</code> หรือ <code>/try</code></td>
                <td>สร้างคู่มือ Read-Only แนะนำจุดที่มนุษย์ควรคลิกทดสอบและผลลัพธ์ที่คาดหวัง</td>
              </tr>
              <tr>
                <td>ต้องการตรวจสอบคุณภาพโค้ดของฟีเจอร์ปัจจุบัน</td>
                <td><code>/audit current</code></td>
                <td>สแกนหาข้อบกพร่อง ความปลอดภัย OWASP และบันทึกลง <code>findings.md</code></td>
              </tr>
              <tr>
                <td>ต้องการรันหรือเพิ่มชุดทดสอบ Unit/Integration</td>
                <td><code>/tests</code></td>
                <td>จัดการชุดทดสอบ วิเคราะห์ Coverage และเพิ่มเคสทดสอบที่ขาดหายไป</td>
              </tr>
              <tr>
                <td>ต้องการทดสอบผ่านเบราว์เซอร์จริง (E2E)</td>
                <td><code>/tests browser</code> หรือ <code>/browser-tests</code></td>
                <td>ทดสอบ End-to-End บนเบราว์เซอร์จริงผ่าน Playwright และ MCP BrowserOS Neo</td>
              </tr>
              <tr>
                <td>ต้องการตรวจสุขภาพของระบบ DevFlow ทั้งหมด</td>
                <td><code>/doctor</code></td>
                <td>ตรวจสอบความสอดคล้องของ Adapters, Plans, Config, และความสดใหม่ของ Overview</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'everyday-build-path',
        title: 'เส้นทางการพัฒนาประจำวัน (Everyday build path)',
        contentHtml: `
          <p>วงจรการพัฒนามาตรฐานที่ปลอดภัยและมีประสิทธิภาพที่สุดสำหรับการพัฒนาแต่ละฟีเจอร์:</p>
          <pre><code>/feature -> /implement -> /check -> /audit current -> /complete</code></pre>
          <p>ลำดับขั้นตอนและการทำงานของแต่ละด่าน (Quality Gates):</p>
          <ul>
            <li><strong>ตรวจสอบและอนุมัติ Spec ก่อนเริ่มเขียนโค้ด</strong>: ตรวจสอบ <code>devflow/context/{xxx-slug}/spec.md</code> เพื่อยืนยันขอบเขตงานและเกณฑ์การยอมรับ</li>
            <li><strong><code>/check</code> พิสูจน์พฤติกรรมจริง</strong>: รันคำสั่งทดสอบจริงในสภาพแวดล้อมที่ใช้งานจริง เพื่อยืนยันว่าฟีเจอร์ทำงานถูกต้องตามเกณฑ์ใน Spec</li>
            <li><strong><code>/check guide</code> แนะนำการทดสอบด้วยมนุษย์</strong>: อธิบายสิ่งที่คนควรคลิกทดสอบและผลลัพธ์ที่คาดหวัง (คู่มือนี้เป็นเพียงคำแนะนำ ไม่ใช่หลักฐานว่าการทดสอบอัตโนมัติผ่าน)</li>
            <li><strong><code>/audit current</code> ตรวจสอบคุณภาพโค้ด</strong>: สแกนโค้ดที่เพิ่งแก้ไขเพื่อค้นหาข้อบกพร่อง ช่องโหว่ความปลอดภัย และบันทึกผลลงใน <code>findings.md</code></li>
            <li><strong><code>/complete</code> ส่งมอบงาน</strong>: สรุป Release Digest, ย้ายเข้า History Archive, ทำความสะอาด Workspace ชั่วคราว และทำการ Squash-Merge เข้าสู่ branch หลัก</li>
          </ul>
        `
      },
      {
        id: 'build',
        title: 'สร้างและส่งมอบ (Build)',
        contentHtml: `
          <p>กลุ่มคำสั่งหลักสำหรับวงจรการพัฒนาและส่งมอบฟีเจอร์:</p>
          <ul>
            <li>
              <strong><a href="../commands/feature/">/feature</a></strong>: 
              สกัดฟีเจอร์จาก <code>devflow/build-plan.md</code> กำหนดรหัสลำดับงาน (<code>xxx-slug</code>) และสร้าง <strong>Task-Isolated Living Spec (<code>devflow/context/{xxx-slug}/spec.md</code>)</strong>, Stage Pointer (<code>stage.md</code>), และ Audit Ledger (<code>findings.md</code>)
            </li>
            <li>
              <strong><a href="../commands/implement/">/implement</a></strong>: 
              สลับเข้าทำงานบน Branch <code>feature/{xxx-slug}</code> ดำเนินการพัฒนาตาม Checklist ใน Living Spec ด้วยระเบียบวินัย <strong>TDD (Red-Green-Refactor)</strong> และบันทึก Diff Evidence
            </li>
            <li>
              <strong><a href="../commands/check/">/check</a></strong>: 
              ทำหน้าที่เป็น Senior QA Gatekeeper ตรวจสอบ Multi-Lane Verification Matrix (Typecheck, Lint, Test Suites, Manual Proof) และบันทึกผลการตรวจสอบเชิงประจักษ์ลงใน Living Spec
            </li>
            <li>
              <strong>/check guide (หรือ /try)</strong>: 
              สร้างคู่มือการทดสอบแบบแมนนวล (Read-Only Try Guide) ระบุขั้นตอนการรัน จุดที่ต้องคลิกบนหน้าจอ และสิ่งที่ควรสังเกต เพื่อให้ผู้ใช้สามารถทดสอบด้วยตนเองได้อย่างง่ายดาย
            </li>
            <li>
              <strong><a href="../commands/complete/">/complete</a></strong>: 
              ด่านตรวจความปลอดภัยขั้นตอนสุดท้าย บันทึก Release Digest, ย้าย Living Spec ไปเก็บถาวรใน <code>devflow/history/features/</code>, ทำความสะอาด Workspace ชั่วคราว, อัปเดต <code>build-plan.md</code> และ <code>HISTORY.md</code>, แล้วทำ Git Squash-Merge เข้าสู่ <code>main</code>
            </li>
          </ul>
        `
      },
      {
        id: 'understand-and-review',
        title: 'ทำความเข้าใจและตรวจสอบ (Understand and review)',
        contentHtml: `
          <p>กลุ่มคำสั่งสำหรับการวิเคราะห์ สำรวจ และตรวจสอบคุณภาพระบบ:</p>
          <ul>
            <li>
              <strong><a href="../commands/explore/">/explore</a></strong>: 
              สำรวจโค้ดเบสจริงเพื่อตอบคำถามทางเทคนิค เปรียบเทียบทางเลือกและข้อดีข้อเสียก่อนตัดสินใจวางแผน โดยไม่มีการแก้ไขไฟล์ใดๆ
            </li>
            <li>
              <strong><a href="../commands/brief/">/brief</a></strong>: 
              สรุปภาพรวมของฟีเจอร์ถัดไปใน Build Plan อธิบายขอบเขต ความเสี่ยง ผลกระทบ และแนวทางการแบ่งฟีเจอร์ย่อย โดยไม่อ่านไฟล์เกินจำเป็น
            </li>
            <li>
              <strong><a href="../commands/status/">/status</a></strong>: 
              รายงานสถานะภาพรวมของโปรเจกต์ ความคืบหน้าของ Build Plan, สถานะของฟีเจอร์ปัจจุบัน, Git State, และคำสั่งถัดไปที่ต้องทำ
            </li>
            <li>
              <strong><a href="../commands/debug/">/debug</a></strong>: 
              วินิจฉัยหาสาเหตุที่แท้จริงของข้อผิดพลาด (Root-Cause Tracing) ผ่านการตั้งสมมติฐานและทดสอบ โดยไม่แก้โค้ดแบบสุ่มสี่สุ่มห้า พร้อมส่งมอบแนวทางการแก้ไข
            </li>
            <li>
              <strong><a href="../commands/audit/">/audit</a></strong>: 
              ตรวจสอบคุณภาพและความปลอดภัย 5 มิติ (Code Quality, OWASP Top 10 Security, Performance Bottlenecks, Architecture Drift, Test Integrity) และบันทึกลง <code>findings.md</code> (รองรับ <code>/audit current</code> สำหรับงานปัจจุบัน และ <code>/audit full</code> สำหรับทั้งโปรเจกต์)
            </li>
            <li>
              <strong><a href="../commands/doctor/">/doctor</a></strong>: 
              ตรวจสุขภาพของระบบ DevFlow ทั้งหมด ตรวจสอบ Adapter Sync, Config Drift, และความสดใหม่ของ <code>project-overview.md</code>
            </li>
          </ul>
        `
      },
      {
        id: 'plan-and-setup',
        title: 'วางแผนและติดตั้งระบบ (Plan and setup)',
        contentHtml: `
          <p>กลุ่มคำสั่งสำหรับการเริ่มต้น ติดตั้ง และกำหนดโครงสร้างโปรเจกต์:</p>
          <ul>
            <li>
              <strong><a href="../commands/onboard/">/onboard</a></strong>: 
              ปรับแต่งโปรเจกต์ใหม่ ตรวจจับ Stack, คำสั่ง Test, Coding Conventions, และระดับการ Review Cadence (Efficient vs Guided)
            </li>
            <li>
              <strong><a href="../commands/adopt/">/adopt</a></strong>: 
              สำรวจโค้ดเบสเดิม (Brownfield) 5 ขั้นตอนเชิงลึก สกัดฟังก์ชันที่มีอยู่แล้วลงใน <code>build-plan.md</code> เป็น <code>- [x]</code> โดยไม่กระทบ Git History เดิม
            </li>
            <li>
              <strong><a href="../commands/discovery/">/discovery</a></strong>: 
              สัมภาษณ์เชิงลึกและสำรวจ Roadmap ของผลิตภัณฑ์ เพื่อช่วยจัดทำและปรับปรุง <code>project-plan.md</code> และ <code>build-plan.md</code>
            </li>
            <li>
              <strong><a href="../commands/overview/">/overview</a></strong>: 
              Deterministic Compiler คอมไพล์แผนงานทั้งสองฉบับเป็น <code>devflow/context/project-overview.md</code> (ขนาดกะทัดรัด &lt; 20KB) เพื่อให้ AI โหลดเป็น Living Source of Truth ร่วมกัน
            </li>
            <li>
              <strong><a href="../commands/prototype/">/prototype</a></strong>: 
              สร้าง UI Mockup (HTML/CSS Standalone) และ Design Tokens อย่างรวดเร็วก่อนลงมือพัฒนาจริง
            </li>
            <li>
              <strong><a href="../commands/tests/">/tests</a></strong>: 
              จัดการและรันชุดทดสอบ Unit/Integration Tests รวมถึงการทดสอบผ่านเบราว์เซอร์จริง (<code>/tests browser</code>) ผ่าน Playwright และ MCP BrowserOS Neo
            </li>
            <li>
              <strong><a href="../commands/ci/">/ci</a></strong>: 
              สร้างคำสั่ง Verify หนึ่งคำสั่งเฉพาะสำหรับโปรเจกต์ และสร้างไฟล์ GitHub Actions Workflow (<code>devflow-verify.yml</code>) ให้ตรงกัน
            </li>
          </ul>
        `
      },
      {
        id: 'recover-and-release',
        title: 'กู้คืนระบบและเตรียมปล่อยงาน (Recover and release)',
        contentHtml: `
          <p>กลุ่มคำสั่งสำหรับการแก้ไขงานด่วน กู้คืนประวัติ และเตรียมความพร้อมสำหรับ Production:</p>
          <ul>
            <li>
              <strong><a href="../commands/fix/">/fix</a></strong>: 
              สร้าง Task-Isolated Spec สำหรับแก้ไขบั๊กเร่งด่วนหรืองานเล็กนอกแผน พร้อมวงจร TDD และบันทึกเข้าสู่ History Archive
            </li>
            <li>
              <strong><a href="../commands/rollback/">/rollback</a></strong>: 
              วางแผนถอนฟีเจอร์ที่เสร็จสมบูรณ์แล้วอย่างปลอดภัย โดยอ้างอิงจาก History Archive และ Git Commit โดยรักษาประวัติ Git ไว้อย่างถูกต้อง
            </li>
            <li>
              <strong><a href="../commands/release/">/release</a></strong>: 
              ตรวจสอบความพร้อมสำหรับการ Deploy ขึ้น Production (Render / Vercel), เช็ค Build, Environment Variables, และ Health-Check Endpoint
            </li>
          </ul>
        `
      },
      {
        id: 'automation',
        title: 'ระบบอัตโนมัติ (Automation)',
        contentHtml: `
          <p>กลุ่มคำสั่งสำหรับการพัฒนาระบบแบบอัตโนมัติโดยลดการแทรกแซงของมนุษย์:</p>
          <ul>
            <li>
              <strong><a href="../commands/autopilot/">/autopilot</a></strong>: 
              รันกระบวนการพัฒนา 1 ฟีเจอร์แบบอัตโนมัติตั้งแต่ต้นจนจบ (Spec -> Implement -> Check -> Audit) แล้วหยุดรอการอนุมัติก่อนทำ Complete
            </li>
            <li>
              <strong><a href="../commands/continuous/">/continuous</a></strong>: 
              Autonomous Multi-Feature Delivery Loop พัฒนาฟีเจอร์ใน <code>build-plan.md</code> ต่อเนื่องทีละรายการแบบอัตโนมัติ มีการสร้าง Branch แยก, รัน TDD, ตรวจสอบ Quality Gates, และ Squash-Merge ทีละฟีเจอร์จนจบแผน
            </li>
          </ul>
        `
      },
      {
        id: 'invocation-and-migration',
        title: 'รูปแบบการเรียกใช้และการย้ายคำสั่ง (Invocation and migration)',
        contentHtml: `
          <p>คุณสามารถเรียกใช้คำสั่งได้ตามรูปแบบที่เครื่องมือ AI ของคุณรองรับ:</p>
          <ul>
            <li><strong>Claude Code / Google Antigravity / Gemini CLI</strong>: ใช้เครื่องหมาย Slash เช่น <code>/explore</code>, <code>/tests browser</code>, <code>/check guide</code></li>
            <li><strong>OpenAI Codex</strong>: ใช้เครื่องหมาย Dollar เช่น <code>$explore</code>, <code>$tests browser</code>, <code>$check guide</code></li>
            <li><strong>GitHub Copilot / OpenCode / Chat ทั่วไป</strong>: พิมพ์ชื่อคำสั่งหรือระบุความต้องการเป็นภาษาไทยหรืออังกฤษได้โดยตรง</li>
          </ul>
          
          <h4>การย้ายและเปลี่ยนผ่านคำสั่ง (Command Migration)</h4>
          <p>ใน Nexus-DevFlow เวอร์ชันปัจจุบัน มีการปรับชื่อคำสั่งให้กระชับและเป็นหมวดหมู่มากขึ้น:</p>
          <table>
            <thead>
              <tr>
                <th>คำสั่งเดิม (Legacy)</th>
                <th>คำสั่งใหม่ (Canonical)</th>
                <th>คำอธิบาย</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>/browser-tests</code></td>
                <td><code>/tests browser</code></td>
                <td>รวมการทดสอบ Browser เข้าเป็นคำสั่งย่อยของ <code>/tests</code> (ยังคงรองรับคำสั่งเดิม)</td>
              </tr>
              <tr>
                <td><code>/try</code></td>
                <td><code>/check guide</code></td>
                <td>รวมคู่มือการทดสอบด้วยตนเองเข้าเป็นโหมด Guide ของ <code>/check</code> (ยังคงรองรับคำสั่งเดิม)</td>
              </tr>
            </tbody>
          </table>
        `
      }
    ]
  },

  // 4. Writing Your Plans
  {
    slug: 'writing-your-plans',
    category: 'START',
    title: 'การเขียนแผนงาน (Writing Your Plans)',
    lead: 'เขียนการตัดสินใจเชิงลึกของโปรเจกต์และสร้างแผนงานพัฒนา (Build Roadmap) ที่ติดตามผลได้จริง ทั้งแบบเขียนด้วยตนเองโดยตรงหรือผ่านการนำทางด้วยคำสั่ง /discovery',
    pills: ['Plans', 'ProjectPlan', 'BuildPlan', 'Strategy', 'Roadmap', 'SpecWriter'],
    sections: [
      {
        id: 'the-two-files-you-own',
        title: 'เอกสารสองฉบับที่คุณเป็นเจ้าของ (The two files you own)',
        contentHtml: `
          <p>Nexus-DevFlow สร้างบริบทของโปรเจกต์ (Project Context), ข้อกำหนดฟีเจอร์ (Feature Specs) และประวัติการพัฒนา (History Archives) จากไฟล์ 2 ไฟล์ที่คุณเป็นผู้เขียนและดูแลรักษา เอกสารทั้งสองฉบับยังคงมีประโยชน์อย่างต่อเนื่องแม้จะปล่อยเวอร์ชันแรกไปแล้ว เพราะ Build Plan จะทำหน้าที่เป็น Living Roadmap ของโปรเจกต์ต่อไป ทุกขั้นตอนในเวิร์กโฟลว์ขึ้นอยู่กับเอกสารสองฉบับนี้ จึงคุ้มค่าอย่างยิ่งที่จะเขียนให้ถูกต้องและชัดเจน</p>
          <table>
            <thead>
              <tr>
                <th>ไฟล์ (File)</th>
                <th>หน้าที่และเนื้อหา (What it is)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>devflow/project-plan.md</code></td>
                <td><strong>สิ่งที่สร้างและเหตุผล (The what and why)</strong>: ปัญหาที่ต้องการแก้, กลุ่มผู้ใช้, ฟีเจอร์หลัก, ข้อมูลที่จัดเก็บ, Tech Stack, ข้อจำกัด, และแนวทางการ Deploy โดยใส่รายละเอียดได้มากเท่าที่โปรเจกต์ต้องการ</td>
              </tr>
              <tr>
                <td><code>devflow/build-plan.md</code></td>
                <td><strong>ลำดับการสร้าง (Build Order)</strong>: 1 บรรทัดต่อ 1 ฟังก์ชันขนาดพอเหมาะ เรียงตามลำดับการพัฒนา โดยคำสั่ง <code>/overview</code> จะช่วยเติมรูปแบบ Checkbox สำหรับติดตามผลให้อัตโนมัติ</td>
              </tr>
            </tbody>
          </table>
          <p>คุณเป็นเจ้าของไฟล์ทั้งสองฉบับอย่างแท้จริง สามารถเขียนโดยตรง, พัฒนาผ่านการพูดคุยกับ AI ในเซสชันใดๆ หรือใช้คำสั่ง <code>/discovery</code> เพื่อรับคำแนะนำในการวางแผนเชิงลึก การตัดสินใจเป็นของคุณเสมอ และเมื่อทิศทางของโปรเจกต์เปลี่ยนไป ให้แก้ไขไฟล์ทั้งสองนี้แล้วรันคำสั่ง <code>/overview</code> ใหม่ แทนการแก้ไขไฟล์บริบทที่ระบบสร้างขึ้นโดยตรง</p>
        `
      },
      {
        id: 'optional-guided-discovery',
        title: 'ทางเลือกเสริม: การค้นหาและวางแผนแบบมีคำแนะนำ (Optional guided discovery)',
        contentHtml: `
          <p>สั่งการ AI ด้วยคำสั่ง <code>$discovery</code> ใน Codex หรือ <code>/discovery</code> ใน Claude Code / Google Antigravity เพื่อเริ่มเซสชันการสนทนาวางแผนที่มีการปรับตามบริบท:</p>
          <pre><code>/discovery</code></pre>
          
          <h4>กลไกการทำงานเชิงลึกของ Skill /discovery</h4>
          <p>Skill <code>/discovery</code> ช่วยเปลี่ยนไอเดียคร่าวๆ ให้กลายเป็นพิมพ์เขียวที่พร้อมลงมือสร้าง:</p>
          <ul>
            <li><strong>ถามคำถามทีละข้ออย่างเจาะจง (One Focused Question at a Time)</strong>: AI จะถามคำถามครั้งละ 1 ประเด็น และตั้งคำถามต่อเนื่องจากคำตอบสำคัญของคุณ เพื่อให้การตัดสินใจชัดเจนและไม่สับสน</li>
            <li><strong>สรุปความคืบหน้าเป็นระยะ (Periodic Summaries)</strong>: สรุปประเด็นที่ได้รับการยืนยันแล้ว และชี้ให้เห็นช่องว่างที่ยังต้องระบุเพิ่มเติม</li>
            <li><strong>ไม่มีการจำกัดจำนวนคำถาม</strong>: เมื่อคุณยืนยันว่าโปรเจกต์พร้อมแล้ว Discovery จะนำเสนอแบบร่างฉบับเต็มของ <code>project-plan.md</code> และ <code>build-plan.md</code></li>
            <li><strong>รอการอนุมัติอย่างชัดเจน (Explicit Approval Gate)</strong>: Skill จะหยุดรอให้คุณตรวจสอบและอนุมัติก่อนที่จะเขียนไฟล์จริงลงในโฟลเดอร์ <code>devflow/</code> เสมอ</li>
            <li><strong>เป็นตัวเลือกเสริม 100%</strong>: การ Onboard โปรเจกต์จะไม่บังคับรัน Discovery และคำสั่ง <code>/overview</code> สามารถประมวลผลแผนงานที่คุณเขียนเองได้โดยไม่มีข้อจำกัด ดูรายละเอียดเพิ่มเติมได้ที่ <a href="../commands/discovery/">Discovery Command</a></li>
          </ul>
        `
      },
      {
        id: 'project-planmd',
        title: 'โครงสร้างไฟล์ project-plan.md (project-plan.md)',
        contentHtml: `
          <p>ใส่รายละเอียดได้มากเท่าที่โปรเจกต์ต้องการ บันทึกเหตุผล, ข้อจำกัด, ตัวอย่าง, Edge Cases, ข้อดีข้อเสีย (Tradeoffs) และสิ่งที่ไม่รวมในขอบเขต (Exclusions) เพื่อไม่ให้ขั้นตอนการพัฒนาฟีเจอร์ในภายหลังต้องเสียเวลาสืบค้นซ้ำ ตัวอย่างด้านล่างเป็นโครงสร้าง 9 หัวข้อมาตรฐาน:</p>
          <pre><code># Project Plan

## 1. Problem - ปัญหาที่เรากำลังแก้ไขคืออะไร?
การติดตามนิสัยประจำวันทำได้ยากหากมองไม่เห็นความคืบหน้าที่ชัดเจน

## 2. Users - กลุ่มผู้ใช้งานเป้าหมายคือใคร?
บุคคลที่ต้องการสร้างวินัยส่วนตัวและมองหาแอปบันทึกกิจวัตรประจำวันที่เรียบง่าย

## 3. Features - MVP ต้องการฟังก์ชันอะไรบ้าง?
สร้างนิสัย, เช็คชื่อประจำวัน, แสดง Streak ความต่อเนื่อง, และดูสรุปรายงานรายสัปดาห์

## 4. Data - ข้อมูลอะไรบ้างที่เราต้องจัดเก็บ?
ผู้ใช้ (Users), นิสัย (Habits), และประวัติการทำเสร็จแต่ละวัน (Daily Completions)

## 5. Tech - สถาปัตยกรรมและ Tech Stack ใดที่เลือกใช้?
Next.js, PostgreSQL, และ Tailwind CSS (สามารถเลือกใช้ Stack ใดก็ได้ตามต้องการ)

## 6. Monetize - โมเดลธุรกิจหรือการสร้างรายได้?
เปิดให้ใช้งานฟรีสำหรับ Core Tracker พร้อมตัวเลือก Paid Tier สำหรับการ Sync ข้ามอุปกรณ์

## 7. UI/UX - รูปลักษณ์ ความรู้สึก และประสบการณ์ใช้งาน?
สะอาดตา, ออกแบบเน้น Mobile-First, รวดเร็ว และมีการกระทำที่ชัดเจนวันละ 1 ครั้ง

## 8. Deployment - ส่งมอบงานที่ไหนและอย่างไร?
Deploy บน Vercel พร้อมฐานข้อมูล PostgreSQL และกระบวนการ Build ตามมาตรฐาน

## 9. Usage model and constraints (optional)
การใช้งานส่วนบุคคล, ผู้ใช้คนเดียว, รันภายในเครื่อง ไม่มีความต้องการด้านกฎหมายพิเศษ</code></pre>
          <div class="docs-callout note">
            <div class="docs-callout-label">ข้อแนะนำสำหรับหัวข้อที่ 9 (Usage model and constraints)</div>
            <p>หัวข้อที่ 9 เป็นตัวเลือกเสริม ให้ระบุเฉพาะข้อเท็จจริงที่กำหนดไว้ชัดเจน เช่น ขนาดการรองรับ, การทำงานในเครื่องหรือออกอินเทอร์เน็ต, ความน่าเชื่อถือของผู้ใช้, Tenancy หรือข้อกำหนดความปลอดภัย หากเว้นว่างไว้จะถือว่ายังไม่ระบุ และระบบจะไม่ด่วนสรุปไปเองว่าเป็นระบบระดับ Enterprise หรือ Multi-tenant</p>
          </div>
        `
      },
      {
        id: 'build-planmd',
        title: 'โครงสร้างไฟล์ build-plan.md (build-plan.md)',
        contentHtml: `
          <p>เขียน 1 บรรทัดต่อ 1 ฟังก์ชันขนาดพอเหมาะ (Feature-sized outcome) เรียงตามลำดับการพัฒนา การเขียนด้วย Plain Bullets หรือ Numbered List ก็เพียงพอแล้ว โดยคำสั่ง <code>/overview</code> จะเติม Checkbox และหมายเลขข้อให้อัตโนมัติ หรือจะเขียนในรูปแบบ Checkbox โดยตรงก็ได้:</p>
          <pre><code># Build Plan

- [ ] 1. **Habit list** - สร้าง แก้ไขชื่อ และลบนิสัย
- [ ] 2. **Daily check-in** - ทำเครื่องหมายนิสัยที่ทำเสร็จในวันนี้
- [ ] 3. **Streak view** - แสดงจำนวนวันต่อเนื่องปัจจุบันและสถิติสูงสุด
- [ ] 4. **Weekly summary** - สรุปอัตราความสำเร็จย้อนหลัง 7 วัน
- [ ] 5. **Deployment readiness** - กำหนดค่าโฮสต์และตรวจสอบ Production Build</code></pre>
          <p>คำสั่ง <code>/feature</code> (เมื่อไม่ระบุอาร์กิวเมนต์) จะสเปกฟีเจอร์แรกที่ยังไม่ได้ทำ และเมื่อฟีเจอร์เสร็จสิ้นจะถูกทำเครื่องหมาย <code>[x]</code> รายการนี้จึงทำหน้าที่เป็น Progress Tracker ไปในตัว หากฟีเจอร์มีขนาดใหญ่เกินไป จะถูกแบ่งเป็นข้อย่อย (เช่น <code>4a</code>, <code>4b</code>) ในขั้นตอนการเขียน Spec</p>
        `,
        subsections: [
          {
            id: 'continue-after-the-initial-build',
            title: 'สานต่อหลังจากการสร้างระยะแรก (Continue after the initial build)',
            contentHtml: `
              <p>ห้ามลบหรือแทนที่ Build Plan ทั้งฉบับเมื่อฟีเจอร์ชุดแรกสร้างเสร็จ ให้คงรายการที่เสร็จแล้ว (<code>[x]</code>) และหมายเลขข้อเดิมไว้ แล้วเพิ่มฟีเจอร์ใหม่ที่ยังไม่ได้ทำต่อท้าย การใช้หัวข้อ Milestone (เช่น <code>## MVP</code>, <code>## Post-MVP</code>) จะช่วยให้อ่านง่ายโดยไม่กระทบต่อวิธีที่ <code>/feature</code> ค้นหาข้อถัดไป:</p>
              <pre><code>## MVP

- [x] 1. **Habit list** - สร้าง แก้ไขชื่อ และลบนิสัย
- [x] 2. **Daily check-in** - ทำเครื่องหมายนิสัยที่ทำเสร็จในวันนี้

## Post-MVP

- [ ] 3. **Shared habits** - เชิญผู้ใช้อื่นมาร่วมติดตามนิสัยด้วยกัน
- [ ] 4. **Reminder schedule** - กำหนดเวลาการแจ้งเตือนนิสัย</code></pre>
              <p>สำหรับการเพิ่มฟีเจอร์ใหม่ ให้เพิ่ม 1 บรรทัดใน <code>build-plan.md</code>, รันคำสั่ง <code>/overview</code> ใหม่ แล้วดำเนินการต่อด้วย <code>/feature</code> (แก้ไข <code>project-plan.md</code> เฉพาะเมื่อฟีเจอร์นั้นเปลี่ยนทิศทางผลิตภัณฑ์, ข้อมูล, สถาปัตยกรรม หรือการ Deploy)</p>
              <p>คุณยังสามารถสั่งงานแบบเจาะจงได้ เช่น <code>/feature "shared habits"</code> หากไม่มีข้อที่ตรงกัน Skill จะเสนอเพิ่มบรรทัดใหม่ลงในแผน พร้อมตรวจสอบผลกระทบต่อ Project Plan และรอการอนุมัติจากคุณก่อนอัปเดต Overview และเริ่มเขียน Feature Spec</p>
              <p>สำหรับบั๊กหรืองานแก้ไขด่วนขนาดเล็กที่ไม่ได้อยู่ในแผนงาน ให้ใช้คำสั่ง <code>/fix</code> โดยไม่ต้องนำมาเพิ่มเป็นข้อใน Build Plan</p>
            `
          },
          {
            id: 'keep-items-feature-sized',
            title: 'รักษาขนาดของแต่ละข้อให้อยู่ในระดับฟีเจอร์ (Keep items feature-sized)',
            contentHtml: `
              <p>การแบ่งขนาดฟีเจอร์ที่เหมาะสมจะช่วยให้การพัฒนาและการตรวจสอบทำได้อย่างแม่นยำ:</p>
              <table>
                <thead>
                  <tr>
                    <th>ขนาดที่เหมาะสม (Good)</th>
                    <th>สิ่งที่ควรหลีกเลี่ยง (Avoid)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>Daily check-in - ทำเครื่องหมายนิสัยที่ทำเสร็จในวันนี้</code></td>
                    <td><code>Database</code> (กว้างเกินไป ขาดพฤติกรรมผู้ใช้)</td>
                  </tr>
                  <tr>
                    <td><code>Streak view - แสดงจำนวนวันต่อเนื่องและสถิติสูงสุด</code></td>
                    <td><code>Make it look nice</code> (คลุมเครือ ไม่สามารถวัดผลได้)</td>
                  </tr>
                  <tr>
                    <td><code>Weekly summary - สรุปอัตราความสำเร็จย้อนหลัง 7 วัน</code></td>
                    <td><code>Habits, streaks, summary, and deploy</code> (ใหญ่เกินไป รวมหลายฟีเจอร์)</td>
                  </tr>
                </tbody>
              </table>
              <p>อย่าใส่ขั้นตอนการ Scaffold หรือ Prototype ลงใน Build Plan เพราะสิ่งเหล่านั้นเป็นขั้นตอนก่อนการสร้าง ให้เริ่มต้นด้วยฟังก์ชันที่ทำงานได้จริงชิ้นแรก</p>
            `
          }
        ]
      },
      {
        id: 'before-you-run-overview',
        title: 'สิ่งที่ควรรู้ก่อนรันคำสั่ง Overview (Before you run overview)',
        contentHtml: `
          <p>ในการเขียนรอบแรก เพียงแค่มีรายการฟีเจอร์ที่ชัดเจนก็เพียงพอ คำสั่ง <code>/overview</code> จะช่วยเติมรูปแบบไวยากรณ์ Checklist ที่ขาดหายไป โดยคงข้อความ ลำดับ หมายเลข ID สถานะความสำเร็จ และบันทึกย่อของคุณไว้อย่างครบถ้วน เช็คลิสต์ที่ถูกต้องอยู่แล้วจะไม่ถูกดัดแปลง</p>
          
          <h4>กลไกการทำงานเชิงลึกของ Skill /overview</h4>
          <ul>
            <li><strong>ขออนุมัติก่อนปรับเปลี่ยน (Approval Gate)</strong>: Overview จะถามก่อนเสมอหากจำเป็นต้องเปลี่ยนความหมายหรือลำดับของฟีเจอร์, ทำการแยกหรือรวมข้อ, หรือแก้ไขหมายเลข ID ที่กำกวม</li>
            <li><strong>เสนอสร้าง Build Checklist อัตโนมัติ</strong>: หากมีรายการฟีเจอร์เฉพาะใน <code>project-plan.md</code> แต่ยังไม่มีใน <code>build-plan.md</code> Overview จะเสนอร่าง Checklist ที่ขาดอยู่ให้คุณตรวจสอบและอนุมัติก่อน</li>
            <li><strong>คอมไพล์เป็น Living Source of Truth</strong>: สังเคราะห์แผนงานทั้งสองฉบับเป็น <code>devflow/context/project-overview.md</code> ที่มีขนาดกะทัดรัด (&lt; 20KB) เพื่อให้ AI Agent ทุกตัวในทุกเซสชันโหลดอ่านได้อย่างรวดเร็วโดยไม่สิ้นเปลือง Context Window</li>
          </ul>
        `
      }
    ]
  },

  // 5. Updating DevFlow
  {
    slug: 'updating-devflow',
    category: 'START',
    title: 'Updating DevFlow (การอัปเดตเวอร์ชัน)',
    lead: 'อัปเดตเลเยอร์เวิร์กโฟลว์ของ Nexus-DevFlow อย่างปลอดภัยโดยไม่เขียนทับแผนงาน บริบท หรือประวัติของโปรเจกต์',
    pills: ['Update', 'Upgrade', 'Version', 'Sync', 'Manifest', 'Compatibility', 'Skills Migration'],
    sections: [
      {
        id: 'preview-the-update',
        title: 'ตรวจสอบผลกระทบก่อนอัปเดต (Preview the update)',
        contentHtml: `
          <p>DevFlow สามารถอัปเดตเลเยอร์เวิร์กโฟลว์ ทักษะ (Skills) และความสามารถใหม่ๆ ได้อย่างปลอดภัย โดยมีขอบเขตความเป็นเจ้าของที่ชัดเจน (Narrow ownership boundary) เพื่อให้สถานะและโค้ดของโปรเจกต์ยังคงเป็นของคุณ 100%</p>
          <p>คุณสามารถรันการจำลองล่วงหน้า (Dry-run) เพื่อดูรายการการเปลี่ยนแปลงทั้งหมดก่อนได้จาก Root Directory ของโปรเจกต์:</p>
          <pre><code># npm
npx nexus-devflow@latest update --dry-run

# pnpm
pnpm dlx nexus-devflow@latest update --dry-run</code></pre>
          <p>แผนการอัปเดตจะรายงานสรุปรายการไฟล์ที่จะถูกเพิ่ม (Add), อัปเดต (Update), ลบ (Remove) หรือตรวจพบข้อขัดแย้ง (Conflicts) พร้อมแสดงรายการ AI Adapters ที่ตรวจพบในโปรเจกต์ เช่น Codex, Claude Code, GitHub Copilot, Google Antigravity และ OpenCode</p>
        `
      },
      {
        id: 'apply-the-update',
        title: 'ดำเนินการอัปเดตเวิร์กโฟลว์ (Apply the update)',
        contentHtml: `
          <p>เมื่อพร้อมอัปเกรด ให้รันคำสั่ง update เพื่อดำเนินการจริง:</p>
          <pre><code># npm
npx nexus-devflow@latest update

# pnpm
pnpm dlx nexus-devflow@latest update</code></pre>
          <p>ตัวอัปเดตของ DevFlow จะดูแลและแก้ไขเฉพาะโฟลเดอร์ที่เป็นของเวิร์กโฟลว์ DevFlow เท่านั้น:</p>
          <ul>
            <li><code>.agents/skills/</code> — ทักษะสำหรับ OpenAI Codex, Google Antigravity, GitHub Copilot และ OpenCode</li>
            <li><code>.claude/skills/</code> — ทักษะสำหรับ Claude Code</li>
          </ul>
          <p>Codex, Antigravity และ GitHub Copilot จะแชร์ไฟล์ทักษะใน <code>.agents/skills/</code> ร่วมกัน ส่วน OpenCode จะใช้ไฟล์ทักษะที่เข้ากันได้จาก <code>.agents/skills/</code> หรือ <code>.claude/skills/</code> ทำให้ไม่ต้องสร้างโครงสร้างโฟลเดอร์ <code>.opencode/skills/</code> แยกต่างหาก</p>
          <div class="note-box">
            <strong>เส้นทางไฟล์ที่เป็นของโปรเจกต์และปลอดภัย 100% (Preserved Paths):</strong>
            <ul>
              <li><code>AGENTS.md</code> และ <code>CLAUDE.md</code> (คำสั่งและกฎเฉพาะโปรเจกต์ของคุณ)</li>
              <li><code>devflow/config.json</code> (นโยบาย Quality Gates และการตั้งค่าเวิร์กโฟลว์)</li>
              <li><code>devflow/project-plan.md</code> และ <code>devflow/build-plan.md</code> (แผนงานหลัก)</li>
              <li><code>devflow/context/</code> (บริบทโปรเจกต์และ Task-Isolated Living Specs ที่กำลังทำงาน)</li>
              <li><code>devflow/history/</code> (ประวัติการส่งมอบฟีเจอร์ บั๊กฟิกซ์ และ Rollbacks ทั้งหมด)</li>
              <li><code>devflow/reference/</code> และ <code>prototypes/</code> (เอกสารอ้างอิงและหน้าจอต้นแบบ)</li>
            </ul>
          </div>
          <p>การอัปเดตเวอร์ชันล่าสุดได้เพิ่มหลักการ <strong>Proportional Engineering</strong> ลงใน Managed Skills, เพิ่มข้อเสนอติดตั้ง Git pre-push hook ในคำสั่ง <code>/ci</code>, ปรับปรุงระบบกู้คืนการทำงาน (Completion recovery), รองรับ Local-only review snapshots และการจัดรูปแบบ Feature List ใน Overview ให้กระชับอัตโนมัติ</p>
        `
      },
      {
        id: 'command-migration',
        title: 'การโยกย้ายและเปลี่ยนผ่านคำสั่ง (Command migration)',
        contentHtml: `
          <p>ในเวอร์ชันล่าสุด คำสั่งเดี่ยว 2 ตัวได้รับการปรับโครงสร้างให้เป็นโหมดการทำงานย่อย (Sub-modes) ของคำสั่งหลัก เพื่อความกระชับและเป็นระเบียบ:</p>
          <table>
            <thead>
              <tr>
                <th>คำสั่งเดิม (Previous command)</th>
                <th>คำสั่งใหม่ (Replacement)</th>
                <th>คำอธิบายหน้าที่</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>/browser-tests</code></td>
                <td><code>/tests browser</code></td>
                <td>เพิ่มหรือปรับแต่ง Browser Test Harness (Playwright) และเชื่อมต่อกับ MCP browseros-neo</td>
              </tr>
              <tr>
                <td><code>/try</code></td>
                <td><code>/check guide</code></td>
                <td>สร้างคู่มือการทดสอบ Manual Walkthrough ทีละขั้นตอนสำหรับมนุษย์ตรวจทาน</td>
              </tr>
              <tr>
                <td><code>/try latest</code></td>
                <td><code>/check guide latest</code></td>
                <td>สร้างคู่มือการทดสอบเฉพาะสำหรับฟีเจอร์หรือขอบเขตงานล่าสุด</td>
              </tr>
            </tbody>
          </table>
          <p>สำหรับ OpenAI Codex ให้ใช้คำสั่ง <code>$tests browser</code> และ <code>$check guide</code> โดยที่คำสั่งหลัก <code>/tests</code> ยังคงใช้ติดตั้งและรัน Unit Test ตามปกติ และคำสั่ง <code>/check</code> ยังคงใช้ตรวจสอบพฤติกรรมของระบบจริงตามเดิม</p>
          
          <h4>กลไกการทำงานของ Skills สำคัญที่เกี่ยวข้อง (Core & Companion Skills)</h4>
          <ul>
            <li><strong><code>/tests browser</code> (หรือ <code>browser-tests</code>)</strong>: วิเคราะห์สถาปัตยกรรมเว็บแอป ติดตั้งชุดทดสอบ Playwright E2E พร้อมสคริปต์รันทั้งแบบ Headless และ Interactive UI และเชื่อมต่อกับ MCP Server ของ <code>browseros-neo</code> (ที่พอร์ต <code>http://127.0.0.1:9010/mcp</code>) เพื่อให้เอเจนต์สามารถเปิดเบราว์เซอร์จริงที่ล็อกอินบัญชีจริงไว้แล้ว ตรวจสอบผลลัพธ์เชิงภาพ และบันทึกหลักฐานการทดสอบอัตโนมัติ</li>
            <li><strong><code>/check guide</code> (หรือ <code>try</code>)</strong>: สร้างเอกสารคู่มือทดสอบสำหรับมนุษย์ (Human Review Walkthrough) แบบ Read-Only โดยจะระบุคำสั่งที่ต้องรัน ที่อยู่ URL จุดที่ต้องคลิกบนหน้าจอ ข้อมูลตัวอย่างที่ต้องกรอก ผลลัพธ์ที่ถูกต้อง และสัญญาณที่บ่งบอกว่าเกิดข้อผิดพลาด <em>(หมายเหตุ: โหมด guide เป็นเครื่องมือช่วยตรวจทานของมนุษย์ ไม่นับเป็นการยืนยันความถูกต้องเชิงคุณภาพอัตโนมัติ)</em></li>
            <li><strong><code>/explore</code></strong>: สกิลสำรวจไอเดียและวิเคราะห์ความเป็นไปได้เชิงสถาปัตยกรรมแบบ Read-Only เปรียบเทียบทางเลือกและข้อดีข้อเสีย (Trade-offs) กับโค้ดจริงในโปรเจกต์ โดยไม่มีการแก้ไขโค้ดหรือบังคับเขียนสเปก/แผนงานล่วงหน้า เหมาะสำหรับการศึกษาความเป็นไปได้ก่อนตัดสินใจ</li>
            <li><strong><code>/doctor</code></strong>: สแกนตรวจสุขภาพและวินิจฉัยความพร้อมของระบบ DevFlow ตรวจสอบความสมบูรณ์ของ Adapters, ความสดใหม่ของ <code>project-overview.md</code>, ความถูกต้องของคำสั่งใน <code>AGENTS.md</code> และแจ้งเตือนหากไฟล์ Context มีขนาดใหญ่เกินเกณฑ์ 20KB</li>
            <li><strong><code>/overview</code></strong>: ทำหน้าที่เป็น Deterministic Compiler ที่กลั่นกรองและรวบรวมข้อมูลจาก <code>project-plan.md</code> และ <code>build-plan.md</code> ลงสู่ <code>devflow/context/project-overview.md</code> เพื่อเป็น Single Living Source of Truth ที่กระชับและแม่นยำให้ AI Agent ทุกตัวอ่านก่อนเริ่มงานในแต่ละเซสชัน</li>
            <li><strong><code>/ci</code></strong>: จัดระเบียบคำสั่ง Verify ของโปรเจกต์ สร้าง GitHub Actions CI Workflow ที่สอดคล้องกัน และเสนอการติดตั้ง Git pre-push hook ในเครื่องเพื่อป้องกันการ Push โค้ดที่ไม่ผ่านการทดสอบขึ้นสู่ Remote Repository</li>
          </ul>

          <p>หลังจากรันคำสั่งอัปเดตแล้ว สามารถรัน <code>/doctor</code> เพื่อตรวจสอบคำแนะนำ Proportional Engineering ที่อาจยังไม่ได้อัปเดตใน <code>AGENTS.md</code> ได้อย่างง่ายดาย</p>
        `,
        subsections: [
          {
            id: 'if-latest-runs-an-older-version',
            title: 'หาก @latest ยังคงรันเวอร์ชันเก่า (If latest runs an older version)',
            contentHtml: `
              <p>โปรดตรวจสอบเลขเวอร์ชันที่แสดงในแผนการอัปเดตก่อนดำเนินการเสมอ บางครั้งแคชของเครื่องมือติดตั้ง (Package Resolution Cache) อาจรันเวอร์ชันเก่าที่ถูกแคชไว้ แม้ว่าคำสั่งจะระบุ <code>@latest</code> ก็ตาม</p>
              <p>วิธีแก้ปัญหาคือการระบุเลขเวอร์ชันที่ต้องการอย่างชัดเจน (Pinned Version) เช่น สำหรับเวอร์ชัน 1.9.0:</p>
              <pre><code># npm
npx nexus-devflow@1.9.0 update

# pnpm
pnpm dlx nexus-devflow@1.9.0 update</code></pre>
              <p>คุณสามารถตรวจสอบเลขเวอร์ชันล่าสุดได้จาก <a href="https://github.com/jakkrichm/nexus-devflow/releases" target="_blank" rel="noopener">GitHub Releases</a> ทั้งนี้หากรันในโหมด Interactive โดยไม่ระบุแฟล็ก ระบบจะแสดง Adapter Picker ให้เลือก และหากตัวอัปเดตรุ่นเก่าเสนอให้แทนที่ Global CLI ด้วยเวอร์ชันที่เก่ากว่า ให้ตอบ <strong>No</strong> แล้วรันใหม่ด้วยเลขเวอร์ชันที่ถูกต้อง</p>
            `
          }
        ]
      },
      {
        id: 'change-adapters',
        title: 'ปรับเปลี่ยน AI Adapters (Change adapters)',
        contentHtml: `
          <p>คำสั่ง <code>update</code> สามารถใช้ปรับเปลี่ยนชุดของ AI Tool Adapters ที่ติดตั้งในโปรเจกต์ได้ตลอดเวลา เมื่อรันใน Interactive Terminal ระบบจะแสดง Checkbox ให้เลือกเครื่องมือ (Codex, Claude Code, GitHub Copilot, Google Antigravity, OpenCode) โดยมีค่าเริ่มต้นตาม Adapters ที่ติดตั้งอยู่แล้ว คุณสามารถกด Enter เพื่อคงชุดเดิม หรือติ๊กเลือก/ยกเลิกเครื่องมือก่อนเริ่มสร้างแผนการอัปเดตได้</p>
          <p>หากต้องการเพิ่ม Adapter โดยไม่ต้องตอบคำถาม สามารถใช้ Adapter Flags ได้โดยตรง (แฟล็กนี้จะเพิ่มเครื่องมือเท่านั้น ไม่มีการลบเครื่องมือเดิม):</p>
          <pre><code>npx nexus-devflow@latest update -- --codex</code></pre>
          <p>สำหรับการรันแบบ <code>--yes</code> หรือในระบบอัตโนมัติ (Non-interactive) ระบบจะคงชุด Adapter เดิมไว้เสมอ การลบ Adapter จะทำได้เฉพาะในโหมด Interactive เท่านั้น โดยไฟล์ทักษะที่ถูกถอดออกจะถูกจัดการตามกฎสำรองข้อมูลและความขัดแย้ง และโฟลเดอร์ทักษะที่ว่างลงจะถูก Prune ทิ้งอย่างปลอดภัย</p>
          <p>การเพิ่ม Claude Code จะสร้างไฟล์ <code>CLAUDE.md</code> จากเทมเพลตเฉพาะเมื่อยังไม่มีไฟล์นี้อยู่ และการลบ Claude Code จะ<strong>ไม่มีการลบไฟล์</strong> <code>CLAUDE.md</code> ของคุณอย่างเด็ดขาด</p>
          <p>หากต้องการดูตัวอย่างแผนการอัปเดตโดยข้ามคำถามเลือก Adapter ให้รัน:</p>
          <pre><code>npx nexus-devflow@latest update --dry-run --yes</code></pre>
        `
      },
      {
        id: 'adopt-the-lower-context-defaults',
        title: 'ปรับใช้การตั้งค่าแบบประหยัด Context (Adopt the lower-context defaults)',
        contentHtml: `
          <p>ตัวอัปเดตจะรีเฟรชเฉพาะไฟล์ Managed Skills และคำอธิบายทักษะที่กระชับขึ้นเพื่อลดการใช้ Token แต่จะ<strong>ไม่เขียนทับ</strong>ไฟล์ <code>CLAUDE.md</code> หรือ <code>devflow/config.json</code> ของผู้ใช้ ดังนั้นโปรเจกต์เดิมจะยังคงได้รับประสบการณ์การรีวิวตามการตั้งค่าเดิม</p>
          <p>ตัวอัปเดตจะแจ้งเตือนบรรทัด Import ที่ล้าสมัย เช่น <code>@devflow/context/project-overview.md</code>, <code>@devflow/context/current-feature.md</code>, <code>@devflow/context/coding-standards.md</code> หรือ <code>@devflow/context/ai-interaction.md</code> ใน <code>CLAUDE.md</code> ขอแนะนำให้ลบบรรทัดเหล่านั้นออกและคงไว้เพียง <code>@AGENTS.md</code> จากนั้น Restart เซสชันของ AI เอเจนต์ เพื่อให้บริบทโหลดไฟล์ตามความต้องการจริง (On-demand) ซึ่งช่วยประหยัด Context Window ได้มหาศาล</p>
          <p>หากต้องการปรับใช้เวิร์กโฟลว์แบบคล่องตัวสูง ลดการหยุดถามระหว่างสเต็ปย่อย (Efficient Mode) ให้ตั้งค่าใน <code>devflow/config.json</code> ดังนี้:</p>
          <pre><code>"workflow": {
  "stepReview": "feature",
  "checkpointCommits": "disabled"
}</code></pre>
          <p>หรือหากต้องการให้ AI หยุดถามความเห็นและสร้าง Checkpoint ทุกขั้นตอนย่อย (Guided Mode) ให้ตั้งค่าเป็น:</p>
          <pre><code>"workflow": {
  "stepReview": "every",
  "checkpointCommits": "enabled"
}</code></pre>
          <p><em>หมายเหตุ: การตั้งค่า <code>stepReview: "every"</code> เพียงอย่างเดียวจะคืนค่าการขออนุมัติทุกสเต็ป แต่จะไม่แสดง Checkpoint Prompt ทั้งนี้ภาพรวมบริบทที่กระชับและคำอธิบายทักษะที่ปรับปรุงใหม่จะช่วยประหยัด Context ได้อย่างมีประสิทธิภาพในทุกรูปแบบ</em></p>
        `
      },
      {
        id: 'return-to-an-earlier-workflow-version',
        title: 'ย้อนกลับสู่เวอร์ชันก่อนหน้า (Return to an earlier workflow version)',
        contentHtml: `
          <p>คุณสามารถย้อนกลับไปยังเวิร์กโฟลว์เวอร์ชันก่อนหน้าได้อย่างง่ายดาย โดยระบุเลขเวอร์ชันที่ต้องการร่วมกับแฟล็ก <code>--force</code>:</p>
          <pre><code>npx nexus-devflow@1.4.1 update --target . --yes --force</code></pre>
          <p>ตัวอัปเดตจะแทนที่เฉพาะไฟล์ Managed Skills ของเวอร์ชันนั้น ลบไฟล์ทักษะที่ไม่มีอยู่ในเวอร์ชันดังกล่าว รักษาไฟล์แผนงานและบริบททั้งหมดไว้ 100% พร้อมบันทึกสำเนาไฟล์เดิมไว้ใน <code>devflow/.state/backups/</code> โดยอัตโนมัติ</p>
          <p>การย้อนกลับเวอร์ชันจะไม่แก้ไขไฟล์ <code>CLAUDE.md</code> หากต้องการให้ Claude โหลดบริบทแบบเวอร์ชันดั้งเดิม สามารถเพิ่มบรรทัด Import เหล่านี้กลับเข้าไปและ Restart Claude Code:</p>
          <pre><code>@devflow/context/project-overview.md
@devflow/context/current-feature.md</code></pre>
        `
      },
      {
        id: 'the-global-command-does-not-update-blueprint',
        title: 'คำสั่ง Global CLI จะไม่อัปเดต DevFlow (The global command does not update DevFlow)',
        contentHtml: `
          <p>คำสั่งส่วนกลาง (Global CLI) <code>nexus-devflow</code> หรือ <code>devflow</code> ถูกออกแบบมาสำหรับแสดงผล <strong>Status</strong> และ <strong>Live Dashboard</strong> แบบ Read-Only เท่านั้น คำสั่ง <code>devflow update</code> จะไม่ทำงาน เพื่อป้องกันความสับสนของเวอร์ชัน</p>
          <p>เมื่อต้องการอัปเดตไฟล์เวิร์กโฟลว์ในโปรเจกต์ ให้ใช้คำสั่งระบุแพ็กเกจผ่าน npx เสมอ:</p>
          <pre><code>npx nexus-devflow@latest update</code></pre>
          <p>หลังการอัปเดตแบบ Interactive สำเร็จ ตัวติดตั้งจะตรวจสอบเวอร์ชันของ Global CLI ในเครื่อง หากเวอร์ชันไม่ตรงกัน ระบบจะเสนอทางเลือกในการอัปเดต Global CLI ให้ตรงกับเวอร์ชันของโปรเจกต์ (ค่าเริ่มต้นคือ No ซึ่งคำสั่ง <code>npx nexus-devflow@latest status</code> และ <code>dashboard</code> ยังคงทำงานได้สมบูรณ์โดยไม่ต้องติดตั้ง Global CLI)</p>
          <p>ดูรายละเอียดเพิ่มเติมได้ที่หน้า <a href="../cli/">CLI Overview</a></p>
        `
      },
      {
        id: 'manifest-and-backups',
        title: 'ระบบ Manifest และการสำรองข้อมูล (Manifest and backups)',
        contentHtml: `
          <p>การติดตั้ง DevFlow จะสร้างไฟล์ <code>devflow/.state/manifest.json</code> ซึ่งทำหน้าที่บันทึกเวอร์ชันของแพ็กเกจ, รายการ Adapters ที่เลือก และค่า SHA-256 Hashes ของทุกไฟล์ที่ DevFlow ดูแล ขอแนะนำให้ Commit ไฟล์ Manifest นี้ร่วมกับโค้ดของโปรเจกต์ เพื่อให้การ Clone หรือ Checkout ในเครื่องอื่นมี Baseline การอัปเดตที่ตรงกัน</p>
          <p>ก่อนที่จะมีการแทนที่หรือลบไฟล์ Managed Skill ใดๆ ตัวอัปเดตจะคัดลอกไฟล์เดิมไปเก็บไว้ใน <code>devflow/.state/backups/</code> เสมอ โดยโฟลเดอร์สำรองข้อมูลและโฟลเดอร์ Staging ทั้งหมดจะถูก Ignore โดยอัตโนมัติผ่าน <code>devflow/.state/.gitignore</code></p>
        `
      },
      {
        id: 'conflicts',
        title: 'การจัดการข้อขัดแย้งของไฟล์ (Conflicts)',
        contentHtml: `
          <p>ข้อขัดแย้ง (Conflict) จะเกิดขึ้นเมื่อไฟล์ที่ DevFlow ดูแลมีเนื้อหาไม่ตรงกับค่า Hash ที่บันทึกไว้ใน Manifest (เช่น มีการเข้าไปแก้ไขโค้ดใน <code>.agents/skills/</code> ด้วยตนเอง)</p>
          <p>ในการรันคำสั่งอัปเดตปกติ ระบบจะแสดงรายการไฟล์ที่มีข้อขัดแย้งและหยุดถามการยืนยันก่อนที่จะสำรองข้อมูลและเขียนทับ ส่วนการรันแบบ Non-interactive ระบบจะหยุดการทำงานทันทีโดยไม่เขียนไฟล์ใดๆ เพื่อความปลอดภัยสูงสุด</p>
          <p>หากคุณตรวจสอบแล้วและต้องการสำรองไฟล์เดิมพร้อมเขียนทับด้วยเวอร์ชันใหม่อย่างแน่นอน ให้ระบุแฟล็ก <code>--force</code>:</p>
          <pre><code>npx nexus-devflow@latest update --force</code></pre>
          <p><em>หมายเหตุ: ไฟล์ที่อยู่ในเส้นทางที่ไม่ปลอดภัย เช่น Symbolic Links หรือโฟลเดอร์ที่ทับตำแหน่งไฟล์ จะไม่ถูกเขียนทับโดย <code>--force</code> เด็ดขาด คุณต้องแก้ไขโครงสร้างไฟล์ด้วยตนเองก่อนรันอัปเดตอีกครั้ง</em></p>
        `
      },
      {
        id: 'legacy-installations',
        title: 'การอัปเกรดโปรเจกต์เวอร์ชันเดิม (Legacy installations)',
        contentHtml: `
          <p>โปรเจกต์ที่ติดตั้ง DevFlow ในยุคแรกก่อนที่จะมีระบบ Manifest สามารถใช้คำสั่ง <code>update</code> เดียวกันนี้เพื่ออัปเกรดได้ทันที</p>
          <p>ไฟล์ใดที่มีเนื้อหาตรงกับแพ็กเกจปัจจุบันจะถูกบันทึกเข้าสู่ Manifest ใหม่อัตโนมัติ ส่วนไฟล์ Managed ที่มีเนื้อหาแตกต่างจะถูกรายงานเป็นข้อขัดแย้ง (Conflict) เพื่อให้คุณมีโอกาสตรวจสอบและเลือกตัดสินใจว่าจะคงไว้หรือแทนที่ด้วยเวอร์ชันใหม่</p>
        `
      },
      {
        id: 'local-only-mode',
        title: 'โหมดการทำงานเฉพาะในเครื่อง (Local-only mode)',
        contentHtml: `
          <p>หากคุณใช้งาน DevFlow ในรูปแบบ Local-Only Mode โฟลเดอร์ <code>devflow/</code> ที่ถูกระบุไว้ใน <code>.gitignore</code> หลักของโปรเจกต์จะครอบคลุมถึง <code>devflow/.state/</code> ด้วย</p>
          <p>ทำให้ข้อมูล Manifest และประวัติการสำรองข้อมูลทั้งหมดจะคงอยู่เฉพาะในเครื่องของคุณ โดยไม่มีการส่งขึ้น Git Repository ร่วมกับทีม ดูรายละเอียดข้อดีและข้อจำกัดได้ที่หน้า <a href="../local-only-mode/">Local-Only Mode</a></p>
        `
      }
    ]
  }
];

