# Trae AI Protection Script
# Auto Snapshot, Risk Assessment, Safe Recovery

param(
    [string]$Action = "protect",
    [string]$TaskId = "",
    [string]$RecoveryPoint = ""
)

$ProjectRoot = "D:\traepj\life-simulator"
$TraeDir = "$ProjectRoot\.trae"
$ConfigFile = "$TraeDir\protection_config.json"

function Write-ColorOutput {
    param([string]$Message, [string]$Level = "info")
    switch ($Level) {
        "success" { Write-Host "[OK] $Message" -ForegroundColor Green }
        "warning" { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
        "danger" { Write-Host "[DANGER] $Message" -ForegroundColor Red }
        "info" { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
        default { Write-Host $Message }
    }
}

function Get-ProtectionConfig {
    if (Test-Path $ConfigFile) {
        return Get-Content $ConfigFile | ConvertFrom-Json
    }
    return $null
}

function New-TaskSnapshot {
    param([string]$TaskDescription = "Auto Snapshot")

    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $snapshotName = "backup/snapshot-$timestamp"
    $commitMessage = "[AUTO] $TaskDescription - $timestamp"

    Write-ColorOutput "Creating snapshot: $snapshotName" "info"

    Set-Location $ProjectRoot
    $status = git status --porcelain

    if ($status) {
        Write-ColorOutput "Uncommitted changes detected, staging..." "warning"
        git add .
        git commit -m $commitMessage
        Write-ColorOutput "Changes committed" "success"
    }

    git branch $snapshotName
    Write-ColorOutput "Snapshot branch created: $snapshotName" "success"

    $currentSha = git rev-parse HEAD
    Write-ColorOutput "Current SHA: $currentSha" "info"

    $logEntry = "[$timestamp] Snapshot: $snapshotName | SHA: $currentSha | Task: $TaskDescription"
    Add-Content -Path "$TraeDir\snapshots.log" -Value $logEntry

    return @{
        Branch = $snapshotName
        SHA = $currentSha
        Timestamp = $timestamp
    }
}

function Test-CommandRisk {
    param([string]$Command)

    $config = Get-ProtectionConfig
    $commandLower = $Command.ToLower()

    foreach ($pattern in $config.risk_levels.high) {
        if ($commandLower -match $pattern.ToLower()) {
            return @{
                Level = "high"
                Message = "HIGH RISK command detected: $Command"
                RequireConfirm = $true
            }
        }
    }

    foreach ($pattern in $config.risk_levels.medium) {
        if ($commandLower -match $pattern.ToLower()) {
            return @{
                Level = "medium"
                Message = "MEDIUM RISK command detected: $Command"
                RequireConfirm = $true
            }
        }
    }

    return @{
        Level = "low"
        Message = "Command is safe: $Command"
        RequireConfirm = $false
    }
}

function Restore-Version {
    param([string]$Point)

    Write-ColorOutput "Preparing to restore: $Point" "warning"

    Set-Location $ProjectRoot

    if ($Point -match "^[a-f0-9]{7,}$") {
        $exists = git rev-parse --verify $Point 2>$null
        if (-not $exists) {
            Write-ColorOutput "SHA not found: $Point" "danger"
            return $false
        }
        git reset --hard $Point
    } else {
        $exists = git branch -a | Select-String $Point
        if (-not $exists) {
            Write-ColorOutput "Branch not found: $Point" "danger"
            return $false
        }
        git reset --hard $Point
    }

    Write-ColorOutput "Successfully restored: $Point" "success"
    return $true
}

function Get-AllBackups {
    Set-Location $ProjectRoot
    Write-ColorOutput "`n=== All Backup Branches ===" "info"

    $branches = git branch -a | Select-String "backup"
    if ($branches) {
        $branches | ForEach-Object { Write-Host $_.Line }
    } else {
        Write-ColorOutput "No backup branches found" "warning"
    }

    Write-ColorOutput "`n=== Recent Snapshots ===" "info"
    if (Test-Path "$TraeDir\snapshots.log") {
        Get-Content "$TraeDir\snapshots.log" -Tail 10
    }
}

function Invoke-SafeCommand {
    param([string]$Command)

    $risk = Test-CommandRisk -Command $Command

    Write-ColorOutput $risk.Message -Level $risk.Level

    if ($risk.Level -eq "high") {
        Write-ColorOutput "HIGH RISK OPERATION! Creating auto backup..." "warning"
        New-TaskSnapshot -TaskDescription "Pre-high-risk backup"

        Write-Host "`nContinue? (y/n): " -NoNewline
        $confirm = Read-Host
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-ColorOutput "Operation cancelled" "info"
            return $null
        }
    }

    Write-ColorOutput "Executing: $Command" "info"
    $result = Invoke-Expression $Command

    Write-ColorOutput "Command completed" "success"
    return $result
}

function Initialize-Protection {
    Set-Location $ProjectRoot

    Write-ColorOutput "=== Trae AI Protection System Init ===" "info"

    $backupBranch = (Get-ProtectionConfig).backup.branches.safe_backup
    $exists = git branch -a | Select-String $backupBranch

    if (-not $exists) {
        Write-ColorOutput "Creating safe backup branch: $backupBranch" "warning"
        git branch $backupBranch
    }

    if (-not (Test-Path "$TraeDir\snapshots.log")) {
        $header = "# Snapshot Log`n# Format: [Timestamp] Snapshot: Branch | SHA | Task`n"
        Set-Content -Path "$TraeDir\snapshots.log" -Value $header
    }

    Write-ColorOutput "Protection system ready" "success"
}

Set-Location $ProjectRoot

switch ($Action.ToLower()) {
    "protect" {
        if ($TaskId) {
            New-TaskSnapshot -TaskDescription "Task: $TaskId"
        } else {
            Initialize-Protection
        }
    }
    "check" {
        $risk = Test-CommandRisk -Command $TaskId
        Write-ColorOutput $risk.Message -Level $risk.Level
    }
    "restore" {
        if ($RecoveryPoint) {
            Restore-Version -Point $RecoveryPoint
        } else {
            Get-AllBackups
        }
    }
    "backups" {
        Get-AllBackups
    }
    default {
        Write-ColorOutput "Unknown action: $Action" "danger"
        Write-Host "`nAvailable actions:"
        Write-Host "  - protect [TaskId]  : Create task snapshot"
        Write-Host "  - check [Command]   : Check command risk"
        Write-Host "  - restore [Point]   : Restore to specific point"
        Write-Host "  - backups           : View all backups"
    }
}
