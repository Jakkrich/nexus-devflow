param(
  [string]$TargetDir = '',
  [string]$SourceRepo = '',
  [string]$Branch = 'main',
  [switch]$Upgrade,
  [switch]$SkipPstackSync,
  [switch]$Force,
  [switch]$NoPause
)

$ErrorActionPreference = 'Stop'
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$DefaultSourceRepo = 'https://github.com/Jakkrich/poteto-starter.git'

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

function Normalize-Lf {
  param([string]$Text)
  return ($Text -replace "`r`n", "`n")
}

function Write-Utf8File {
  param([string]$Path, [string]$Content)
  $parent = Split-Path -Parent $Path
  if ($parent -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }
  [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
}

function Copy-ManagedDirectory {
  param([string]$Source, [string]$Dest)
  if (-not (Test-Path -LiteralPath $Source)) { return }
  Remove-TreeForce -Path $Dest
  $destParent = Split-Path -Parent $Dest
  if ($destParent) { New-Item -ItemType Directory -Force -Path $destParent | Out-Null }
  Copy-Item -LiteralPath $Source -Destination $Dest -Recurse -Force
}

function Copy-ManagedFilesPreserveExtra {
  param([string]$SourceDir, [string]$DestDir)
  if (-not (Test-Path -LiteralPath $SourceDir)) { return }
  New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
  Get-ChildItem -LiteralPath $SourceDir -File -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $DestDir $_.Name) -Force
  }
}

function Merge-AdditiveGitignore {
  param([string]$SourceFile, [string]$DestFile, [string[]]$RequiredEntries)
  if (-not (Test-Path -LiteralPath $DestFile)) {
    $raw = Normalize-Lf ([System.IO.File]::ReadAllText($SourceFile, $Utf8NoBom))
    Write-Utf8File -Path $DestFile -Content ($raw.TrimEnd("`n") + "`n")
    return
  }
  $existingRaw = Normalize-Lf ([System.IO.File]::ReadAllText($DestFile, $Utf8NoBom))
  $lines = @($existingRaw -split "`n")
  $trimmedSet = New-Object 'System.Collections.Generic.HashSet[string]'
  foreach ($ln in $lines) {
    $t = $ln.Trim()
    if ($t) { [void]$trimmedSet.Add($t) }
  }
  $toAdd = @()
  foreach ($req in $RequiredEntries) {
    if (-not $trimmedSet.Contains($req)) { $toAdd += $req }
  }
  if ($toAdd.Count -gt 0) {
    $base = $existingRaw.TrimEnd("`n")
    if ($base) { $base += "`n" }
    $merged = $base + ($toAdd -join "`n") + "`n"
    Write-Utf8File -Path $DestFile -Content $merged
  }
}

function Merge-ManagedMarkdown {
  param(
    [string]$SourceFile,
    [string]$DestFile,
    [string]$LegacyV1File = '',
    [switch]$PreserveFrontmatter
  )
  $srcRaw = (Normalize-Lf ([System.IO.File]::ReadAllText($SourceFile, $Utf8NoBom))).TrimEnd("`n")
  $markerRegex = [System.Text.RegularExpressions.Regex]::new(
    '<!-- BEGIN AGENT-STARTER-KIT -->[\s\S]*?<!-- END AGENT-STARTER-KIT -->'
  )
  $blockMatch = $markerRegex.Match($srcRaw)
  if (-not $blockMatch.Success) {
    throw "Missing BEGIN/END AGENT-STARTER-KIT markers in $SourceFile"
  }
  $managedBlock = $blockMatch.Value

  if (-not (Test-Path -LiteralPath $DestFile)) {
    Write-Utf8File -Path $DestFile -Content ($srcRaw + "`n")
    return
  }

  $dstRaw = Normalize-Lf ([System.IO.File]::ReadAllText($DestFile, $Utf8NoBom))
  $beginIdx = $dstRaw.IndexOf('<!-- BEGIN AGENT-STARTER-KIT -->', [System.StringComparison]::Ordinal)
  $endIdx = $dstRaw.IndexOf('<!-- END AGENT-STARTER-KIT -->', [System.StringComparison]::Ordinal)

  if ($beginIdx -ge 0 -and $endIdx -gt $beginIdx) {
    $merged = $markerRegex.Replace($dstRaw, { param($m) $managedBlock }, 1)
    Write-Utf8File -Path $DestFile -Content $merged
    return
  }

  if ($LegacyV1File -and (Test-Path -LiteralPath $LegacyV1File)) {
    $v1Norm = (Normalize-Lf ([System.IO.File]::ReadAllText($LegacyV1File, $Utf8NoBom))).TrimEnd("`n")
    if ($dstRaw.TrimEnd("`n") -ceq $v1Norm) {
      Write-Utf8File -Path $DestFile -Content ($srcRaw + "`n")
      return
    }
    $v1Idx = $dstRaw.IndexOf($v1Norm, [System.StringComparison]::Ordinal)
    if ($v1Idx -ge 0) {
      $replacement = if ($PreserveFrontmatter) { $srcRaw } else { $managedBlock }
      $merged = $dstRaw.Substring(0, $v1Idx) + $replacement + $dstRaw.Substring($v1Idx + $v1Norm.Length)
      Write-Utf8File -Path $DestFile -Content ($merged.TrimEnd("`n") + "`n")
      return
    }
  }

  if ($PreserveFrontmatter) {
    $fmMatch = [System.Text.RegularExpressions.Regex]::Match($dstRaw, '^(---\n[\s\S]*?\n---\n)')
    if ($fmMatch.Success) {
      $fm = $fmMatch.Value
      $rest = $dstRaw.Substring($fm.Length).TrimStart("`n")
      $merged = $fm + $managedBlock + "`n`n" + $rest
      Write-Utf8File -Path $DestFile -Content ($merged.TrimEnd("`n") + "`n")
      return
    }
  }

  $mergedFallback = $managedBlock + "`n`n" + $dstRaw.TrimStart("`n")
  Write-Utf8File -Path $DestFile -Content ($mergedFallback.TrimEnd("`n") + "`n")
}

