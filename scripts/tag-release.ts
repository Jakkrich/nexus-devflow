import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

interface VersionBumpOptions {
  typeOrVersion?: string;
  summary?: string;
  push?: boolean;
  dryRun?: boolean;
}

function parseSemver(version: string): { major: number; minor: number; patch: number } {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    throw new Error(`Invalid semver version: ${version}`);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  };
}

function calculateNextVersion(currentVersion: string, bumpType: string = "patch"): string {
  const { major, minor, patch } = parseSemver(currentVersion);
  const normalized = bumpType.trim().toLowerCase();

  if (normalized === "patch") {
    return `${major}.${minor}.${patch + 1}`;
  }
  if (normalized === "minor") {
    return `${major}.${minor + 1}.0`;
  }
  if (normalized === "major") {
    return `${major + 1}.0.0`;
  }
  if (/^\d+\.\d+\.\d+/.test(bumpType)) {
    return bumpType.replace(/^v/, "");
  }

  throw new Error(`Unknown bump type or invalid version: "${bumpType}". Use patch, minor, major, or explicit X.Y.Z.`);
}

export function tagRelease(options: VersionBumpOptions = {}): { oldVersion: string; newVersion: string; tag: string } {
  const pkgPath = path.join(projectRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { version: string };
  const oldVersion = pkg.version;
  const newVersion = calculateNextVersion(oldVersion, options.typeOrVersion || "patch");
  const tag = `v${newVersion}`;
  const today = new Date().toISOString().slice(0, 10);
  const summary = options.summary || `Release ${tag}`;

  console.log(`\n🚀 Nexus-DevFlow Release Manager`);
  console.log(`   Current version : ${oldVersion}`);
  console.log(`   New version     : ${newVersion} (${tag})`);
  console.log(`   Date            : ${today}\n`);

  if (options.dryRun) {
    console.log(`[DRY-RUN] Would update package.json, create-nexus-devflow, .nexus manifest, and CHANGELOG.md`);
    return { oldVersion, newVersion, tag };
  }

  // 1. Update root package.json
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log(`✔ Updated root package.json -> ${newVersion}`);

  // 2. Update packages/create-nexus-devflow/package.json
  const subPkgPath = path.join(projectRoot, "packages", "create-nexus-devflow", "package.json");
  if (fs.existsSync(subPkgPath)) {
    const subPkg = JSON.parse(fs.readFileSync(subPkgPath, "utf8")) as { version: string };
    subPkg.version = newVersion;
    fs.writeFileSync(subPkgPath, JSON.stringify(subPkg, null, 2) + "\n", "utf8");
    console.log(`✔ Updated packages/create-nexus-devflow/package.json -> ${newVersion}`);
  }

  // 3. Update .nexus/nexus-devflow.json
  const manifestPath = path.join(projectRoot, ".nexus", "nexus-devflow.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as { version: string };
    manifest.version = newVersion;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
    console.log(`✔ Updated .nexus/nexus-devflow.json -> ${newVersion}`);
  }

  // 4. Update CHANGELOG.md if not already present
  const changelogPath = path.join(projectRoot, "CHANGELOG.md");
  if (fs.existsSync(changelogPath)) {
    let changelog = fs.readFileSync(changelogPath, "utf8");
    const headerPattern = `## [${newVersion}]`;
    if (!changelog.includes(headerPattern)) {
      const insertIdx = changelog.indexOf("## [");
      if (insertIdx !== -1) {
        const entry = `## [${newVersion}] - ${today}\n\n### Changed\n- ${summary}\n\n`;
        changelog = changelog.slice(0, insertIdx) + entry + changelog.slice(insertIdx);
        fs.writeFileSync(changelogPath, changelog, "utf8");
        console.log(`✔ Added release entry to CHANGELOG.md`);
      }
    }
  }

  // 5. Run Verification
  console.log(`\n⏳ Running verification test suites...`);
  execSync("npm test", { cwd: projectRoot, stdio: "inherit" });
  execSync("npm run check:static", { cwd: projectRoot, stdio: "inherit" });

  // 6. Git commit
  console.log(`\n📦 Committing release files...`);
  execSync(`git add package.json packages/create-nexus-devflow/package.json .nexus/nexus-devflow.json CHANGELOG.md`, {
    cwd: projectRoot,
    stdio: "inherit"
  });
  execSync(`git commit -m "chore(release): bump version to ${tag}"`, {
    cwd: projectRoot,
    stdio: "inherit"
  });
  console.log(`✔ Created commit for ${tag}`);

  // 7. Git tag
  execSync(`git tag -a ${tag} -m "${summary}"`, {
    cwd: projectRoot,
    stdio: "inherit"
  });
  console.log(`✔ Created annotated Git tag ${tag}`);

  // 8. Git push
  if (options.push !== false) {
    console.log(`\n🚀 Pushing to origin main --tags...`);
    execSync(`git push origin main --tags`, {
      cwd: projectRoot,
      stdio: "inherit"
    });
    console.log(`\n🎉 Successfully pushed ${tag} to GitHub! CI/CD workflow triggered.`);
  }

  return { oldVersion, newVersion, tag };
}

// Direct CLI invocation
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  const bumpType = args[0] || "patch";
  const noPush = args.includes("--no-push");
  const dryRun = args.includes("--dry-run");
  const summaryArg = args.find((a) => a.startsWith("--summary="))?.slice("--summary=".length);

  try {
    tagRelease({
      typeOrVersion: bumpType.startsWith("-") ? "patch" : bumpType,
      push: !noPush,
      dryRun,
      summary: summaryArg
    });
  } catch (err: unknown) {
    console.error(`\n✖ Release failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
