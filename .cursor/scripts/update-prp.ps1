param (
    [string]$Branch = "prp-auto-dev",
    [string]$RepoUrl = "https://git.nstda.or.th/application-etc/rules-development.git",
    [switch]$CheckOnly,
    [switch]$Apply
)

# Determine Target Directory globally
if ($PSScriptRoot -match "Temp" -or $PSScriptRoot -match "tmp" -or $PSScriptRoot -match "prp-updater" -or $PSScriptRoot -match "prp-setup") {
    # Running from an external one-liner (temp dir) -> Target is where the user ran the command
    $TargetRoot = (Get-Location).Path
}
else {
    # Running from inside an existing project's .cursor/scripts
    $TargetCursorDir = Split-Path $PSScriptRoot -Parent
    $TargetRoot = Split-Path $TargetCursorDir -Parent
}

$LocalHashFile = Join-Path $TargetRoot ".cursor\prp-commit.txt"

# Smart Self-Replacement Logic
if ($MyInvocation.MyCommand.Path -match "update-prp\.ps1$") {
    if ($Apply) {
        $RunnerPath = Join-Path $PSScriptRoot "update-runner.ps1"
        Write-Host "[!] Spawning temporary runner to allow the script to override itself..." -ForegroundColor Cyan
        Copy-Item -Path $MyInvocation.MyCommand.Path -Destination $RunnerPath -Force
        
        $ProcessInfo = New-Object System.Diagnostics.ProcessStartInfo
        $ProcessInfo.FileName = "powershell.exe"
        $ProcessInfo.Arguments = "-ExecutionPolicy Bypass -File `"$RunnerPath`" -Apply -Branch `"$Branch`" -RepoUrl `"$RepoUrl`""
        $ProcessInfo.UseShellExecute = $false
        
        $Process = [System.Diagnostics.Process]::Start($ProcessInfo)
        $Process.WaitForExit()
        
        if (Test-Path $RunnerPath) { Remove-Item $RunnerPath -Force }
        exit $Process.ExitCode
    }
}

function Get-RemoteHash {
    $output = git ls-remote $RepoUrl $Branch 2> $null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($output)) {
        Write-Host "[Error] Failed to reach repository '$RepoUrl'." -ForegroundColor Red
        exit 1
    }
    return ($output -split '\s+')[0]
}

function Get-LocalHash {
    if (Test-Path $LocalHashFile) {
        return (Get-Content $LocalHashFile | Select-Object -First 1).Trim()
    }
    return "NONE"
}

if ($CheckOnly) {
    Write-Host "[i] Verifying framework updates with '$Branch'..." -ForegroundColor Cyan
    $RemoteHash = Get-RemoteHash
    $LocalHash = Get-LocalHash
    
    if ($RemoteHash -ne $LocalHash) {
        Write-Host "UPDATE_AVAILABLE=true"
        Write-Host "LATEST_HASH=$RemoteHash"
        Write-Host "CURRENT_HASH=$LocalHash"
        Write-Host "`n[!] An update is available! Current: $LocalHash -> New: $RemoteHash" -ForegroundColor Yellow
    }
    else {
        Write-Host "UPDATE_AVAILABLE=false"
        Write-Host "[OK] You are already on the latest system version ($LocalHash)." -ForegroundColor Green
    }
    exit 0
}

if ($Apply) {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "[>] Applying PRP Framework Update" -ForegroundColor Green
    Write-Host "Repository: $RepoUrl"
    Write-Host "Branch:     $Branch"
    Write-Host "==========================================" -ForegroundColor Cyan

    $RemoteHash = Get-RemoteHash
    $LocalHash = Get-LocalHash

    if ($RemoteHash -eq $LocalHash) {
        Write-Host "[OK] You are already on the latest version. Update aborted." -ForegroundColor Green
        exit 0
    }

    $TempDir = Join-Path $env:TEMP "prp-updater-$([guid]::NewGuid())"
    Write-Host "`n[1/3] Downloading latest framework components..."

    git clone -b $Branch --depth 1 $RepoUrl $TempDir 2> $null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Error] Failed to download repository. Please check your access rights." -ForegroundColor Red
        if (Test-Path $TempDir) { Remove-Item -Path $TempDir -Recurse -Force }
        exit 1
    }

    Write-Host "[2/3] Applying updates to local framework..."
    
    $TargetCursor = Join-Path $TargetRoot ".cursor"
    $TargetAutoClaude = Join-Path $TargetRoot ".auto-claude"

    Write-Host "   -> Project Target Root: $TargetRoot" -ForegroundColor Cyan

    if (-not (Test-Path $TargetCursor)) { New-Item -ItemType Directory -Path $TargetCursor -Force | Out-Null }
    if (-not (Test-Path $TargetAutoClaude)) { New-Item -ItemType Directory -Path $TargetAutoClaude -Force | Out-Null }

    if (Test-Path "$TempDir\.cursor") {
        Write-Host "   -> Updating .cursor/ folder..."
        Copy-Item -Path "$TempDir\.cursor\*" -Destination "$TargetCursor\" -Recurse -Force -ErrorAction SilentlyContinue 2>$null
    }

    if (Test-Path "$TempDir\.auto-claude") {
        Write-Host "   -> Updating .auto-claude/ folder..."
        Copy-Item -Path "$TempDir\.auto-claude\*" -Destination "$TargetAutoClaude\" -Recurse -Force -ErrorAction SilentlyContinue 2>$null
    }

    $RemoteHash | Out-File -FilePath $LocalHashFile -Encoding UTF8

    Write-Host "[3/3] Cleaning up temporary files..."
    Remove-Item -Path $TempDir -Recurse -Force

    Write-Host "`n[OK] Update Completed Successfully! System updated to commit $RemoteHash" -ForegroundColor Green
    exit 0
}

Write-Host "[!] Please specify -CheckOnly or -Apply" -ForegroundColor Yellow
