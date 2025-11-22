# ============================================
# סקריפט לתיקון חיבור מסד הנתונים
# ============================================
# סקריפט זה עוזר לעדכן את DATABASE_URL בקובץ .env
# עם הסיסמה הנכונה מ-Neon Console

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "תיקון חיבור מסד הנתונים - Tan & Co CRM" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$envFile = Join-Path $PSScriptRoot ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ קובץ .env לא נמצא!" -ForegroundColor Red
    Write-Host "   מיקום צפוי: $envFile" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ קובץ .env נמצא" -ForegroundColor Green
Write-Host ""

# קריאת הקובץ הנוכחי
$envContent = Get-Content $envFile -Raw

# חילוץ DATABASE_URL הנוכחי
if ($envContent -match 'DATABASE_URL=(.+)') {
    $currentUrl = $matches[1].Trim()
    Write-Host "DATABASE_URL נוכחי:" -ForegroundColor Yellow
    Write-Host "  $currentUrl" -ForegroundColor Gray
    Write-Host ""
    
    # חילוץ פרטים מהקישור
    if ($currentUrl -match 'postgresql://([^:]+):([^@]+)@([^/]+)/(.+)') {
        $currentUser = $matches[1]
        $currentPassword = $matches[2]
        $currentHost = $matches[3]
        $currentDb = $matches[4]
        
        Write-Host "פרטים מחולצים:" -ForegroundColor Cyan
        Write-Host "  משתמש: $currentUser" -ForegroundColor Gray
        Write-Host "  סיסמה: $($currentPassword.Substring(0, [Math]::Min(10, $currentPassword.Length)))..." -ForegroundColor Gray
        Write-Host "  שרת: $currentHost" -ForegroundColor Gray
        Write-Host "  מסד נתונים: $currentDb" -ForegroundColor Gray
        Write-Host ""
    }
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "הנחיות:" -ForegroundColor Cyan
Write-Host "1. התחבר ל-Neon Console:" -ForegroundColor Yellow
Write-Host "   https://console.neon.tech" -ForegroundColor White
Write-Host ""
Write-Host "2. בחר את הפרויקט שלך" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. עבור ל-Dashboard → Connection Details" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. העתק את הסיסמה (Password) של המשתמש neondb_owner" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. הדבק את הסיסמה כאן למטה" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$newPassword = Read-Host "הדבק את הסיסמה החדשה מ-Neon Console"

if ([string]::IsNullOrWhiteSpace($newPassword)) {
    Write-Host "❌ סיסמה לא הוזנה. ביטול." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "מעדכן את DATABASE_URL..." -ForegroundColor Yellow

# בניית DATABASE_URL חדש
# פורמט: postgresql://user:password@host/database?sslmode=require
$newDatabaseUrl = "postgresql://neondb_owner:$newPassword@ep-super-pond-afcnloji.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require"

# עדכון הקובץ
$newEnvContent = $envContent -replace 'DATABASE_URL=.*', "DATABASE_URL=$newDatabaseUrl"

# שמירה
Set-Content -Path $envFile -Value $newEnvContent -NoNewline

Write-Host "✓ DATABASE_URL עודכן בהצלחה!" -ForegroundColor Green
Write-Host ""

# בדיקת חיבור
Write-Host "בודק חיבור למסד הנתונים..." -ForegroundColor Yellow
Write-Host ""

$testResult = & npm run db:push 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ חיבור למסד הנתונים הצליח!" -ForegroundColor Green
    Write-Host ""
    Write-Host "ניתן כעת להריץ:" -ForegroundColor Cyan
    Write-Host "  npm run db:push" -ForegroundColor White
} else {
    Write-Host "❌ עדיין יש בעיה בחיבור" -ForegroundColor Red
    Write-Host ""
    Write-Host "פלט הבדיקה:" -ForegroundColor Yellow
    Write-Host $testResult -ForegroundColor Gray
    Write-Host ""
    Write-Host "אנא בדוק:" -ForegroundColor Yellow
    Write-Host "1. שהסיסמה שהודבקה נכונה" -ForegroundColor White
    Write-Host "2. שהמשתמש neondb_owner קיים ב-Neon" -ForegroundColor White
    Write-Host "3. שהפרויקט פעיל ב-Neon Console" -ForegroundColor White
}

