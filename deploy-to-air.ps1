# 🚀 העלאת הפרויקט לאוויר - Tan & Co CRM
# מתקין ומפעיל את הכל

Write-Host "`n🚀 העלאת הפרויקט לאוויר..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# שלב 1: הפעל את השרת
Write-Host "`n1️⃣ מפעיל את השרת על פורט 3001..." -ForegroundColor Yellow
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if (-not $port3001) {
    Write-Host "   🚀 מפעיל את השרת..." -ForegroundColor Cyan
    $projectPath = $PWD.Path
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; Write-Host '🚀 Tan & Co CRM - פורט 3001' -ForegroundColor Cyan; Write-Host '=' * 50 -ForegroundColor Gray; npm run server" -WindowStyle Minimized
    
    Write-Host "   ⏳ ממתין 15 שניות להרצה..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
    
    $port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if ($port3001) {
        Write-Host "   ✅ השרת רץ!" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  השרת עדיין לא רץ - ממתין עוד 5 שניות..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
} else {
    Write-Host "   ✅ השרת כבר רץ" -ForegroundColor Green
}

# בדוק תגובה
Write-Host "`n2️⃣ בודק תגובת השרת..." -ForegroundColor Yellow
$serverResponding = $false
for ($i = 1; $i -le 3; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "   ✅ השרת מגיב! Status: $($response.StatusCode)" -ForegroundColor Green
        $serverResponding = $true
        break
    } catch {
        if ($i -lt 3) {
            Write-Host "   ⏳ ניסיון $i/3 - ממתין 3 שניות..." -ForegroundColor Gray
            Start-Sleep -Seconds 3
        } else {
            Write-Host "   ❌ השרת לא מגיב" -ForegroundColor Red
        }
    }
}

if (-not $serverResponding) {
    Write-Host "`n❌ השרת לא מגיב. בדוק את החלון שנפתח." -ForegroundColor Red
    Write-Host "`n💡 הרץ ידנית: npm run server" -ForegroundColor Yellow
    exit 1
}

# שלב 3: התקן והפעל Tunnel Service
Write-Host "`n3️⃣ מטפל ב-Tunnel Service..." -ForegroundColor Yellow

if ($isAdmin) {
    Write-Host "   ✅ יש הרשאות Administrator" -ForegroundColor Green
    
    $service = Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "   📋 Service נמצא, מצב: $($service.Status)" -ForegroundColor Gray
        
        if ($service.Status -ne "Running") {
            Write-Host "   🚀 מפעיל את ה-Service..." -ForegroundColor Cyan
            try {
                Start-Service -Name "cloudflared" -ErrorAction Stop
                Start-Sleep -Seconds 3
                $service = Get-Service -Name "cloudflared"
                Write-Host "   ✅ ה-Service הופעל! Status: $($service.Status)" -ForegroundColor Green
            } catch {
                Write-Host "   ❌ שגיאה בהפעלה: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "   ✅ ה-Service כבר רץ" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠️  Service לא מותקן" -ForegroundColor Yellow
        Write-Host "   💡 צריך להתקין את ה-Service עם הטוקן מ-Cloudflare" -ForegroundColor Cyan
        Write-Host "`n   הרץ את הפקודה הזו (החלף את TOKEN בטוקן שלך):" -ForegroundColor Yellow
        Write-Host "   cloudflared.exe service install TOKEN" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️  אין הרשאות Administrator" -ForegroundColor Yellow
    Write-Host "   💡 צריך להריץ PowerShell כ-Administrator כדי להתקין את ה-Service" -ForegroundColor Cyan
}

# סיכום
Write-Host "`n" + ("=" * 50) -ForegroundColor Gray
Write-Host "`n📋 סיכום:" -ForegroundColor Cyan

if ($serverResponding) {
    Write-Host "   ✅ השרת רץ ומגיב על localhost:3001" -ForegroundColor Green
} else {
    Write-Host "   ❌ השרת לא רץ" -ForegroundColor Red
}

if ($isAdmin) {
    $service = Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue
    if ($service -and $service.Status -eq "Running") {
        Write-Host "   ✅ Tunnel Service רץ" -ForegroundColor Green
        Write-Host "`n🌐 הפרויקט זמין על: https://crm.tanandco.co.il" -ForegroundColor Cyan
    } else {
        Write-Host "   ⚠️  Tunnel Service לא רץ" -ForegroundColor Yellow
        Write-Host "`n💡 כדי להפעיל את ה-Tunnel:" -ForegroundColor Yellow
        Write-Host "   1. פתח PowerShell כ-Administrator" -ForegroundColor White
        Write-Host "   2. הרץ: cloudflared.exe service install [TOKEN]" -ForegroundColor White
        Write-Host "   3. או הרץ: cloudflared tunnel run tanandco-tunnel" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️  לא בדקתי Tunnel Service (אין הרשאות)" -ForegroundColor Yellow
}

Write-Host "`n✅ סיימתי!" -ForegroundColor Green

