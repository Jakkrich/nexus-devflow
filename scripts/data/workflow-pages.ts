import type { DocPage } from '../build-docs-site.js';

export const WORKFLOW_PAGES: DocPage[] = [
  // 1. Core Workflow
  {
    slug: 'core-workflow',
    category: 'WORKFLOW',
    title: 'Core Workflow (วงจรเวิร์กโฟลว์หลัก)',
    lead: 'ทำความเข้าใจความเชื่อมโยงระหว่างการวางแผน (Planning), การลงมือพัฒนา (Implementation), หลักฐานการตรวจรับ (Evidence) และการส่งมอบงาน (Completion)',
    pills: ['Workflow', 'Core-Loop', 'Living-Spec', 'TDD', 'Verification', 'Human-in-the-Loop', 'Continuous', 'Slicing', 'Input-Coverage'],
    sections: [
      {
        id: 'visual-overview',
        title: 'ภาพรวมเวิร์กโฟลว์เชิงภาพ (Visual overview)',
        contentHtml: `
          <p>วงจรการพัฒนาโปรเจกต์ใหม่เริ่มต้นด้วยคำสั่ง <code>/onboard</code> ซึ่งจะแปลงแผนงานของคุณให้เป็นภาพรวมบริบทของโปรเจกต์ (Project Overview) จากนั้นจะเข้าสู่วงจรการทำงานซ้ำในแต่ละฟีเจอร์ผ่านการกำหนดสเปก (Spec), การลงมือเขียนโค้ด (Implement), การพิสูจน์ตรวจรับ (Proof), การตรวจทาน (Review) และการส่งมอบงาน (Completion)</p>
          <p>คุณสามารถเขียนแผนงานลงในไฟล์โดยตรง หรือรันคำสั่ง <code>/discovery</code> เพื่อให้ AI ช่วยสัมภาษณ์และวางโครงสร้างแผนงานอย่างลึกซึ้ง สำหรับโปรเจกต์ที่มีโค้ดเดิมอยู่แล้ว ให้เริ่มต้นด้วยคู่มือ <a href="../existing-codebase/">Existing Codebase</a> แทนคำสั่ง <code>/onboard</code></p>
          <figure class="docs-figure">
            <picture>
              <source media="(max-width: 640px)" srcset="../brand/nexus-devflow-workflow-mobile.svg"/>
              <img src="../brand/nexus-devflow-workflow.svg" alt="Nexus-DevFlow Core Workflow จากการวางแผน สู่การคอมไพล์บริบท การกำหนดสเปก การลงมือเขียนโค้ด การตรวจสอบ และการส่งมอบงานเข้าสู่ประวัติ"/>
            </picture>
            <figcaption>การวางแผน (Planning) และการคอมไพล์บริบท (Overview) จะรันเมื่อเริ่มต้นโปรเจกต์หรือเมื่อแผนงานหลักมีการเปลี่ยนแปลงอย่างมีนัยสำคัญ ส่วนวงจรพัฒนาหลักจะเริ่มต้นที่คำสั่ง Feature และหากผลการตรวจรับไม่ผ่าน จะย้อนกลับไปแก้ไขที่ Implement</figcaption>
          </figure>
          <div class="note-box">
            <strong>Interactive Architecture Diagrams:</strong> คุณสามารถเปิดดูแผนผังเชิงปฏิสัมพันธ์ได้โดยตรง:
            <ul>
              <li>🌐 <a href="../diagrams/nexus-devflow-architecture.html" target="_blank">Nexus-DevFlow System Architecture Map (Interactive HTML)</a> — แผนผังสถาปัตยกรรมระบบและ 3-Pillars Model</li>
              <li>⚡ <a href="../diagrams/nexus-devflow-lifecycle.html" target="_blank">Living Spec Lifecycle & State Machine (Interactive HTML)</a> — แผนผัง State Machine และ 4-Stage Progressive Rail</li>
            </ul>
          </div>
        `
      },
      {
        id: 'slicing-archetypes',
        title: '4 Slicing Archetypes Framework (การซอยฟีเจอร์อย่างมีประสิทธิภาพ)',
        contentHtml: `
          <p>เมื่อพบฟีเจอร์ขนาดใหญ่ใน <code>build-plan.md</code> หรือในขั้นตอน <code>/discovery</code> DevFlow มีแบบแผนมาตรฐานในการแบ่งย่อยงาน (Slicing) ออกเป็น 4 รูปแบบ เพื่อให้แต่ละฟีเจอร์สามารถสร้าง ทดสอบ และรีวิวได้จบในตัว:</p>
          <table>
            <thead>
              <tr>
                <th>Archetype</th>
                <th>สัญลักษณ์</th>
                <th>กลยุทธ์การแบ่งงาน (Strategy)</th>
                <th>เมื่อไหร่ควรเลือกใช้ (When to use)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Skateboard</strong></td>
                <td>🛹</td>
                <td><strong>Minimal Functional Loop</strong>: พัฒนาเฉพาะแกน Logic/Algorithm หลักแบบ End-to-End ด้วย UI แบบ Minimal (หรือ CLI) เพื่อพิสูจน์การทำงานจริงก่อนทำ UI สวยงาม</td>
                <td>ฟังก์ชันที่เน้นความถูกต้องของการคำนวณ, Logic ทางธุรกิจที่ซับซ้อน หรือระบบประมวลผลข้อมูล</td>
              </tr>
              <tr>
                <td><strong>2. Facade</strong></td>
                <td>🎭</td>
                <td><strong>Rich UI/DX with Mock Backend</strong>: สร้างหน้าจอ ส่วนติดต่อผู้ใช้ และ Interaction ที่สมบูรณ์แบบโดยใช้ Mock Data ก่อนต่อระบบ Backend จริง</td>
                <td>ฟีเจอร์ที่ต้องอาศัย Feedback ด้าน UX/UI จากผู้ใช้งานจริง, Dashboard, หรือ Form กรอกข้อมูลหลายขั้นตอน</td>
              </tr>
              <tr>
                <td><strong>3. Tracer Bullet</strong></td>
                <td>🎯</td>
                <td><strong>Deep Vertical Slice</strong>: ผ่าตรงผ่านทุก Layer ของระบบ (Database ➔ API ➔ Business Logic ➔ UI) สำหรับ 1 Happy Path แรกที่ใช้งานได้จริง</td>
                <td>เมื่อต้องการทดสอบการเชื่อมต่อสถาปัตยกรรมข้ามระบบครั้งแรก (Architecture Feasibility)</td>
              </tr>
              <tr>
                <td><strong>4. Journey</strong></td>
                <td>🧭</td>
                <td><strong>Step-by-Step User Journey</strong>: แบ่งฟีเจอร์ตามลำดับขั้นตอนในเส้นทางของผู้ใช้ (เช่น Onboarding ➔ Creation ➔ Preview ➔ Export)</td>
                <td>Workflow การทำงานที่มีหลายหน้าจอ หรือขั้นตอนที่ต้องทำต่อกันเป็นลำดับ</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'mechanical-input-coverage',
        title: 'Mechanical Input Coverage Spec Gate (การสกัดกั้น AI Hallucination)',
        contentHtml: `
          <p>เพื่อป้องกันไม่ให้ AI Coding Agent คิดเองเออเองหรือแอบตัดสินใจเชิงสถาปัตยกรรมระหว่างการเขียนโค้ด (Silent Architectural Drift) DevFlow กำหนดให้ทุก Living Spec ต้องผ่านเกณฑ์ <strong>Mechanical Input Coverage Test</strong> ก่อนเริ่มลงมือพัฒนา:</p>
          <pre><code>ทุกค่า/ข้อมูลที่โค้ดต้องสร้างหรือแสดงผล (Produced Values)
  └── ต้องระบุที่มา (Named Data Source) ไว้อย่างชัดเจนใน Spec เสมอ:
        ├── Database Schema / Column
        ├── Request Parameter / Input Argument
        ├── External API Response Field
        └── Prior Architectural Decision (ADR)</code></pre>
          <div class="note-box warning">
            <strong>Anti-Hallucination Guard:</strong> หากค่าหรือเงื่อนไขใดไม่มีที่มาของข้อมูลระบุไว้อย่างชัดเจน ให้ถือเป็น <strong>Owed Decision</strong> ซึ่ง AI จะไม่ได้รับอนุญาตให้คาดเดาเองเป็น "Wiring Code" โดยเด็ดขาด แต่ต้องหยุดถามผู้ใช้ หรือส่งเข้าขั้นตอน <code>/grill</code> เพื่อบันทึกข้อสรุปก่อน
          </div>
        `
      },
      {
        id: 'explore-an-idea',
        title: 'การสำรวจและวิเคราะห์ไอเดีย (Explore an idea)',
        contentHtml: `
          <p>เมื่อคุณมีไอเดียใหม่หรือข้อสงสัยเชิงเทคนิคแต่ยังไม่แน่ใจว่าจะทำหรือไม่ DevFlow มีชุดคำสั่งช่วยเหลือที่ทำงานแบบ <strong>Read-Only</strong> โดยไม่แก้ไขโค้ดหรือบังคับเขียนแผนงานล่วงหน้า:</p>
          <ul>
            <li><strong><code>/explore</code></strong>: สำรวจไอเดียและวิเคราะห์ความเป็นไปได้เชิงสถาปัตยกรรม เปรียบเทียบทางเลือกและข้อดีข้อเสีย (Trade-offs) กับโค้ดจริงในโปรเจกต์โดยตรง</li>
            <li><strong><code>/brief</code></strong>: สรุปและอธิบายขอบเขต ความสัมพันธ์ พื้นที่ที่ได้รับผลกระทบ และขนาดของงานสำหรับฟีเจอร์ที่อยู่ใน <code>build-plan.md</code> เพื่อช่วยในการตัดสินใจลำดับการพัฒนา</li>
            <li><strong><code>/idea</code></strong>: บันทึกไอเดียเข้าสู่ <code>devflow/ideas.md</code> พร้อมให้ AI วิเคราะห์ Feasibility Score, Value และ Key Points ให้โดยอัตโนมัติ</li>
            <li><strong><code>/brainstorm</code></strong>: ระดมสมองและสังเคราะห์ทางเลือกในการออกแบบระบบ 2-3 แบบ พร้อมเปรียบเทียบข้อดีข้อเสียก่อนตัดสินใจเลือกแนวทาง</li>
            <li><strong><code>/grill</code> (หรือ <code>align</code>)</strong>: จัดเซสชันสัมภาษณ์เชิงลึกแบบ Socratic Interview เพื่อทดสอบความสมบูรณ์ของแผนงาน สกัด Glossary คำศัพท์ทางธุรกิจ และบันทึก Architecture Decision Records (ADRs) ลงใน <code>devflow/decisions/</code></li>
          </ul>
        `
      },
      {
        id: 'establish-the-plan',
        title: 'การสร้างและจัดตั้งแผนงาน (Establish the plan)',
        contentHtml: `
          <p>คุณเป็นเจ้าของไฟล์ <code>devflow/project-plan.md</code> และ <code>devflow/build-plan.md</code> อย่างแท้จริง โดยขั้นตอน Overview จะตรวจสอบไฟล์แผนงานเหล่านี้และคอมไพล์เป็นบริบทที่กระชับเพื่อให้ AI โหลดอ่านตามความต้องการจริง (On-demand):</p>
          <pre><code>เขียนแผนงานลงไฟล์โดยตรง ────────────────────────────▶ /overview
หรือรัน /discovery ──▶ ตรวจสอบและอนุมัติแผนงาน ───────▶ /overview</code></pre>
          <p>ทั้งสองแนวทางจะสร้างไฟล์แผนงานที่ผู้ใช้เป็นเจ้าของเหมือนกัน โดย <code>/discovery</code> จะไม่ถูกบังคับรันจากขั้นตอน Onboarding และไม่เป็น Gate ขัดขวางการรัน Overview</p>
          <div class="note-box">
            <strong>Baseline Project Commit:</strong> ก่อนเริ่มพัฒนา Feature แรก เมื่อรัน <code>/overview</code> สำเร็จ ระบบจะเสนอทางเลือกในการสร้าง Commit ตั้งต้น <code>chore: establish DevFlow project baseline</code> โดย AI จะแสดง Diff ให้ตรวจสอบและรอการอนุมัติก่อนเสมอ
          </div>
        `
      },
      {
        id: 'configure-shared-workflow-policy',
        title: 'การกำหนดนโยบายเวิร์กโฟลว์ร่วมกัน (Configure shared workflow policy)',
        contentHtml: `
          <p>ไฟล์ <code>devflow/config.json</code> เป็นศูนย์กลางควบคุมนโยบายเวิร์กโฟลว์ที่ทำงานร่วมกันได้อย่างสอดคล้องข้ามทุก AI Adapter โดยควบคุมการตั้งค่าสำคัญ เช่น:</p>
          <ul>
            <li><strong>จังหวะการรีวิว (Review Cadence)</strong>: ควบคุมผ่าน <code>workflow.stepReview</code> (ค่าเริ่มต้น <code>"feature"</code> สำหรับโหมดคล่องตัว หรือ <code>"every"</code> สำหรับการหยุดถามทุกสเต็ป)</li>
            <li><strong>Checkpoint Commits</strong>: ควบคุมผ่าน <code>workflow.checkpointCommits</code> (ค่าเริ่มต้น <code>"disabled"</code> หรือเปิดใช้งานเป็น <code>"enabled"</code>)</li>
            <li><strong>นโยบาย Quality Gates</strong>: ควบคุมการทำงานของ Audit, Check, Try Guide และ Independent Review ในโหมดปกติ (<code>qualityGates.regular</code>) และโหมดต่อเนื่อง (<code>qualityGates.continuous</code>)</li>
            <li><strong>Independent Review</strong>: มีค่าเริ่มต้นเป็น <code>"when-sensitive"</code> สำหรับงานที่มีความอ่อนไหวสูงหรือขอบเขตกว้าง โดยจะใช้ Subagent แบบแยกขาดอิสระ (Isolated Reviewer) เพื่อความโปร่งใสสูงสุด</li>
          </ul>
        `
      },
      {
        id: 'repeat-for-each-feature',
        title: 'วงจรการพัฒนาซ้ำในแต่ละฟีเจอร์ (Repeat for each feature)',
        contentHtml: `
          <p>การพัฒนาในชีวิตประจำวันจะโฟกัสทีละหนึ่งขอบเขตงานที่แยกขาดจากกัน (Task Isolation):</p>
          <pre><code>/feature ──▶ /implement ──▶ /check ──▶ /audit current ──▶ /complete</code></pre>
          <table>
            <thead>
              <tr>
                <th>ขั้นตอน (Stage)</th>
                <th>คำสั่ง (Command)</th>
                <th>ผลลัพธ์และหน้าที่ของ Skill (Result & Role)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Specify (กำหนดสเปก)</strong></td>
                <td><code>/feature [id]</code></td>
                <td>จัดสรร Running ID (เช่น <code>001-user-auth</code>), สร้าง Workspace เฉพาะงานใน <code>devflow/context/{xxx-slug}/</code>, ร่าง Living Spec (<code>spec.md</code>) พร้อมเกณฑ์ Done-when และหยุดรอการอนุมัติสเปก</td>
              </tr>
              <tr>
                <td><strong>2. Build (ลงมือสร้าง)</strong></td>
                <td><code>/implement [id]</code></td>
                <td>สลับ branch ไปยัง <code>feature/{xxx-slug}</code>, ดำเนินการเขียนโค้ดตาม Task Checklist ด้วยวินัย Strict TDD (Red-Green-Refactor) และรัน Verify เมื่อมีการตั้งค่าไว้</td>
              </tr>
              <tr>
                <td><strong>3. Prove (พิสูจน์ตรวจรับ)</strong></td>
                <td><code>/check [id]</code></td>
                <td>ตรวจรับระดับ Senior QA รันแอปพลิเคชันจริงเทียบกับเกณฑ์ Done-when, รัน Verification Matrix และบันทึกหลักฐานเชิงประจักษ์ (Empirical Evidence)</td>
              </tr>
              <tr>
                <td><strong>4. Review (ตรวจทานโค้ด)</strong></td>
                <td><code>/audit current</code></td>
                <td>ตรวจทานการเปลี่ยนแปลงของโค้ดในเซสชัน ค้นหาช่องโหว่ความปลอดภัย ข้อบกพร่องด้านประสิทธิภาพ และบันทึกประเด็นที่ต้องแก้ไขลง <code>findings.md</code></td>
              </tr>
              <tr>
                <td><strong>5. Land (ส่งมอบงาน)</strong></td>
                <td><code>/complete [id]</code></td>
                <td>ตรวจสอบ Verify ซ้ำครั้งสุดท้าย, บันทึก Release Digest, ย้ายเอกสารเข้าสู่ <code>devflow/history/</code>, ลบ Workspace ชั่วคราว, อัปเดต <code>build-plan.md</code> และทำ Git Squash-Merge เข้าสู่ <code>main</code></td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'run-the-remaining-plan-continuously',
        title: 'การรันแผนงานแบบต่อเนื่องอัตโนมัติ (Run the remaining plan continuously)',
        contentHtml: `
          <p>คำสั่ง <code>/continuous</code> หรือ <code>$continuous</code> เป็นโหมดการทำงานอัตโนมัติสำหรับรันฟีเจอร์ที่ยังไม่ได้ทำใน <code>devflow/build-plan.md</code> แบบต่อเนื่องหลายรายการโดยไม่ต้องหยุดรอการอนุมัติระหว่างขั้นตอนย่อย:</p>
          <pre><code>/continuous ──▶ หยิบฟีเจอร์ถัดไป ──▶ รัน Spec/Implement/Check/Gates ──▶ Local Completion & Merge ──▶ ทำซ้ำ</code></pre>
          <p>Build Plan จะทำหน้าที่เป็นคิวงานโดยตรง แต่ละฟีเจอร์ยังคงแยก Branch, รันการทดสอบ TDD, บันทึกประวัติ และทำ Local Squash-Merge เข้าสู่ <code>main</code> อย่างปลอดภัย</p>
        `
      },
      {
        id: 'reverse-a-completed-feature',
        title: 'การย้อนกลับฟีเจอร์ที่ส่งมอบแล้ว (Reverse a completed feature)',
        contentHtml: `
          <p>เมื่อจำเป็นต้องถอดถอนฟีเจอร์ที่ส่งมอบไปแล้วออกจากระบบ ให้ใช้คำสั่ง <code>/rollback &lt;feature-id&gt;</code>:</p>
          <pre><code>/rollback 4 ──▶ วิเคราะห์ความเสี่ยงและสร้าง Rollback Spec ──▶ /implement ──▶ /check ──▶ /complete</code></pre>
          <p>คำสั่ง Rollback จะจับคู่รายการใน Build Plan กับประวัติใน <code>devflow/history/</code> และ Git Commit ที่ตรงกัน จากนั้นจะวิเคราะห์ความเสี่ยงของ Commit หลังจากนั้นและร่าง Rollback Spec ที่รัดกุม</p>
        `
      }
    ]
  },

  // 2. Workflow Surface Map (New)
  {
    slug: 'workflow-surface-map',
    category: 'WORKFLOW',
    title: 'Workflow Surface Map (แผนผังคำสั่ง 33 Core Skills)',
    lead: 'แผนผังและโครงสร้างคำสั่งมาตรฐานทั้ง 33 Core Skills ใน Nexus-DevFlow พร้อมรูปแบบการเรียกใช้งานข้ามทุก AI Assistant',
    pills: ['Workflow', 'Surface', 'CoreSkills', 'Taxonomy', 'Commands', 'Adapters'],
    sections: [
      {
        id: 'universal-invocations',
        title: 'รูปแบบการเรียกใช้คำสั่ง (Universal Invocation)',
        contentHtml: `
          <p>Nexus-DevFlow กำหนดให้แต่ละคำสั่งมี <strong>ชื่อมาตรฐานหนึ่งเดียว (One Canonical Name)</strong> และสามารถเรียกใช้ได้ตามไวยากรณ์ของ AI Assistant แต่ละค่าย:</p>
          <table>
            <thead><tr><th>สไตล์การเรียกคำสั่ง</th><th>เครื่องมือที่รองรับ</th><th>ตัวอย่างการเรียกใช้</th></tr></thead>
            <tbody>
              <tr><td><strong>Slash Prefix (<code>/</code>)</strong></td><td>Google Antigravity, Claude Code, Gemini CLI</td><td><code>/feature</code>, <code>/implement</code>, <code>/check</code>, <code>/complete</code></td></tr>
              <tr><td><strong>Dollar Prefix (<code>$</code>)</strong></td><td>OpenAI Codex CLI</td><td><code>$feature</code>, <code>$continuous</code>, <code>$devflow</code></td></tr>
              <tr><td><strong>Plain Canonical Name</strong></td><td>GitHub Copilot, Generic Terminals, OpenCode, Aider</td><td><code>feature 1</code>, <code>implement</code>, <code>check</code></td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'lifecycle-skills',
        title: '1. กลุ่มคำสั่งวงจรชีวิตการพัฒนา (Lifecycle Delivery Skills - 7 Skills)',
        contentHtml: `
          <table>
            <thead><tr><th>คำสั่ง</th><th>หมวดหมู่</th><th>บทบาทหน้าที่</th><th>อาร์ติแฟกต์หลัก</th></tr></thead>
            <tbody>
              <tr><td><strong><code>feature</code></strong></td><td>Spec & Plan</td><td>จัดสรร ID, สร้าง Task-Isolated Workspace และร่าง Living Spec</td><td><code>context/{xxx-slug}/spec.md</code></td></tr>
              <tr><td><strong><code>fix</code></strong></td><td>Spec & Plan</td><td>ร่าง Fix Spec สำหรับการแก้ไขบั๊กหรือการปรับปรุงเร่งด่วน</td><td><code>context/{xxx-slug}/spec.md</code></td></tr>
              <tr><td><strong><code>implement</code></strong></td><td>Execution</td><td>ดำเนินการพัฒนาตาม Task Checklist ด้วยวินัย Strict TDD</td><td><code>context/{xxx-slug}/spec.md</code></td></tr>
              <tr><td><strong><code>check</code></strong></td><td>Quality Gate</td><td>Senior QA Dual-Axis Verification ตรวจสอบพฤติกรรมจริง</td><td><code>context/{xxx-slug}/spec.md</code></td></tr>
              <tr><td><strong><code>complete</code></strong></td><td>Delivery</td><td>สรุป Release Digest, ย้ายเข้า History Archive และ Squash-Merge</td><td><code>history/features/</code></td></tr>
              <tr><td><strong><code>continuous</code></strong></td><td>Delivery</td><td>รันคิวฟีเจอร์ใน Build Plan ต่อเนื่องอัตโนมัติในเครื่อง</td><td><code>history/features/</code></td></tr>
              <tr><td><strong><code>rollback</code></strong></td><td>Delivery</td><td>วางแผนและย้อนคืนฟีเจอร์ที่ส่งมอบแล้วโดยรักษาประวัติอย่างปลอดภัย</td><td><code>history/rollbacks/</code></td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'preflight-skills',
        title: '2. กลุ่มคำสั่งวิเคราะห์ความต้องการและการออกแบบ (Pre-Flight SA Suite - 5 Skills)',
        contentHtml: `
          <table>
            <thead><tr><th>คำสั่ง</th><th>หมวดหมู่</th><th>บทบาทหน้าที่</th><th>อาร์ติแฟกต์หลัก</th></tr></thead>
            <tbody>
              <tr><td><strong><code>analyze</code></strong></td><td>SA Ingestion</td><td>แปลงเอกสารทุกฟอร์แมต (PDF, Word, Excel, รูปภาพ) สแกนผลกระทบโค้ดเบส</td><td><code>inbox/</code> & <code>analysis/</code></td></tr>
              <tr><td><strong><code>idea</code></strong></td><td>Backlog</td><td>บันทึกไอเดียพร้อมประเมิน AI Feasibility Score & Value</td><td><code>devflow/ideas.md</code></td></tr>
              <tr><td><strong><code>grill</code> / <code>align</code></strong></td><td>Alignment</td><td>Socratic Alignment Interview, สกัด Glossary และบันทึก ADR</td><td><code>decisions/</code> & <code>glossary.md</code></td></tr>
              <tr><td><strong><code>brainstorm</code></strong></td><td>Ideation</td><td>ระดมสมองและเปรียบเทียบข้อดีข้อเสียของทางเลือกสถาปัตยกรรม</td><td>Interactive Session</td></tr>
              <tr><td><strong><code>discovery</code></strong></td><td>Exploration</td><td>สำรวจเจาะลึกภาพรวมโปรเจกต์หรือฟีเจอร์ก่อนเริ่มเขียนสเปก</td><td><code>discoveries/DISC-xxx.md</code></td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'governance-skills',
        title: '3. กลุ่มคำสั่งบริหารจัดการเวิร์กสเปซและคุณภาพ (Workspace Governance - 21 Skills)',
        contentHtml: `
          <table>
            <thead><tr><th>คำสั่ง</th><th>หน้าที่</th><th>คำสั่ง</th><th>หน้าที่</th></tr></thead>
            <tbody>
              <tr><td><strong><code>devflow</code></strong></td><td>ผู้ช่วยแนะนำเส้นทางและตรวจสอบสถานะงาน</td><td><strong><code>doctor</code></strong></td><td>วินิจฉัยสุขภาพโปรเจกต์และการตั้งค่าระบบ</td></tr>
              <tr><td><strong><code>explore</code></strong></td><td>ตอบคำถามและทำความเข้าใจโค้ดเบสแบบ Read-Only</td><td><strong><code>overview</code></strong></td><td>คอมไพล์บริบทโปรเจกต์ลง <code>project-overview.md</code></td></tr>
              <tr><td><strong><code>brief</code></strong></td><td>สรุปขอบเขตและความเสี่ยงของฟีเจอร์ใน Build Plan</td><td><strong><code>debug</code></strong></td><td>วินิจฉัยหาสาเหตุของบั๊กอย่างเป็นระบบ</td></tr>
              <tr><td><strong><code>onboard</code></strong></td><td>ติดตั้งและปรับแต่งค่าเริ่มต้นบนโปรเจกต์ใหม่</td><td><strong><code>adopt</code></strong></td><td>สำรวจและผนวก DevFlow เข้ากับโปรเจกต์เดิม</td></tr>
              <tr><td><strong><code>try</code></strong></td><td>สร้างคู่มือ Manual QA Walkthrough ทีละขั้นตอน</td><td><strong><code>audit</code></strong></td><td>สแกนความปลอดภัยและคุณภาพโค้ดลง <code>findings.md</code></td></tr>
              <tr><td><strong><code>bughunter</code></strong></td><td>สแกนช่องโหว่ความปลอดภัยเชิงรุกและ 83 CVE Patterns</td><td><strong><code>ci</code></strong></td><td>สร้างและปรับจูน GitHub Actions Verification Workflow</td></tr>
              <tr><td><strong><code>test</code></strong></td><td>รันชุดทดสอบและวิเคราะห์ Test Coverage</td><td><strong><code>setup-tests</code></strong></td><td>ติดตั้ง Test Runner และชุดทดสอบเริ่มต้น</td></tr>
              <tr><td><strong><code>browser-tests</code></strong></td><td>ติดตั้ง Playwright และเชื่อม BrowserOS Neo MCP</td><td><strong><code>autopilot</code></strong></td><td>รัน 1 ฟีเจอร์ต่อเนื่องตั้งแต่ Spec จนถึง Check</td></tr>
              <tr><td><strong><code>prototype</code></strong></td><td>สร้าง Mockup HTML/CSS จำลองหน้าจอแบบ Static</td><td><strong><code>release</code></strong></td><td>ตรวจสอบความพร้อมก่อน Deploy ขึ้น Render/Vercel</td></tr>
              <tr><td><strong><code>report-html</code></strong></td><td>สร้าง Standalone HTML Report Dashboard</td><td><strong><code>convert-any-to-md</code></strong></td><td>แปลงเอกสารภายนอกเป็น Markdown ใน <code>reference/</code></td></tr>
              <tr><td><strong><code>vendor</code></strong></td><td>ติดตั้ง External Skill และสร้าง Custom Wrapper</td><td><strong><code>status</code></strong></td><td>สรุปความคืบหน้าของงานและขั้นตอนถัดไป</td></tr>
            </tbody>
          </table>
        `
      }
    ]
  },

  // 3. Skill Selection Policy (New)
  {
    slug: 'skill-selection-policy',
    category: 'WORKFLOW',
    title: 'Skill Selection Policy (นโยบายการเลือกใช้ทักษะ)',
    lead: 'แนวทางการตัดสินใจเลือกใช้คำสั่งที่เหมาะสมและมีขอบเขตเล็กที่สุดตรงตามลักษณะงาน (Smallest Appropriate Surface)',
    pills: ['Workflow', 'Policy', 'Selection', 'Decision-Tree', 'BestPractices'],
    sections: [
      {
        id: 'lifecycle-decision-tree',
        title: 'ผังการตัดสินใจเลือกวงจรการพัฒนา (Lifecycle Decision Tree)',
        contentHtml: `
          <p>เลือกใช้คำสั่งในวงจรหลักตามลักษณะของงานที่ต้องการทำ:</p>
          <ul>
            <li><strong>ต้องการพัฒนาฟีเจอร์ใหม่ตามแผน หรือความสามารถใหม่</strong> ➔ ใช้ <code>/feature</code> (รองรับการดึงจาก Idea Inbox <code>/feature IDEA-xxx</code> หรือ Discovery <code>/feature DISC-xxx</code>)</li>
            <li><strong>ต้องการแก้ไขบั๊ก ข้อผิดพลาด หรือปรับปรุงโค้ดย่อย</strong> ➔ ใช้ <code>/fix</code></li>
            <li><strong>ต้องการลงมือเขียนโค้ดตามสเปกที่ผ่านการอนุมัติแล้ว</strong> ➔ ใช้ <code>/implement</code></li>
            <li><strong>ต้องการตรวจสอบความถูกต้องและรันแอปพลิเคชันจริงก่อนส่งมอบ</strong> ➔ ใช้ <code>/check</code></li>
            <li><strong>ต้องการส่งมอบงาน บันทึกประวัติ และ Squash-Merge</strong> ➔ ใช้ <code>/complete</code></li>
          </ul>
        `
      },
      {
        id: 'preflight-decision-tree',
        title: 'ผังการตัดสินใจในขั้นตอนเตรียมความพร้อม (Pre-Flight Discovery Tree)',
        contentHtml: `
          <pre><code>มีไอเดียแต่ยังไม่ชัดเจน ────▶ /idea (บันทึกลง Inbox พร้อม AI Feasibility Score)
ต้องการทางเลือกสถาปัตยกรรม ──▶ /brainstorm (สร้าง 2-3 Options พร้อม Trade-off Matrix)
มีเอกสารสเปกดิบ (PDF/Doc) ──▶ /analyze (สแกนผลกระทบโค้ดเบส & Socratic Gap Check)
ต้องการตกลงโมเดลข้อมูล/ADR ──▶ /grill (Socratic Interview บันทึกลง devflow/decisions/)
ต้องการสำรวจเจาะลึก ────────▶ /discovery (สร้างบันทึกการสำรวจ DISC-xxx)</code></pre>
        `
      },
      {
        id: 'companion-tools-mapping',
        title: 'ตารางเลือกเครื่องมือช่วยเหลือ (Companion Tools Matrix)',
        contentHtml: `
          <table>
            <thead><tr><th>ความต้องการ</th><th>คำสั่งที่แนะนำ</th><th>พฤติกรรมหลัก</th></tr></thead>
            <tbody>
              <tr><td>ตรวจสุขภาพระบบและการตั้งค่า</td><td><code>/doctor</code></td><td>Read-only ตรวจเช็ค Config, Adapters, และความสมบูรณ์ของเวิร์กโฟลว์</td></tr>
              <tr><td>สืบหาสาเหตุของบั๊กที่แท้จริง</td><td><code>/debug</code></td><td>กระบวนการ Scientific Diagnosis 6 ขั้นตอนโดยไม่แก้โค้ดล่วงหน้า</td></tr>
              <tr><td>ทำความเข้าใจโค้ดหรือสอบถามจุดทำงาน</td><td><code>/explore</code></td><td>สำรวจและตอบคำถามเชิงลึกแบบ Read-only</td></tr>
              <tr><td>ต้องการคู่มือคลิกทดสอบหน้าจอสำหรับมนุษย์</td><td><code>/try</code></td><td>สร้างคู่มือ Step-by-Step UI Manual Review พร้อมจุดสังเกต</td></tr>
              <tr><td>สแกนความปลอดภัยและคุณภาพโค้ด</td><td><code>/audit</code></td><td>ตรวจเช็คทั้ง Branch Delta หรือทั้งโปรเจกต์ บันทึกลง <code>findings.md</code></td></tr>
              <tr><td>สร้าง Mockup หน้าจอจำลองก่อนเขียนโค้ด</td><td><code>/prototype</code></td><td>สร้าง Static HTML/CSS จำลองที่ใช้ Design Tokens ร่วมกัน</td></tr>
              <tr><td>สร้างรายงาน HTML Dashboard สวยงาม</td><td><code>/report-html</code></td><td>คอมไพล์สเปกหรือประวัติเป็น Dashboard สำหรับนำเสนอ</td></tr>
            </tbody>
          </table>
        `
      }
    ]
  }
];
