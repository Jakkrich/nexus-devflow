param(
  [switch]$Reinstall,
  [switch]$NoPause
)

$ErrorActionPreference = 'Stop'

$AgentsDir = Split-Path -Parent $PSScriptRoot
$PluginsDir = Join-Path $AgentsDir 'plugins'
$PstackDir = Join-Path $PluginsDir 'pstack'
$CacheDir = Join-Path $AgentsDir '.cache\pstack-claude'
$RepoUrl = 'https://github.com/michael-denyer/pstack-claude.git'
$Branch = 'main'

function Remove-TreeForce {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return }
  Get-ChildItem -LiteralPath $Path -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.Attributes -band [System.IO.FileAttributes]::ReadOnly) {
      $_.Attributes = $_.Attributes -band (-bnot [System.IO.FileAttributes]::ReadOnly)
    }
  }
  Remove-Item -LiteralPath $Path -Recurse -Force
}

function Backup-LegacyPstackChanges {
  param([string]$PluginsRoot, [string]$AgentsRoot)
  $legacyGit = Join-Path $PluginsRoot '.git'
  if (-not (Test-Path -LiteralPath $legacyGit)) { return }

  $lines = @(& git -C $PluginsRoot -c core.quotepath=false status --porcelain -- pstack 2>$null)
  if ($LASTEXITCODE -ne 0 -or $lines.Count -eq 0) { return }

  $validLines = @($lines | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
  if ($validLines.Count -eq 0) { return }

  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $backupRoot = Join-Path $AgentsRoot ".backup\legacy-pstack-$stamp"
  $copied = 0
  foreach ($line in $validLines) {
    if ($line.Length -lt 4) { continue }
    $rel = $line.Substring(3).Trim()
    if ($rel -match ' -> (.+)$') { $rel = $Matches[1].Trim() }
    if ($rel.StartsWith('"') -and $rel.EndsWith('"') -and $rel.Length -ge 2) {
      $rel = $rel.Substring(1, $rel.Length - 2)
    }
    $srcPath = Join-Path $PluginsRoot ($rel -replace '/', '\')
    if (-not (Test-Path -LiteralPath $srcPath)) { continue }
    $dstPath = Join-Path $backupRoot ($rel -replace '/', '\')
    $dstParent = Split-Path -Parent $dstPath
    if ($dstParent -and -not (Test-Path -LiteralPath $dstParent)) {
      New-Item -ItemType Directory -Force -Path $dstParent | Out-Null
    }
    Copy-Item -LiteralPath $srcPath -Destination $dstPath -Recurse -Force
    $copied++
  }
  if ($copied -gt 0) {
    Write-Host "[WARN] Backed up $copied local path(s) from legacy .agents/plugins/pstack to $backupRoot" -ForegroundColor Yellow
  }
}

function Get-PstackVersion {
  param([string]$Dir, [string]$Cache)
  foreach ($pj in @(
    (Join-Path $Dir 'plugin.json'),
    (Join-Path $Dir '.antigravity-plugin\plugin.json'),
    (Join-Path $Dir '.claude-plugin\plugin.json')
  )) {
    if (Test-Path -LiteralPath $pj) {
      try {
        $v = (Get-Content -LiteralPath $pj -Raw | ConvertFrom-Json).version
        if ($v) { return $v }
      }
      catch {}
    }
  }
  $verFile = Join-Path $Cache 'VERSION'
  if (Test-Path -LiteralPath $verFile) {
    return (Get-Content -LiteralPath $verFile -Raw).Trim()
  }
  return 'unknown'
}

New-Item -ItemType Directory -Force -Path $PluginsDir | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $CacheDir) | Out-Null

# Back up any local modifications/untracked files inside legacy cursor/plugins checkout before cleanup
$LegacyGitDir = Join-Path $PluginsDir '.git'
if (Test-Path -LiteralPath $LegacyGitDir) {
  Backup-LegacyPstackChanges -PluginsRoot $PluginsDir -AgentsRoot $AgentsDir
  Remove-TreeForce -Path $LegacyGitDir
}

$needClone = $Reinstall -or (-not (Test-Path -LiteralPath (Join-Path $CacheDir '.git')))
if (-not $needClone) {
  Write-Host "Updating pstack-claude cache in $CacheDir ..."
  git -C $CacheDir pull --ff-only origin $Branch
  if ($LASTEXITCODE -ne 0) {
    Write-Host '[WARN] Fast-forward update failed; re-cloning pstack-claude cache cleanly ...' -ForegroundColor Yellow
    $needClone = $true
  }
}

if ($needClone) {
  Remove-TreeForce -Path $CacheDir
  Write-Host "Cloning pstack-claude (sparse checkout) from $RepoUrl ($Branch) ..."
  git clone --depth 1 --branch $Branch --filter=blob:none --no-checkout $RepoUrl $CacheDir
  if ($LASTEXITCODE -ne 0) {
    throw "git clone failed with exit code $LASTEXITCODE"
  }

  Push-Location $CacheDir
  try {
    git sparse-checkout init --cone
    if ($LASTEXITCODE -ne 0) { throw "git sparse-checkout init failed with exit code $LASTEXITCODE" }
    git sparse-checkout set plugins/pstack VERSION
    if ($LASTEXITCODE -ne 0) { throw "git sparse-checkout set failed with exit code $LASTEXITCODE" }
    git checkout $Branch
    if ($LASTEXITCODE -ne 0) { throw "git checkout $Branch failed with exit code $LASTEXITCODE" }
  }
  finally {
    Pop-Location
  }
}

$SourcePstack = Join-Path $CacheDir 'plugins\pstack'
if (-not (Test-Path -LiteralPath (Join-Path $SourcePstack 'skills\poteto-mode\SKILL.md'))) {
  throw "Expected plugins/pstack/skills/poteto-mode/SKILL.md not found in $CacheDir"
}

Remove-TreeForce -Path $PstackDir
Copy-Item -LiteralPath $SourcePstack -Destination $PstackDir -Recurse -Force

# Ensure Antigravity workspace plugin manifest exists at root of .agents/plugins/pstack/
$AgyManifest = Join-Path $PstackDir '.antigravity-plugin\plugin.json'
$RootManifest = Join-Path $PstackDir 'plugin.json'
if ((Test-Path -LiteralPath $AgyManifest) -and -not (Test-Path -LiteralPath $RootManifest)) {
  Copy-Item -LiteralPath $AgyManifest -Destination $RootManifest -Force
}

# Remove SessionStart / PreToolUse hook manifests inside the mirrored tree so Windows hosts
# do not attempt to execute ./hooks/session-start.sh or duplicate Chief of Staff routing.
foreach ($hookFile in @(
  'hooks.json',
  'hooks\hooks.json',
  'hooks\codex-hooks.json',
  'hooks\copilot-hooks.json'
)) {
  $hp = Join-Path $PstackDir $hookFile
  if (Test-Path -LiteralPath $hp) {
    Remove-Item -LiteralPath $hp -Force
  }
}

# Use a single official logo.png in .agents/plugins/pstack/assets/logo.png and rewrite manifests
$CustomLogo = Join-Path $AgentsDir 'assets\logo.png'
if (Test-Path -LiteralPath $CustomLogo) {
  $assetsDir = Join-Path $PstackDir 'assets'
  New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
  Copy-Item -LiteralPath $CustomLogo -Destination (Join-Path $assetsDir 'logo.png') -Force
  foreach ($oldAsset in @(
    (Join-Path $assetsDir 'pstack-icon.png'),
    (Join-Path $assetsDir 'pstack-icon.prompt.txt'),
    (Join-Path $PstackDir '.claude-plugin\icon.png')
  )) {
    if (Test-Path -LiteralPath $oldAsset) {
      Remove-Item -LiteralPath $oldAsset -Force
    }
  }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  foreach ($mf in @(
    (Join-Path $PstackDir 'plugin.json'),
    (Join-Path $PstackDir '.antigravity-plugin\plugin.json'),
    (Join-Path $PstackDir '.codex-plugin\plugin.json'),
    (Join-Path $PstackDir '.muse-plugin\plugin.json')
  )) {
    if (Test-Path -LiteralPath $mf) {
      $raw = [System.IO.File]::ReadAllText($mf, $utf8NoBom)
      if ($raw.Contains('pstack-icon.png')) {
        [System.IO.File]::WriteAllText($mf, $raw.Replace('pstack-icon.png', 'logo.png'), $utf8NoBom)
      }
    }
  }
}

$ver = Get-PstackVersion -Dir $PstackDir -Cache $CacheDir
$sha = (git -C $CacheDir rev-parse --short HEAD).Trim()
Write-Host "[OK] pstack-claude (version $ver, commit $sha) ready at $PstackDir" -ForegroundColor Green
