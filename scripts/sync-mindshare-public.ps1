param(
    [string]$MindshareRoot = "C:\Users\scott\Code\mindshare",
    [string]$MojoRoot = "C:\Users\scott\Code\mojo"
)

$ErrorActionPreference = "Stop"

$source = Join-Path $MindshareRoot "public"
$target = Join-Path $MojoRoot "MindShare"

if (-not (Test-Path -LiteralPath $source)) {
    throw "Mindshare public folder not found: $source"
}

New-Item -ItemType Directory -Force -Path $target | Out-Null

Get-ChildItem -LiteralPath $source -Force | ForEach-Object {
    $destination = Join-Path $target $_.Name
    Copy-Item -LiteralPath $_.FullName -Destination $destination -Recurse -Force
}

Write-Output "Synced $source to $target"
