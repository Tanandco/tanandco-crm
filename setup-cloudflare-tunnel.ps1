# 🚀 הגדרת Cloudflare Tunnel
# Tan & Co CRM

Write-Host "`n🚀 מתחיל הגדרת Cloudflare Tunnel..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# בדוק אם cloudflared מותקן
Write-Host "`n📋 שלב 1: בדיקת cloudflared" -ForegroundColor Yellow
try {
    $version = cloudflared --version 2>&1 | Select-Object -First 1
    Write-Host "✅ cloudflared מותקן: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ cloudflared לא מותקן" -ForegroundColor Red
    Write-Host "`n💡 התקן cloudflared:" -ForegroundColor Yellow
    Write-Host "`nאפשרות 1: דרך winget" -ForegroundColor Cyan
    Write-Host "   winget install --id Cloudflare.cloudflared" -ForegroundColor White
    Write-Host "`nאפשרות 2: דרך Chocolatey" -ForegroundColor Cyan
    Write-Host "   choco install cloudflared" -ForegroundColor White
    Write-Host "`nאפשרות 3: הורדה ידנית" -ForegroundColor Cyan
    Write-Host "   https://github.com/cloudflare/cloudflared/releases/latest" -ForegroundColor White
    Write-Host "`nאחרי ההתקנה, הרץ את הסקריפט שוב" -ForegroundColor Yellow
    exit 1
}

# התחברות
Write-Host "`n📋 שלב 2: התחברות ל-Cloudflare" -ForegroundColor Yellow
$loginChoice = Read-Host "האם אתה כבר מחובר? (y/n)"
if ($loginChoice -ne "y") {
    Write-Host "`nפתיחת דפדפן להתחברות..." -ForegroundColor Cyan
    cloudflared tunnel login
    Write-Host "`n✅ התחברת בהצלחה!" -ForegroundColor Green
} else {
    Write-Host "✅ מדלג על התחברות" -ForegroundColor Green
}

# רשימת tunnels קיימים
Write-Host "`n📋 שלב 3: רשימת tunnels קיימים" -ForegroundColor Yellow
Write-Host "`nTunnels קיימים:" -ForegroundColor Cyan
cloudflared tunnel list

# צור או בחר tunnel
Write-Host "`n📋 שלב 4: צור או בחר tunnel" -ForegroundColor Yellow
$tunnelName = Read-Host "הכנס שם tunnel (לדוגמה: tanandco-crm)"
if ([string]::IsNullOrWhiteSpace($tunnelName)) {
    $tunnelName = "tanandco-crm"
    Write-Host "משתמש בשם ברירת מחדל: $tunnelName" -ForegroundColor Gray
}

# בדוק אם tunnel קיים
$tunnelExists = cloudflared tunnel list 2>&1 | Select-String -Pattern $tunnelName
if ($tunnelExists) {
    Write-Host "✅ Tunnel '$tunnelName' כבר קיים" -ForegroundColor Green
    $useExisting = Read-Host "האם להשתמש ב-tunnel הקיים? (y/n)"
    if ($useExisting -ne "y") {
        Write-Host "יוצר tunnel חדש..." -ForegroundColor Cyan
        cloudflared tunnel create $tunnelName
    }
} else {
    Write-Host "יוצר tunnel חדש..." -ForegroundColor Cyan
    cloudflared tunnel create $tunnelName
    Write-Host "✅ Tunnel '$tunnelName' נוצר בהצלחה!" -ForegroundColor Green
}

# בחר אופציה: מקומי או Cloud Run
Write-Host "`n📋 שלב 5: בחר אופציה" -ForegroundColor Yellow
Write-Host "`nאיפה השרת רץ?" -ForegroundColor Cyan
Write-Host "   1. מקומי (localhost:5000)" -ForegroundColor White
Write-Host "   2. Cloud Run (URL חיצוני)" -ForegroundColor White
$serverChoice = Read-Host "בחר (1/2)"

$serviceUrl = ""
if ($serverChoice -eq "1") {
    $serviceUrl = "http://localhost:5000"
    Write-Host "`n⚠️  חשוב: ודא שהשרת רץ!" -ForegroundColor Yellow
    Write-Host "   הרץ: npm run server" -ForegroundColor White
} else {
    $serviceUrl = Read-Host "הכנס את ה-Cloud Run URL (לדוגמה: https://tanandco-crm-xxxxx-xx.a.run.app)"
}

# הגדר Public Hostname
Write-Host "`n📋 שלב 6: הגדרת Public Hostname" -ForegroundColor Yellow
Write-Host "`n💡 עכשיו צריך להגדיר את ה-Public Hostname ב-Cloudflare Dashboard" -ForegroundColor Cyan
Write-Host "`nפתח:" -ForegroundColor Yellow
Write-Host "   https://one.dash.cloudflare.com" -ForegroundColor White
Write-Host "`nנווט ל:" -ForegroundColor Yellow
Write-Host "   Zero Trust → Networks → Tunnels" -ForegroundColor White
Write-Host "`nבחר את ה-Tunnel: $tunnelName" -ForegroundColor Yellow
Write-Host "`nהוסף Public Hostname:" -ForegroundColor Yellow
Write-Host "   Subdomain: crm" -ForegroundColor White
Write-Host "   Domain: tanandco.co.il" -ForegroundColor White
Write-Host "   Service Type: HTTP" -ForegroundColor White
Write-Host "   URL: $serviceUrl" -ForegroundColor White
Write-Host "`nלחץ 'Save'" -ForegroundColor Yellow

$continue = Read-Host "`nלחץ Enter אחרי שסיימת להגדיר ב-Dashboard"

# הרץ tunnel (אם מקומי)
if ($serverChoice -eq "1") {
    Write-Host "`n📋 שלב 7: הרצת Tunnel" -ForegroundColor Yellow
    Write-Host "`n⚠️  חשוב: השאר את ה-window הזה פתוח!" -ForegroundColor Yellow
    Write-Host "`nמתחיל להריץ את ה-tunnel..." -ForegroundColor Cyan
    Write-Host "`nהדומיין יעבוד על: https://crm.tanandco.co.il" -ForegroundColor Green
    Write-Host "`nלעצירה: Ctrl+C" -ForegroundColor Gray
    Write-Host "`n" + ("=" * 50) -ForegroundColor Gray
    
    cloudflared tunnel run $tunnelName
} else {
    Write-Host "`n✅ הגדרת Tunnel הושלמה!" -ForegroundColor Green
    Write-Host "`nהדומיין יעבוד על: https://crm.tanandco.co.il" -ForegroundColor Cyan
    Write-Host "`n⚠️  המתן 2-5 דקות להפצת DNS" -ForegroundColor Yellow
}

Write-Host "`n✅ סיום!" -ForegroundColor Green

