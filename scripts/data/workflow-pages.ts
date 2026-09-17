import type { DocPage } from '../build-docs-site.js';

export const WORKFLOW_PAGES: DocPage[] = [
  {
    slug: 'core-workflow',
    category: 'WORKFLOW',
    title: 'Core Workflow (วงจรเวิร์กโฟลว์หลัก)',
    lead: 'ทำความเข้าใจความเชื่อมโยงระหว่างการวางแผน (Planning), การลงมือพัฒนา (Implementation), หลักฐานการตรวจรับ (Evidence) และการส่งมอบงาน (Completion)',
    pills: ['Workflow', 'Core-Loop', 'Living-Spec', 'TDD', 'Verification', 'Human-in-the-Loop', 'Continuous'],
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
          <p>ดูคู่มือการเลือกใช้คำสั่งที่เหมาะสมได้ที่หน้า <a href="../command-guide/">Command Guide</a></p>
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
            <strong>Baseline Project Commit:</strong> ก่อนเริ่มพัฒนา Feature แรก เมื่อรัน <code>/overview</code> สำเร็จ ระบบจะเสนอทางเลือกในการสร้าง Commit ตั้งต้น <code>chore: establish DevFlow project baseline</code> โดย AI จะแสดง Diff ให้ตรวจสอบและรอการอนุมัติก่อนเสมอ เพื่อแยกส่วนการติดตั้งเวิร์กโฟลว์ออกจาก Commit ของฟีเจอร์แรกอย่างชัดเจน
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
          <p>ดูรายละเอียด Schema และข้อจำกัดทั้งหมดได้ที่หน้า <a href="../project-configuration/">Project Configuration</a></p>
        `
      },
      {
        id: 'set-up-shared-verification-separately',
        title: 'การตั้งค่าระบบทดสอบและตรวจสอบแยกอิสระ (Set up shared verification separately)',
        contentHtml: `
          <p>การตั้งค่าระบบตรวจสอบอัตโนมัติบน GitHub Actions เป็นขั้นตอนเสริมแยกต่างหาก ไม่ได้ถูกบังคับให้รันใหม่ในทุกฟีเจอร์ คุณสามารถรันคำสั่ง <code>/ci</code> หรือ <code>$ci</code> หลัง Onboarding หรือ Adoption เพื่อกำหนดคำสั่ง Verify มาตรฐานเดียวที่ใช้งานทั้งในเครื่องและบน CI:</p>
          <pre><code>/onboard หรือ /adopt ──▶ /ci ──▶ Verify ในเครื่อง ──▶ GitHub Actions รัน Verify แบบเดียวกัน</code></pre>
          <p>คำสั่ง Verify จะจัดลำดับการตรวจสอบที่กำหนดค่าไว้อย่างเป็นระบบ: Typecheck ➔ Tests ➔ Build และหากคุณรันคำสั่ง <code>/tests</code> ในภายหลังเพื่อเพิ่มชุดทดสอบ ระบบจะนำคำสั่งทดสอบนั้นเข้าสู่กระบวนการ Verify เดิมโดยอัตโนมัติ</p>
          <p>นอกจากนี้ คำสั่ง <code>/ci</code> ยังเสนอทางเลือกในการติดตั้ง <strong>Git pre-push hook</strong> ในเครื่อง เพื่อช่วยตรวจสอบโค้ดก่อนการ Push สู่ Remote ป้องกันโค้ดที่ผิดพลาดหลุดขึ้นสู่เซิร์ฟเวอร์</p>
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
          <p><strong>คำสั่งช่วยเหลือเมื่อพบสถานการณ์เฉพาะ:</strong></p>
          <ul>
            <li><strong><code>/check guide</code> (หรือ <code>try</code>)</strong>: สร้างคู่มือทดสอบ Manual Walkthrough สำหรับมนุษย์ตรวจทาน ระบุจุดคลิกและผลลัพธ์ที่ถูกต้อง</li>
            <li><strong><code>/fix</code></strong>: ใช้สำหรับงานแก้ไขบั๊กหรือการเปลี่ยนแปลงย่อยที่ไม่ได้อยู่ใน Build Plan โดยจะสร้าง Fix Spec ที่กระชับและเข้าสู่วงจรเดียวกัน</li>
            <li><strong><code>/debug</code></strong>: ใช้สืบหาสาเหตุของข้อผิดพลาดและแกะรอยปัญหาแบบ Read-Only เมื่อยืนยันสาเหตุได้แล้วจะส่งต่อให้ <code>/implement</code> หรือ <code>/fix</code> เพื่อแก้ไขต่อไป</li>
          </ul>
        `
      },
      {
        id: 'run-the-remaining-plan-continuously',
        title: 'การรันแผนงานแบบต่อเนื่องอัตโนมัติ (Run the remaining plan continuously)',
        contentHtml: `
          <p>คำสั่ง <code>/continuous</code> หรือ <code>$continuous</code> เป็นโหมดการทำงานอัตโนมัติสำหรับรันฟีเจอร์ที่ยังไม่ได้ทำใน <code>devflow/build-plan.md</code> แบบต่อเนื่องหลายรายการโดยไม่ต้องหยุดรอการอนุมัติระหว่างขั้นตอนย่อย:</p>
          <pre><code>/continuous ──▶ หยิบฟีเจอร์ถัดไป ──▶ รัน Spec/Implement/Check/Gates ──▶ Local Completion & Merge ──▶ ทำซ้ำ</code></pre>
          <p>Build Plan จะทำหน้าที่เป็นคิวงานโดยตรง แต่ละฟีเจอร์ยังคงแยก Branch, รันการทดสอบ TDD, บันทึกประวัติ และทำ Local Squash-Merge เข้าสู่ <code>main</code> อย่างปลอดภัย</p>
          <p>ระบบจะหยุดการทำงานทันทีเมื่อพบการตัดสินใจสำคัญที่ต้องให้มนุษย์เลือก, ตรวจพบสถานะที่ไม่ปลอดภัย, การทดสอบไม่ผ่าน หรือมี Audit Finding ระดับร้ายแรงที่ยังไม่ได้รับการแก้ไข และที่สำคัญคือ<strong>ไม่มีการ Push โค้ดขึ้น Remote อย่างเด็ดขาด</strong> ดูรายละเอียดที่หน้า <a href="../commands/continuous/">Continuous Mode</a></p>
        `
      },
      {
        id: 'continue-after-the-initial-build',
        title: 'การต่อยอดพัฒนาหลังการเปิดตัวเวอร์ชันแรก (Continue after the initial build)',
        contentHtml: `
          <p>ไฟล์ <code>devflow/build-plan.md</code> ยังคงทำหน้าที่เป็น Roadmap หลักของโปรเจกต์แม้ว่าจะส่งมอบเวอร์ชันแรก (MVP) ไปแล้วก็ตาม โดยให้คงรายการเดิมที่ติ๊กถูกแล้วไว้ และเพิ่มรายการฟีเจอร์ใหม่ที่ยังไม่ได้ติ๊กต่อท้าย หรือแยกหมวดหมู่เช่น <code>## Post-MVP</code></p>
          <pre><code>เพิ่มฟีเจอร์ใน build-plan.md ──▶ /overview ──▶ /feature ──▶ /implement ──▶ /check ──▶ /complete</code></pre>
          <p>หากคุณรันคำสั่ง <code>/feature "ชื่อความสามารถใหม่"</code> แล้วไม่พบรายการที่ตรงกันใน Build Plan สกิลจะเสนอเพิ่มรายการนั้นลงในแผนงานให้โดยอัตโนมัติ โดยจะแสดงรายการเปลี่ยนแปลงให้คุณตรวจสอบและอนุมัติก่อน จากนั้นจะรีเฟรช Overview และสร้าง Spec ให้ทันที</p>
        `
      },
      {
        id: 'reverse-a-completed-feature',
        title: 'การย้อนกลับฟีเจอร์ที่ส่งมอบแล้ว (Reverse a completed feature)',
        contentHtml: `
          <p>เมื่อจำเป็นต้องถอดถอนฟีเจอร์ที่ส่งมอบไปแล้วออกจากระบบ ให้ใช้คำสั่ง <code>/rollback &lt;feature-id&gt;</code>:</p>
          <pre><code>/rollback 4 ──▶ วิเคราะห์ความเสี่ยงและสร้าง Rollback Spec ──▶ /implement ──▶ /check ──▶ /complete</code></pre>
          <p>คำสั่ง Rollback จะจับคู่รายการใน Build Plan กับประวัติใน <code>devflow/history/</code> และ Git Commit ที่ตรงกัน จากนั้นจะวิเคราะห์ความเสี่ยงของ Commit หลังจากนั้นและร่าง Rollback Spec ที่รัดกุม</p>
          <p>การดำเนินการจะ Revert เฉพาะส่วนของโค้ดผลิตภัณฑ์บน Branch <code>rollback/{xxx-slug}</code> โดยจะปกป้องไฟล์แผนงานและประวัติของ DevFlow ไว้ และเมื่อ Complete สำเร็จ ระบบจะเพิ่มบันทึก Rollback Archive พร้อมยกเลิกการติ๊กถูกใน Build Plan เพื่อสะท้อนสถานะปัจจุบันของระบบอย่างแม่นยำ ดูรายละเอียดที่หน้า <a href="../commands/rollback/">Rollback Command</a></p>
        `
      },
      {
        id: 'keep-human-gates-visible',
        title: 'การคงด่านอนุมัติของมนุษย์ให้ชัดเจน (Keep human gates visible)',
        contentHtml: `
          <p>เวิร์กโฟลว์ของ Nexus-DevFlow ออกแบบมาโดยมีมนุษย์เป็นศูนย์กลางในการตัดสินใจ (Human-in-the-Loop) โดยจะหยุดรอการอนุมัติก่อนแตะต้องโค้ดผลิตภัณฑ์และก่อนการ Merge เสมอ เนื่องจากการปรับแก้สเปกมีต้นทุนถูกกว่าการแก้โค้ด และการแก้โค้ดใน Branch มีต้นทุนถูกกว่าการแก้ข้อผิดพลาดบน Branch หลัก</p>
          <ul>
            <li><strong>Autopilot Mode</strong>: เป็นโหมดเลือกใช้งานเฉพาะคราว (Opt-in) สำหรับ 1 ฟีเจอร์หรือ 1 บั๊กฟิกซ์ โดยจะรันขั้นตอน Spec และ Implement ต่อเนื่องผ่าน Quality Gates และส่งมอบ Review Packet ให้มนุษย์ตรวจทานเมื่อจบรอบ แต่จะ<strong>ไม่รัน Rollback และไม่ทำการ Merge อัตโนมัติ</strong></li>
            <li><strong>Continuous Mode</strong>: เป็นโหมดเลือกใช้งานสำหรับรันคิวฟีเจอร์ที่วางแผนไว้ใน Build Plan แบบต่อเนื่องในเครื่อง แต่ละฟีเจอร์จะถูกสร้างและทดสอบอย่างเข้มงวด</li>
          </ul>
          <div class="note-box">
            <strong>ขอบเขตความปลอดภัยเด็ดขาด:</strong> ไม่ว่าจะเป็นโหมดใด AI จะไม่มีสิทธิ์ในการ Push โค้ด, Deploy สู่เซิร์ฟเวอร์จริง, สั่งลบข้อมูลสำคัญ, ข้ามขั้นตอนการทดสอบ หรือตัดสินใจทิศทางธุรกิจแทนคุณ
          </div>
        `
      },
      {
        id: 'resume-from-files',
        title: 'การสานต่องานจากไฟล์สถานะ (Resume from files)',
        contentHtml: `
          <p>ความคืบหน้าของงานทั้งหมดจะถูกบันทึกไว้ในไฟล์ของระบบเสมอ: Checklist ใน <code>spec.md</code> บันทึกขั้นตอนที่เสร็จสิ้นแล้ว และ Git บันทึกประวัติโค้ดและ Checkpoint Commits</p>
          <p>เมื่อเริ่มต้นวันใหม่หรือหลังจากล้างประวัติการสนทนา (Context Clear) คุณหรือ AI สามารถรันคำสั่ง <code>/status</code> หรือ <code>$status</code> เพื่อตรวจสอบสถานะปัจจุบันและระบุขั้นตอนถัดไปที่ต้องทำได้ทันที โดยไม่ต้องพึ่งพาประวัติการแชทเดิม</p>
        `
      }
    ]
  }
];
