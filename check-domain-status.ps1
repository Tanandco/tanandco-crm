# 🔍 בדיקת סטטוס הדומיין tanandco.co.il

Write-Host "`n🔍 בודק את tanandco.co.il..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# בדיקת DNS
Write-Host "`n📋 בדיקת DNS:" -ForegroundColor Yellow
try {
    $dns = Resolve-DnsName -Name "tanandco.co.il" -Type A -ErrorAction Stop
    Write-Host "✅ DNS מפנה ל:" -ForegroundColor Green
    $dns | ForEach-Object { 
        Write-Host "   $($_.IPAddress)" -ForegroundColor White 
    }
} catch {
    Write-Host "❌ DNS לא מפנה" -ForegroundColor Red
    Write-Host "   שגיאה: $($_.Exception.Message)" -ForegroundColor Yellow
}

# בדיקת subdomain
Write-Host "`n📋 בדיקת crm.tanandco.co.il:" -ForegroundColor Yellow
try {
    $dns = Resolve-DnsName -Name "crm.tanandco.co.il" -Type CNAME -ErrorAction Stop
    Write-Host "✅ DNS מפנה ל:" -ForegroundColor Green
    $dns | ForEach-Object { 
        Write-Host "   $($_.NameHost)" -ForegroundColor White 
    }
} catch {
    Write-Host "❌ DNS לא מפנה" -ForegroundColor Red
    Write-Host "   שגיאה: $($_.Exception.Message)" -ForegroundColor Yellow
}

# בדיקת האתר הראשי
Write-Host "`n📋 בדיקת האתר הראשי:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://tanandco.co.il" -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ האתר עובד! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ האתר לא עובד" -ForegroundColor Red
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode) {
        Write-Host "   Status Code: $statusCode" -ForegroundColor Yellow
    } else {
        Write-Host "   שגיאה: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# בדיקת subdomain
Write-Host "`n📋 בדיקת crm.tanandco.co.il:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://crm.tanandco.co.il" -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ האתר עובד! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ האתר לא עובד" -ForegroundColor Red
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode) {
        Write-Host "   Status Code: $statusCode" -ForegroundColor Yellow
    } else {
        Write-Host "   שגיאה: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# בדיקת API health
Write-Host "`n📋 בדיקת API health:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://crm.tanandco.co.il/api/health" -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ API עובד! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ API לא עובד" -ForegroundColor Red
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode) {
        Write-Host "   Status Code: $statusCode" -ForegroundColor Yellow
    } else {
        Write-Host "   שגיאה: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n💡 מה לעשות:" -ForegroundColor Cyan
Write-Host "   1. ראה: FIX_DOMAIN.md למדריך מפורט" -ForegroundColor White
Write-Host "   2. בדוק את Cloud Run Console" -ForegroundColor White
Write-Host "   3. הגדר Cloudflare Tunnel או DNS" -ForegroundColor White
Write-Host "`n" -NoNewline

