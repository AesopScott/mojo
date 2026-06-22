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
  $env:CODEX_FILE_WATCH_RESUME = "1"
  $env:CODEX_THREAD_ID = $ThreadId
  $env:CODEX_TARGET_THREAD_ID = $ThreadId
  Get-Content -LiteralPath $InputPath -Raw |
    & $CodexExe exec -c 'notify=[]' resume --skip-git-repo-check $ThreadId - > $OutputPath 2> $ErrorPath
} finally {
  Remove-Item Env:\CODEX_FILE_WATCH_RESUME -ErrorAction SilentlyContinue
  Remove-Item Env:\CODEX_THREAD_ID -ErrorAction SilentlyContinue
  Remove-Item Env:\CODEX_TARGET_THREAD_ID -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $MarkerPath -Force -ErrorAction SilentlyContinue
}
