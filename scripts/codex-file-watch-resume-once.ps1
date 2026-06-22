param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [Parameter(Mandatory=$true)][string]$ThreadId,
  [Parameter(Mandatory=$true)][string]$OutputPath,
  [Parameter(Mandatory=$true)][string]$ErrorPath,
  [Parameter(Mandatory=$true)][string]$MarkerPath,
  [string]$CodexExe = "codex"
)

$ErrorActionPreference = "Continue"

try {
  Get-Content -LiteralPath $InputPath -Raw |
    & $CodexExe exec resume --skip-git-repo-check $ThreadId - > $OutputPath 2> $ErrorPath
} finally {
  Remove-Item -LiteralPath $MarkerPath -Force -ErrorAction SilentlyContinue
}
