$ErrorActionPreference = 'Stop'

$logPath = Join-Path $PSScriptRoot 'token usage.md'
$htmlPath = Join-Path $PSScriptRoot 'token-usage.html'

if (-not (Test-Path $logPath)) {
  throw "Missing log file: $logPath"
}

$lines = Get-Content $logPath
$data = @()

foreach ($line in $lines) {
  if ($line -notmatch '^\|') { continue }
  if ($line -match '^\|\s*logged_at_mdt\s*\|') { continue }
  if ($line -match '^\|\s*---') { continue }

  $parts = $line.Trim('|').Split('|') | ForEach-Object { $_.Trim() }
  if ($parts.Count -lt 13) { continue }

  $data += [pscustomobject]@{
    logged_at_mdt = [datetime]::ParseExact($parts[0], 'yyyy-MM-dd HH:mm:ss', $null)
    window_start_mdt = [datetime]::ParseExact($parts[1], 'yyyy-MM-dd HH:mm:ss', $null)
    window_end_mdt = [datetime]::ParseExact($parts[2], 'yyyy-MM-dd HH:mm:ss', $null)
    interface = $parts[3]
    room_or_session = $parts[4]
    room_title_or_cwd = $parts[5]
    input_tokens = [long]$parts[6]
    output_tokens = [long]$parts[7]
    cache_create_tokens = [long]$parts[8]
    cache_read_tokens = [long]$parts[9]
    total_tokens = [long]$parts[10]
    confidence = $parts[11]
    notes = $parts[12]
  }
}

if (-not $data.Count) {
  throw 'No data rows parsed from token usage markdown.'
}

$updated = ($data | Sort-Object logged_at_mdt | Select-Object -Last 1).logged_at_mdt
$buildVersion = Get-Date -Format 'yyyyMMddHHmmss'
$displayVersion = 'v' + (Get-Date -Format 'HH:mm')
$last24Start = $updated.AddHours(-24)
$last24End = $updated
$last24 = $data | Where-Object { $_.window_end_mdt -gt $last24Start -and $_.window_end_mdt -le $last24End }
$hourly = $data |
  Group-Object { $_.window_end_mdt.ToString('yyyy-MM-dd HH:mm:ss') } |
  ForEach-Object {
    $rows = $_.Group
    $end = $rows[0].window_end_mdt
    $start = ($rows | Sort-Object window_start_mdt | Select-Object -First 1).window_start_mdt
    $codex = ($rows | Where-Object interface -eq 'Codex' | Measure-Object total_tokens -Sum).Sum
    $claude = ($rows | Where-Object interface -eq 'Claude' | Measure-Object total_tokens -Sum).Sum
    if ($null -eq $codex) { $codex = 0 }
    if ($null -eq $claude) { $claude = 0 }

    [pscustomobject]@{
      start = $start
      end = $end
      Codex = [long]$codex
      Claude = [long]$claude
      Total = [long]$codex + [long]$claude
    }
  } |
  Sort-Object end

$codexTotal = ($data | Where-Object interface -eq 'Codex' | Measure-Object total_tokens -Sum).Sum
$claudeTotal = ($data | Where-Object interface -eq 'Claude' | Measure-Object total_tokens -Sum).Sum
if ($null -eq $codexTotal) { $codexTotal = 0 }
if ($null -eq $claudeTotal) { $claudeTotal = 0 }
$codexTotal = [long]$codexTotal
$claudeTotal = [long]$claudeTotal
$grandTotal = $codexTotal + $claudeTotal

$maxY = [Math]::Max(
  ($hourly | Measure-Object Codex -Maximum).Maximum,
  ($hourly | Measure-Object Claude -Maximum).Maximum
)
if ($maxY -lt 1) { $maxY = 1 }
$maxY = [math]::Ceiling($maxY / 100000) * 100000

$chartLeft = 64
$chartTop = 28
$chartBottom = 308
$chartRight = 940
$chartHeight = $chartBottom - $chartTop
$chartWidth = $chartRight - $chartLeft
$count = $hourly.Count

