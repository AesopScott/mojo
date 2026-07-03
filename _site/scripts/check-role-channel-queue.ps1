param(
  [string]$ConfigPath = $env:CODEX_FILE_WATCH_CONFIG_PATH,
  [string]$AutomationDir = $env:CODEX_FILE_WATCH_AUTOMATION_DIR,
  [string]$AutomationId = $env:CODEX_FILE_WATCH_AUTOMATION_ID,
  [int]$MaxAgeHours = 48,
  [switch]$NoStateWrite
)

$ErrorActionPreference = "Stop"

function Read-FileWatchConfig {
  param([string]$Path)

  $text = Get-Content -LiteralPath $Path -Raw
  $config = [ordered]@{}
  foreach ($key in @("automation_id", "name", "target_thread_id")) {
    $match = [regex]::Match($text, "(?m)^$key\s*=\s*`"([^`"]*)`"")
    if ($match.Success) {
      $config[$key] = $match.Groups[1].Value
    }
  }

  $paths = New-Object System.Collections.Generic.List[string]
  $block = [regex]::Match($text, "(?s)watched_paths\s*=\s*\[(.*?)\]")
  if ($block.Success) {
    foreach ($line in ($block.Groups[1].Value -split "`r?`n")) {
      $pathMatch = [regex]::Match($line, '^\s*"((?:\\"|[^"])*)"\s*,?\s*$')
      if ($pathMatch.Success) {
        $paths.Add(($pathMatch.Groups[1].Value -replace '\\"','"'))
      }
    }
  }
  $config["watched_paths"] = @($paths)
  return $config
}

function Get-RoleProfile {
  param([string]$Id)

  $profiles = @{
    "ana-handoff-check" = @{
      Name = "Ana"
      Aliases = @("Ana", "Recruiter", "Ana / Recruiter")
    }
    "bea-handoff-check" = @{
      Name = "Bea"
      Aliases = @("Bea", "Mojo MAPS Engineer", "MAPS Engineer", "Implementation Engineer")
    }
    "jay-handoff-check" = @{
      Name = "Jay"
      Aliases = @("Jay", "Watch Meetup Coordinator", "Meetup Coordinator", "Customer Success")
    }
    "liz-handoff-check" = @{
      Name = "Liz"
      Aliases = @("Liz", "Mojo MAPS Training Coordinator", "Training Coordinator", "Training")
    }
    "mae-handoff-check" = @{
      Name = "Mae"
      Aliases = @("Mae", "Communications Director", "Communications")
    }
    "matt-handoff-check" = @{
      Name = "Matt"
      Aliases = @("Matt", "MAPS ASPM")
    }
    "rae-handoff-check" = @{
      Name = "Rae"
      Aliases = @("Rae", "Chief Executive Officer", "CEO", "Executive")
    }
    "vik-handoff-check" = @{
      Name = "Vik"
      Aliases = @("Vik", "MAPS ASPA", "ASPA", "Architecture", "Architect")
    }
  }

  if ($profiles.ContainsKey($Id)) {
    return $profiles[$Id]
  }

  return @{
    Name = $Id
    Aliases = @($Id -replace '-handoff-check$', '')
  }
}

function Test-MentionsRole {
  param([string]$Text, [string[]]$Aliases, [bool]$AllowBroad = $true)

  foreach ($alias in $Aliases) {
    if ([string]::IsNullOrWhiteSpace($alias)) {
      continue
    }
    $exceptPattern = '(?i)\b(?:except|excluding)\s+' + [regex]::Escape($alias) + '([^A-Za-z0-9]|$)'
    if ($Text -match $exceptPattern) {
      return $false
    }
  }

  if ($AllowBroad -and $Text -match '(?i)\b(all active roles|all roles|all active roles and agents|every active role|everybody|organization-wide)\b') {
    return $true
  }

  foreach ($alias in $Aliases) {
    if ([string]::IsNullOrWhiteSpace($alias)) {
      continue
    }
    $pattern = '(?i)(^|[^A-Za-z0-9])' + [regex]::Escape($alias) + '([^A-Za-z0-9]|$)'
    if ($Text -match $pattern) {
      return $true
    }
  }
  return $false
}

function Test-HeadingAddressesRole {
  param([string]$Heading, [string[]]$Aliases)

  foreach ($alias in $Aliases) {
    if ([string]::IsNullOrWhiteSpace($alias)) {
      continue
    }
    $pattern = '(?i)\bto\s+' + [regex]::Escape($alias) + '([^A-Za-z0-9]|$)'
    if ($Heading -match $pattern) {
      return $true
    }
  }
  return $false
}

function Test-ClosedSection {
  param([string]$Text)

  return (
    $Text -match '(?im)^-\s*Requested response:\s*None\b' -or
    $Text -match '(?im)^-\s*Next owner:\s*None\b' -or
    $Text -match '(?im)^-\s*Status:\s*(closed|complete|completed|done)\b' -or
    $Text -match '(?im)^-\s*Message:\s*(closed|complete|completed|done)\b' -or
    $Text -match '(?i)\bcommitted and pushed\b|\bpushed .* commit\b|\bno action needed\b'
  )
}

function Get-SectionDate {
  param([string]$Heading)

  $match = [regex]::Match($Heading, '\b(20\d\d-\d\d-\d\d)(?:[T\s](\d\d:\d\d(?::\d\d)?))?')
  if (-not $match.Success) {
    return $null
  }

  $value = $match.Groups[1].Value
  if ($match.Groups[2].Success) {
    $value = "$value $($match.Groups[2].Value)"
  }

  $parsed = [datetime]::MinValue
  if ([datetime]::TryParse($value, [ref]$parsed)) {
    return $parsed
  }
  return $null
}

function Get-StableId {
  param([string]$Path, [int]$Line, [string]$Heading)

  $bytes = [Text.Encoding]::UTF8.GetBytes("$Path|$Line|$Heading")
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try {
    return (($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString("x2") }) -join "").Substring(0, 16)
  } finally {
    $sha.Dispose()
  }
}

function Get-ClosureTokens {
  param([string]$Text)

  $tokens = New-Object System.Collections.Generic.List[string]
  foreach ($match in [regex]::Matches($Text, '`([^`]{5,})`')) {
    $value = $match.Groups[1].Value.Trim()
    if ($value.Length -ge 5 -and -not $tokens.Contains($value)) {
      $tokens.Add($value)
    }
  }
  foreach ($match in [regex]::Matches($Text, '(?i)(?:[A-Z]:\\|G:\\|/)?[A-Za-z0-9_.-]+(?:[\\/][A-Za-z0-9_.-]+)+')) {
    $value = $match.Value.Trim()
    if ($value.Length -ge 5 -and -not $tokens.Contains($value)) {
      $tokens.Add($value)
    }
  }
  foreach ($word in @("org-chart", "gate-block", "file-watch", "release-management")) {
    if ($Text -match [regex]::Escape($word) -and -not $tokens.Contains($word)) {
      $tokens.Add($word)
    }
  }
  return @($tokens)
}

function Test-TokenOverlap {
  param([string]$OpenText, [string]$CloseText)

  foreach ($token in (Get-ClosureTokens -Text $OpenText)) {
    if ($CloseText -match [regex]::Escape($token)) {
      return $true
    }
  }
  return $false
}

function Test-LaterRoleCloseout {
  param(
    $Sections,
    [int]$Index,
    [string]$OpenText,
    [string[]]$Aliases
  )

  if ($Index -ge ($Sections.Count - 1)) {
    return $false
  }

  for ($j = $Index + 1; $j -lt $Sections.Count; $j++) {
    $later = $Sections[$j]
    $laterBody = ($later.Lines -join "`n")
    $laterText = "$($later.Heading)`n$laterBody"
    if (-not (Test-ClosedSection -Text $laterText)) {
      continue
    }
    if (-not (Test-MentionsRole -Text $laterText -Aliases $Aliases -AllowBroad $false) -and -not (Test-HeadingAddressesRole -Heading $later.Heading -Aliases $Aliases)) {
      continue
    }
    if (Test-TokenOverlap -OpenText $OpenText -CloseText $laterText) {
      return $true
    }
  }

  return $false
}

if ([string]::IsNullOrWhiteSpace($ConfigPath) -or -not (Test-Path -LiteralPath $ConfigPath)) {
  Write-Output "OPEN_ROLE_QUEUE"
  Write-Output "Missing file-watch config for role queue guard: $ConfigPath"
  exit 2
}

if ([string]::IsNullOrWhiteSpace($AutomationDir)) {
  $AutomationDir = Split-Path -Parent $ConfigPath
}

$config = Read-FileWatchConfig -Path $ConfigPath
if ([string]::IsNullOrWhiteSpace($AutomationId)) {
  $AutomationId = $config.automation_id
}

$profile = Get-RoleProfile -Id $AutomationId
$statePath = Join-Path $AutomationDir "channel_queue_guard_state.json"
$seen = @{}
if (Test-Path -LiteralPath $statePath) {
  try {
    $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    if ($null -ne $state.seen_items) {
      foreach ($prop in $state.seen_items.PSObject.Properties) {
        $seen[$prop.Name] = $true
      }
    }
  } catch {
    $seen = @{}
  }
}

$now = Get-Date
$openItems = New-Object System.Collections.Generic.List[object]
$allOpenIds = @{}

foreach ($path in $config.watched_paths) {
  if ($path -notmatch '(?i)\\channels\\.*\.md$') {
    continue
  }
    if (-not (Test-Path -LiteralPath $path)) {
    continue
  }

  $lines = Get-Content -LiteralPath $path
  $sections = New-Object System.Collections.Generic.List[object]
  $current = $null
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^#{2,4}\s+') {
      if ($null -ne $current) {
        $sections.Add([pscustomobject]$current)
      }
      $current = @{
        Heading = $lines[$i]
        StartLine = $i + 1
        Lines = New-Object System.Collections.Generic.List[string]
      }
    } elseif ($null -ne $current) {
      $current.Lines.Add($lines[$i])
    }
  }
  if ($null -ne $current) {
    $sections.Add([pscustomobject]$current)
  }

  for ($sectionIndex = 0; $sectionIndex -lt $sections.Count; $sectionIndex++) {
    $section = $sections[$sectionIndex]
    $body = ($section.Lines -join "`n")
    $text = "$($section.Heading)`n$body"
    if (Test-ClosedSection -Text $text) {
      continue
    }

    $date = Get-SectionDate -Heading $section.Heading
    if ($null -ne $date -and $date -lt $now.AddHours(-1 * $MaxAgeHours)) {
      continue
    }

    $assignmentText = (($body -split "`r?`n") | Where-Object {
      $_ -match '(?i)^\s*(?:-\s*)?(Audience|Requested response|Requested next move|Next owner|Owner|Assigned to|Action owner|Reid responsibility|Mae monitoring rule):'
    }) -join "`n"

    $isHeartbeat = $path -match '(?i)\\heartbeat\.md$'
    $isReleaseManagement = $path -match '(?i)\\release-management\.md$'
    $allowBroad = -not ($isHeartbeat -or $isReleaseManagement)
    $assignedByField = Test-MentionsRole -Text $assignmentText -Aliases $profile.Aliases -AllowBroad $allowBroad
    $assignedByHeading = Test-HeadingAddressesRole -Heading $section.Heading -Aliases $profile.Aliases
    if (-not ($assignedByField -or $assignedByHeading)) {
      continue
    }
    $sectionArray = $sections.ToArray()
    if ($isReleaseManagement -and (Test-LaterRoleCloseout -Sections $sectionArray -Index $sectionIndex -OpenText $text -Aliases $profile.Aliases)) {
      continue
    }

    $id = Get-StableId -Path $path -Line $section.StartLine -Heading $section.Heading
    $allOpenIds[$id] = $true
    if (-not $seen.ContainsKey($id)) {
      $openItems.Add([pscustomobject]@{
        Id = $id
        Path = $path
        Line = $section.StartLine
        Heading = $section.Heading
      })
    }
  }
}

$newSeen = [ordered]@{}
foreach ($key in ($seen.Keys | Sort-Object)) {
  $newSeen[$key] = $true
}
foreach ($item in $openItems) {
  $newSeen[$item.Id] = $true
}

$envNoStateWrite = if ($env:CODEX_FILE_WATCH_NO_STATE_WRITE -eq "1") { $true } else { $false }
if (-not $NoStateWrite -and -not $envNoStateWrite -and $env:CODEX_FILE_WATCH_DRY_RUN -ne "1") {
  [pscustomobject]@{
    automation_id = $AutomationId
    role = $profile.Name
    checked_at = (Get-Date).ToUniversalTime().ToString("o")
    seen_items = $newSeen
  } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $statePath -Encoding UTF8
}

if ($openItems.Count -eq 0) {
  Write-Output "NO_OPEN_ROLE_QUEUE"
  exit 0
}

Write-Output "OPEN_ROLE_QUEUE"
foreach ($item in $openItems) {
  Write-Output ("{0} {1} line {2}: {3}" -f $item.Id, $item.Path, $item.Line, $item.Heading)
}
exit 2
