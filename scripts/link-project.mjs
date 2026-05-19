import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  // node scripts/link-project.mjs <target>
  const targetArg = process.argv[2];
  if (!targetArg) {
    console.error('Error: Please provide the target project path.');
    console.error('Usage: npm run link-project -- <path-to-your-project>');
    process.exit(1);
  }

  const absoluteTarget = path.resolve(process.cwd(), targetArg);

  try {
    const stats = await fs.stat(absoluteTarget);
    if (!stats.isDirectory()) {
      console.error(`Error: Target path '${absoluteTarget}' is not a directory.`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error: Target path '${absoluteTarget}' does not exist.`);
    process.exit(1);
  }

  const agentSource = path.join(rootDir, '.agent');
  const agentTarget = path.join(absoluteTarget, '.agent');
  
  const scriptsSource = path.join(rootDir, 'scripts');
  const scriptsTarget = path.join(absoluteTarget, 'scripts');

  async function createSymlink(source, target, type = 'dir') {
    try {
      await fs.symlink(source, target, type);
      console.log(`✅ Linked: ${target} -> ${source}`);
    } catch (err) {
      if (err.code === 'EEXIST') {
         console.log(`⚠️  Already exists (skipping): ${target}`);
      } else if (err.code === 'EPERM' && process.platform === 'win32') {
         // Fallback to junction on Windows if symlink fails due to lack of admin rights
         try {
             await fs.symlink(source, target, 'junction');
             console.log(`✅ Linked (Junction): ${target} -> ${source}`);
         } catch (jErr) {
             console.error(`❌ Failed to link ${target}: ${jErr.message}`);
         }
      } else {
         console.error(`❌ Failed to link ${target}: ${err.message}`);
      }
    }
  }

  console.log(`\nLinking Nexus-DevFlow to: ${absoluteTarget}`);
  await createSymlink(agentSource, agentTarget, 'dir');
  await createSymlink(scriptsSource, scriptsTarget, 'dir');
  
  console.log(`\n🎉 Linking complete!`);
  console.log(`Note: To use the framework fully, merge the "scripts" block from Nexus-DevFlow's package.json into your project's package.json.\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
