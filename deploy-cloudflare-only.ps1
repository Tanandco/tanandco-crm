# 🚀 פריסה מלאה דרך Cloudflare - ללא Google Cloud
# ============================================

Write-Host "`n🚀 Tan & Co CRM - פריסה דרך Cloudflare בלבד" -ForegroundColor Cyan
Write-Host "==============================================`n" -ForegroundColor Cyan

Write-Host "✅ מה זה אומר:" -ForegroundColor Green
Write-Host "   • השרת רץ מקומית (localhost:3001)" -ForegroundColor Gray
Write-Host "   • Cloudflare Tunnel מחבר ל-DNS" -ForegroundColor Gray
Write-Host "   • לא צריך Google Cloud Run" -ForegroundColor Gray
Write-Host "   • פשוט ומהיר יותר" -ForegroundColor Gray

Write-Host "`n📋 שלבים:" -ForegroundColor Yellow

# שלב 1: בדוק אם השרת רץ
Write-Host "`n1️⃣  בדיקת השרת" -ForegroundColor Cyan
$serverRunning = $false

# נסה מספר פעמים
for ($i = 1; $i -le 3; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Get -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $serverRunning = $true
            Write-Host "   ✅ השרת רץ על localhost:3001" -ForegroundColor Green
            break
        }
    } catch {
        if ($i -lt 3) {
            Write-Host "   ⏳ ניסיון $i/3..." -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }
    }
}

if (-not $serverRunning) {
    Write-Host "   ⚠️  השרת לא מגיב" -ForegroundColor Yellow
    Write-Host "   💡 מריץ את השרת עכשיו..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run server" -WindowStyle Minimized
    Write-Host "   ⏳ ממתין 10 שניות..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # נסה שוב מספר פעמים
    for ($i = 1; $i -le 5; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Get -TimeoutSec 3 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $serverRunning = $true
                Write-Host "   ✅ השרת רץ עכשיו!" -ForegroundColor Green
                break
            }
        } catch {
            if ($i -lt 5) {
                Write-Host "   ⏳ ממתין... ($i/5)" -ForegroundColor Gray
                Start-Sleep -Seconds 2
            }
        }
    }
    
    if (-not $serverRunning) {
        Write-Host "   ❌ השרת לא עלה. הרץ ידנית: npm run server" -ForegroundColor Red
        Write-Host "   💡 אחרי שהשרת יעלה, הרץ שוב: .\deploy-cloudflare-only.ps1" -ForegroundColor Yellow
        exit 1
    }
}

# שלב 2: בדוק cloudflared
Write-Host "`n2️⃣  בדיקת cloudflared" -ForegroundColor Cyan
$cloudflaredInstalled = $false
try {
    $version = cloudflared --version 2>&1 | Select-Object -First 1
    Write-Host "   ✅ cloudflared מותקן: $version" -ForegroundColor Green
    $cloudflaredInstalled = $true
} catch {
    Write-Host "   ❌ cloudflared לא מותקן" -ForegroundColor Red
    Write-Host "   💡 מנסה להתקין..." -ForegroundColor Cyan
    
    try {
        winget install --id Cloudflare.cloudflared --accept-package-agreements --accept-source-agreements --silent 2>&1 | Out-Null
        Start-Sleep -Seconds 3
        
        $version = cloudflared --version 2>&1 | Select-Object -First 1
        Write-Host "   ✅ cloudflared הותקן: $version" -ForegroundColor Green
        $cloudflaredInstalled = $true
    } catch {
        Write-Host "   ❌ לא הצלחתי להתקין אוטומטית" -ForegroundColor Red
        Write-Host "   💡 התקן ידנית:" -ForegroundColor Yellow
        Write-Host "      winget install --id Cloudflare.cloudflared" -ForegroundColor White
        Write-Host "      או: https://github.com/cloudflare/cloudflared/releases/latest" -ForegroundColor White
        exit 1
    }
}

# שלב 3: בדוק התחברות
Write-Host "`n3️⃣  בדיקת התחברות ל-Cloudflare" -ForegroundColor Cyan
try {
    $tunnels = cloudflared tunnel list 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ מחובר ל-Cloudflare" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  צריך להתחבר" -ForegroundColor Yellow
        Write-Host "   💡 פותח דפדפן להתחברות..." -ForegroundColor Cyan
        cloudflared tunnel login
    }
} catch {
    Write-Host "   ⚠️  צריך להתחבר" -ForegroundColor Yellow
    cloudflared tunnel login
}

# שלב 4: בדוק/צור tunnel
Write-Host "`n4️⃣  בדיקת Tunnel" -ForegroundColor Cyan
$tunnelName = "tanandco-crm"
try {
    $tunnels = cloudflared tunnel list 2>&1
    if ($tunnels -match $tunnelName) {
        Write-Host "   ✅ Tunnel '$tunnelName' קיים" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Tunnel '$tunnelName' לא נמצא" -ForegroundColor Yellow
        Write-Host "   💡 יוצר tunnel חדש..." -ForegroundColor Cyan
        cloudflared tunnel create $tunnelName
        Write-Host "   ✅ Tunnel '$tunnelName' נוצר!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ שגיאה ביצירת tunnel" -ForegroundColor Red
    exit 1
}

# שלב 5: הוראות להגדרת Dashboard
Write-Host "`n5️⃣  הגדרת Public Hostname ב-Dashboard" -ForegroundColor Cyan
Write-Host "`n⚠️  צריך להגדיר ידנית ב-Cloudflare Dashboard:" -ForegroundColor Yellow
Write-Host "`n1. פתח:" -ForegroundColor White
Write-Host "   https://one.dash.cloudflare.com" -ForegroundColor Gray
Write-Host "`n2. נווט ל:" -ForegroundColor White
Write-Host "   Zero Trust → Networks → Tunnels" -ForegroundColor Gray
Write-Host "`n3. בחר את ה-Tunnel: $tunnelName" -ForegroundColor White
Write-Host "`n4. הוסף Public Hostname:" -ForegroundColor White
Write-Host "   Subdomain: crm" -ForegroundColor Gray
Write-Host "   Domain: tanandco.co.il" -ForegroundColor Gray
Write-Host "   Service Type: HTTP" -ForegroundColor Gray
Write-Host "   URL: http://localhost:3001" -ForegroundColor Gray
Write-Host "`n5. לחץ 'Save'" -ForegroundColor White

$continue = Read-Host "`nלחץ Enter אחרי שסיימת להגדיר ב-Dashboard"

# שלב 6: הרץ tunnel
Write-Host "`n6️⃣  הרצת Tunnel" -ForegroundColor Cyan
Write-Host "`n🚀 מתחיל להריץ את ה-tunnel..." -ForegroundColor Green
Write-Host "`n✅ הדומיין יעבוד על: https://crm.tanandco.co.il" -ForegroundColor Green
Write-Host "`n⚠️  חשוב: השאר את ה-window הזה פתוח!" -ForegroundColor Yellow
Write-Host "`nלעצירה: Ctrl+C" -ForegroundColor Gray
Write-Host "`n" + ("=" * 50) -ForegroundColor Gray
Write-Host ""

# הרץ tunnel
cloudflared tunnel run $tunnelName