function Migrate-LegacyCursorRule {
  param(
    [string]$TargetRoot,
    [string]$LegacyCursorTemplate,
    [string]$TargetRuleFile
  )
  $legacyMdc = Join-Path $TargetRoot '.cursor\rules\chief-of-staff.mdc'
  if (-not (Test-Path -LiteralPath $legacyMdc)) { return }

  $mdcNorm = (Normalize-Lf ([System.IO.File]::ReadAllText($legacyMdc, $Utf8NoBom))).TrimEnd("`n")
  $v1CursorNorm = ''
  if (Test-Path -LiteralPath $LegacyCursorTemplate) {
    $v1CursorNorm = (Normalize-Lf ([System.IO.File]::ReadAllText($LegacyCursorTemplate, $Utf8NoBom))).TrimEnd("`n")
  }

  if ($v1CursorNorm -and ($mdcNorm -cne $v1CursorNorm)) {
    $custom = $mdcNorm
    $v1Idx = $custom.IndexOf($v1CursorNorm, [System.StringComparison]::Ordinal)
    if ($v1Idx -ge 0) {
      $custom = ($custom.Substring(0, $v1Idx) + $custom.Substring($v1Idx + $v1CursorNorm.Length)).Trim()
    }
    else {
      $custom = ([System.Text.RegularExpressions.Regex]::Replace($custom, '^---\n[\s\S]*?\n---\n', '')).Trim()
    }

    if ($custom -and (Test-Path -LiteralPath $TargetRuleFile)) {
      $ruleRaw = Normalize-Lf ([System.IO.File]::ReadAllText($TargetRuleFile, $Utf8NoBom))
      if (-not $ruleRaw.Contains($custom)) {
        $appended = $ruleRaw.TrimEnd("`n") + "`n`n## Migrated Legacy Notes (from .cursor/rules/chief-of-staff.mdc)`n`n" + $custom + "`n"
        Write-Utf8File -Path $TargetRuleFile -Content $appended
        Write-Host 'Migrated custom notes from .cursor/rules/chief-of-staff.mdc into .agents/rules/chief-of-staff.md'
      }
    }
  }

  Remove-Item -LiteralPath $legacyMdc -Force
  Write-Host 'Removed legacy .cursor/rules/chief-of-staff.mdc'
  $legacyRulesDir = Join-Path $TargetRoot '.cursor\rules'
  if ((Test-Path -LiteralPath $legacyRulesDir) -and ((Get-ChildItem -LiteralPath $legacyRulesDir -Force | Measure-Object).Count -eq 0)) {
    Remove-Item -LiteralPath $legacyRulesDir -Force
  }
  $legacyCursorDir = Join-Path $TargetRoot '.cursor'
  if ((Test-Path -LiteralPath $legacyCursorDir) -and ((Get-ChildItem -LiteralPath $legacyCursorDir -Force | Measure-Object).Count -eq 0)) {
    Remove-Item -LiteralPath $legacyCursorDir -Force
    Write-Host 'Removed empty legacy .cursor directory'
  }
}

