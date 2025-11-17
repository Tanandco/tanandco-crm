# 🚀 פריסה דרך gcloud CLI
# Tan & Co CRM

Write-Host "`n🚀 מתחיל פריסה דרך gcloud CLI..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# בדוק אם gcloud מותקן
Write-Host "`n📋 שלב 1: בדיקת gcloud CLI" -ForegroundColor Yellow
try {
    $gcloudVersion = gcloud --version 2>&1 | Select-Object -First 1
    Write-Host "✅ gcloud מותקן: $gcloudVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ gcloud לא מותקן" -ForegroundColor Red
    Write-Host "`n💡 התקן gcloud:" -ForegroundColor Yellow
    Write-Host "   https://cloud.google.com/sdk/docs/install" -ForegroundColor White
    Write-Host "`nאו השתמש ב-GitHub Actions או Cloud Build" -ForegroundColor Yellow
    exit 1
}

# הגדר פרויקט
Write-Host "`n📋 שלב 2: הגדרת פרויקט" -ForegroundColor Yellow
$projectId = Read-Host "הכנס Project ID (לדוגמה: tan-and-co-crm או tanandco-crm)"
if ([string]::IsNullOrWhiteSpace($projectId)) {
    Write-Host "❌ Project ID נדרש" -ForegroundColor Red
    exit 1
}

gcloud config set project $projectId

# בדוק התחברות
Write-Host "`n📋 שלב 3: בדיקת התחברות" -ForegroundColor Yellow
try {
    $currentAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>&1
    if ([string]::IsNullOrWhiteSpace($currentAccount)) {
        Write-Host "⚠️  לא מחובר - מתחבר..." -ForegroundColor Yellow
        gcloud auth login
    } else {
        Write-Host "✅ מחובר כ: $currentAccount" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ שגיאה בהתחברות" -ForegroundColor Red
    exit 1
}

# בחר region
Write-Host "`n📋 שלב 4: בחירת region" -ForegroundColor Yellow
Write-Host "אפשרויות:" -ForegroundColor Cyan
Write-Host "   1. me-west1 (ישראל)" -ForegroundColor White
Write-Host "   2. europe-west1 (אירופה)" -ForegroundColor White
Write-Host "   3. אחר (הכנס ידנית)" -ForegroundColor White
$regionChoice = Read-Host "בחר (1/2/3)"
$region = switch ($regionChoice) {
    "1" { "me-west1" }
    "2" { "europe-west1" }
    default { Read-Host "הכנס region" }
}

# שם ה-service
Write-Host "`n📋 שלב 5: שם ה-service" -ForegroundColor Yellow
$serviceName = Read-Host "הכנס שם service (לדוגמה: tanandco או tanandco-crm)"
if ([string]::IsNullOrWhiteSpace($serviceName)) {
    $serviceName = "tanandco-crm"
    Write-Host "משתמש בשם ברירת מחדל: $serviceName" -ForegroundColor Gray
}

# Deploy
Write-Host "`n🚀 שלב 6: מתחיל פריסה..." -ForegroundColor Cyan
Write-Host "זה יכול לקחת 5-10 דקות..." -ForegroundColor Yellow

try {
    gcloud run deploy $serviceName `
        --source . `
        --platform managed `
        --region $region `
        --allow-unauthenticated `
        --port 5000 `
        --memory 512Mi `
        --cpu 1 `
        --min-instances 0 `
        --max-instances 10 `
        --timeout 300 `
        --concurrency 80 `
        --project $projectId

    Write-Host "`n✅ הפריסה הצליחה!" -ForegroundColor Green
    
    # קבל את ה-URL
    $serviceUrl = gcloud run services describe $serviceName --platform managed --region $region --format 'value(status.url)' --project $projectId
    Write-Host "`n🌐 Service URL:" -ForegroundColor Cyan
    Write-Host "   $serviceUrl" -ForegroundColor White
    
    Write-Host "`n⚠️  חשוב: הוסף משתני סביבה ב-Cloud Run Console" -ForegroundColor Yellow
    Write-Host "   https://console.cloud.google.com/run/detail/$region/$serviceName?project=$projectId" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ הפריסה נכשלה" -ForegroundColor Red
    Write-Host "   שגיאה: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "`n💡 נסה דרך Cloud Console במקום" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✅ סיום!" -ForegroundColor Green

