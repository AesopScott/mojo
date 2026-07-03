param(
  [string]$AutomationRoot = (Join-Path $env:USERPROFILE ".codex\automations")
)

$ErrorActionPreference = "Stop"
$errors = New-Object System.Collections.Generic.List[string]

function Read-Automation {
  param([string]$Id)
  $path = Join-Path $AutomationRoot "$Id\automation.toml"
  if (-not (Test-Path -LiteralPath $path)) {
    $errors.Add("Missing automation: $Id")
    return $null
  }
  $text = Get-Content -LiteralPath $path -Raw
  return [pscustomobject]@{
    Id = $Id
    Path = $path
    Text = $text
    Kind = if ($text -match '(?m)^kind = "([^"]+)"') { $Matches[1] } else { "" }
    Status = if ($text -match '(?m)^status = "([^"]+)"') { $Matches[1] } else { "" }
    RRule = if ($text -match '(?m)^rrule = "([^"]+)"') { $Matches[1] } else { "" }
  }
}

$backlog = Read-Automation "vik-visible-backlog-research"
$memory = Read-Automation "vik-daily-role-memory-maintenance"
$handoffDir = Join-Path $AutomationRoot "vik-handoff-check"
$queuePath = Join-Path $handoffDir "queue.toml"
$fileWatchPath = Join-Path $handoffDir "file-watch.toml"

if ($null -ne $backlog) {
  if ($backlog.Kind -ne "heartbeat") { $errors.Add("Backlog automation must be a heartbeat.") }
  if ($backlog.Status -ne "ACTIVE") { $errors.Add("Backlog automation must be ACTIVE.") }
  if ($backlog.RRule -ne "FREQ=MINUTELY;INTERVAL=30") { $errors.Add("Backlog automation must run every 30 minutes.") }
  if ($backlog.Text -notmatch "architecture-backlog\.md") { $errors.Add("Backlog automation must read the architecture backlog.") }
  if ($backlog.Text -match "(?s)Task:.*role_memory_rollover\.py") { $errors.Add("Backlog automation must not run memory rollover.") }
  if ($backlog.Text -notmatch "Do not run .*role_memory_rollover\.py") { $errors.Add("Backlog automation must explicitly forbid memory rollover.") }
  if ($backlog.Text -match "preserve Vik's daily role-memory maintenance duty") { $errors.Add("Backlog automation must not preserve or combine memory maintenance duty.") }
  if ($backlog.Text -notmatch "(?s)After completing one backlog item.*immediately re-check") { $errors.Add("Backlog automation must immediately re-check after completing an item.") }
  if ($backlog.Text -notmatch "(?s)Repeat this item-by-item loop until no eligible backlog item remains") { $errors.Add("Backlog automation must repeat item-by-item until the backlog is empty.") }
  if ($backlog.Text -notmatch "(?s)30-minute cadence is the idle polling interval only") { $errors.Add("Backlog automation must state that 30 minutes is idle polling only.") }
  if ($backlog.Text -match "(?s)30.*minutes.*per-item|per-item.*30.*minutes") { $errors.Add("Backlog automation must not describe 30 minutes as a per-item interval.") }
}

if ($null -ne $memory) {
  if ($memory.Kind -ne "cron") { $errors.Add("Memory maintenance must be a cron automation, not Vik's thread heartbeat.") }
  if ($memory.Status -ne "ACTIVE") { $errors.Add("Memory maintenance must be ACTIVE.") }
  if ($memory.RRule -ne "FREQ=DAILY;INTERVAL=1") { $errors.Add("Memory maintenance must run daily.") }
  if ($memory.Text -notmatch "role_memory_rollover\.py") { $errors.Add("Memory maintenance must run the memory rollover script.") }
  if ($memory.Text -notmatch "Do not inspect or process Vik's architecture backlog") { $errors.Add("Memory maintenance must explicitly forbid backlog processing.") }
}

