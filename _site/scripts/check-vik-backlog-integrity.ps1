param(
  [string]$AutomationDir = (Join-Path $env:USERPROFILE ".codex\automations\vik-handoff-check")
)

$ErrorActionPreference = "Stop"
$errors = New-Object System.Collections.Generic.List[string]
$validStatuses = @("backlog", "complete", "cancelled", "errored")

function Add-Error {
  param([string]$Message)
  $errors.Add($Message)
}

function Get-TomlString {
  param([string]$Text, [string]$Key, [string]$Default = "")
  $match = [regex]::Match($Text, "(?m)^$([regex]::Escape($Key))\s*=\s*`"([^`"]*)`"")
  if ($match.Success) {
    return $match.Groups[1].Value
  }
  return $Default
}

if (-not (Test-Path -LiteralPath $AutomationDir)) {
  Write-Output "VIK_BACKLOG_INTEGRITY_FAILED"
  Write-Output "- Missing automation directory: $AutomationDir"
  exit 1
}

$queuePath = Join-Path $AutomationDir "queue.toml"
if (-not (Test-Path -LiteralPath $queuePath)) {
  Write-Output "VIK_BACKLOG_INTEGRITY_FAILED"
  Write-Output "- Missing queue.toml: $queuePath"
  exit 1
}

$queueText = Get-Content -LiteralPath $queuePath -Raw
$backlogPath = Get-TomlString -Text $queueText -Key "backlog_path"
$stateFile = Get-TomlString -Text $queueText -Key "state_path" -Default "channel_queue_guard_state.json"
$reportDirName = Get-TomlString -Text $queueText -Key "completion_report_dir" -Default "reports"

if ([string]::IsNullOrWhiteSpace($backlogPath) -or -not (Test-Path -LiteralPath $backlogPath)) {
  Add-Error "Missing backlog path from queue.toml: $backlogPath"
}

$statePath = Join-Path $AutomationDir $stateFile
$stateStatuses = @{}
if (-not (Test-Path -LiteralPath $statePath)) {
  Add-Error "Missing queue state: $statePath"
} else {
  try {
    $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    foreach ($prop in $state.item_statuses.PSObject.Properties) {
      $stateStatuses[$prop.Name] = ([string]$prop.Value).Trim().ToLowerInvariant()
    }
  } catch {
    Add-Error "Queue state is not valid JSON: $statePath"
  }
}

$reportDir = Join-Path $AutomationDir $reportDirName
if (-not (Test-Path -LiteralPath $reportDir)) {
  Add-Error "Missing completion report directory: $reportDir"
}

$backlogItems = New-Object System.Collections.Generic.List[object]
if (-not [string]::IsNullOrWhiteSpace($backlogPath) -and (Test-Path -LiteralPath $backlogPath)) {
  $lines = Get-Content -LiteralPath $backlogPath
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line -notmatch '^\|\s*VA-\d+\s*\|') {
      continue
    }

    $cells = ($line.Trim() -replace '^\|', '' -replace '\|$', '') -split '\|' | ForEach-Object { $_.Trim() }
    if ($cells.Count -lt 8) {
      Add-Error ("Malformed backlog row at line {0}: {1}" -f ($i + 1), $line)
      continue
    }

    $backlogItems.Add([pscustomobject]@{
      Id = $cells[0]
      Line = $i + 1
      Status = $cells[7].Trim().ToLowerInvariant()
    })
  }
}

foreach ($item in $backlogItems) {
  if ($validStatuses -notcontains $item.Status) {
    Add-Error ("{0} line {1} has invalid backlog status '{2}'." -f $item.Id, $item.Line, $item.Status)
  }

  if (-not $stateStatuses.ContainsKey($item.Id)) {
    Add-Error ("{0} is missing from queue state." -f $item.Id)
    continue
  }

  $stateStatus = $stateStatuses[$item.Id]
  if ($validStatuses -notcontains $stateStatus) {
    Add-Error ("{0} has invalid queue-state status '{1}'." -f $item.Id, $stateStatus)
  }

  if ($stateStatus -ne $item.Status) {
    Add-Error ("{0} status mismatch: backlog={1}, state={2}." -f $item.Id, $item.Status, $stateStatus)
  }

  if ($item.Status -eq "complete") {
    $reportPath = Join-Path $reportDir ("{0}.md" -f $item.Id)
    if (-not (Test-Path -LiteralPath $reportPath)) {
      Add-Error ("{0} is complete but missing report file: {1}" -f $item.Id, $reportPath)
    }
  }
}

foreach ($id in $stateStatuses.Keys) {
  if (-not @($backlogItems | Where-Object { $_.Id -eq $id })) {
    Add-Error ("Queue state contains item not present in backlog: {0}" -f $id)
  }
}

if ($errors.Count -gt 0) {
  Write-Output "VIK_BACKLOG_INTEGRITY_FAILED"
  $errors | ForEach-Object { Write-Output "- $_" }
  exit 1
}

$completeCount = @($backlogItems | Where-Object { $_.Status -eq "complete" }).Count
$backlogCount = @($backlogItems | Where-Object { $_.Status -eq "backlog" }).Count

Write-Output "VIK_BACKLOG_INTEGRITY_OK"
Write-Output ("items={0} complete={1} backlog={2}" -f $backlogItems.Count, $completeCount, $backlogCount)
Write-Output "valid_statuses=backlog,complete,cancelled,errored"
Write-Output "complete_items_have_reports=true"
exit 0
