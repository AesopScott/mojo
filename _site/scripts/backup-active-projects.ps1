param(
    [string]$BackupRoot = "G:\My Drive\maps\backup",
    [int]$SnapshotRetentionDays = 3,
    [int]$DailyRetentionDays = 30
)

$ErrorActionPreference = "Stop"

$projects = @(
    @{ Name = "mindshare"; Path = "C:\Users\scott\Code\mindshare" },
    @{ Name = "mojo"; Path = "C:\Users\scott\Code\mojo" },
    @{ Name = "watch"; Path = "C:\Users\scott\Code\watch" }
)

function Assert-UnderPath {
    param(
        [Parameter(Mandatory = $true)][string]$Candidate,
        [Parameter(Mandatory = $true)][string]$Root
    )

    $candidateFull = [System.IO.Path]::GetFullPath($Candidate)
    $rootFull = [System.IO.Path]::GetFullPath($Root)
    if (-not $rootFull.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
        $rootFull += [System.IO.Path]::DirectorySeparatorChar
    }

    if (-not $candidateFull.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to remove path outside backup root: $candidateFull"
    }
}

function Invoke-RobocopyChecked {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$Destination
    )

    New-Item -ItemType Directory -Force -Path $Destination | Out-Null
    & robocopy $Source $Destination /E /R:2 /W:2 /MT:16 /NFL /NDL /NP
    $code = $LASTEXITCODE
    if ($code -gt 7) {
        throw "Robocopy failed for $Source -> $Destination with exit code $code"
    }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$today = Get-Date -Format "yyyyMMdd"
$snapshotRoot = Join-Path $BackupRoot "snapshots\$timestamp"
$dailyContainer = Join-Path $BackupRoot "daily"
$dailyMarkerPath = Join-Path $dailyContainer "$today.json"
$manifestPath = Join-Path $snapshotRoot "manifest.csv"

New-Item -ItemType Directory -Force -Path $snapshotRoot | Out-Null
New-Item -ItemType Directory -Force -Path $dailyContainer | Out-Null

$manifest = New-Object System.Collections.Generic.List[object]

foreach ($project in $projects) {
    if (-not (Test-Path -LiteralPath $project.Path)) {
        $manifest.Add([pscustomobject]@{
            Project = $project.Name
            Source = $project.Path
            Destination = ""
            Status = "missing-source"
            Bytes = 0
            Files = 0
        })
        continue
    }

    $destination = Join-Path $snapshotRoot $project.Name
    Invoke-RobocopyChecked -Source $project.Path -Destination $destination
    $sum = Get-ChildItem -LiteralPath $destination -Recurse -File -Force -ErrorAction SilentlyContinue |
        Measure-Object -Property Length -Sum

    $manifest.Add([pscustomobject]@{
        Project = $project.Name
        Source = $project.Path
        Destination = $destination
        Status = "backed-up"
        Bytes = [int64]($sum.Sum)
        Files = [int64]($sum.Count)
    })
}

$manifest | Export-Csv -LiteralPath $manifestPath -NoTypeInformation

if (-not (Test-Path -LiteralPath $dailyMarkerPath)) {
    [pscustomobject]@{
        Date = $today
        SnapshotName = $timestamp
        SnapshotPath = $snapshotRoot
        ManifestPath = $manifestPath
        CreatedAt = (Get-Date).ToString("o")
        Retention = "daily"
    } | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $dailyMarkerPath -Encoding UTF8
}

$snapshotCutoff = (Get-Date).AddDays(-1 * $SnapshotRetentionDays)
$dailyCutoff = (Get-Date).AddDays(-1 * $DailyRetentionDays)

$protectedSnapshots = @{}
Get-ChildItem -LiteralPath $dailyContainer -File -Filter "*.json" -ErrorAction SilentlyContinue |
    ForEach-Object {
        try {
            $marker = Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json
            if ($marker.SnapshotName) {
                $protectedSnapshots[$marker.SnapshotName] = $true
            }
        } catch {
            Write-Warning "Could not parse daily marker $($_.FullName): $($_.Exception.Message)"
        }
    }

$snapshotContainer = Join-Path $BackupRoot "snapshots"
if (Test-Path -LiteralPath $snapshotContainer) {
    Get-ChildItem -LiteralPath $snapshotContainer -Directory |
        Where-Object { $_.LastWriteTime -lt $snapshotCutoff -and -not $protectedSnapshots.ContainsKey($_.Name) } |
        ForEach-Object {
            Assert-UnderPath -Candidate $_.FullName -Root $BackupRoot
            Remove-Item -LiteralPath $_.FullName -Recurse -Force
        }
}

if (Test-Path -LiteralPath $dailyContainer) {
    Get-ChildItem -LiteralPath $dailyContainer -File -Filter "*.json" |
        Where-Object { $_.LastWriteTime -lt $dailyCutoff } |
        ForEach-Object {
            Assert-UnderPath -Candidate $_.FullName -Root $BackupRoot
            Remove-Item -LiteralPath $_.FullName -Force
        }
}

[pscustomobject]@{
    BackupRoot = $BackupRoot
    Snapshot = $snapshotRoot
    DailyMarker = $dailyMarkerPath
    Manifest = $manifestPath
    SnapshotRetentionDays = $SnapshotRetentionDays
    DailyRetentionDays = $DailyRetentionDays
}
