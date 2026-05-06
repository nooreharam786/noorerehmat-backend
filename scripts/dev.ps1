$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$jobs = @(
  @{ Name = "backend"; Path = Join-Path $root "backend"; Command = "npm.cmd"; Args = "run dev" },
  @{ Name = "admin"; Path = Join-Path $root "admin"; Command = "npm.cmd"; Args = "run dev" }
)

Write-Host "Starting Sacred Journey dev stack..." -ForegroundColor Green
Write-Host "Backend: http://localhost:4000/api" -ForegroundColor DarkGreen
Write-Host "Admin:   http://localhost:3000" -ForegroundColor DarkGreen
Write-Host ""

$processes = foreach ($job in $jobs) {
  Write-Host "Starting $($job.Name)..." -ForegroundColor Yellow
  Start-Process -FilePath $job.Command -ArgumentList $job.Args -WorkingDirectory $job.Path -PassThru
}

Write-Host ""
Write-Host "Dev stack is running. Press Ctrl+C in this window, then close child terminals if needed." -ForegroundColor Green

try {
  while ($true) {
    Start-Sleep -Seconds 2
    foreach ($process in $processes) {
      if ($process.HasExited) {
        Write-Host "Process $($process.Id) exited with code $($process.ExitCode)." -ForegroundColor Red
      }
    }
  }
} finally {
  foreach ($process in $processes) {
    if (!$process.HasExited) {
      Stop-Process -Id $process.Id -Force
    }
  }
}