function Get-X([int]$index) {
  if ($count -le 1) {
    return [double](($chartLeft + $chartRight) / 2)
  }
  return [double]($chartLeft + ($chartWidth * $index / ($count - 1)))
}

function Get-Y([long]$value) {
  return [double]($chartBottom - (($value / $maxY) * $chartHeight))
}

function Escape-Html([string]$value) {
  if ($null -eq $value) { return '' }
  return $value.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;')
}

function Fmt([long]$value) {
  return '{0:N0}' -f $value
}

$codexPts = @()
$claudePts = @()
$xLabels = @()

for ($i = 0; $i -lt $count; $i++) {
  $row = $hourly[$i]
  $x = Get-X $i
  $codexPts += ('{0:N2},{1:N2}' -f $x, (Get-Y $row.Codex))
  $claudePts += ('{0:N2},{1:N2}' -f $x, (Get-Y $row.Claude))
  $xLabels += [pscustomobject]@{
    x = $x
    label = $row.end.ToString('HH:mm')
  }
}

$gridSvg = @()
for ($step = 0; $step -le 4; $step++) {
  $val = [long]($maxY * $step / 4)
  $y = Get-Y $val
  $gridSvg += '<line class="grid" x1="' + $chartLeft + '" y1="' + ('{0:N2}' -f $y) + '" x2="' + $chartRight + '" y2="' + ('{0:N2}' -f $y) + '" />'
  $gridSvg += '<text class="label" x="56" y="' + ('{0:N2}' -f ($y + 4)) + '" text-anchor="end">' + (Fmt $val) + '</text>'
}

$codexDots = @()
$claudeDots = @()
for ($i = 0; $i -lt $count; $i++) {
  $x = Get-X $i
  $codexDots += '<circle class="dot codex" cx="' + ('{0:N2}' -f $x) + '" cy="' + ('{0:N2}' -f (Get-Y $hourly[$i].Codex)) + '" r="3" />'
  $claudeDots += '<circle class="dot claude" cx="' + ('{0:N2}' -f $x) + '" cy="' + ('{0:N2}' -f (Get-Y $hourly[$i].Claude)) + '" r="3" />'
}

$xSvg = @()
foreach ($item in $xLabels) {
  $xSvg += '<text class="label" x="' + ('{0:N2}' -f $item.x) + '" y="326" text-anchor="middle">' + (Escape-Html $item.label) + '</text>'
}

$largestClaude = $data | Where-Object interface -eq 'Claude' | Sort-Object total_tokens -Descending | Select-Object -First 3
$largestCodex = $data | Where-Object interface -eq 'Codex' | Sort-Object total_tokens -Descending | Select-Object -First 3

$codexRoomLabels = @{
  '019eec2c-bb6b-7b03-8c97-f73cf63dc7a8' = 'Tess / Autonomy Engineer'
  '019ee18f-b082-7e82-89c5-47498b9ec97e' = 'Bea / Mojo MAPS Engineer'
  '019ee143-3f32-7093-9a24-acd3558fc52e' = 'Reid / Release Manager'
  '019eed9b-cb80-7311-989f-2bbc95605d8b' = 'Liz / Web Manager'
  '019ee0cf-d067-7e60-92ae-41ea66a75746' = 'Vik / MAPS ASPA'
  '019eed17-7348-7593-b2ae-661027ba9cb2' = 'June / Staff Writer'
  '019eedc7-9e34-78c2-9792-5e8c1787fd46' = 'Lane / Mojo Lab Operator'
  '019eedc1-b201-7fb2-a5bd-9e1c6957fa39' = 'Paige / Executive Assistant'
}

