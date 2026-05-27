# 清理 Next.js 开发环境脚本
# 用法: npm run dev:clean

$ErrorActionPreference = "SilentlyContinue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   留学Hub 开发环境清理工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 停止占用端口的 node 进程
Write-Host "[1/4] 检查并停止占用 3000-3010 端口的进程..." -ForegroundColor Yellow

$ports = @(3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010)
$stoppedCount = 0

foreach ($port in $ports) {
    $connections = netstat -ano | Select-String ":$port\s+.*LISTENING"
    if ($connections) {
        foreach ($conn in $connections) {
            if ($conn -match "LISTENING\s+(\d+)$") {
                $pid = $matches[1]
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($process) {
                    Stop-Process -Id $pid -Force
                    Write-Host "  - 已停止进程 PID=$pid (端口 $port)" -ForegroundColor DarkGray
                    $stoppedCount++
                }
            }
        }
    }
}

if ($stoppedCount -eq 0) {
    Write-Host "  ✓ 没有发现占用端口的进程" -ForegroundColor Green
} else {
    Write-Host "  ✓ 共停止 $stoppedCount 个进程" -ForegroundColor Green
}

# 2. 停止所有 Next.js 相关 node 进程
Write-Host ""
Write-Host "[2/4] 检查 Next.js 相关进程..." -ForegroundColor Yellow

$nextProcesses = Get-Process | Where-Object {
    $_.ProcessName -eq "node" -and $_.CommandLine -match "next"
}

if ($nextProcesses) {
    foreach ($proc in $nextProcesses) {
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        Write-Host "  - 已停止 Next 进程 PID=$($proc.Id)" -ForegroundColor DarkGray
    }
    Write-Host "  ✓ 共停止 $($nextProcesses.Count) 个 Next 进程" -ForegroundColor Green
} else {
    Write-Host "  ✓ 没有发现 Next.js 进程" -ForegroundColor Green
}

# 3. 清理 .next 缓存
Write-Host ""
Write-Host "[3/4] 清理 .next 缓存..." -ForegroundColor Yellow

$nextDir = "D:\Users\59517\Desktop\liuxue-hub\liuxuehub-web\.next"

if (Test-Path $nextDir) {
    Remove-Item -Recurse -Force $nextDir
    Write-Host "  ✓ .next 缓存已清理" -ForegroundColor Green
} else {
    Write-Host "  ✓ .next 目录不存在，无需清理" -ForegroundColor Green
}

# 4. 验证端口已释放
Write-Host ""
Write-Host "[4/4] 验证端口状态..." -ForegroundColor Yellow

Start-Sleep -Milliseconds 500
$port3000 = netstat -ano | Select-String ":3000\s+.*LISTENING"

if ($port3000) {
    Write-Host "  ⚠ 警告：端口 3000 仍被占用" -ForegroundColor Red
} else {
    Write-Host "  ✓ 端口 3000 已释放" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
