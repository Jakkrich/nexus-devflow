import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillsDir = path.resolve(__dirname, '../.agents/skills');
const entries = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

console.log(`Total skill directories: ${entries.length}`);

entries.forEach(name => {
  const skillFile = path.join(skillsDir, name, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    console.log(`[NO SKILL.MD] ${name}`);
  } else {
    const content = fs.readFileSync(skillFile, 'utf8');
    const match = content.match(/description:\s*([^\r\n]+)/);
    if (!match) {
      console.log(`[NO DESCRIPTION] ${name}`);
    }
  }
});
