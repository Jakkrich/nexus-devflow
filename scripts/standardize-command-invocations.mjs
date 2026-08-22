import fs from 'node:fs';
import path from 'node:path';

const skillsDir = path.resolve('.agents/skills');

const mainlineStages = [
  '00-explore',
  '10-define',
  '20-spec',
  '30-plan',
  '40-execute',
  '50-verify',
  '60-report',
  '70-deliver'
];

function standardizeMainlineSkills() {
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  let modifiedCount = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    let content = fs.readFileSync(skillFile, 'utf8');
    let original = content;

    // Standardize usage blocks for mainline stages
    if (entry.name === '00-explore') {
      content = content.replace(
        /```text\s*\n\/00-explore \{title or request\}\s*\n\/00-explore \{discovery-id\}\s*\n```/g,
        '```text\n00-explore {title or request}\n00-explore {discovery-id}\n```'
      );
    } else if (entry.name === '10-define') {
      content = content.replace(
        /```text\s*\n\/10-Define \{discovery-id or discovery path\}\s*\n\/10-Define \{running-id or run path\}\s*\n```/g,
        '```text\n10-define {discovery-id or discovery path}\n10-define {running-id or run path}\n```'
      );
    } else if (entry.name === '20-spec') {
      content = content.replace(
        /```text\s*\n\/20-Spec \{running-id or workspace path\}\s*\n```/g,
        '```text\n20-spec {running-id or workspace path}\n```'
      );
    } else if (entry.name === '30-plan') {
      content = content.replace(
        /```text\s*\n\/30-Plan \{running-id or workspace path\}\s*\n```/g,
        '```text\n30-plan {running-id or workspace path}\n```'
      );
    } else if (entry.name === '40-execute') {
      content = content.replace(
        /```text\s*\n\/40-Execute \{running-id or workspace path\}\s*\n```/g,
        '```text\n40-execute {running-id or workspace path}\n```'
      );
    } else if (entry.name === '50-verify') {
      content = content.replace(
        /```text\s*\n\/50-Verify \{running-id or workspace path\}\s*\n```/g,
        '```text\n50-verify {running-id or workspace path}\n```'
      );
    } else if (entry.name === '60-report') {
      content = content.replace(
        /```text\s*\n\/60-Report \{running-id or workspace path\}\s*\n```/g,
        '```text\n60-report {running-id or workspace path}\n```'
      );
    } else if (entry.name === '70-deliver') {
      content = content.replace(
        /```text\s*\n\/70-deliver \{running-id or workspace path\}\s*\n```/g,
        '```text\n70-deliver {running-id or workspace path}\n```'
      );
    }

    // Replace slash references with canonical names across all SKILL.md files
    content = content
      .replace(/\/00-explore/gi, '00-explore')
      .replace(/\/10-define/gi, '10-define')
      .replace(/\/20-spec/gi, '20-spec')
      .replace(/\/30-plan/gi, '30-plan')
      .replace(/\/40-execute/gi, '40-execute')
      .replace(/\/40-execute/gi, '40-execute')
      .replace(/\/50-verify/gi, '50-verify')
      .replace(/\/60-report/gi, '60-report')
      .replace(/\/70-deliver/gi, '70-deliver')
      .replace(/\/devflow/gi, 'devflow')
      .replace(/\/onboard/gi, 'onboard')
      .replace(/\/adopt/gi, 'adopt')
      .replace(/\/doctor/gi, 'doctor')
      .replace(/\/try/gi, 'try')
      .replace(/\/rollback/gi, 'rollback')
      .replace(/\/ci/gi, 'ci')
      .replace(/\/brief/gi, 'brief')
      .replace(/\/autopilot/gi, 'autopilot');

    if (content !== original) {
      fs.writeFileSync(skillFile, content, 'utf8');
      modifiedCount++;
    }
  }

  console.log(`Standardized ${modifiedCount} SKILL.md files in .agents/skills/`);
}

standardizeMainlineSkills();
