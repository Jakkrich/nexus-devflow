import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

interface DriftReport {
  upstreamFound: boolean;
  upstreamPath?: string;
  upstreamTag?: string;
  upstreamHead?: string;
  localVersion: string;
  localHead: string;
  divergedCommits: string[];
  skillsParity: {
    upstreamTotal: number;
    localTotal: number;
    missingInLocal: string[];
    localUnique: string[];
  };
}

function runGit(cmd: string, cwd = repoRoot): string {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function findUpstreamRepoPath(): string | undefined {
  const candidatePaths = [
    path.resolve(repoRoot, "..", "ai-blueprint"),
    "D:/Projects/devtools/ai-blueprint",
    "d:/Projects/devtools/ai-blueprint"
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, ".agents", "skills"))) {
      return candidate;
    }
  }

  return undefined;
}

export function checkUpstreamDrift(): DriftReport {
  const localPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")) as { version: string };
  const localHead = runGit("git rev-parse --short HEAD") || "unknown";
  const upstreamPath = findUpstreamRepoPath();

  if (!upstreamPath) {
    return {
      upstreamFound: false,
      localVersion: localPkg.version,
      localHead,
      divergedCommits: [],
      skillsParity: {
        upstreamTotal: 0,
        localTotal: fs.readdirSync(path.join(repoRoot, ".agents", "skills")).length,
        missingInLocal: [],
        localUnique: []
      }
    };
  }

  const upstreamTag = runGit("git describe --tags --always", upstreamPath) || "unknown";
  const upstreamHead = runGit("git rev-parse --short HEAD", upstreamPath) || "unknown";
  const upstreamLog = runGit("git log -n 10 --oneline", upstreamPath);
  const divergedCommits = upstreamLog ? upstreamLog.split("\n").filter(Boolean) : [];

  const upstreamSkills = fs
    .readdirSync(path.join(upstreamPath, ".agents", "skills"), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const localSkills = fs
    .readdirSync(path.join(repoRoot, ".agents", "skills"), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const localSkillSet = new Set(localSkills);
  // Map "tests" -> "setup-tests" alias in Nexus-DevFlow
  const normalizedUpstream = upstreamSkills.map((s) => (s === "tests" ? "setup-tests" : s));

  const missingInLocal = normalizedUpstream.filter((s) => !localSkillSet.has(s));
  const upstreamSkillSet = new Set(normalizedUpstream);
  const localUnique = localSkills.filter((s) => !upstreamSkillSet.has(s));

  return {
    upstreamFound: true,
    upstreamPath,
    upstreamTag,
    upstreamHead,
    localVersion: localPkg.version,
    localHead,
    divergedCommits,
    skillsParity: {
      upstreamTotal: upstreamSkills.length,
      localTotal: localSkills.length,
      missingInLocal,
      localUnique
    }
  };
}

function printReport(report: DriftReport) {
  console.log("==================================================================");
  console.log("  📡 Nexus-DevFlow Upstream Drift & Synchronization Radar");
  console.log("==================================================================");

  if (!report.upstreamFound) {
    console.log("⚠️  Upstream AI Blueprint repository not found locally.");
    console.log(`   Local Nexus-DevFlow Version: v${report.localVersion} (${report.localHead})`);
    console.log(`   Local Core Skills Count:    ${report.skillsParity.localTotal}`);
    console.log("==================================================================\n");
    return;
  }

  console.log(`✅ Upstream Path:     ${report.upstreamPath}`);
  console.log(`🏷️  Upstream Release:  ${report.upstreamTag} (${report.upstreamHead})`);
  console.log(`🚀 Local DevFlow:     v${report.localVersion} (${report.localHead})`);
  console.log("------------------------------------------------------------------");

  console.log("\n📊 Skills Parity Analysis:");
  console.log(`   • Upstream Skills: ${report.skillsParity.upstreamTotal}`);
  console.log(`   • DevFlow Skills:  ${report.skillsParity.localTotal} (31 Core + Extensions)`);

  if (report.skillsParity.missingInLocal.length === 0) {
    console.log("   • Status:          ✅ 100% Upstream Skills Parity Achieved!");
  } else {
    console.log(`   • Missing in Local: ⚠️  ${report.skillsParity.missingInLocal.join(", ")}`);
  }

  if (report.skillsParity.localUnique.length > 0) {
    console.log(`   • DevFlow Unique:  🌟 ${report.skillsParity.localUnique.length} skills (${report.skillsParity.localUnique.slice(0, 5).join(", ")}...)`);
  }

  console.log("\n📜 Recent Upstream Commits:");
  for (const commit of report.divergedCommits.slice(0, 5)) {
    console.log(`   - ${commit}`);
  }

  console.log("\n==================================================================");
  console.log("  Drift Check Completed successfully.");
  console.log("==================================================================\n");
}

if (
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(__filename)
) {
  const report = checkUpstreamDrift();
  printReport(report);
}
