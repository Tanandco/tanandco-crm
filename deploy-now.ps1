# 🚀 פריסה מהירה - Tan & Co CRM
# ============================================

Write-Host "`n🚀 Tan & Co CRM - פריסה מהירה" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# בדיקה אם השרת רץ מקומית
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $serverRunning = $true
    }
} catch {
    $serverRunning = $false
}

Write-Host "`n📋 אפשרויות פריסה:" -ForegroundColor Yellow
Write-Host "`n1️⃣  Google Cloud Run (פריסה לפרודקשן)" -ForegroundColor Green
Write-Host "   ✅ הקוד כבר ב-GitHub" -ForegroundColor Gray
Write-Host "   ✅ Dockerfile מוכן" -ForegroundColor Gray
Write-Host "   📝 צריך להגדיר ב-Cloud Console" -ForegroundColor Gray
Write-Host "`n2️⃣  Cloudflare Tunnel (חיבור מקומי)" -ForegroundColor Green
if ($serverRunning) {
    Write-Host "   ✅ השרת רץ על localhost:3001" -ForegroundColor Gray
    Write-Host "   ✅ מוכן לחיבור" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  השרת לא רץ - צריך להריץ: npm run server" -ForegroundColor Yellow
}
Write-Host "`n3️⃣  GitHub Actions (אוטומטי - צריך ליצור workflow)" -ForegroundColor Green
Write-Host "   📝 צריך ליצור .github/workflows/deploy.yml" -ForegroundColor Gray

Write-Host "`n" -ForegroundColor White
$choice = Read-Host "בחר אפשרות (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host "`n🌐 פותח Google Cloud Console..." -ForegroundColor Cyan
        Start-Process "https://console.cloud.google.com/run?project=tan-and-co-crm"
        Write-Host "`n📝 הוראות:" -ForegroundColor Yellow
        Write-Host "1. לחץ 'Create Service' או בחר service קיים" -ForegroundColor White
        Write-Host "2. בחר 'Continuously deploy from source repository'" -ForegroundColor White
        Write-Host "3. Repository: Tanandco/tanandco-crm" -ForegroundColor White
        Write-Host "4. Branch: main" -ForegroundColor White
        Write-Host "5. Build type: Dockerfile" -ForegroundColor White
        Write-Host "6. Port: 5000" -ForegroundColor White
        Write-Host "7. Authentication: Allow unauthenticated" -ForegroundColor White
        Write-Host "8. הוסף משתני סביבה (ראה DEPLOY_VIA_CONSOLE_STEP_BY_STEP.md)" -ForegroundColor White
        Write-Host "9. לחץ 'Deploy'" -ForegroundColor White
    }
    "2" {
        if (-not $serverRunning) {
            Write-Host "`n⚠️  השרת לא רץ!" -ForegroundColor Yellow
            Write-Host "מריץ את השרת עכשיו..." -ForegroundColor Cyan
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run server"
            Write-Host "`n⏳ המתן 10 שניות שהשרת יעלה..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
        }
        Write-Host "`n🔗 מפעיל Cloudflare Tunnel..." -ForegroundColor Cyan
        if (Test-Path ".\start-cloudflare-tunnel.ps1") {
            & ".\start-cloudflare-tunnel.ps1"
        } else {
            Write-Host "⚠️  קובץ start-cloudflare-tunnel.ps1 לא נמצא" -ForegroundColor Yellow
            Write-Host "מריץ cloudflared ישירות..." -ForegroundColor Cyan
            cloudflared tunnel run
        }
    }
    "3" {
        Write-Host "`n📝 יוצר GitHub Actions workflow..." -ForegroundColor Cyan
        $workflowDir = ".github\workflows"
        if (-not (Test-Path $workflowDir)) {
            New-Item -ItemType Directory -Path $workflowDir -Force | Out-Null
        }
        Write-Host "✅ תיקיית workflows נוצרה" -ForegroundColor Green
        Write-Host "`n💡 צריך ליצור workflow ידנית או להשתמש ב-Google Cloud Build Trigger" -ForegroundColor Yellow
        Write-Host "`n📖 ראה: DEPLOY_ALTERNATIVE_METHODS.md" -ForegroundColor Cyan
    }
    default {
        Write-Host "`n❌ בחירה לא תקינה" -ForegroundColor Red
    }
}

Write-Host "`n✅ סיימתי!" -ForegroundColor Green
Write-Host "`n💡 טיפ: אם אתה רוצה לפרוס אוטומטית, השתמש ב-Google Cloud Build Trigger" -ForegroundColor Cyan
Write-Host "   https://console.cloud.google.com/cloud-build/triggers" -ForegroundColor Gray

