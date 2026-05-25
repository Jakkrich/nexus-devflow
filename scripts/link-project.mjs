import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function usage() {
  return 'Usage: npm run link-project -- <path-to-your-project> [--dry-run] [--overwrite]';
}

function assertChildPath(child, parent, label) {
  const relative = path.relative(parent, child);
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} must stay under ${parent}: ${child}`);
  }
}

async function pathExists(target) {
  try {
    await fs.lstat(target);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function removeExisting(target) {
  const stats = await fs.lstat(target);
  if (stats.isDirectory() && !stats.isSymbolicLink()) {
    await fs.rm(target, { recursive: true, force: true });
    return;
  }
  await fs.unlink(target);
}

async function main() {
  const args = process.argv.slice(2);
  const options = new Set(args.filter((arg) => arg.startsWith('--')));
  const positional = args.filter((arg) => !arg.startsWith('--'));
  const targetArg = positional[0];
  const dryRun = options.has('--dry-run');
  const overwrite = options.has('--overwrite');

  for (const option of options) {
    if (!['--dry-run', '--overwrite'].includes(option)) {
      console.error(`Error: Unknown option '${option}'.`);
      console.error(usage());
      process.exit(1);
    }
  }

  if (!targetArg || positional.length > 1) {
    console.error('Error: Please provide exactly one target project path.');
    console.error(usage());
    process.exit(1);
  }

  const absoluteTarget = path.resolve(process.cwd(), targetArg);
  const relativeToFramework = path.relative(rootDir, absoluteTarget);
  if (relativeToFramework === '' || (!relativeToFramework.startsWith('..') && !path.isAbsolute(relativeToFramework))) {
    console.error(`Error: Refusing to link inside the Nexus-DevFlow framework checkout: ${absoluteTarget}`);
    process.exit(1);
  }

  try {
    const stats = await fs.stat(absoluteTarget);
    if (!stats.isDirectory()) {
      console.error(`Error: Target path '${absoluteTarget}' is not a directory.`);
      process.exit(1);
    }
  } catch {
    console.error(`Error: Target path '${absoluteTarget}' does not exist.`);
    process.exit(1);
  }

  const links = [
    {
      source: path.join(rootDir, '.agent'),
      target: path.resolve(absoluteTarget, '.agent'),
      type: 'dir',
    },
    {
      source: path.join(rootDir, 'scripts'),
      target: path.resolve(absoluteTarget, 'scripts'),
      type: 'dir',
    },
  ];

  async function createSymlink({ source, target, type }) {
    assertChildPath(target, absoluteTarget, 'Link target');

    if (!(await pathExists(source))) {
      throw new Error(`Source path does not exist: ${source}`);
    }

    const existing = await pathExists(target);
    if (existing && !overwrite) {
      throw new Error(`Target already exists: ${target}. Use --overwrite to replace it.`);
    }

    if (dryRun) {
      const action = existing ? 'Would replace' : 'Would link';
      console.log(`[DRY RUN] ${action}: ${target} -> ${source}`);
      return;
    }

    if (existing) await removeExisting(target);

    try {
      await fs.symlink(source, target, type);
      console.log(`Linked: ${target} -> ${source}`);
    } catch (error) {
      if (error.code !== 'EPERM' || process.platform !== 'win32') {
        throw new Error(`Failed to link ${target}: ${error.message}`);
      }
      await fs.symlink(source, target, 'junction');
      console.log(`Linked (Junction): ${target} -> ${source}`);
    }
  }

  console.log(`\n${dryRun ? 'DRY RUN: ' : ''}Linking Nexus-DevFlow to: ${absoluteTarget}`);
  for (const link of links) {
    await createSymlink(link);
  }

  console.log(`\n${dryRun ? 'Dry run complete.' : 'Linking complete!'}`);
  console.log('Note: To use the framework fully, merge the "scripts" block from Nexus-DevFlow\'s package.json into your project package.json.\n');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