if (-not (Test-Path -LiteralPath $queuePath)) {
  $errors.Add("Missing Vik queue config: $queuePath")
} else {
  $queueText = Get-Content -LiteralPath $queuePath -Raw
  if ($queueText -notmatch '(?m)^cadence = "FREQ=MINUTELY;INTERVAL=30"$') {
    $errors.Add("Vik queue.toml cadence must be 30 minutes.")
  }
  if ($queueText -notmatch '(?m)^loop_semantics = "drain-until-empty"$') {
    $errors.Add("Vik queue.toml must document drain-until-empty loop semantics.")
  }
}

if (-not (Test-Path -LiteralPath $fileWatchPath)) {
  $errors.Add("Missing Vik file-watch config: $fileWatchPath")
} else {
  $fileWatchText = Get-Content -LiteralPath $fileWatchPath -Raw
  if ($fileWatchText -notmatch '(?m)^status = "PAUSED"$') {
    $errors.Add("Headless Vik file-watch config must remain PAUSED.")
  }
  if ($fileWatchText -notmatch '(?m)^rrule = "FREQ=MINUTELY;INTERVAL=30"$') {
    $errors.Add("Vik file-watch fallback cadence must be 30 minutes.")
  }
  if ($fileWatchText -match "preserve Vik's daily role-memory maintenance duty") {
    $errors.Add("Vik file-watch fallback prompt must not combine memory maintenance duty.")
  }
  if ($fileWatchText -notmatch "(?s)After completing one backlog item.*immediately re-check") {
    $errors.Add("Vik file-watch fallback prompt must document immediate re-check loop semantics.")
  }
  if ($fileWatchText -notmatch "(?s)Repeat this item-by-item loop until no eligible backlog item remains") {
    $errors.Add("Vik file-watch fallback prompt must repeat item-by-item until the backlog is empty.")
  }
  if ($fileWatchText -notmatch "(?s)30-minute cadence is the idle polling interval only") {
    $errors.Add("Vik file-watch fallback prompt must state that 30 minutes is idle polling only.")
  }
}

$activeVikHeartbeats = Get-ChildItem -LiteralPath $AutomationRoot -Directory |
  Where-Object { $_.Name -like "vik*" } |
  ForEach-Object {
    $path = Join-Path $_.FullName "automation.toml"
    if (Test-Path -LiteralPath $path) {
      $text = Get-Content -LiteralPath $path -Raw
      if ($text -match '(?m)^kind = "heartbeat"' -and $text -match '(?m)^status = "ACTIVE"') {
        $_.Name
      }
    }
  }

if (@($activeVikHeartbeats).Count -ne 1 -or @($activeVikHeartbeats)[0] -ne "vik-visible-backlog-research") {
  $errors.Add("Exactly one active Vik heartbeat is allowed: vik-visible-backlog-research.")
}

$staleScheduleHits = Get-ChildItem -LiteralPath $AutomationRoot -Directory |
  Where-Object { $_.Name -like "vik*" } |
  ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -File -Recurse -ErrorAction SilentlyContinue } |
  ForEach-Object { Select-String -LiteralPath $_.FullName -Pattern 'FREQ=MINUTELY;INTERVAL=3("|$)' -ErrorAction SilentlyContinue }

if ($staleScheduleHits) {
  $errors.Add("Found stale Vik three-minute schedule.")
}

if ($errors.Count -gt 0) {
  Write-Output "VIK_AUTOMATION_SEPARATION_FAILED"
  $errors | ForEach-Object { Write-Output "- $_" }
  exit 1
}

Write-Output "VIK_AUTOMATION_SEPARATION_OK"
Write-Output "backlog=heartbeat ACTIVE FREQ=MINUTELY;INTERVAL=30"
Write-Output "memory=cron ACTIVE FREQ=DAILY;INTERVAL=1"
Write-Output "file-watch=PAUSED FREQ=MINUTELY;INTERVAL=30"
Write-Output "loop=drain-until-empty idle-poll=30min"
exit 0
