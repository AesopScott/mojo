[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$Prompt,

    [Parameter(Mandatory = $false)]
    [string]$PromptFile,

    [Parameter(Mandatory = $false)]
    [string]$Cwd = (Get-Location).Path,

    [Parameter(Mandatory = $false)]
    [ValidateSet("low", "medium", "high", "xhigh", "max")]
    [string]$Effort = "low",

    [Parameter(Mandatory = $false)]
    [string[]]$AllowedTools = @("Read"),

    [Parameter(Mandatory = $false)]
    [string[]]$DisallowedTools = @("Bash(git *)", "Bash(gh *)", "WebFetch", "WebSearch"),

    [switch]$AllowEdits,
    [switch]$UseSkills,
    [switch]$Bare,
    [switch]$NoBare,
    [switch]$DryRun
)

if ($AllowEdits) {
    $AllowedTools = @($AllowedTools + @("Read", "Edit", "Write", "MultiEdit") | Select-Object -Unique)
}

$AllowedTools = @($AllowedTools | ForEach-Object { $_ -split "," } | ForEach-Object { $_.Trim() } | Where-Object { $_ } | Select-Object -Unique)
$DisallowedTools = @($DisallowedTools | ForEach-Object { $_ -split "," } | ForEach-Object { $_.Trim() } | Where-Object { $_ } | Select-Object -Unique)

if (-not $Prompt -and $PromptFile) {
    $Prompt = Get-Content -LiteralPath $PromptFile -Raw
}

if (-not $Prompt) {
    throw "Provide -Prompt or -PromptFile."
}

$resolvedCwd = (Resolve-Path -LiteralPath $Cwd).Path

$claudeArgs = @("-p", $Prompt)
if ($Bare -and -not $NoBare) {
    $claudeArgs += "--bare"
}
else {
    $claudeArgs += "--safe-mode"
}
$claudeArgs += @("--effort", $Effort)

if (-not $UseSkills) {
    $claudeArgs += "--disable-slash-commands"
}

if ($AllowedTools.Count -gt 0) {
    $claudeArgs += @("--allowedTools", ($AllowedTools -join ","))
}

if ($DisallowedTools.Count -gt 0) {
    $claudeArgs += @("--disallowedTools", ($DisallowedTools -join ","))
}

if ($DryRun) {
    [pscustomobject]@{
        command = "claude"
        args = $claudeArgs
        cwd = $resolvedCwd
        bare = [bool]($Bare -and -not $NoBare)
        safe_mode = -not ($Bare -and -not $NoBare)
        skills_enabled = [bool]$UseSkills
        allowed_tools = $AllowedTools
        disallowed_tools = $DisallowedTools
    } | ConvertTo-Json -Depth 5
    return
}

Push-Location -LiteralPath $resolvedCwd
try {
    & claude @claudeArgs
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Pop-Location
}
