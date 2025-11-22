# ============================================
# סקריפט לעדכון Environment Variables ב-Cloud Run
# ============================================
# סקריפט זה עוזר לעדכן את כל משתני הסביבה ב-Cloud Run
# בהתאם לערכים ב-CLOUD_RUN_ENV_VARIABLES_REAL.txt

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "עדכון Environment Variables ב-Cloud Run" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$envFile = Join-Path $PSScriptRoot "CLOUD_RUN_ENV_VARIABLES_REAL.txt"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ קובץ CLOUD_RUN_ENV_VARIABLES_REAL.txt לא נמצא!" -ForegroundColor Red
    Write-Host "   מיקום צפוי: $envFile" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ קובץ CLOUD_RUN_ENV_VARIABLES_REAL.txt נמצא" -ForegroundColor Green
Write-Host ""

# קריאת הקובץ
$envContent = Get-Content $envFile

# חילוץ משתני סביבה (ללא הערות)
$envVars = @{}
foreach ($line in $envContent) {
    $line = $line.Trim()
    # דלג על שורות ריקות והערות
    if ($line -and -not $line.StartsWith("#")) {
        if ($line -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            $envVars[$key] = $value
        }
    }
}

Write-Host "נמצאו $($envVars.Count) משתני סביבה" -ForegroundColor Cyan
Write-Host ""

# הצגת רשימת משתנים לעדכון
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "משתנים לעדכון ב-Cloud Run:" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""

$importantVars = @(
    "WA_PHONE_NUMBER_ID",
    "CLOUD_API_VERSION",
    "CLOUD_API_ACCESS_TOKEN",
    "CARDCOM_TERMINAL_NUMBER",
    "CARDCOM_API_USERNAME",
    "CARDCOM_API_PASSWORD"
)

foreach ($key in $importantVars) {
    if ($envVars.ContainsKey($key)) {
        $value = $envVars[$key]
        if ($value.Length -gt 50) {
            $displayValue = $value.Substring(0, 50) + "..."
        } else {
            $displayValue = $value
        }
        Write-Host "  $key = $displayValue" -ForegroundColor Gray
    } else {
        Write-Host "  $key = (לא נמצא)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "הנחיות לעדכון ידני ב-Cloud Run:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. התחבר ל-Google Cloud Console:" -ForegroundColor Yellow
Write-Host "   https://console.cloud.google.com" -ForegroundColor White
Write-Host ""
Write-Host "2. עבור ל-Cloud Run → בחר את השירות tanandco-crm" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. לחץ על 'Edit & Deploy New Revision'" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. עבור לטאב 'Variables & Secrets'" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. עדכן את המשתנים הבאים:" -ForegroundColor Yellow
Write-Host ""

# יצירת רשימה לעדכון
$updateList = @"
# העתק את הרשימה הבאה והדבק ב-Cloud Run:

"@

foreach ($key in $envVars.Keys | Sort-Object) {
    $value = $envVars[$key]
    # דלג על משתנים עם ערכים placeholder
    if ($value -notmatch "your_|placeholder|TODO") {
        $updateList += "$key=$value`n"
    }
}

Write-Host $updateList -ForegroundColor White
Write-Host ""

# בדיקת gcloud CLI
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "אופציה: עדכון אוטומטי עם gcloud CLI" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$hasGcloud = Get-Command gcloud -ErrorAction SilentlyContinue

if ($hasGcloud) {
    Write-Host "✓ gcloud CLI מותקן" -ForegroundColor Green
    Write-Host ""
    Write-Host "לעדכון אוטומטי, הרץ:" -ForegroundColor Yellow
    Write-Host ""
    
    # בניית פקודת gcloud
    $gcloudCmd = "gcloud run services update tanandco-crm --region me-west1 --update-env-vars "
    $envPairs = @()
    
    foreach ($key in $envVars.Keys | Sort-Object) {
        $value = $envVars[$key]
        if ($value -notmatch "your_|placeholder|TODO") {
            # Escape special characters
            $escapedValue = $value -replace '"', '\"'
            $envPairs += "$key=`"$escapedValue`""
        }
    }
    
    $gcloudCmd += ($envPairs -join ",")
    
    Write-Host $gcloudCmd -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️ שים לב: הפקודה ארוכה מאוד!" -ForegroundColor Yellow
    Write-Host "   מומלץ לעדכן ידנית דרך Console" -ForegroundColor Yellow
} else {
    Write-Host "⚠️ gcloud CLI לא מותקן" -ForegroundColor Yellow
    Write-Host "   להתקנה: https://cloud.google.com/sdk/docs/install" -ForegroundColor Gray
    Write-Host "   או עדכן ידנית דרך Console" -ForegroundColor Gray
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "בדיקות לאחר עדכון:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. בדיקת WhatsApp Webhook:" -ForegroundColor Yellow
Write-Host '   $url = "https://crm.tanandco.co.il/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=tanandco_2025_webhook&hub.challenge=test"' -ForegroundColor White
Write-Host '   Invoke-WebRequest -Uri $url -Method GET' -ForegroundColor White
Write-Host ""
Write-Host "2. בדיקת לוגים ב-Cloud Run:" -ForegroundColor Yellow
Write-Host "   Google Cloud Console → Cloud Run → Logs" -ForegroundColor White
Write-Host "   חפש שגיאות authentication" -ForegroundColor White
Write-Host ""

