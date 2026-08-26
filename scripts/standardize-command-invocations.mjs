import fs from 'node:fs';
import path from 'node:path';

const skillsDir = path.resolve('.agents/skills');

const mainlineStages = [
  'discovery',
  'feature',
  'fix',
  'implement',
  'check',
  'complete'
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
    if (entry.name === 'discovery') {
      content = content.replace(
        /```text\s*\n\/discovery \{title or request\}\s*\n\/discovery \{discovery-id\}\s*\n```/g,
        '```text\ndiscovery {title or request}\ndiscovery {discovery-id}\n```'
      );
    } else if (entry.name === 'feature') {
      content = content.replace(
        /```text\s*\n\/feature\s*\n```/g,
        '```text\nfeature\n```'
      );
    } else if (entry.name === 'fix') {
      content = content.replace(
        /```text\s*\n\/fix\s*\n```/g,
        '```text\nfix\n```'
      );
    } else if (entry.name === 'implement') {
      content = content.replace(
        /```text\s*\n\/implement\s*\n```/g,
        '```text\nimplement\n```'
      );
    } else if (entry.name === 'check') {
      content = content.replace(
        /```text\s*\n\/check\s*\n```/g,
        '```text\ncheck\n```'
      );
    } else if (entry.name === 'complete') {
      content = content.replace(
        /```text\s*\n\/complete\s*\n```/g,
        '```text\ncomplete\n```'
      );
    }

    if (content !== original) {
      fs.writeFileSync(skillFile, content, 'utf8');
      modifiedCount++;
    }
  }

  console.log(`Standardized ${modifiedCount} SKILL.md files in .agents/skills/`);
}

standardizeMainlineSkills();
