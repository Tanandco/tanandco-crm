# 🚀 הרצת Cloudflare Tunnel
# Tan & Co CRM

Write-Host "`n🚀 מתחיל Cloudflare Tunnel..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# בדוק אם השרת רץ
Write-Host "`n📋 בדיקת השרת" -ForegroundColor Yellow
$serverRunning = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue

if (-not $serverRunning) {
    Write-Host "⚠️  השרת לא רץ על localhost:5000" -ForegroundColor Yellow
    Write-Host "`n💡 מנסה להריץ את השרת..." -ForegroundColor Cyan
    
    # נסה להריץ את השרת
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run server" -WindowStyle Minimized
    Write-Host "⏳ ממתין 5 שניות..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    $serverRunning = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($serverRunning) {
        Write-Host "✅ השרת רץ עכשיו!" -ForegroundColor Green
    } else {
        Write-Host "❌ השרת לא עלה. הרץ ידנית: npm run server" -ForegroundColor Red
        Write-Host "`nלאחר מכן הרץ שוב את הסקריפט הזה" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ השרת רץ על localhost:5000" -ForegroundColor Green
}

# בדוק tunnel
Write-Host "`n📋 בדיקת Tunnel" -ForegroundColor Yellow
$tunnelName = "tanandco-tunnel"

try {
    $tunnels = cloudflared tunnel list 2>&1
    if ($tunnels -match $tunnelName) {
        Write-Host "✅ Tunnel '$tunnelName' נמצא" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Tunnel '$tunnelName' לא נמצא" -ForegroundColor Yellow
        Write-Host "`n💡 צור tunnel חדש או בחר אחר:" -ForegroundColor Cyan
        cloudflared tunnel list
        $tunnelName = Read-Host "הכנס שם tunnel"
    }
} catch {
    Write-Host "❌ שגיאה בבדיקת tunnels" -ForegroundColor Red
    exit 1
}

# הרץ tunnel
Write-Host "`n🚀 מתחיל להריץ את ה-tunnel..." -ForegroundColor Cyan
Write-Host "`n✅ הדומיין יעבוד על: https://crm.tanandco.co.il" -ForegroundColor Green
Write-Host "`n⚠️  חשוב: השאר את ה-window הזה פתוח!" -ForegroundColor Yellow
Write-Host "`nלעצירה: Ctrl+C" -ForegroundColor Gray
Write-Host "`n" + ("=" * 50) -ForegroundColor Gray
Write-Host ""

# הרץ tunnel
cloudflared tunnel run $tunnelName

