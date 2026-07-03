param(
  [string]$ConfigPath = $env:CODEX_FILE_WATCH_CONFIG_PATH,
  [string]$AutomationDir = $env:CODEX_FILE_WATCH_AUTOMATION_DIR,
  [string]$AutomationId = $env:CODEX_FILE_WATCH_AUTOMATION_ID,
  [switch]$NoStateWrite
)

$ErrorActionPreference = "Stop"

function Get-TomlString {
  param([string]$Text, [string]$Key, [string]$Default = "")
  $match = [regex]::Match($Text, "(?m)^$([regex]::Escape($Key))\s*=\s*`"([^`"]*)`"")
  if ($match.Success) {
    return $match.Groups[1].Value
  }
  return $Default
}

function Get-TomlInt {
  param([string]$Text, [string]$Key, [int]$Default = 1)
  $match = [regex]::Match($Text, "(?m)^$([regex]::Escape($Key))\s*=\s*(\d+)")
  if ($match.Success) {
    return [int]$match.Groups[1].Value
  }
  return $Default
}

if ([string]::IsNullOrWhiteSpace($AutomationDir)) {
  if (-not [string]::IsNullOrWhiteSpace($ConfigPath)) {
    $AutomationDir = Split-Path -Parent $ConfigPath
  } elseif (-not [string]::IsNullOrWhiteSpace($env:USERPROFILE)) {
    $candidateAutomationDir = Join-Path $env:USERPROFILE ".codex\automations\vik-handoff-check"
    if (Test-Path -LiteralPath $candidateAutomationDir) {
      $AutomationDir = $candidateAutomationDir
    }
  }

  if ([string]::IsNullOrWhiteSpace($AutomationDir)) {
    Write-Output "NO_BACKLOG_VIK_QUEUE"
    Write-Output "Missing automation dir for Vik queue guard."
    exit 2
  }
}

if (-not (Test-Path -LiteralPath $AutomationDir)) {
  Write-Output "NO_BACKLOG_VIK_QUEUE"
  Write-Output "Missing automation dir for Vik queue guard: $AutomationDir"
  exit 2
}

if ([string]::IsNullOrWhiteSpace($AutomationId)) {
  $AutomationId = "vik-handoff-check"
}

$queuePath = Join-Path $AutomationDir "queue.toml"
if (-not (Test-Path -LiteralPath $queuePath)) {
  Write-Output "NO_BACKLOG_VIK_QUEUE"
  Write-Output "Missing queue.toml: $queuePath"
  exit 2
}

$queueText = Get-Content -LiteralPath $queuePath -Raw
$backlogPath = Get-TomlString -Text $queueText -Key "backlog_path"
$stateFile = Get-TomlString -Text $queueText -Key "state_path" -Default "channel_queue_guard_state.json"
$maxItems = Get-TomlInt -Text $queueText -Key "max_items_per_packet" -Default 1

if ([string]::IsNullOrWhiteSpace($backlogPath) -or -not (Test-Path -LiteralPath $backlogPath)) {
  Write-Output "NO_BACKLOG_VIK_QUEUE"
  Write-Output "Missing Vik backlog path from queue.toml: $backlogPath"
  exit 2
}

$statePath = Join-Path $AutomationDir $stateFile
$itemStatuses = @{}
if (Test-Path -LiteralPath $statePath) {
  try {
    $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    if ($null -ne $state.item_statuses) {
      foreach ($prop in $state.item_statuses.PSObject.Properties) {
        $itemStatuses[$prop.Name] = ([string]$prop.Value).ToLowerInvariant()
      }
    }
  } catch {
    $itemStatuses = @{}
  }
}

function Normalize-QueueStatus {
  param([string]$Status)
  $normalized = $Status.Trim().ToLowerInvariant()
  if ($normalized -eq "open") {
    return "backlog"
  }
  return $normalized
}

$priorityRank = @{
  "P0" = 0
  "P1" = 1
  "P2" = 2
  "P3" = 3
}

$lines = Get-Content -LiteralPath $backlogPath
$items = New-Object System.Collections.Generic.List[object]

for ($i = 0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i]
  if ($line -notmatch '^\|\s*VA-\d+\s*\|') {
    continue
  }

  $cells = ($line.Trim() -replace '^\|', '' -replace '\|$', '') -split '\|' | ForEach-Object { $_.Trim() }
  if ($cells.Count -lt 8) {
    continue
  }

  $id = $cells[0]
  $sourceUseCase = $cells[1]
  $researchQuestion = $cells[2]
  $likelyOutput = $cells[4]
  $priority = $cells[6]
  $status = Normalize-QueueStatus -Status $cells[7]

  if ($itemStatuses.ContainsKey($id)) {
    $status = Normalize-QueueStatus -Status $itemStatuses[$id]
  }

  if ($status -ne "backlog") {
    continue
  }

  $rank = if ($priorityRank.ContainsKey($priority)) { $priorityRank[$priority] } else { 99 }
  $items.Add([pscustomobject]@{
    Id = $id
    Line = $i + 1
    Priority = $priority
    Rank = $rank
    SourceUseCase = $sourceUseCase
    ResearchQuestion = $researchQuestion
    LikelyOutput = $likelyOutput
    Status = $status
  })
}

$selected = @($items | Sort-Object Rank, Line | Select-Object -First $maxItems)

if ($selected.Count -eq 0) {
  Write-Output "NO_BACKLOG_VIK_QUEUE"
  exit 0
}

Write-Output "BACKLOG_VIK_QUEUE"
foreach ($item in $selected) {
  Write-Output ("{0} {1} line {2}: {3} {4} - {5} -> {6}" -f $item.Id, $backlogPath, $item.Line, $item.Priority, $item.Status, $item.SourceUseCase, $item.LikelyOutput)
  Write-Output ("QUESTION {0}: {1}" -f $item.Id, $item.ResearchQuestion)
}
exit 2
