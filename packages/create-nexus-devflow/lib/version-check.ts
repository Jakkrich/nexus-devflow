type PackageVersionState = "current" | "available" | "offline" | "unknown";
type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;

interface PackageVersionStatus {
  packageName: string;
  installedVersion: string | null;
  latestVersion: string | null;
  state: PackageVersionState;
  checkedAt: string;
  message: string;
}

interface VersionCheckOptions {
  packageName?: string;
  installedVersion: string | null;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  cacheTtlMs?: number;
  now?: () => number;
}

interface CacheEntry {
  expiresAt: number;
  value: PackageVersionStatus;
}

const cache = new Map<string, CacheEntry>();

async function checkPackageVersion(options: VersionCheckOptions): Promise<PackageVersionStatus> {
  const packageName = options.packageName || "@jakkrichm/create-nexus-devflow";
  const now = options.now || Date.now;
  const cacheKey = `${packageName}:${options.installedVersion || "unknown"}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now()) return cached.value;

  const checkedAt = new Date(now()).toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 1000);
  let value: PackageVersionStatus;

  try {
    const response = await (options.fetchImpl || fetch)(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`,
      { headers: { accept: "application/json" }, signal: controller.signal }
    );
    if (!response.ok) {
      value = fallback(packageName, options.installedVersion, checkedAt, "unknown", `Registry returned HTTP ${response.status}.`);
    } else {
      const payload: unknown = await response.json();
      const latestVersion = readVersion(payload);
      value = latestVersion
        ? {
            packageName,
            installedVersion: options.installedVersion,
            latestVersion,
            state: latestVersion === options.installedVersion ? "current" : "available",
            checkedAt,
            message: latestVersion === options.installedVersion
              ? "Installed version matches the npm registry."
              : `Version ${latestVersion} is available.`
          }
        : fallback(packageName, options.installedVersion, checkedAt, "unknown", "Registry response did not include a version.");
    }
  } catch (error: unknown) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "Registry check timed out."
      : "Registry is unavailable; installed version remains usable.";
    value = fallback(packageName, options.installedVersion, checkedAt, "offline", message);
  } finally {
    clearTimeout(timeout);
  }

  cache.set(cacheKey, { expiresAt: now() + (options.cacheTtlMs ?? 600_000), value });
  return value;
}

function readVersion(payload: unknown): string | null {
  return typeof payload === "object" && payload !== null && "version" in payload && typeof payload.version === "string"
    ? payload.version
    : null;
}

function fallback(
  packageName: string,
  installedVersion: string | null,
  checkedAt: string,
  state: "offline" | "unknown",
  message: string
): PackageVersionStatus {
  return { packageName, installedVersion, latestVersion: null, state, checkedAt, message };
}

function clearVersionCheckCache(): void {
  cache.clear();
}

export { checkPackageVersion, clearVersionCheckCache };
export type { FetchLike, PackageVersionState, PackageVersionStatus, VersionCheckOptions };