function Assert-SafeTargetDir {
  param([string]$Path)
  if ([string]::IsNullOrWhiteSpace($Path)) {
    throw 'TargetDir must not be empty.'
  }
  $full = [System.IO.Path]::GetFullPath($Path).TrimEnd('\', '/')
  $homeFull = [System.IO.Path]::GetFullPath($HOME).TrimEnd('\', '/')
  $rootFull = [System.IO.Path]::GetPathRoot($full).TrimEnd('\', '/')
  if ($full -ieq $homeFull -or $full -ieq $rootFull) {
    throw "Refusing unsafe TargetDir: $full (on-project installs only; never install into HOME or filesystem root)."
  }
  return $full
}

$StarterRoot = [System.IO.Path]::GetFullPath((Split-Path -Parent (Split-Path -Parent $PSScriptRoot))).TrimEnd('\', '/')

if ($Upgrade -and [string]::IsNullOrWhiteSpace($TargetDir)) {
  $TargetDir = $StarterRoot
}
if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  $TargetDir = (Get-Location).Path
}
if (-not (Test-Path -LiteralPath $TargetDir)) {
  New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
}
$TargetFull = Assert-SafeTargetDir -Path $TargetDir

$ManifestPath = Join-Path $TargetFull '.agents\starter-kit.json'
if (-not $PSBoundParameters.ContainsKey('SourceRepo') -or [string]::IsNullOrWhiteSpace($SourceRepo)) {
  if (Test-Path -LiteralPath $ManifestPath) {
    try {
      $existingManifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json
      if ($existingManifest.sourceRepo) { $SourceRepo = [string]$existingManifest.sourceRepo }
      if (-not $PSBoundParameters.ContainsKey('Branch') -and $existingManifest.branch) {
        $Branch = [string]$existingManifest.branch
      }
    }
    catch {}
  }
  if ([string]::IsNullOrWhiteSpace($SourceRepo)) {
    $SourceRepo = $DefaultSourceRepo
  }
}

# Self-upgrade delegation with dirty starter-kit source repo guard
if ($Upgrade) {
  if ((Test-Path -LiteralPath (Join-Path $TargetFull '.git')) -and -not $Force) {
    $originUrl = (git -C $TargetFull remote get-url origin 2>$null | Out-String).Trim()
    if ($originUrl -match 'poteto-starter|agent-starter-kit') {
      $dirty = (git -C $TargetFull status --porcelain 2>$null | Out-String).Trim()
      if ($dirty) {
        throw "Refusing -Upgrade on dirty starter-kit repository ($TargetFull). Commit/stash changes or use sync-all.bat, or pass -Force."
      }
    }
  }

  if (Test-Path -LiteralPath $SourceRepo -PathType Container) {
    $SourceFull = [System.IO.Path]::GetFullPath($SourceRepo).TrimEnd('\', '/')
    if ($SourceFull -ieq $TargetFull) {
      throw "Upgrade sourceRepo ($SourceFull) is identical to TargetDir ($TargetFull)."
    }
    $localInstaller = Join-Path $SourceFull '.agents\tools\install-project.ps1'
    if (-not (Test-Path -LiteralPath $localInstaller)) {
      throw "Installer not found at $localInstaller"
    }
    & $localInstaller -TargetDir $TargetFull -SourceRepo $SourceFull -Branch $Branch -SkipPstackSync:$SkipPstackSync -NoPause
    if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    exit 0
  }

  $TmpClone = Join-Path ([System.IO.Path]::GetTempPath()) ('starter-kit-upgrade-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
  try {
    Write-Host "Fetching latest agent-starter-kit from $SourceRepo ($Branch) ..."
    git clone --depth 1 --branch $Branch $SourceRepo $TmpClone
    if ($LASTEXITCODE -ne 0) {
      throw "git clone failed with exit code $LASTEXITCODE"
    }
    $remoteInstaller = Join-Path $TmpClone '.agents\tools\install-project.ps1'
    if (-not (Test-Path -LiteralPath $remoteInstaller)) {
      throw "Installer not found in cloned repo at $remoteInstaller"
    }
    & $remoteInstaller -TargetDir $TargetFull -SourceRepo $SourceRepo -Branch $Branch -SkipPstackSync:$SkipPstackSync -NoPause
    if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    exit 0
  }
  finally {
    Remove-TreeForce -Path $TmpClone
  }
}

$IsSelfTarget = ($TargetFull -ieq $StarterRoot)
$ProjectName = Split-Path -Leaf $TargetFull
$TemplatesDir = Join-Path $StarterRoot '.agents\skills\chief-of-staff\templates'

if (-not $IsSelfTarget) {
  Write-Host "Installing/updating starter-kit files into $TargetFull ..."

  # 1. Additive .agents/.gitignore + file-by-file .agents/tools/ + managed skill/doc dirs
  Merge-AdditiveGitignore `
    -SourceFile (Join-Path $StarterRoot '.agents\.gitignore') `
    -DestFile (Join-Path $TargetFull '.agents\.gitignore') `
    -RequiredEntries @('plugins/', '.cache/', '.backup/')

  Copy-ManagedFilesPreserveExtra `
    -SourceDir (Join-Path $StarterRoot '.agents\tools') `
    -DestDir (Join-Path $TargetFull '.agents\tools')

  Copy-ManagedDirectory -Source (Join-Path $StarterRoot '.agents\skills\chief-of-staff') -Dest (Join-Path $TargetFull '.agents\skills\chief-of-staff')
  Copy-ManagedDirectory -Source (Join-Path $StarterRoot '.agents\skills\make-bot-ui') -Dest (Join-Path $TargetFull '.agents\skills\make-bot-ui')
  Copy-ManagedDirectory -Source (Join-Path $StarterRoot '.agents\docs\pstack-guide-th') -Dest (Join-Path $TargetFull '.agents\docs\pstack-guide-th')
  Copy-ManagedDirectory -Source (Join-Path $StarterRoot '.agents\assets') -Dest (Join-Path $TargetFull '.agents\assets')

  # 2. Lossless marker-block + exact-v1 merge for rules and migrate custom notes from .cursor/rules/chief-of-staff.mdc
  $TargetCosRule = Join-Path $TargetFull '.agents\rules\chief-of-staff.md'
  Merge-ManagedMarkdown `
    -SourceFile (Join-Path $StarterRoot '.agents\rules\chief-of-staff.md') `
    -DestFile $TargetCosRule `
    -PreserveFrontmatter

  Migrate-LegacyCursorRule `
    -TargetRoot $TargetFull `
    -LegacyCursorTemplate (Join-Path $TemplatesDir 'legacy-v1-cursor-rule.txt') `
    -TargetRuleFile $TargetCosRule

  Merge-ManagedMarkdown `
    -SourceFile (Join-Path $StarterRoot '.agents\rules\pstack-antigravity.md') `
    -DestFile (Join-Path $TargetFull '.agents\rules\pstack-antigravity.md') `
    -LegacyV1File (Join-Path $TemplatesDir 'legacy-v1-pstack-antigravity.txt') `
    -PreserveFrontmatter

  # 3. Seed-once / untouched-v1-only upgrade for project-owned files
  $TargetHandoff = Join-Path $TargetFull 'AI_HANDOFF.md'
  if (-not (Test-Path -LiteralPath $TargetHandoff)) {
    $tmplHandoff = Join-Path $TemplatesDir 'AI_HANDOFF.md'
    $rawHandoff = [System.IO.File]::ReadAllText($tmplHandoff, $Utf8NoBom)
    $seededHandoff = $rawHandoff.Replace('<project-name>', $ProjectName)
    Write-Utf8File -Path $TargetHandoff -Content $seededHandoff
  }

  $TargetBoard = Join-Path $TargetFull '.context\cos-board.md'
  if (-not (Test-Path -LiteralPath $TargetBoard)) {
    $tmplBoard = Join-Path $TemplatesDir 'cos-board.md'
    $rawBoard = [System.IO.File]::ReadAllText($tmplBoard, $Utf8NoBom)
    $today = Get-Date -Format 'yyyy-MM-dd'
    $seededBoard = $rawBoard.Replace('YYYY-MM-DD', $today).Replace('<repo>', $ProjectName)
    $seededBoard = [System.Text.RegularExpressions.Regex]::Replace(
      $seededBoard,
      '## Latest summary\r?\n',
      "## Latest summary`nStarter kit installed on-project. Waiting for project bootstrap (fill ``AI_HANDOFF.md`` and customize ``.agents/skills/verify-project/SKILL.md``).`n"
    )
    $emDash = [char]0x2014
    $seededBoard = [System.Text.RegularExpressions.Regex]::Replace(
      $seededBoard,
      '(\|---\|---\|---\|---\|---\|---\|---\|---\|\r?\n)',
      "`$1| bootstrap-repo | Populate ``AI_HANDOFF.md`` and customize ``verify-project`` skill from real codebase inspection | ``AI_HANDOFF.md`` has accurate build/test commands & invariants; ``verify-project`` runs cleanly | Investigation | root | queued | Inspect codebase and bootstrap | $emDash |`n"
    )
    Write-Utf8File -Path $TargetBoard -Content $seededBoard
  }

  $TargetVerify = Join-Path $TargetFull '.agents\skills\verify-project\SKILL.md'
  if (-not (Test-Path -LiteralPath $TargetVerify)) {
    $verifyParent = Split-Path -Parent $TargetVerify
    New-Item -ItemType Directory -Force -Path $verifyParent | Out-Null
    Copy-Item -LiteralPath (Join-Path $StarterRoot '.agents\skills\verify-project\SKILL.md') -Destination $TargetVerify -Force
  }

  $TargetModels = Join-Path $TargetFull '.agents\rules\pstack-models.md'
  $SrcModels = Join-Path $StarterRoot '.agents\rules\pstack-models.md'
  if (-not (Test-Path -LiteralPath $TargetModels)) {
    $modelsParent = Split-Path -Parent $TargetModels
    New-Item -ItemType Directory -Force -Path $modelsParent | Out-Null
    Copy-Item -LiteralPath $SrcModels -Destination $TargetModels -Force
  }
  else {
    $legacyModelsPath = Join-Path $TemplatesDir 'legacy-v1-pstack-models.txt'
    if (Test-Path -LiteralPath $legacyModelsPath) {
      $dstModelsNorm = (Normalize-Lf ([System.IO.File]::ReadAllText($TargetModels, $Utf8NoBom))).TrimEnd("`n")
      $v1ModelsNorm = (Normalize-Lf ([System.IO.File]::ReadAllText($legacyModelsPath, $Utf8NoBom))).TrimEnd("`n")
      if ($dstModelsNorm -ceq $v1ModelsNorm) {
        Copy-Item -LiteralPath $SrcModels -Destination $TargetModels -Force
        Write-Host '[INFO] Upgraded untouched v1 .agents/rules/pstack-models.md to cross-harness defaults'
      }
    }
  }

  # 4. Lossless marker-block + exact-v1 merge for AGENTS.md, CLAUDE.md, GEMINI.md
  $legacyEntryPath = Join-Path $TemplatesDir 'legacy-v1-entry.txt'
  foreach ($entryName in @('AGENTS.md', 'CLAUDE.md', 'GEMINI.md')) {
    Merge-ManagedMarkdown `
      -SourceFile (Join-Path $StarterRoot $entryName) `
      -DestFile (Join-Path $TargetFull $entryName) `
      -LegacyV1File $legacyEntryPath
  }
}

# 5. Sync pstack-claude on-project
if (-not $SkipPstackSync) {
  $syncScript = Join-Path $TargetFull '.agents\tools\sync-pstack.ps1'
  & $syncScript -NoPause
  if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) {
    throw "sync-pstack.ps1 failed with exit code $LASTEXITCODE"
  }
}

# 6. Write provenance manifest
$starterCommit = 'local'
if (Test-Path -LiteralPath (Join-Path $StarterRoot '.git')) {
  $rev = git -C $StarterRoot rev-parse --short HEAD 2>$null
  if ($LASTEXITCODE -eq 0 -and $rev) { $starterCommit = $rev.Trim() }
}

$pstackVersion = 'pending-sync'
foreach ($pj in @(
  (Join-Path $TargetFull '.agents\plugins\pstack\plugin.json'),
  (Join-Path $TargetFull '.agents\plugins\pstack\.antigravity-plugin\plugin.json')
)) {
  if (Test-Path -LiteralPath $pj) {
    try {
      $v = (Get-Content -LiteralPath $pj -Raw | ConvertFrom-Json).version
      if ($v) { $pstackVersion = [string]$v; break }
    }
    catch {}
  }
}

$manifestObj = [ordered]@{
  name             = 'agent-starter-kit'
  sourceRepo       = $SourceRepo
  branch           = $Branch
  starterKitCommit = $starterCommit
  pstackSource     = 'https://github.com/michael-denyer/pstack-claude.git'
  pstackVersion    = $pstackVersion
  updatedAt        = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
}
$manifestJson = ($manifestObj | ConvertTo-Json -Depth 3) + "`n"
Write-Utf8File -Path $ManifestPath -Content $manifestJson

Write-Host "[OK] agent-starter-kit ready on-project at $TargetFull (commit: $starterCommit, pstack: $pstackVersion)" -ForegroundColor Green
