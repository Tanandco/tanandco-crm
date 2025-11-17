# 🚀 חיבור אוטומטי ל-Cloudflare Tunnel
# Tan & Co CRM

Write-Host "`n🚀 מתחיל חיבור אוטומטי ל-Cloudflare..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# שלב 1: בדוק אם השרת רץ
Write-Host "`n📋 שלב 1: בדיקת השרת המקומי" -ForegroundColor Yellow
$serverRunning = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue

if (-not $serverRunning) {
    Write-Host "⚠️  השרת לא רץ על localhost:5000" -ForegroundColor Yellow
    Write-Host "`n💡 מנסה להריץ את השרת..." -ForegroundColor Cyan
    
    # בדוק אם npm run server רץ כבר
    $serverProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*server*" }
    
    if (-not $serverProcess) {
        Write-Host "מתחיל השרת ברקע..." -ForegroundColor Gray
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run server" -WindowStyle Minimized
        Write-Host "⏳ ממתין 5 שניות להרצת השרת..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # בדוק שוב
        $serverRunning = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($serverRunning) {
            Write-Host "✅ השרת רץ עכשיו!" -ForegroundColor Green
        } else {
            Write-Host "❌ השרת לא עלה. הרץ ידנית: npm run server" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ השרת כבר רץ" -ForegroundColor Green
    }
} else {
    Write-Host "✅ השרת רץ על localhost:5000" -ForegroundColor Green
}

# שלב 2: בדוק/התקן cloudflared
Write-Host "`n📋 שלב 2: בדיקת cloudflared" -ForegroundColor Yellow
try {
    $cloudflaredVersion = cloudflared --version 2>&1 | Select-Object -First 1
    Write-Host "✅ cloudflared מותקן: $cloudflaredVersion" -ForegroundColor Green
    $cloudflaredInstalled = $true
} catch {
    Write-Host "❌ cloudflared לא מותקן" -ForegroundColor Red
    $cloudflaredInstalled = $false
}

if (-not $cloudflaredInstalled) {
    Write-Host "`n💡 מנסה להתקין cloudflared..." -ForegroundColor Cyan
    
    # נסה דרך winget
    try {
        Write-Host "מתקין דרך winget..." -ForegroundColor Gray
        winget install --id Cloudflare.cloudflared --accept-package-agreements --accept-source-agreements --silent 2>&1 | Out-Null
        
        # המתן להתקנה
        Start-Sleep -Seconds 3
        
        # בדוק שוב
        try {
            $cloudflaredVersion = cloudflared --version 2>&1 | Select-Object -First 1
            Write-Host "✅ cloudflared הותקן בהצלחה: $cloudflaredVersion" -ForegroundColor Green
            $cloudflaredInstalled = $true
        } catch {
            Write-Host "⚠️  ההתקנה לא הושלמה. נסה ידנית:" -ForegroundColor Yellow
            Write-Host "   winget install --id Cloudflare.cloudflared" -ForegroundColor White
            exit 1
        }
    } catch {
        Write-Host "❌ לא הצלחתי להתקין אוטומטית" -ForegroundColor Red
        Write-Host "`n💡 התקן ידנית:" -ForegroundColor Yellow
        Write-Host "   winget install --id Cloudflare.cloudflared" -ForegroundColor White
        Write-Host "   או: https://github.com/cloudflare/cloudflared/releases/latest" -ForegroundColor White
        exit 1
    }
}

# שלב 3: בדוק התחברות
Write-Host "`n📋 שלב 3: בדיקת התחברות ל-Cloudflare" -ForegroundColor Yellow
try {
    $authList = cloudflared tunnel list 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ מחובר ל-Cloudflare" -ForegroundColor Green
    } else {
        Write-Host "⚠️  לא מחובר. צריך להתחבר..." -ForegroundColor Yellow
        Write-Host "`nפתיחת דפדפן להתחברות..." -ForegroundColor Cyan
        cloudflared tunnel login
        Write-Host "✅ התחברת בהצלחה!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  צריך להתחבר ל-Cloudflare" -ForegroundColor Yellow
    Write-Host "`nפתיחת דפדפן להתחברות..." -ForegroundColor Cyan
    cloudflared tunnel login
    Write-Host "✅ התחברת בהצלחה!" -ForegroundColor Green
}

# שלב 4: צור או בחר tunnel
Write-Host "`n📋 שלב 4: הגדרת Tunnel" -ForegroundColor Yellow
$tunnelName = "tanandco-crm"

try {
    $tunnels = cloudflared tunnel list 2>&1
    if ($tunnels -match $tunnelName) {
        Write-Host "✅ Tunnel '$tunnelName' כבר קיים" -ForegroundColor Green
    } else {
        Write-Host "יוצר tunnel חדש: $tunnelName..." -ForegroundColor Cyan
        cloudflared tunnel create $tunnelName
        Write-Host "✅ Tunnel '$tunnelName' נוצר בהצלחה!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  שגיאה ביצירת tunnel. מנסה ליצור ידנית..." -ForegroundColor Yellow
    cloudflared tunnel create $tunnelName
}

# שלב 5: הגדר config
Write-Host "`n📋 שלב 5: הגדרת קובץ Config" -ForegroundColor Yellow
$configDir = "$env:USERPROFILE\.cloudflared"
$configFile = "$configDir\config.yml"

# צור תיקייה אם לא קיימת
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    Write-Host "✅ נוצרה תיקיית config" -ForegroundColor Green
}

# קבל את ה-tunnel ID
try {
    $tunnelInfo = cloudflared tunnel list 2>&1 | Select-String -Pattern $tunnelName
    if ($tunnelInfo) {
        $tunnelId = ($tunnelInfo -split '\s+')[0]
        Write-Host "✅ Tunnel ID: $tunnelId" -ForegroundColor Green
    } else {
        Write-Host "⚠️  לא מצאתי tunnel ID. צריך להגדיר ידנית" -ForegroundColor Yellow
        $tunnelId = "YOUR_TUNNEL_ID"
    }
} catch {
    Write-Host "⚠️  לא הצלחתי לקבל tunnel ID" -ForegroundColor Yellow
    $tunnelId = "YOUR_TUNNEL_ID"
}

# כתוב config
$configContent = @"
tunnel: $tunnelId
credentials-file: $configDir\$tunnelId.json

ingress:
  - hostname: crm.tanandco.co.il
    service: http://localhost:5000
  - service: http_status:404
"@

Set-Content -Path $configFile -Value $configContent -Encoding UTF8
Write-Host "✅ קובץ config נוצר: $configFile" -ForegroundColor Green

# שלב 6: הוסף Public Hostname דרך Dashboard
Write-Host "`n📋 שלב 6: הגדרת Public Hostname" -ForegroundColor Yellow
Write-Host "`n⚠️  צריך להגדיר ידנית ב-Cloudflare Dashboard:" -ForegroundColor Yellow
Write-Host "`n1. פתח:" -ForegroundColor Cyan
Write-Host "   https://one.dash.cloudflare.com" -ForegroundColor White
Write-Host "`n2. נווט ל:" -ForegroundColor Cyan
Write-Host "   Zero Trust → Networks → Tunnels" -ForegroundColor White
Write-Host "`n3. בחר את ה-Tunnel: $tunnelName" -ForegroundColor Cyan
Write-Host "`n4. הוסף Public Hostname:" -ForegroundColor Cyan
Write-Host "   Subdomain: crm" -ForegroundColor White
Write-Host "   Domain: tanandco.co.il" -ForegroundColor White
Write-Host "   Service Type: HTTP" -ForegroundColor White
Write-Host "   URL: http://localhost:5000" -ForegroundColor White
Write-Host "`n5. לחץ 'Save'" -ForegroundColor Cyan

$continue = Read-Host "`nלחץ Enter אחרי שסיימת להגדיר ב-Dashboard"

# שלב 7: הרץ tunnel
Write-Host "`n📋 שלב 7: הרצת Tunnel" -ForegroundColor Yellow
Write-Host "`n🚀 מתחיל להריץ את ה-tunnel..." -ForegroundColor Cyan
Write-Host "`n✅ הדומיין יעבוד על: https://crm.tanandco.co.il" -ForegroundColor Green
Write-Host "`n⚠️  חשוב: השאר את ה-window הזה פתוח!" -ForegroundColor Yellow
Write-Host "`nלעצירה: Ctrl+C" -ForegroundColor Gray
Write-Host "`n" + ("=" * 50) -ForegroundColor Gray
Write-Host ""

# הרץ tunnel
cloudflared tunnel run $tunnelName

