# 🔍 בדיקת הגדרת Cloudflare Tunnel ו-CRM
# Tan & Co CRM

Write-Host "`n🔍 בודק את ההגדרה..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# 1. בדיקת Tunnel
Write-Host "`n📋 1. בדיקת Cloudflare Tunnel:" -ForegroundColor Yellow
try {
    $tunnels = cloudflared tunnel list 2>&1
    if ($tunnels -match "tanandco-tunnel") {
        Write-Host "✅ Tunnel 'tanandco-tunnel' מחובר!" -ForegroundColor Green
        $tunnelInfo = cloudflared tunnel info tanandco-tunnel 2>&1
        $tunnelInfo | Select-String -Pattern "CONNECTOR|CREATED" | ForEach-Object {
            Write-Host "   $_" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Tunnel לא נמצא" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ שגיאה בבדיקת Tunnel" -ForegroundColor Red
}

# 2. בדיקת פורט 5000
Write-Host "`n📋 2. בדיקת פורט 5000:" -ForegroundColor Yellow
$port5000 = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($port5000) {
    Write-Host "✅ פורט 5000 פתוח" -ForegroundColor Green
    
    # בדוק מה רץ שם
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        if ($response.Content -match "BioStar") {
            Write-Host "⚠️  BioStar 2 רץ על פורט 5000 (לא CRM)" -ForegroundColor Yellow
            Write-Host "   צריך להריץ את ה-CRM עם: npm run server" -ForegroundColor Cyan
        } elseif ($response.Content -match "react|vite|tanandco" -or $response.StatusCode -eq 200) {
            Write-Host "✅ CRM רץ על פורט 5000!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  משהו רץ על פורט 5000 (לא מזוהה)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  לא הצלחתי לבדוק מה רץ על הפורט" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ פורט 5000 לא פתוח" -ForegroundColor Red
    Write-Host "   הרץ: npm run server" -ForegroundColor Cyan
}

# 3. בדיקת Config
Write-Host "`n📋 3. בדיקת Config:" -ForegroundColor Yellow
$configPath = "$env:USERPROFILE\.cloudflared\config.yml"
if (Test-Path $configPath) {
    Write-Host "✅ קובץ config קיים" -ForegroundColor Green
    $config = Get-Content $configPath
    $config | ForEach-Object {
        if ($_ -match "hostname:|service:") {
            Write-Host "   $_" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "❌ קובץ config לא נמצא" -ForegroundColor Red
}

# 4. בדיקת הדומיין
Write-Host "`n📋 4. בדיקת הדומיין:" -ForegroundColor Yellow
try {
    $dns = Resolve-DnsName -Name "crm.tanandco.co.il" -Type CNAME -ErrorAction Stop
    Write-Host "✅ DNS מפנה ל: $($dns.NameHost)" -ForegroundColor Green
} catch {
    Write-Host "❌ DNS לא מפנה (צריך להגדיר ב-Cloudflare Dashboard)" -ForegroundColor Red
}

# 5. סיכום ופעולות נדרשות
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "`n📝 סיכום:" -ForegroundColor Cyan

$actions = @()

if (-not $port5000 -or (Test-Path $configPath) -and (Get-Content $configPath | Select-String -Pattern "BioStar")) {
    $actions += "הרץ את ה-CRM: npm run server"
}

$actions += "הגדר Public Hostname ב-Cloudflare Dashboard:"
$actions += "  1. פתח: https://one.dash.cloudflare.com"
$actions += "  2. Zero Trust → Networks → Tunnels"
$actions += "  3. בחר: tanandco-tunnel"
$actions += "  4. הוסף Public Hostname:"
$actions += "     - Subdomain: crm"
$actions += "     - Domain: tanandco.co.il"
$actions += "     - Service Type: HTTP"
$actions += "     - URL: http://localhost:5000"

Write-Host "`n🎯 פעולות נדרשות:" -ForegroundColor Yellow
$actions | ForEach-Object {
    Write-Host "  $_" -ForegroundColor White
}

Write-Host "`n✅ התעלה מחוברת - רק צריך להגדיר את ה-Public Hostname!" -ForegroundColor Green
Write-Host ""