$codexRooms = $last24 |
  Where-Object interface -eq 'Codex' |
  Group-Object room_or_session |
  ForEach-Object {
    $rows = $_.Group
    $latest = $rows | Sort-Object logged_at_mdt -Descending | Select-Object -First 1
    $rawTitle = $latest.room_title_or_cwd
    $looksLikePath = $rawTitle -match '^[A-Za-z]:\\'
    $title = if ($codexRoomLabels.ContainsKey($_.Name)) {
      $codexRoomLabels[$_.Name]
    } elseif ($looksLikePath) {
      'Unknown Codex room'
    } else {
      $rawTitle
    }
    $repo = if ($looksLikePath) { $rawTitle } else { '' }
    $input = ($rows | Measure-Object input_tokens -Sum).Sum
    $output = ($rows | Measure-Object output_tokens -Sum).Sum
    $cacheRead = ($rows | Measure-Object cache_read_tokens -Sum).Sum
    $total = ($rows | Measure-Object total_tokens -Sum).Sum
    if ($null -eq $input) { $input = 0 }
    if ($null -eq $output) { $output = 0 }
    if ($null -eq $cacheRead) { $cacheRead = 0 }
    if ($null -eq $total) { $total = 0 }
    [pscustomobject]@{
      room = $_.Name
      title = $title
      repo = $repo
      rows = $rows.Count
      input = [long]$input
      output = [long]$output
      cache_read = [long]$cacheRead
      total = [long]$total
    }
  } |
  Sort-Object total -Descending

$largestClaudeHtml = if ($largestClaude) {
  ($largestClaude | ForEach-Object {
    '<li><strong>' + (Fmt $_.total_tokens) + '</strong> - ' + (Escape-Html $_.room_or_session) + ' <span class="muted">(' + (Escape-Html $_.room_title_or_cwd) + ')</span></li>'
  }) -join "`n"
} else {
  '<li>No Claude sessions logged.</li>'
}

$largestCodexHtml = if ($largestCodex) {
  ($largestCodex | ForEach-Object {
    '<li><strong>' + (Fmt $_.total_tokens) + '</strong> - ' + (Escape-Html $_.room_title_or_cwd) + ' <span class="muted">(' + (Escape-Html $_.room_or_session) + ')</span></li>'
  }) -join "`n"
} else {
  '<li>No Codex rooms logged.</li>'
}

$codexRoomRows = if ($codexRooms) {
  ($codexRooms | ForEach-Object {
    $codexLast24Total = ($codexRooms | Measure-Object total -Sum).Sum
    if ($null -eq $codexLast24Total) { $codexLast24Total = 0 }
    $codexLast24Total = [long]$codexLast24Total
    $share = if ($codexLast24Total -gt 0) { '{0:P1}' -f ($_.total / $codexLast24Total) } else { '0.0%' }
    '<tr><td><strong>' + (Escape-Html $_.title) + '</strong><div class="muted">' + (Escape-Html $_.room) + '</div></td><td>' + (Escape-Html $_.repo) + '</td><td class="num">' + (Fmt $_.input) + '</td><td class="num">' + (Fmt $_.output) + '</td><td class="num">' + (Fmt $_.cache_read) + '</td><td class="num">' + (Fmt $_.total) + '</td><td class="num">' + (Escape-Html $share) + '</td><td class="num">' + $_.rows + '</td></tr>'
  }) -join "`n"
} else {
  '<tr><td colspan="8">No Codex rooms logged.</td></tr>'
}

$codexLast24Total = ($codexRooms | Measure-Object total -Sum).Sum
if ($null -eq $codexLast24Total) { $codexLast24Total = 0 }
$codexLast24Total = [long]$codexLast24Total

$confidenceCounts = $data | Group-Object confidence | Sort-Object Name | ForEach-Object { $_.Name + ': ' + $_.Count }
$confidenceNote = 'Codex rows come from visible-message estimates because exact thread token fields are unavailable. Claude rows use exact local JSONL usage fields including input, output, cache_create, and cache_read tokens.'
if ($confidenceCounts.Count -gt 0) {
  $confidenceNote += ' Confidence mix: ' + ($confidenceCounts -join '; ') + '.'
}

$tableRows = ($hourly | ForEach-Object {
  '<tr><td>' + (Escape-Html ($_.start.ToString('HH:mm') + '–' + $_.end.ToString('HH:mm'))) + '</td><td class="num">' + (Fmt $_.Codex) + '</td><td class="num">' + (Fmt $_.Claude) + '</td><td class="num">' + (Fmt $_.Total) + '</td></tr>'
}) -join "`n"

