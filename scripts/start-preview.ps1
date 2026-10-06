$ErrorActionPreference = 'Stop'
$projectDir = Split-Path $PSScriptRoot -Parent
$runtimeDir = Join-Path $projectDir '.runtime'
New-Item -ItemType Directory -Force $runtimeDir | Out-Null
if (Test-Path -LiteralPath (Join-Path $runtimeDir 'my.ini')) {
  & (Join-Path $PSScriptRoot 'start-local-mysql.ps1')
}
$connection = New-Object System.Net.Sockets.TcpClient
$alreadyRunning = $false
try { $connection.Connect('127.0.0.1',3000); $alreadyRunning = $true } catch {} finally { $connection.Dispose() }
if ($alreadyRunning) { Write-Output 'Port 3000 is already active. Open http://localhost:3000'; return }
$node = (Get-Command node.exe -ErrorAction Stop).Source
$process = Start-Process -FilePath $node -ArgumentList @('node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1') -WorkingDirectory $projectDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDir 'preview.out.log') -RedirectStandardError (Join-Path $runtimeDir 'preview.err.log') -PassThru
$process.Id | Set-Content -LiteralPath (Join-Path $runtimeDir 'preview.pid')
Write-Output "Preview starting in background (PID $($process.Id)): http://localhost:3000"
