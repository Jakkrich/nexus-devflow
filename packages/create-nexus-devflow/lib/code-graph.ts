import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";

export interface CodeGraphNode {
  filePath: string;
  imports: string[];
  importedBy: string[];
  exports: string[];
}

export interface CodeGraph {
  nodes: Record<string, CodeGraphNode>;
  totalFiles: number;
  totalEdges: number;
}

export interface BlastRadiusReport {
  targetFile: string;
  exists: boolean;
  directDependents: string[];
  transitiveDependents: string[];
  totalAffected: number;
  impactScore: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  affectedFiles: string[];
}

const SUPPORTED_EXTENSIONS = new Set([".ts", ".js", ".mjs", ".cjs", ".jsx", ".tsx"]);
const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".nexus",
  ".agents",
  ".claude",
  "coverage"
]);

/**
 * Normalizes file path to forward slashes relative to workspace root.
 */
function normalizeRelative(projectRoot: string, filePath: string): string {
  const rel = path.isAbsolute(filePath) ? path.relative(projectRoot, filePath) : filePath;
  return rel.replace(/\\/g, "/").replace(/^\.\//, "");
}

/**
 * Resolves an import specifier relative to the importing file.
 */
function resolveImportPath(
  projectRoot: string,
  importingFile: string,
  specifier: string
): string | null {
  if (!specifier.startsWith(".")) {
    return null; // External package
  }

  const baseDir = path.dirname(path.join(projectRoot, importingFile));
  let resolved = path.join(baseDir, specifier);

  // Try direct match or common extensions
  if (fsSync.existsSync(resolved) && fsSync.statSync(resolved).isFile()) {
    return normalizeRelative(projectRoot, resolved);
  }

  const candidates = [
    resolved,
    resolved + ".ts",
    resolved + ".js",
    resolved + ".tsx",
    resolved + ".jsx",
    resolved.replace(/\.js$/, ".ts"),
    resolved.replace(/\.jsx$/, ".tsx"),
    path.join(resolved, "index.ts"),
    path.join(resolved, "index.js")
  ];

  for (const c of candidates) {
    if (fsSync.existsSync(c) && fsSync.statSync(c).isFile()) {
      return normalizeRelative(projectRoot, c);
    }
  }

  return normalizeRelative(projectRoot, resolved.replace(/\\/g, "/"));
}

/**
 * Parses exports and imports from code contents using regex AST heuristic.
 */
function parseModuleSymbols(content: string): { imports: string[]; exports: string[] } {
  const imports: string[] = [];
  const exports: string[] = [];

  // Import matches: import ... from "..." or require("...")
  const importRegex = /(?:import\s+(?:[\w*\s{},$]+from\s+)?['"]([^'"]+)['"])|(?:require\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) {
    const spec = match[1] || match[2];
    if (spec) imports.push(spec);
  }

  // Export matches: export { ... } or export const/function/class/interface/type/default
  const exportRegex = /export\s+(?:default\s+|const\s+|let\s+|var\s+|function\s+|class\s+|interface\s+|type\s+)?([a-zA-Z0-9_$]+)/g;
  while ((match = exportRegex.exec(content)) !== null) {
    const sym = match[1];
    if (sym && !["default", "const", "let", "var", "function", "class", "interface", "type"].includes(sym)) {
      exports.push(sym);
    }
  }

  return {
    imports: Array.from(new Set(imports)),
    exports: Array.from(new Set(exports))
  };
}

/**
 * Recursively scans directory to collect supported code files.
 */
async function collectFiles(dir: string, projectRoot: string, fileList: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".gitignore") continue;
    if (IGNORED_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, projectRoot, fileList);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        fileList.push(normalizeRelative(projectRoot, fullPath));
      }
    }
  }

  return fileList;
}

/**
 * Builds an In-Memory Codebase Semantic Dependency Graph.
 */
export async function buildCodeGraph(
  projectRoot: string,
  options: { maxFiles?: number } = {}
): Promise<CodeGraph> {
  const files = await collectFiles(projectRoot, projectRoot);
  const targetFiles = options.maxFiles ? files.slice(0, options.maxFiles) : files;

  const nodes: Record<string, CodeGraphNode> = {};

  // 1. Initialize all nodes
  for (const file of targetFiles) {
    nodes[file] = {
      filePath: file,
      imports: [],
      importedBy: [],
      exports: []
    };
  }

  // 2. Parse symbols and build edges
  let totalEdges = 0;
  for (const file of targetFiles) {
    try {
      const fullPath = path.join(projectRoot, file);
      const content = await fs.readFile(fullPath, "utf8");
      const { imports, exports } = parseModuleSymbols(content);

      nodes[file].exports = exports;

      for (const imp of imports) {
        const resolved = resolveImportPath(projectRoot, file, imp);
        if (resolved && nodes[resolved]) {
          if (!nodes[file].imports.includes(resolved)) {
            nodes[file].imports.push(resolved);
            totalEdges++;
          }
          if (!nodes[resolved].importedBy.includes(file)) {
            nodes[resolved].importedBy.push(file);
          }
        }
      }
    } catch {
      // Graceful ignore on unreadable files
    }
  }

  return {
    nodes,
    totalFiles: Object.keys(nodes).length,
    totalEdges
  };
}

/**
 * Calculates the Blast Radius (direct and transitive dependents) of a modified target file.
 */
export function calculateBlastRadius(graph: CodeGraph, targetFile: string): BlastRadiusReport {
  const normalizedTarget = targetFile.replace(/\\/g, "/").replace(/^\.\//, "");
  const directDependents: string[] = [];
  const transitiveDependents: string[] = [];
  const visited = new Set<string>();

  // Find exact node or match suffix
  let targetNodeKey = Object.keys(graph.nodes).find(
    (k) => k === normalizedTarget || k.endsWith(normalizedTarget) || normalizedTarget.endsWith(k)
  );

  if (!targetNodeKey || !graph.nodes[targetNodeKey]) {
    return {
      targetFile: normalizedTarget,
      exists: false,
      directDependents: [],
      transitiveDependents: [],
      totalAffected: 0,
      impactScore: "LOW",
      affectedFiles: []
    };
  }

  const direct = graph.nodes[targetNodeKey].importedBy;
  directDependents.push(...direct);
  visited.add(targetNodeKey);

  const queue = [...direct];
  for (const d of direct) visited.add(d);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const node = graph.nodes[current];
    if (node && node.importedBy) {
      for (const parent of node.importedBy) {
        if (!visited.has(parent)) {
          visited.add(parent);
          transitiveDependents.push(parent);
          queue.push(parent);
        }
      }
    }
  }

  const totalAffected = directDependents.length + transitiveDependents.length;
  let impactScore: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
  if (totalAffected >= 10) impactScore = "CRITICAL";
  else if (totalAffected >= 5) impactScore = "HIGH";
  else if (totalAffected >= 2) impactScore = "MEDIUM";

  const affectedFiles = Array.from(new Set([...directDependents, ...transitiveDependents]));

  return {
    targetFile: targetNodeKey,
    exists: true,
    directDependents,
    transitiveDependents,
    totalAffected,
    impactScore,
    affectedFiles
  };
}