$html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="refresh" content="60">
  <title>Lane Token Usage</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f1ea;
      --panel: #fffdf8;
      --ink: #1f2933;
      --muted: #6b7280;
      --line: #d8d2c4;
      --codex: #0f766e;
      --claude: #c2410c;
      --accent: #e7decf;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: linear-gradient(180deg, #efe7da 0%, #f7f4ee 240px, #f4f1ea 100%); color: var(--ink); font-family: Georgia, "Times New Roman", serif; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 18px 40px; }
    h1, h2, h3 { margin: 0; }
    h1 { font-size: 30px; letter-spacing: 0.01em; }
    h2 { font-size: 18px; margin-bottom: 14px; }
    p { margin: 0; }
    .meta { margin-top: 8px; color: var(--muted); font-size: 13px; }
    .version-banner { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; padding: 8px 12px; border: 1px solid var(--codex); border-radius: 8px; background: rgba(15,118,110,0.08); color: var(--ink); font-family: Consolas, "SFMono-Regular", monospace; font-size: 13px; font-weight: 700; }
    .live-status { display: inline-flex; gap: 8px; align-items: center; margin-top: 10px; padding: 7px 10px; border: 1px solid var(--line); border-radius: 999px; background: #fffaf2; color: var(--muted); font-size: 12px; }
    .pulse { width: 8px; height: 8px; border-radius: 999px; background: var(--codex); box-shadow: 0 0 0 4px rgba(15,118,110,0.12); }
    .panel { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 20px; margin-top: 22px; box-shadow: 0 10px 30px rgba(31,41,51,0.05); }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-top: 16px; }
    .stat { background: var(--accent); border-radius: 10px; padding: 14px; border-left: 4px solid var(--line); }
    .stat.codex { border-left-color: var(--codex); }
    .stat.claude { border-left-color: var(--claude); }
    .stat .k { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
    .stat .v { margin-top: 6px; font-size: 22px; font-weight: 700; font-family: Consolas, "SFMono-Regular", monospace; }
    .split { display: grid; grid-template-columns: 2fr 1fr; gap: 18px; align-items: start; }
    .lists { display: grid; gap: 14px; }
    ul { margin: 10px 0 0; padding-left: 18px; }
    li { margin: 6px 0; }
    .muted { color: var(--muted); font-size: 12px; }
    svg { width: 100%; height: auto; display: block; background: #fffaf2; border-radius: 10px; border: 1px solid var(--line); }
    .axis, .grid { stroke: var(--line); stroke-width: 1; }
    .grid { stroke-dasharray: 3 5; }
    .series { fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .codex { stroke: var(--codex); }
    .claude { stroke: var(--claude); }
    .dot { fill: #fff; stroke-width: 2; }
    .label { fill: var(--muted); font-size: 12px; }
    .legend { display: flex; gap: 18px; margin-top: 12px; color: var(--muted); font-size: 13px; }
    .swatch { width: 20px; height: 3px; display: inline-block; vertical-align: middle; margin-right: 8px; border-radius: 999px; }
    .swatch.codex { background: var(--codex); }
    .swatch.claude { background: var(--claude); }
    .note { margin-top: 14px; padding: 12px 14px; background: #fbf7ef; border: 1px solid var(--line); border-radius: 10px; color: var(--muted); font-size: 12px; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
    th, td { padding: 9px 10px; border-bottom: 1px solid var(--line); }
    th { text-align: left; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
    .num { text-align: right; font-family: Consolas, "SFMono-Regular", monospace; }
    .total-row td { border-top: 2px solid var(--line); font-weight: 700; }
    code { font-family: Consolas, "SFMono-Regular", monospace; font-size: 12px; }
    @media (max-width: 860px) { .split { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <h1>Daily Token Usage</h1>
    <p class="meta">Source <code>roles/lab-operator/token usage.md</code> | Data through $($updated.ToString('yyyy-MM-dd HH:mm:ss')) MDT | Build $buildVersion</p>
    <p class="version-banner">Report $displayVersion</p>
    <p class="live-status"><span class="pulse"></span><span>Live view refreshes every 60 seconds after hourly rebuilds.</span></p>
    <section class="panel">
      <h2>Summary</h2>
      <div class="stats">
        <div class="stat codex"><div class="k">Codex total</div><div class="v">$(Fmt $codexTotal)</div></div>
        <div class="stat claude"><div class="k">Claude total</div><div class="v">$(Fmt $claudeTotal)</div></div>
        <div class="stat"><div class="k">Grand total</div><div class="v">$(Fmt $grandTotal)</div></div>
        <div class="stat"><div class="k">Hourly windows</div><div class="v">$count</div></div>
      </div>
      <div class="split" style="margin-top:18px;">
        <div>
          <h3>Largest Claude sessions</h3>
          <ul>
            $largestClaudeHtml
          </ul>
        </div>
        <div class="lists">
          <div>
            <h3>Largest Codex rooms</h3>
            <ul>
              $largestCodexHtml
            </ul>
          </div>
          <div class="note"><strong>Confidence:</strong> $(Escape-Html $confidenceNote)</div>
        </div>
      </div>
    </section>
    <section class="panel">
      <h2>Codex Usage By Room</h2>
      <p class="meta">Rolling 24 hours ending $($last24End.ToString('yyyy-MM-dd HH:mm:ss')) MDT.</p>
      <table>
        <thead>
          <tr><th>Room / Role</th><th>Repo / CWD</th><th class="num">Input</th><th class="num">Output</th><th class="num">Cache Read</th><th class="num">Total</th><th class="num">Share</th><th class="num">Rows</th></tr>
        </thead>
        <tbody>
          $codexRoomRows
          <tr class="total-row"><td>Last 24h Total</td><td></td><td></td><td></td><td></td><td class="num">$(Fmt $codexLast24Total)</td><td class="num">100.0%</td><td></td></tr>
        </tbody>
      </table>
    </section>
    <section class="panel">
      <h2>Hourly Totals By Interface</h2>
      <svg viewBox="0 0 960 340" role="img" aria-label="Hourly token totals for Codex and Claude">
        $($gridSvg -join "`n")
        <line class="axis" x1="$chartLeft" y1="$chartBottom" x2="$chartRight" y2="$chartBottom" />
        <line class="axis" x1="$chartLeft" y1="$chartTop" x2="$chartLeft" y2="$chartBottom" />
        <polyline class="series codex" points="$($codexPts -join ' ')" />
        $($codexDots -join "`n")
        <polyline class="series claude" points="$($claudePts -join ' ')" />
        $($claudeDots -join "`n")
        $($xSvg -join "`n")
      </svg>
      <div class="legend">
        <span><span class="swatch codex"></span>Codex</span>
        <span><span class="swatch claude"></span>Claude</span>
      </div>
    </section>
    <section class="panel">
      <h2>Hourly Aggregate Table</h2>
      <table>
        <thead>
          <tr><th>Window (MDT)</th><th class="num">Codex</th><th class="num">Claude</th><th class="num">Total</th></tr>
        </thead>
        <tbody>
          $tableRows
          <tr class="total-row"><td>Total</td><td class="num">$(Fmt $codexTotal)</td><td class="num">$(Fmt $claudeTotal)</td><td class="num">$(Fmt $grandTotal)</td></tr>
        </tbody>
      </table>
    </section>
  </main>
  <script>
    window.setTimeout(function () {
      var url = new URL(window.location.href);
      url.searchParams.set('v', '$buildVersion');
      url.searchParams.set('r', Date.now().toString());
      window.location.replace(url.toString());
    }, 60000);
  </script>
</body>
</html>
"@

Set-Content -Path $htmlPath -Value $html -NoNewline
Write-Output "rebuilt:$htmlPath"
Write-Output "rows:$($data.Count) hourly:$count codex_total:$codexTotal claude_total:$claudeTotal"
