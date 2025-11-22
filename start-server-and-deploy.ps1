# 🚀 הפעלת השרת ופריסה דרך Cloudflare
# ============================================

Write-Host "`n🚀 Tan & Co CRM - הפעלת השרת ופריסה" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# עצור תהליכים קיימים על פורט 3001
Write-Host "📋 שלב 1: בדיקת תהליכים קיימים" -ForegroundColor Yellow
try {
    $existingConnections = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if ($existingConnections) {
        foreach ($conn in $existingConnections) {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($process -and $process.ProcessName -eq "node") {
                Write-Host "   ⚠️  נמצא תהליך node על פורט 3001 (PID: $($process.Id))" -ForegroundColor Yellow
                Write-Host "   🛑 עוצר את התהליך..." -ForegroundColor Cyan
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 2
                Write-Host "   ✅ התהליך נעצר" -ForegroundColor Green
            }
        }
    }
} catch {
    Write-Host "   ℹ️  לא מצאתי תהליכים קיימים" -ForegroundColor Gray
}

# הרץ את השרת
Write-Host "`n📋 שלב 2: הפעלת השרת" -ForegroundColor Yellow
Write-Host "   🚀 מריץ את השרת בחלון נפרד..." -ForegroundColor Cyan

$serverScript = @"
cd '$PWD'
Write-Host '🚀 מריץ את השרת...' -ForegroundColor Cyan
npm run server
"@

$serverProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", $serverScript -PassThru -WindowStyle Normal

Write-Host "   ⏳ ממתין 10 שניות שהשרת יעלה..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# בדוק שהשרת רץ
Write-Host "`n📋 שלב 3: בדיקת השרת" -ForegroundColor Yellow
$serverRunning = $false
for ($i = 1; $i -le 5; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Get -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $serverRunning = $true
            Write-Host "   ✅ השרת רץ ומגיב!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "   ⏳ ניסיון $i/5..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $serverRunning) {
    Write-Host "   ❌ השרת לא מגיב" -ForegroundColor Red
    Write-Host "`n💡 בדוק את חלון השרת לראות אם יש שגיאות" -ForegroundColor Yellow
    Write-Host "   אם השרת רץ, הרץ ידנית: .\deploy-cloudflare-only.ps1" -ForegroundColor Cyan
    exit 1
}

# הרץ את סקריפט הפריסה
Write-Host "`n📋 שלב 4: ממשיך עם פריסה דרך Cloudflare" -ForegroundColor Yellow
Write-Host "   🚀 מריץ את סקריפט הפריסה..." -ForegroundColor Cyan
Write-Host ""

# הרץ את הסקריפט
& ".\deploy-cloudflare-only.ps1"

