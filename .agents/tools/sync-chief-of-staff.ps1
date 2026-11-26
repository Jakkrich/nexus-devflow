param(
  [switch]$IncludeHarness,
  [switch]$NoPause
)

$ErrorActionPreference = 'Stop'

$AgentsDir = Split-Path -Parent $PSScriptRoot
$SkillDir = Join-Path $AgentsDir 'skills\chief-of-staff'
$TemplatesDestDir = Join-Path $SkillDir 'templates'
$LocalHarness = Join-Path $SkillDir 'harness.md'
$RepoUrl = 'https://github.com/Jakkrich/Chief-of-Staff.git'
$Branch = 'main'

function Normalize-LineEndings {
  param([string]$Text)
  return ($Text -replace "`r`n", "`n")
}

function Remove-TempDirectory {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return }
  Get-ChildItem -LiteralPath $Path -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.Attributes -band [System.IO.FileAttributes]::ReadOnly) {
      $_.Attributes = $_.Attributes -band (-bnot [System.IO.FileAttributes]::ReadOnly)
    }
  }
  Remove-Item -LiteralPath $Path -Recurse -Force
}

$TmpDir = Join-Path ([System.IO.Path]::GetTempPath()) ("sync-chief-of-staff-" + [guid]::NewGuid().ToString('N').Substring(0, 8))

try {
  Write-Host "Cloning chief-of-staff (sparse checkout) from $RepoUrl ($Branch) ..."
  git clone --depth 1 --branch $Branch --filter=blob:none --no-checkout $RepoUrl $TmpDir
  if ($LASTEXITCODE -ne 0) {
    throw "git clone failed with exit code $LASTEXITCODE"
  }

  Push-Location $TmpDir
  try {
    git sparse-checkout init --cone
    if ($LASTEXITCODE -ne 0) { throw "git sparse-checkout init failed with exit code $LASTEXITCODE" }
    git sparse-checkout set skills/chief-of-staff templates
    if ($LASTEXITCODE -ne 0) { throw "git sparse-checkout set failed with exit code $LASTEXITCODE" }
    git checkout $Branch
    if ($LASTEXITCODE -ne 0) { throw "git checkout $Branch failed with exit code $LASTEXITCODE" }
    $UpstreamSha = (git rev-parse --short HEAD).Trim()
  }
  finally {
    Pop-Location
  }

  $UpstreamSkillDir = Join-Path $TmpDir 'skills\chief-of-staff'
  $UpstreamTemplatesDir = Join-Path $TmpDir 'templates'
  $UpstreamHarness = Join-Path $UpstreamSkillDir 'harness.md'

  if (-not (Test-Path -LiteralPath (Join-Path $UpstreamSkillDir 'SKILL.md'))) {
    throw "Upstream skills/chief-of-staff/SKILL.md not found in $RepoUrl"
  }
  if (-not (Test-Path -LiteralPath $UpstreamTemplatesDir)) {
    throw "Upstream templates/ directory not found in $RepoUrl"
  }

  New-Item -ItemType Directory -Force -Path $SkillDir | Out-Null
  New-Item -ItemType Directory -Force -Path $TemplatesDestDir | Out-Null

  foreach ($item in Get-ChildItem -LiteralPath $UpstreamSkillDir -Force) {
    if ($item.Name -eq 'harness.md') { continue }
    $dest = Join-Path $SkillDir $item.Name
    if (Test-Path -LiteralPath $dest) {
      Remove-Item -LiteralPath $dest -Recurse -Force
    }
    Copy-Item -LiteralPath $item.FullName -Destination $dest -Recurse -Force
  }

  foreach ($existing in Get-ChildItem -LiteralPath $TemplatesDestDir -Force) {
    if ($existing.Name -eq 'AI_HANDOFF.md' -or $existing.Name -like 'legacy-v1-*') { continue }
    Remove-Item -LiteralPath $existing.FullName -Recurse -Force
  }
  foreach ($tmpl in Get-ChildItem -LiteralPath $UpstreamTemplatesDir -Force) {
    if ($tmpl.Extension -eq '.mdc' -or $tmpl.Name -like 'cursor-*') { continue }
    Copy-Item -LiteralPath $tmpl.FullName -Destination (Join-Path $TemplatesDestDir $tmpl.Name) -Recurse -Force
  }

  if (Test-Path -LiteralPath $UpstreamHarness) {
    if ($IncludeHarness) {
      Copy-Item -LiteralPath $UpstreamHarness -Destination $LocalHarness -Force
      Write-Host "[INFO] Updated harness.md from upstream (-IncludeHarness)." -ForegroundColor Yellow
    }
    elseif (-not (Test-Path -LiteralPath $LocalHarness)) {
      Copy-Item -LiteralPath $UpstreamHarness -Destination $LocalHarness -Force
      Write-Host "[INFO] Installed harness.md from upstream (no local copy existed)."
    }
    else {
      $localNorm = Normalize-LineEndings (Get-Content -LiteralPath $LocalHarness -Raw)
      $upstreamNorm = Normalize-LineEndings (Get-Content -LiteralPath $UpstreamHarness -Raw)
      if ($localNorm -ceq $upstreamNorm) {
        Write-Host "[INFO] Preserved local harness.md (matches upstream)."
      }
      else {
        Write-Host "[INFO] Preserved local harness.md (differs from upstream; pass -IncludeHarness to overwrite)." -ForegroundColor Cyan
      }
    }
  }

  Write-Host "[OK] Synced chief-of-staff ($UpstreamSha) into $SkillDir" -ForegroundColor Green
}
catch {
  Write-Host "[ERROR] $_" -ForegroundColor Red
  exit 1
}
finally {
  Remove-TempDirectory -Path $TmpDir
}
