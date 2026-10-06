$ErrorActionPreference = 'Stop'
$runtimeDir = Join-Path $PSScriptRoot '..\.runtime'
$binary = Join-Path $runtimeDir 'mysql-8.4.11-winx64\bin\mysqld.exe'
$config = Join-Path $runtimeDir 'my.ini'
if (!(Test-Path -LiteralPath $binary) -or !(Test-Path -LiteralPath $config)) {
  throw 'Portable MySQL is not available. Use your own MySQL instance as described in README.'
}
$connection = New-Object System.Net.Sockets.TcpClient
try { $connection.Connect('127.0.0.1',3307); Write-Output 'A database is already listening on port 3307.'; exit 0 } catch {} finally { $connection.Dispose() }
$process = Start-Process -FilePath $binary -ArgumentList "--defaults-file=`"$config`"" -WindowStyle Hidden -PassThru
$process.Id | Set-Content -LiteralPath (Join-Path $runtimeDir 'mysql.pid')
Write-Output "Project MySQL started (PID $($process.Id))."
