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
$targetRoot = [System.IO.Path]::GetFullPath($target).TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)

Get-ChildItem -LiteralPath $source -Force | ForEach-Object {
    $destination = Join-Path $target $_.Name
    $destinationFull = [System.IO.Path]::GetFullPath($destination)
    $targetPrefix = $targetRoot + [System.IO.Path]::DirectorySeparatorChar
    if (-not $destinationFull.StartsWith($targetPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to sync outside target root: $destinationFull"
    }
    if (Test-Path -LiteralPath $destination) {
        Remove-Item -LiteralPath $destination -Recurse -Force
    }
    Copy-Item -LiteralPath $_.FullName -Destination $destination -Recurse -Force
}

Write-Output "Synced $source to $target"
